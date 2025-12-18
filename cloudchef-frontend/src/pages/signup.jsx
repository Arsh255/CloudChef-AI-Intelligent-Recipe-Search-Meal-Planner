import { useState } from "react";
import { pool } from "../auth/cognito.js";
import { CognitoUser } from "amazon-cognito-identity-js";
import { Eye, EyeOff, Mail, Lock, UserPlus, CheckCircle, Send } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [verifyMode, setVerifyMode] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");

  const signup = (e) => {
    e.preventDefault();
    setIsLoading(true);

    pool.signUp(email, password, [], null, (err, data) => {
      setIsLoading(false);
      if (err) {
        alert(err.message);
        return;
      }

      alert("Account created! Verification code sent to your email.");
      setVerifyMode(true);
    });
  };

  const confirmSignup = () => {
    setIsLoading(true);
    const user = new CognitoUser({
      Username: email,
      Pool: pool,
    });

    user.confirmRegistration(verifyCode, true, (err, result) => {
      setIsLoading(false);
      if (err) {
        alert(err.message);
        return;
      }

      alert("Email verified! You may now login.");
      window.location.href = "/";
    });
  };

  const resendCode = () => {
    setIsLoading(true);
    pool.resendConfirmationCode(email, (err) => {
      setIsLoading(false);
      if (err) alert(err.message);
      else alert("Verification code resent!");
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && email && password && !verifyMode) {
      signup(e);
    } else if (e.key === "Enter" && verifyCode && verifyMode) {
      confirmSignup();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl mb-4 sm:mb-6 shadow-lg shadow-cyan-500/50">
            {verifyMode ? (
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            ) : (
              <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            )}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">
            {verifyMode ? "Verify Your Email" : "Create Account"}
          </h2>
          {!verifyMode && (
            <p className="text-slate-400 text-sm sm:text-base">
              Sign up to start your journey
            </p>
          )}
          {verifyMode && (
            <p className="text-slate-400 text-sm sm:text-base">
              Enter the code sent to your email
            </p>
          )}
        </div>

        {/* SIGNUP FORM */}
        {!verifyMode && (
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-700/50 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none"></div>
            
            <div className="space-y-5 sm:space-y-6 relative">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    required
                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl
                    text-white placeholder-slate-500
                    focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none
                    transition-all duration-200 hover:border-slate-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-200" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    required
                    className="w-full pl-12 pr-12 py-3 sm:py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl
                    text-white placeholder-slate-500
                    focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none
                    transition-all duration-200 hover:border-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-cyan-500 transition-colors duration-200 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>

              {/* Sign Up Button */}
              <button
                onClick={signup}
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 sm:py-3.5 rounded-xl font-semibold 
                hover:from-cyan-600 hover:to-cyan-700 active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50
                flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Sign Up</span>
                    <UserPlus className="w-5 h-5" />
                  </>
                )}
              </button>
           
            </div>
          </div>
        )}

        {/* VERIFY MODE */}
        {verifyMode && (
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-700/50 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none"></div>
            
            <div className="space-y-5 sm:space-y-6 relative">
              {/* Email Display */}
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <p className="text-slate-400 text-sm text-center mb-2">
                  Verification code sent to:
                </p>
                <p className="text-center font-semibold text-cyan-400 break-all">
                  {email}
                </p>
              </div>

              {/* Verification Code Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Verification Code
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CheckCircle className="w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl
                    text-white placeholder-slate-500 text-center text-lg tracking-wider
                    focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none
                    transition-all duration-200 hover:border-slate-500"
                    maxLength="6"
                    required
                  />
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={confirmSignup}
                disabled={isLoading || !verifyCode}
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 sm:py-3.5 rounded-xl font-semibold 
                hover:from-cyan-600 hover:to-cyan-700 active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50
                flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Account</span>
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Resend Code Button */}
              <button
                onClick={resendCode}
                disabled={isLoading}
                className="w-full bg-slate-700/50 text-slate-300 py-3 sm:py-3.5 rounded-xl font-semibold 
                hover:bg-slate-600/50 active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                border border-slate-600 hover:border-slate-500
                flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Resend Code</span>
                  </>
                )}
              </button>

              {/* Help Text */}
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  Didn't receive the code? Check your spam folder or click resend.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {!verifyMode && (
          <p className="text-center mt-6 sm:mt-8 text-slate-400 text-sm sm:text-base">
            Already have an account?{" "}
            <a
              href="/"
              className="text-cyan-500 hover:text-cyan-400 font-semibold transition-colors"
            >
              Sign in
            </a>
          </p>
        )}

        {verifyMode && (
          <button
            onClick={() => setVerifyMode(false)}
            className="w-full text-center mt-6 sm:mt-8 text-slate-400 text-sm sm:text-base hover:text-slate-300 transition-colors"
          >
            ← Back to signup
          </button>
        )}
      </div>
    </div>
  );
}