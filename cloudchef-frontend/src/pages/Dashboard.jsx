import Navbar from "../components/Navbar.jsx";
import { Settings, Search, Calendar, ShoppingCart, Bookmark, ChefHat, Sparkles, TrendingUp, Clock } from "lucide-react";

export default function Dashboard() {
  const menuItems = [
    {
      href: "/preferences",
      title: "Set Preferences",
      description: "Customize your dietary needs",
      icon: Settings,
      color: "from-cyan-500 to-cyan-600",
      iconBg: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      hoverColor: "hover:border-cyan-500/40"
    },
    {
      href: "/search",
      title: "Search Recipes",
      description: "Find your perfect meal",
      icon: Search,
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      hoverColor: "hover:border-blue-500/40"
    },
    {
      href: "/mealplan",
      title: "Generate Meal Plan",
      description: "AI-powered weekly plans",
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      hoverColor: "hover:border-purple-500/40"
    },
    {
      href: "/grocery",
      title: "Grocery List",
      description: "Smart shopping assistant",
      icon: ShoppingCart,
      color: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      hoverColor: "hover:border-emerald-500/40"
    },
    {
      href: "/saved",
      title: "Saved Plans",
      description: "Your favorite recipes",
      icon: Bookmark,
      color: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      hoverColor: "hover:border-amber-500/40"
    }
  ];

  const stats = [
    { label: "Recipes Found", value: "1,234+", icon: ChefHat, color: "text-cyan-400" },
    { label: "Meal Plans", value: "89", icon: Calendar, color: "text-purple-400" },
    { label: "Time Saved", value: "24hrs", icon: Clock, color: "text-emerald-400" }
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Hero Section */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">AI-Powered Meal Planning</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                CloudChef AI
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Your intelligent cooking companion. Discover recipes, plan meals, and simplify your kitchen experience.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-700/50"
                  >
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color} mx-auto mb-2`} />
                    <p className="text-lg sm:text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-slate-400">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Label */}
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
          </div>

          {/* Grid Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className={`group relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border ${item.borderColor} ${item.hoverColor}
                  hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden`}
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${item.iconBg} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 bg-gradient-to-br ${item.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                      {item.description}
                    </p>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-slate-700/50">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Ready to Transform Your Cooking?
              </h3>
              <p className="text-slate-400 mb-6 max-w-xl mx-auto">
                Get personalized meal recommendations powered by AI and start your culinary journey today.
              </p>
              <a
                href="/preferences"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-cyan-700 active:scale-95 transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
              >
                <Settings className="w-5 h-5" />
                <span>Get Started</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}