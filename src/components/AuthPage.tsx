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
  MessageSquare, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Chrome,
  KeyRound,
  Inbox,
  ArrowLeftRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthPageProps {
  onAuthSuccess: (username: string) => void;
  onBypass: () => void;
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

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onBypass }) => {
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
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Poll for sent simulated emails from server
  const fetchSimulatedEmails = async () => {
    try {
      const res = await fetch('/api/auth/simulated-emails');
      if (res.ok) {
        const data = await res.json();
        setSimulatedEmails(data);
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
    fetchSimulatedEmails();
    const interval = setInterval(fetchSimulatedEmails, 3000);
    return () => clearInterval(interval);
  }, []);

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
        setMode('email-verify');
        fetchSimulatedEmails();
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
        setTempUsername(data.username);
        setTempToken(data.tempToken);
        setMode('otp-verify');
      } else {
        if (rememberMe) {
          localStorage.setItem('volex_jwt_token', data.token);
        } else {
          sessionStorage.setItem('volex_jwt_token', data.token);
        }
        onAuthSuccess(data.username || data.user?.username || username);
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
        localStorage.setItem('volex_jwt_token', data.token);
        onAuthSuccess(data.username || data.user?.username || username);
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
        onAuthSuccess(data.username || data.user?.username || tempUsername);
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
        onAuthSuccess(data.username || data.user?.username || username || 'VolexPlayer');
        setMode('success');
      }
    } catch (err) {
      setLoading(false);
      setMode('login');
      setError("Social authentication failed");
    }
  };

  return (
    <div id="auth-page-container" className="max-w-5xl mx-auto py-6 md:py-12 px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row w-full bg-[#090a10]/80 border border-purple-500/15 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)] backdrop-blur-xl relative">
        
        {/* Ambient background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/5 blur-3xl pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full"></div>

        {/* 1. MAIN FORM PANEL */}
        <div className="flex-1 p-6 sm:p-10 relative z-10 border-b md:border-b-0 md:border-r border-purple-500/10">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 p-[1px] shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                <div className="h-full w-full bg-[#090a10] rounded-[7px] flex items-center justify-center font-black text-xs text-white">V</div>
              </div>
              <div>
                <span className="font-mono font-black text-[9px] tracking-widest text-[#bf5af2] uppercase block">VOLEX CENTRAL AUTHENTICATOR</span>
                <span className="font-sans font-extrabold text-xs text-gray-400">Node Secure Key Exchange v2.5</span>
              </div>
            </div>

            {/* Skip Gate button */}
            <button 
              onClick={onBypass}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-mono text-[9px] uppercase font-black rounded-lg border border-white/5 transition-all cursor-pointer"
            >
              <span>Continue as Guest</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            
            {/* LOGIN MODE */}
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-black text-white font-sans tracking-tight">Access Account Node</h2>
                  <p className="text-xs text-gray-400 mt-1">Authenticate your credentials or synchronize with social auth portals.</p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5">Username or Email Address</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="e.g. shisir or shisirtharu51@gmail.com"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-3 pl-11 pr-4 rounded-xl text-xs focus:outline-none text-white font-mono transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
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
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-3 pl-11 pr-11 rounded-xl text-xs focus:outline-none text-white font-mono transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-xs text-gray-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-purple-500/15 text-purple-600 focus:ring-0 checked:bg-purple-600 cursor-pointer"
                      />
                      <span className="font-sans">Remember My Active Session</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#bf5af2] hover:bg-purple-600 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(191,90,242,0.2)]"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>Validate Credentials & Log In</span>
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Social logins */}
                <div className="space-y-3.5 pt-5 border-t border-purple-500/5">
                  <div className="text-center text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                    OR REGISTER / SIGN IN DIRECTLY WITH
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => triggerOAuth('google')}
                      className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl cursor-pointer text-xs font-bold text-gray-200 transition-all"
                    >
                      <Chrome className="h-4 w-4 text-amber-500" />
                      <span>Google Auth</span>
                    </button>

                    <button
                      onClick={() => triggerOAuth('discord')}
                      className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl cursor-pointer text-xs font-bold text-gray-200 transition-all"
                    >
                      <MessageSquare className="h-4 w-4 text-[#5865F2]" />
                      <span>Discord Auth</span>
                    </button>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-400 pt-2">
                  Don't have a secure Volex account yet?{' '}
                  <button onClick={() => setMode('register')} className="text-[#bf5af2] hover:underline font-extrabold">
                    Register Account
                  </button>
                </div>
              </motion.div>
            )}

            {/* REGISTER MODE */}
            {mode === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-black text-white font-sans tracking-tight">Register Player Card</h2>
                  <p className="text-xs text-gray-400 mt-1">Register your profile to claim exclusive rank benefits & track orders.</p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5">Minecraft ID / Character Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="e.g. shisir"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-3 pl-11 pr-4 rounded-xl text-xs focus:outline-none text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="email"
                        placeholder="e.g. shisirtharu51@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-3 pl-11 pr-4 rounded-xl text-xs focus:outline-none text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-3 pl-11 pr-4 rounded-xl text-xs focus:outline-none text-white font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-3 pl-11 pr-4 rounded-xl text-xs focus:outline-none text-white font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>Compile & Register Profile</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center text-xs text-gray-400 pt-2">
                  Already registered at Volex?{' '}
                  <button onClick={() => setMode('login')} className="text-[#bf5af2] hover:underline font-extrabold">
                    Log In
                  </button>
                </div>
              </motion.div>
            )}

            {/* EMAIL VERIFICATION CODE */}
            {mode === 'email-verify' && (
              <motion.div
                key="email-verify"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-center"
              >
                <div className="h-14 w-14 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-[#bf5af2]">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Email Verification</h2>
                  <p className="text-xs text-gray-400 mt-1">An email code has been sent to <strong>{email}</strong>. Use the simulation mailbox on the right to read and verify it.</p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center text-xs text-rose-400 font-mono">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyEmail} className="space-y-4 max-w-sm mx-auto">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-2">Enter 6-Digit Code PIN</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-black/60 border border-purple-500/25 focus:border-purple-500/50 text-center text-xl font-mono tracking-widest py-3 rounded-xl focus:outline-none text-white font-bold"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin mx-auto" /> : 'Authorize Credentials'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* FORGOT PASSWORD */}
            {mode === 'forgot-password' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-white font-sans tracking-tight">Recover Credentials</h2>
                  <p className="text-xs text-gray-400 mt-1">Enter your account email to dispatch a simulated recovery code.</p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5">Registered Account Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="email"
                        placeholder="e.g. yourname@gmail.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-3 pl-11 pr-4 rounded-xl text-xs focus:outline-none text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase font-black rounded-xl cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-[#bf5af2] hover:bg-purple-600 text-black font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Send Reset PIN'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* RESET PASSWORD */}
            {mode === 'reset-password' && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-white font-sans tracking-tight">Confirm Reset PIN</h2>
                  <p className="text-xs text-gray-400 mt-1">Verify code from simulated dev mailbox to register a new credentials password.</p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5">6-Digit Verification PIN</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-3 pl-11 pr-4 rounded-xl text-center text-sm font-mono tracking-widest focus:outline-none text-white font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1.5">New Password Credentials</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-black/40 border border-purple-500/10 focus:border-purple-500/35 py-3 pl-11 pr-4 rounded-xl text-xs focus:outline-none text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#bf5af2] hover:bg-purple-600 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Confirm New Password'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* OTP 2FA LOGIN VERIFICATION */}
            {mode === 'otp-verify' && (
              <motion.div
                key="otp-verify"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-center"
              >
                <div className="h-14 w-14 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Two-Factor Authentication</h2>
                  <p className="text-xs text-gray-400 mt-1">Your player profile is highly secured! Provide the 6-digit PIN code from your authenticator application.</p>
                </div>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center text-xs text-rose-400 font-mono">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerify2FA} className="space-y-4 max-w-sm mx-auto">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-2">Authenticator App Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="000 000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-black/60 border border-cyan-500/20 focus:border-cyan-500/50 text-center text-xl font-mono tracking-widest py-3 rounded-xl focus:outline-none text-white font-bold"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin mx-auto" /> : 'Confirm Secure Token'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* GOOGLE OAUTH */}
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
                  <h3 className="text-xl font-black text-white">Authorize with Google</h3>
                  <p className="text-xs text-gray-400 mt-1">VOLEX Central Auth is requesting permission to secure access nodes.</p>
                </div>

                <div className="bg-black/40 border border-purple-500/5 p-4 rounded-xl space-y-3 text-left text-xs text-gray-300 max-w-sm mx-auto">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Read primary Google profile credentials email address</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Confirm avatar coordinates, basic metadata, and region nodes</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => completeOAuth('google', false)}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase font-black rounded-lg cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => completeOAuth('google', true)}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-mono text-[10px] uppercase font-black rounded-lg cursor-pointer"
                  >
                    Accept & Connect
                  </button>
                </div>
              </motion.div>
            )}

            {/* DISCORD OAUTH */}
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
                  <h3 className="text-xl font-black text-white">Authorize with Discord</h3>
                  <p className="text-xs text-gray-400 mt-1">Authorize Volex Guild integration to register profile roles.</p>
                </div>

                <div className="bg-black/40 border border-purple-500/5 p-4 rounded-xl space-y-3 text-left text-xs text-gray-300 max-w-sm mx-auto">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#5865F2] flex-shrink-0 mt-0.5" />
                    <span>Read your Discord profile card, tags (e.g. gamer#1234) and avatar files</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#5865F2] flex-shrink-0 mt-0.5" />
                    <span>Track VOLEX Official Guild membership stats automatically</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => completeOAuth('discord', false)}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase font-black rounded-lg cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => completeOAuth('discord', true)}
                    className="px-6 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white font-mono text-[10px] uppercase font-black rounded-lg cursor-pointer"
                  >
                    Authorize Node
                  </button>
                </div>
              </motion.div>
            )}

            {/* SUCCESS SPLASH */}
            {mode === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                <div className="h-16 w-16 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <ShieldCheck className="h-9 w-9" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Secure Authorization Compiled!</h3>
                  <p className="text-xs text-gray-400">Tokens validated, cryptographic node logs written, and profile loaded.</p>
                </div>

                <button
                  onClick={onBypass}
                  className="px-10 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:scale-[1.03] transition-all duration-300 flex items-center justify-center gap-1.5 mx-auto font-sans"
                >
                  <span>Go to Store Home</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* 2. SIMULATED DEV MAILBOX (ON THE RIGHT SIDE) */}
        <div className="w-full md:w-80 bg-black/40 border-t md:border-t-0 md:border-l border-purple-500/10 flex flex-col justify-between">
          
          <div className="p-4 bg-black/60 border-b border-purple-500/10 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-purple-400">
              <Inbox className="h-4 w-4" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider">Live Dev Sandbox Mailbox</span>
            </div>
            
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-black animate-pulse">
                {unreadCount} NEW
              </span>
            )}
          </div>

          {/* Mail List container */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 max-h-60 md:max-h-[380px] min-h-[180px]">
            {simulatedEmails.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 text-[10px] font-mono py-12">
                <Clock className="h-6 w-6 mb-2 opacity-30 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Waiting for dispatch events (Verification/Password Reset OTP Codes)...</span>
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
                    <span>Just now</span>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-white font-sans">{emailItem.subject}</h4>
                    <p className="text-[9.5px] text-gray-400 font-mono leading-relaxed mt-1">{emailItem.body}</p>
                  </div>

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

          <div className="p-4 bg-black/50 border-t border-purple-500/10 text-[9px] font-mono text-gray-500 leading-relaxed">
            <span className="font-bold text-purple-400 block mb-0.5">ℹ️ DEVELOPER SANDBOX</span>
            Simulated sandbox environment captures real emails dispatched by Express servers in real-time. Use codes to complete flow!
          </div>

        </div>

      </div>
    </div>
  );
};
