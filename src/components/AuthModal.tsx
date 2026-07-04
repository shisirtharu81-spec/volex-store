import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Shield, 
  ShieldCheck, 
  Smartphone, 
  ChevronRight, 
  AlertCircle, 
  X, 
  MessageSquare, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  HelpCircle, 
  Chrome,
  KeyRound,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any, token: string) => void;
}

type AuthMode = 
  | 'login' 
  | 'register' 
  | 'forgot-password' 
  | 'reset-password' 
  | 'email-verify' 
  | 'otp-verify'
  | 'google-flow'
  | 'discord-flow'
  | 'success';

interface SimulatedEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  code: string;
  timestamp: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Form Inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  
  // Reset Password states
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // 2FA login requirements
  const [tempUsername, setTempUsername] = useState('');
  const [tempToken, setTempToken] = useState('');

  // Live Inbox panel simulation
  const [simulatedEmails, setSimulatedEmails] = useState<SimulatedEmail[]>([]);
  const [showInbox, setShowInbox] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Poll for sent simulated emails from server
  const fetchSimulatedEmails = async () => {
    try {
      const res = await fetch('/api/auth/simulated-emails');
      if (res.ok) {
        const data = await res.json();
        setSimulatedEmails(data);
        // Find new/unread emails by comparing with previously seen IDs
        const seenCount = parseInt(localStorage.getItem('seen_emails_count') || '0');
        if (data.length > seenCount) {
          setUnreadCount(data.length - seenCount);
        }
      }
    } catch (e) {
      console.error("Error fetching simulated emails:", e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSimulatedEmails();
      const interval = setInterval(fetchSimulatedEmails, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const markInboxRead = () => {
    localStorage.setItem('seen_emails_count', simulatedEmails.length.toString());
    setUnreadCount(0);
    setShowInbox(true);
  };

  // 1. Handle Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Failed to register");
      } else {
        // Success -> Needs Email verification
        setMode('email-verify');
        fetchSimulatedEmails();
        // Keep note of email used
        setEmail(email);
      }
    } catch (err) {
      setLoading(false);
      setError("Network error occurred");
    }
  };

  // 2. Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: username, password, rememberMe })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
      } else if (data.twoFactorRequired) {
        // 2FA Active -> switch mode to OTP
        setTempUsername(data.username);
        setTempToken(data.tempToken);
        setMode('otp-verify');
      } else {
        // Fully authenticated!
        if (rememberMe) {
          localStorage.setItem('volex_jwt_token', data.token);
        } else {
          sessionStorage.setItem('volex_jwt_token', data.token);
        }
        onAuthSuccess(data.user, data.token);
        setMode('success');
      }
    } catch (err) {
      setLoading(false);
      setError("Network connection failed");
    }
  };

  // 3. Handle Email Verification Code
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Invalid or expired verification code");
      } else {
        // Successfully verified and logged in!
        localStorage.setItem('volex_jwt_token', data.token);
        onAuthSuccess(data.user, data.token);
        setMode('success');
      }
    } catch (err) {
      setLoading(false);
      setError("Verification failed due to connectivity issue");
    }
  };

  // 4. Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Failed to trigger recovery flow");
      } else {
        setMode('reset-password');
        fetchSimulatedEmails();
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to reach server");
    }
  };

  // 5. Handle Reset Password Submission
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: resetCode, newPassword })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Invalid token or reset expired");
      } else {
        setMode('login');
        setError("Password reset successful! Please log in with your new password.");
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to execute password reset");
    }
  };

  // 6. Handle 2FA PIN verification
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: tempUsername, tempToken, code: verificationCode })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Invalid authenticator code");
      } else {
        if (rememberMe) {
          localStorage.setItem('volex_jwt_token', data.token);
        } else {
          sessionStorage.setItem('volex_jwt_token', data.token);
        }
        onAuthSuccess(data.user, data.token);
        setMode('success');
      }
    } catch (err) {
      setLoading(false);
      setError("2FA authorization failed");
    }
  };

  // 7. Handle OAuth Simulation Triggers
  const triggerOAuth = (provider: 'google' | 'discord') => {
    setError(null);
    setMode(provider === 'google' ? 'google-flow' : 'discord-flow');
  };

  const completeOAuth = async (provider: 'google' | 'discord', approved: boolean) => {
    if (!approved) {
      setMode('login');
      return;
    }

    setLoading(true);
    try {
      // Send mock approved oauth trigger to backend
      const res = await fetch('/api/auth/oauth-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          email: provider === 'google' ? `${username || 'gamer'}@gmail.com` : undefined,
          username: username || 'VolexPlayer'
        })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMode('login');
        setError(data.error || "Social authentication failed");
      } else {
        localStorage.setItem('volex_jwt_token', data.token);
        onAuthSuccess(data.user, data.token);
        setMode('success');
      }
    } catch (err) {
      setLoading(false);
      setMode('login');
      setError("Social authentication failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Container holding form and optional live mailbox */}
      <div className="relative flex flex-col md:flex-row w-full max-w-4xl bg-[#090a10] border border-purple-500/15 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/5 blur-3xl pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full"></div>

        {/* 1. Main Auth Panel */}
        <div className="flex-1 p-6 sm:p-10 relative">
          
          {/* Top Bar with Brand and Close */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 p-[1px]">
                <div className="h-full w-full bg-[#090a10] rounded-[7px] flex items-center justify-center font-bold text-xs text-white">V</div>
              </div>
              <span className="font-mono font-black text-xs tracking-widest text-white uppercase">VOLEX SECURITY SECURED</span>
            </div>
            
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            
            {/* LOGIN MODE */}
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-white font-sans tracking-tight">Access Secure Account</h2>
                  <p className="text-xs text-gray-400 mt-1">Provide your credentials or log in with social nodes instantly.</p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">Username or Email</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="e.g. shisir or shisirtharu51@gmail.com"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-2.5 pl-10 pr-4 rounded-xl text-xs focus:outline-none text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Security Password</label>
                      <button
                        type="button"
                        onClick={() => setMode('forgot-password')}
                        className="text-[10px] font-mono text-[#bf5af2] hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-2.5 pl-10 pr-10 rounded-xl text-xs focus:outline-none text-white font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-xs text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-purple-500/15 text-purple-600 focus:ring-0 checked:bg-purple-600 cursor-pointer"
                      />
                      <span className="font-sans">Remember My Session</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#bf5af2] hover:bg-purple-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(191,90,242,0.15)]"
                  >
                    {loading ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Validate & Connect Session</span>
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Social Logins */}
                <div className="space-y-3.5 pt-4 border-t border-purple-500/5">
                  <div className="text-center text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                    OR AUTHORIZE INSTANTLY WITH
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => triggerOAuth('google')}
                      className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl cursor-pointer text-xs font-bold text-gray-200 transition-all"
                    >
                      <Chrome className="h-4 w-4 text-amber-500" />
                      <span>Google Login</span>
                    </button>

                    <button
                      onClick={() => triggerOAuth('discord')}
                      className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl cursor-pointer text-xs font-bold text-gray-200 transition-all"
                    >
                      <MessageSquare className="h-4 w-4 text-[#5865F2]" />
                      <span>Discord Login</span>
                    </button>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-500 pt-1">
                  Don't have a secure Volex account?{' '}
                  <button onClick={() => setMode('register')} className="text-[#bf5af2] hover:underline font-bold">
                    Register Account
                  </button>
                </div>
              </motion.div>
            )}

            {/* REGISTER MODE */}
            {mode === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-white font-sans tracking-tight">Register VIP Profile</h2>
                  <p className="text-xs text-gray-400 mt-1">Join the Volex server and claim exclusive security features.</p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">Minecraft Username / Player ID</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="e.g. Notch"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-2.5 pl-10 pr-4 rounded-xl text-xs focus:outline-none text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="email"
                        placeholder="e.g. yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-2.5 pl-10 pr-4 rounded-xl text-xs focus:outline-none text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-2.5 pl-10 pr-4 rounded-xl text-xs focus:outline-none text-white font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-2.5 pl-10 pr-4 rounded-xl text-xs focus:outline-none text-white font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    {loading ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Compile & Register Profile</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center text-xs text-gray-500 pt-1">
                  Already registered at Volex?{' '}
                  <button onClick={() => setMode('login')} className="text-[#bf5af2] hover:underline font-bold">
                    Log In
                  </button>
                </div>
              </motion.div>
            )}

            {/* FORGOT PASSWORD MODE */}
            {mode === 'forgot-password' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-white font-sans tracking-tight">Recover Credentials</h2>
                  <p className="text-xs text-gray-400 mt-1">We will compile a temporary secure reset PIN to retrieve access.</p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">Enter Stored Account Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-2.5 pl-10 pr-4 rounded-xl text-xs focus:outline-none text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase font-bold rounded-lg cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 bg-[#bf5af2] hover:bg-purple-600 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Dispatch Reset OTP'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* RESET PASSWORD MODE */}
            {mode === 'reset-password' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-black text-white font-sans tracking-tight">Reset Password PIN</h2>
                  <p className="text-xs text-gray-400 mt-1">Provide the 6-digit OTP code sent to your simulated inbox below.</p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">6-Digit Verification PIN</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-2.5 pl-10 pr-4 rounded-xl text-center text-sm font-mono tracking-widest focus:outline-none text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">New Password Credentials</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-2.5 pl-10 pr-4 rounded-xl text-xs focus:outline-none text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#bf5af2] hover:bg-purple-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Confirm Credentials Reset'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* EMAIL VERIFICATION MODE */}
            {mode === 'email-verify' && (
              <motion.div
                key="email-verify"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-[#bf5af2]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-black text-white">Email Verification Code</h2>
                  <p className="text-xs text-gray-400">We compiled an OTP pin code to <strong>{email}</strong>. Open the live dev mailbox below to read it.</p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center text-xs text-rose-400 font-mono">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyEmail} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider text-center block mb-2">Enter 6-Digit Code PIN</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-black/60 border border-purple-500/15 focus:border-purple-500/35 text-center text-lg font-mono tracking-widest py-3 rounded-xl focus:outline-none text-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mx-auto" /> : 'Authorize Credentials'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* OTP 2FA LOGIN VERIFICATION */}
            {mode === 'otp-verify' && (
              <motion.div
                key="otp-verify"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-black text-white">Two-Factor Authentication</h2>
                  <p className="text-xs text-gray-400">Your profile is highly secured! Provide the 6-digit verification code from your authenticator app.</p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center text-xs text-rose-400 font-mono">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerify2FA} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider text-center block mb-2">Authenticator App Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000 000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-black/60 border border-cyan-500/20 focus:border-cyan-500/50 text-center text-lg font-mono tracking-widest py-3 rounded-xl focus:outline-none text-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin mx-auto" /> : 'Confirm Secure Token'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* GOOGLE OAUTH POPUP SCREEN FLOW */}
            {mode === 'google-flow' && (
              <motion.div
                key="google"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center py-6"
              >
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg border border-gray-100">
                  <Chrome className="h-9 w-9 text-amber-500" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">Sign in with Google</h3>
                  <p className="text-xs text-gray-400 mt-1">VOLEX Shop is requesting permission to access your profile nodes.</p>
                </div>

                <div className="bg-black/40 border border-purple-500/5 p-4 rounded-xl space-y-3.5 text-left text-[11px] text-gray-300 max-w-sm mx-auto font-sans leading-relaxed">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Read your primary email address (e.g. gamer@gmail.com)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Access basic account preferences, avatar files and country location.</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => completeOAuth('google', false)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase font-black rounded-lg cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => completeOAuth('google', true)}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-mono text-[10px] uppercase font-black rounded-lg cursor-pointer"
                  >
                    Accept & Link
                  </button>
                </div>
              </motion.div>
            )}

            {/* DISCORD OAUTH POPUP SCREEN FLOW */}
            {mode === 'discord-flow' && (
              <motion.div
                key="discord"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center py-6"
              >
                <div className="h-16 w-16 bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-2xl flex items-center justify-center mx-auto text-[#5865F2]">
                  <MessageSquare className="h-9 w-9" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">Authorize Discord App</h3>
                  <p className="text-xs text-gray-400 mt-1">Volex Server seeks permission to bind discord identifier cards.</p>
                </div>

                <div className="bg-black/40 border border-purple-500/5 p-4 rounded-xl space-y-3.5 text-left text-[11px] text-gray-300 max-w-sm mx-auto font-sans leading-relaxed">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#5865F2] flex-shrink-0 mt-0.5" />
                    <span>Access your discord unique ID, avatar files, and general tags (e.g. shisir#4812).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#5865F2] flex-shrink-0 mt-0.5" />
                    <span>Read server guild member tags inside Volex official guild.</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => completeOAuth('discord', false)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase font-black rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => completeOAuth('discord', true)}
                    className="px-5 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white font-mono text-[10px] uppercase font-black rounded-lg cursor-pointer"
                  >
                    Authorize Node
                  </button>
                </div>
              </motion.div>
            )}

            {/* SUCCESS FEEDBACK SPLASH */}
            {mode === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-5 animate-fade-in"
              >
                <div className="h-16 w-16 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <ShieldCheck className="h-9 w-9 animate-bounce" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-white">Security Auth Compiled!</h3>
                  <p className="text-xs text-gray-400">Credential token keys generated, logged and saved successfully.</p>
                </div>

                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:scale-[1.03] transition-all"
                >
                  Enter Secured Dashboard
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* 2. Interactive Live Dev Inbox (Simulated Emails panel) */}
        <div className="w-full md:w-80 bg-black/40 border-t md:border-t-0 md:border-l border-purple-500/10 flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 bg-black/60 border-b border-purple-500/10 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-purple-400">
              <Inbox className="h-4 w-4" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider">Live Dev Mailbox</span>
            </div>
            
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-black animate-pulse">
                {unreadCount} NEW
              </span>
            )}
          </div>

          {/* Mail List */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 max-h-60 md:max-h-[380px] min-h-[150px]">
            {simulatedEmails.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-600 text-[10px] font-mono py-12">
                <Clock className="h-5 w-5 mb-1.5 opacity-30 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Waiting for verification or reset dispatch events...</span>
              </div>
            ) : (
              simulatedEmails.map((emailItem) => (
                <div 
                  key={emailItem.id}
                  className="p-3 rounded-xl border border-purple-500/10 bg-[#090b10] hover:border-purple-500/20 transition-all text-left space-y-2 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-1 bg-purple-500 w-10"></div>
                  
                  <div className="flex justify-between items-start text-[8px] font-mono text-gray-500">
                    <span>TO: {emailItem.to}</span>
                    <span>1s ago</span>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-white font-sans">{emailItem.subject}</h4>
                    <p className="text-[9.5px] text-gray-400 font-mono leading-relaxed mt-1">{emailItem.body}</p>
                  </div>

                  {/* Highlight Verification Code for easy copying */}
                  {emailItem.code && (
                    <div className="flex items-center justify-between bg-black/60 p-1.5 rounded border border-purple-500/20 font-mono text-[10px] mt-1 text-cyan-400">
                      <span>Verification Code:</span>
                      <strong className="text-xs text-white tracking-widest font-black uppercase tracking-wider">{emailItem.code}</strong>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-black/50 border-t border-purple-500/5 text-[9px] text-gray-500 font-mono text-center">
            Development Sandbox sandbox mail-trap relay active.
          </div>

        </div>

      </div>
    </div>
  );
};
