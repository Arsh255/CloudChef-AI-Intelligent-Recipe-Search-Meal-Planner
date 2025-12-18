import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { Settings, Globe, AlertCircle, ThumbsDown, Save, Loader2, CheckCircle2, Utensils } from "lucide-react";

// Define your API base URL
const API_BASE = "https://sryh2mh2sg.execute-api.us-east-1.amazonaws.com/prod/api";

// 🔹 Read stored Cognito session from localStorage to get the Access Token
function getAccessToken() {
  const stored = localStorage.getItem("user");

  if (!stored) throw new Error("User not logged in");
  const parsed = JSON.parse(stored);
  // Access Token is REQUIRED for API Gateway authorizer
  return parsed?.signInUserSession?.idToken?.jwtToken;
}

// API GET request function
export async function apiGet(path) {
  const token = getAccessToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST", // Use POST method as you mentioned fetching preferences via POST
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}) // Empty body to retrieve preferences
  });

  return res.json();
}

// API POST request function (for saving preferences)
export async function apiPost(path, body) {
  const token = getAccessToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

export default function Preferences() {
  const [prefs, setPrefs] = useState({
    cuisine: "",
    allergies: "",
    dislikes: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ----------------------------------------------
  // LOAD PREFERENCES ON PAGE LOAD
  // ----------------------------------------------
  useEffect(() => {
    async function loadPrefs() {
      try {
        // Fetch preferences using the POST method (no body provided)
        const data = await apiGet("/preferences");

        if (data && typeof data === "object") {
          setPrefs({
            cuisine: data.cuisine || "",
            allergies: data.allergies || "",
            dislikes: data.dislikes || "",
          });
        }
      } catch (err) {
        console.error("Failed to load preferences:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPrefs();
  }, []);

  // ----------------------------------------------
  // SAVE PREFERENCES
  // ----------------------------------------------
  const save = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Save preferences using the POST method
      await apiPost("/preferences", prefs);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // -------------------------
  // UI LOGIC BELOW
  // -------------------------

  const cuisineOptions = [
    "Italian", "Chinese", "Indian", "Mexican", "Japanese",
    "Thai", "French", "Mediterranean", "American", "Korean"
  ];

  const commonAllergies = [
    "Peanuts", "Tree nuts", "Milk", "Eggs", "Wheat",
    "Soy", "Fish", "Shellfish", "Gluten"
  ];

  const toggleCuisine = (cuisine) => {
    const current = prefs.cuisine.split(",").map(c => c.trim()).filter(Boolean);
    if (current.includes(cuisine)) {
      setPrefs({ ...prefs, cuisine: current.filter(c => c !== cuisine).join(", ") });
    } else {
      setPrefs({ ...prefs, cuisine: [...current, cuisine].join(", ") });
    }
  };

  const toggleAllergy = (allergy) => {
    const current = prefs.allergies.split(",").map(a => a.trim()).filter(Boolean);
    if (current.includes(allergy)) {
      setPrefs({ ...prefs, allergies: current.filter(a => a !== allergy).join(", ") });
    } else {
      setPrefs({ ...prefs, allergies: [...current, allergy].join(", ") });
    }
  };

  const selectedCuisines = prefs.cuisine.split(",").map(c => c.trim()).filter(Boolean);
  const selectedAllergies = prefs.allergies.split(",").map(a => a.trim()).filter(Boolean);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading your preferences...</p>
          </div>
        </div>
      </>
    );
  }


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl mb-4 sm:mb-6 shadow-lg shadow-cyan-500/50">
              <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Your Preferences
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Customize your culinary experience. Tell us what you love and what to avoid.
            </p>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-400 font-medium">Preferences saved successfully!</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Cuisine Preferences */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-slate-700/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-white">
                      Favorite Cuisines
                    </label>
                    <p className="text-sm text-slate-400">Select all that you enjoy</p>
                  </div>
                </div>

                {/* Cuisine Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {cuisineOptions.map((cuisine) => {
                    const isSelected = selectedCuisines.includes(cuisine);
                    return (
                      <button
                        key={cuisine}
                        onClick={() => toggleCuisine(cuisine)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isSelected
                            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600"
                        }`}
                      >
                        {cuisine}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Input */}
                <div className="relative group">
                  <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    value={prefs.cuisine}
                    onChange={(e) => setPrefs({ ...prefs, cuisine: e.target.value })}
                    placeholder="Or type custom cuisines (comma separated)"
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl
                    text-white placeholder-slate-500
                    focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none
                    transition-all duration-200 hover:border-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-slate-700/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-white">
                      Allergies & Dietary Restrictions
                    </label>
                    <p className="text-sm text-slate-400">Important for your safety</p>
                  </div>
                </div>

                {/* Allergy Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {commonAllergies.map((allergy) => {
                    const isSelected = selectedAllergies.includes(allergy);
                    return (
                      <button
                        key={allergy}
                        onClick={() => toggleAllergy(allergy)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isSelected
                            ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600"
                        }`}
                      >
                        {allergy}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Input */}
                <div className="relative group">
                  <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-400 transition-colors" />
                  <input
                    value={prefs.allergies}
                    onChange={(e) => setPrefs({ ...prefs, allergies: e.target.value })}
                    placeholder="Or type custom allergies (comma separated)"
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl
                    text-white placeholder-slate-500
                    focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none
                    transition-all duration-200 hover:border-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Dislikes */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-slate-700/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <ThumbsDown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-white">
                      Food Dislikes
                    </label>
                    <p className="text-sm text-slate-400">Ingredients you prefer to avoid</p>
                  </div>
                </div>

                <div className="relative group">
                  <ThumbsDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-400 transition-colors" />
                  <input
                    value={prefs.dislikes}
                    onChange={(e) => setPrefs({ ...prefs, dislikes: e.target.value })}
                    placeholder="e.g., mushrooms, olives, cilantro..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl
                    text-white placeholder-slate-500
                    focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none
                    transition-all duration-200 hover:border-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={save}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-4 rounded-xl font-semibold 
              hover:from-cyan-600 hover:to-cyan-700 active:scale-[0.98]
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50
              flex items-center justify-center gap-2 text-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-slate-800/30 backdrop-blur-xl rounded-xl p-4 border border-slate-700/30">
            <p className="text-sm text-slate-400 text-center">
              💡 Your preferences help us recommend recipes tailored just for you. Update them anytime!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}