import { useState } from "react";
import { useAuth } from "../auth/authContext.jsx";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { pool } from "../auth/cognito.js";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = () => {
    setIsLoading(true);

    const user = new CognitoUser({ Username: email, Pool: pool });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
      const userData = {
        username: email,
        signInUserSession: {
          idToken: {
            jwtToken: session.getIdToken().getJwtToken()
          },
          accessToken: {
            jwtToken: session.getAccessToken().getJwtToken()
          },
          refreshToken: {
            token: session.getRefreshToken().getToken()
          },
          clockDrift: session.clockDrift
        }
      };

  // Save FULL session in local storage
  localStorage.setItem("user", JSON.stringify(userData));

  // Also update React state
  setUser(userData);

  window.location.href = "/dashboard";
},


      onFailure: (err) => {
        alert(err.message);
        setIsLoading(false);
      },

      newPasswordRequired: () => {
        setIsLoading(false);
      },
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && email && password) {
      submit();
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
            <LogIn className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Sign in to access your account
          </p>
        </div>

        {/* Login Card */}
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
                  id="email"
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
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm flex-wrap gap-2">
              <label className="flex items-center cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-cyan-500 bg-slate-900 border-slate-600 rounded focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0 focus:ring-offset-slate-800 cursor-pointer" 
                />
                <span className="ml-2 text-slate-400 group-hover:text-slate-300 transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="/forgot-password"
                className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              onClick={submit}
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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <LogIn className="w-5 h-5" />
                </>
              )}
            </button>

           
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 sm:mt-8 text-slate-400 text-sm sm:text-base">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-cyan-500 hover:text-cyan-400 font-semibold transition-colors"
          >
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}