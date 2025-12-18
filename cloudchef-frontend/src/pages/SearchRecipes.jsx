import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { apiGet } from "../api/api.js";
import { Search, Loader2, ChefHat, TrendingUp } from "lucide-react";

export default function SearchRecipes() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const data = await apiGet(`/search?query=${encodeURIComponent(query)}`);
      setResults(data || []);
    } catch {
      alert("Search failed. Please try again.");
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && query.trim()) {
      search();
    }
  };

  const popularSearches = [
    "High protein breakfast",
    "Quick dinner",
    "Vegan desserts",
    "Low carb lunch",
    "30-minute meals",
    "Healthy snacks"
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl mb-4 sm:mb-6 shadow-lg shadow-cyan-500/50">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Discover Recipes
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Search through thousands of recipes tailored to your preferences
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-slate-700/50 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search e.g., 'high protein breakfast'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl
                    text-white placeholder-slate-500
                    focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none
                    transition-all duration-200 hover:border-slate-500"
                  />
                </div>
                <button
                  onClick={search}
                  disabled={loading || !query.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 sm:px-8 py-3.5 rounded-xl font-semibold 
                  hover:from-cyan-600 hover:to-cyan-700 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50
                  flex items-center justify-center gap-2 min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="hidden sm:inline">Searching</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>

              {/* Popular Searches */}
              {!results.length && !loading && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <p className="text-sm font-medium text-slate-400">Popular searches:</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search);
                          setTimeout(() => {
                            const searchBtn = document.querySelector('button[type="button"]');
                            if (searchBtn) searchBtn.click();
                          }, 100);
                        }}
                        className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-sm
                        hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/30
                        border border-slate-600 transition-all duration-200"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Searching for delicious recipes...</p>
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Found {results.length} {results.length === 1 ? 'recipe' : 'recipes'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {results.map((recipe, index) => (
                  <div
                    key={index}
                    className="group bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 
                    hover:border-cyan-500/30 transition-all duration-300 overflow-hidden
                    hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Recipe Image Placeholder */}
                    <div className="relative h-40 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ChefHat className="w-12 h-12 text-slate-600" />
                      </div>
                    </div>

                    {/* Recipe Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                        {recipe.title}
                      </h3>
                      
                      <div className="text-slate-400 text-sm whitespace-pre-wrap">
                        {recipe.fullrecipe}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* No Results */}
          {!loading && results.length === 0 && query && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No recipes found</h3>
              <p className="text-slate-400 mb-6">
                Try adjusting your search terms or browse popular searches above
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && results.length === 0 && !query && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Ready to discover?</h3>
              <p className="text-slate-400">
                Enter a search term above or try one of our popular searches
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}