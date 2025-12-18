import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { apiPost } from "../api/api.js";
import { Calendar, Loader2, Sparkles, Sun, Sunset, Moon, ChefHat, Download, Share2, RefreshCw, Check } from "lucide-react";

export default function MealPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    setPlan(null);

    try {
      const data = await apiPost("/mealplan", { dummy: true });
      setPlan(data);
    } catch {
      alert("Meal plan generation failed. Please try again.");
    }

    setLoading(false);
  };

  const mealIcons = {
    breakfast: { icon: Sun, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    lunch: { icon: Sunset, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    dinner: { icon: Moon, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" }
  };

  const dayColors = [
    { gradient: "from-cyan-500/10 to-blue-500/10", border: "border-cyan-500/20", accent: "text-cyan-400" },
    { gradient: "from-blue-500/10 to-indigo-500/10", border: "border-blue-500/20", accent: "text-blue-400" },
    { gradient: "from-indigo-500/10 to-purple-500/10", border: "border-indigo-500/20", accent: "text-indigo-400" },
    { gradient: "from-purple-500/10 to-pink-500/10", border: "border-purple-500/20", accent: "text-purple-400" },
    { gradient: "from-pink-500/10 to-rose-500/10", border: "border-pink-500/20", accent: "text-pink-400" },
    { gradient: "from-rose-500/10 to-red-500/10", border: "border-rose-500/20", accent: "text-rose-400" },
    { gradient: "from-red-500/10 to-orange-500/10", border: "border-red-500/20", accent: "text-red-400" }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 sm:mb-6 shadow-lg shadow-purple-500/50">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Weekly Meal Plan
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Generate a personalized meal plan based on your preferences
            </p>
          </div>

          {/* Action Bar */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI-Powered Planning</h3>
                  <p className="text-sm text-slate-400">Customized for your dietary needs</p>
                </div>
              </div>

              <button
                onClick={generatePlan}
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold 
                hover:from-purple-600 hover:to-purple-700 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50
                flex items-center justify-center gap-2 min-w-[180px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Generate Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                  <ChefHat className="w-12 h-12 text-purple-400 animate-pulse" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Creating Your Perfect Week</h3>
              <p className="text-slate-400">Analyzing your preferences and generating delicious meals...</p>
            </div>
          )}

          {/* Meal Plan Display */}
          {plan && !loading && (
            <>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-300 rounded-lg
                  hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500
                  transition-all duration-200">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Download PDF</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-300 rounded-lg
                  hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500
                  transition-all duration-200">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Share Plan</span>
                </button>
              </div>

              {/* Days Grid */}
              <div className="space-y-4">
                {Object.entries(plan).map(([day, meals], idx) => {
                  const dayStyle = dayColors[idx % dayColors.length];
                  
                  return (
                    <div
                      key={idx}
                      className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl border ${dayStyle.border} 
                      overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
                    >
                      {/* Day Header */}
                      <div className={`bg-gradient-to-r ${dayStyle.gradient} px-6 py-4 border-b border-slate-700/50`}>
                        <div className="flex items-center justify-between">
                          <h3 className={`text-xl font-bold ${dayStyle.accent}`}>
                            {day}
                          </h3>
                          <button className="w-8 h-8 bg-slate-800/50 rounded-lg flex items-center justify-center
                            hover:bg-slate-700/50 transition-colors border border-slate-600">
                            <Check className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>

                      {/* Meals */}
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {Object.entries(meals).map(([mealType, mealName]) => {
                            const mealStyle = mealIcons[mealType] || mealIcons.breakfast;
                            const MealIcon = mealStyle.icon;

                            return (
                              <div
                                key={mealType}
                                className={`${mealStyle.bg} ${mealStyle.border} border rounded-xl p-4
                                hover:scale-[1.02] transition-transform duration-200`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5">
                                    <MealIcon className={`w-5 h-5 ${mealStyle.color}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                                      {mealType}
                                    </p>
                                    <p className="text-white font-medium leading-snug">
                                      {mealName}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Card */}
              <div className="mt-8 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Your Plan is Ready!</h3>
                      <p className="text-sm text-slate-400">
                        {Object.keys(plan).length} days of delicious meals planned
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={generatePlan}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-slate-300 rounded-lg
                    hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500
                    transition-all duration-200 font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Empty State */}
          {!plan && !loading && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Meal Plan Yet</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Click the "Generate Plan" button above to create your personalized weekly meal plan
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Personalized for you</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>21 meals planned</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>Dietary preferences included</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}