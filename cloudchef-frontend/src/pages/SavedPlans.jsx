import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { apiPost } from "../api/api.js"; // Assuming you are using apiPost to handle the POST request
import {
  Bookmark,
  Loader2,
  Trash2,
  Download,
  Calendar,
  Clock,
  ChefHat,
  Eye,
  Sun,
  Sunset,
  Moon,
  Heart,
  Search
} from "lucide-react";

export default function SavedPlans() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  // ---------------- LOAD SAVED PLANS ----------------
  useEffect(() => {
    async function loadSaved() {
      try {
        // Use POST to fetch saved meal plans (empty body for GET-like behavior)
        const data = await apiPost("/mealplan", {});

        // ✅ GUARANTEE ARRAY
        if (Array.isArray(data)) {
          setSaved(data);
        } else if (data && typeof data === "object" && data.plan) {
          // single plan edge case
          setSaved([data]);
        } else {
          setSaved([]);
        }
      } catch (err) {
        console.error("Failed to load saved plans:", err);
        setSaved([]);
      } finally {
        setLoading(false);
      }
    }

    loadSaved();
  }, []);

  // ---------------- DELETE (LOCAL ONLY) ----------------
  const deletePlan = (index) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      setSaved((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // ---------------- FILTER ----------------
  const filteredPlans = saved.filter((item, i) => {
    if (!searchQuery) return true;
    const label = `Plan #${i + 1}`.toLowerCase();
    return (
      label.includes(searchQuery.toLowerCase()) ||
      JSON.stringify(item.plan || {}).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const mealIcons = {
    breakfast: { icon: Sun, color: "text-amber-400" },
    lunch: { icon: Sunset, color: "text-orange-400" },
    dinner: { icon: Moon, color: "text-purple-400" }
  };

  const formatDate = (date) =>
    new Date(date || Date.now()).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
        </div>
      </>
    );
  }

  // ---------------- UI ----------------
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-900 px-4 py-10">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-8">
            <Bookmark className="w-14 h-14 text-amber-400 mx-auto mb-3" />
            <h2 className="text-3xl font-bold text-white">Saved Meal Plans</h2>
            <p className="text-slate-400">Access your generated plans</p>
          </div>

          {/* SEARCH */}
          {saved.length > 0 && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-3 text-slate-400" />
                <input
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 text-white"
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* PLANS */}
          {filteredPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPlans.map((item, index) => (
                <div key={index} className="bg-slate-800 rounded-xl border border-slate-700">

                  {/* CARD HEADER */}
                  <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <div>
                      <h3 className="text-white font-bold">Plan #{index + 1}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                    <Trash2
                      onClick={() => deletePlan(index)}
                      className="w-4 h-4 text-red-400 cursor-pointer"
                    />
                  </div>

                  {/* PREVIEW */}
                  <div className="p-4 space-y-3">
                    {Object.entries(item.plan || {}).slice(0, 3).map(([day, meals]) => (
                      <div key={day} className="bg-slate-900 rounded-lg p-3">
                        <p className="text-amber-400 font-semibold mb-1">{day}</p>
                        {Object.entries(meals).slice(0, 2).map(([type, name]) => {
                          const Icon = mealIcons[type]?.icon || Sun;
                          return (
                            <div key={type} className="flex items-center gap-2 text-slate-400 text-xs">
                              <Icon className="w-3 h-3" />
                              {name}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* ACTIONS */}
                  <div className="p-4 border-t border-slate-700 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedPlan(item.plan)}
                      className="bg-amber-500/10 text-amber-400 py-2 rounded-lg flex justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button className="bg-slate-700 text-slate-300 py-2 rounded-lg flex justify-center gap-2">
                      <Download className="w-4 h-4" /> Export
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 mt-20">
              <Heart className="w-12 h-12 mx-auto mb-3 text-pink-400" />
              No saved meal plans yet
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedPlan && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPlan(null)}
        >
          <div
            className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">Full Meal Plan</h3>
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {Object.entries(selectedPlan).map(([day, meals]) => (
                <div key={day} className="bg-slate-900 rounded-lg p-4">
                  <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {day}
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(meals).map(([type, name]) => {
                      const Icon = mealIcons[type]?.icon || ChefHat;
                      const colorClass = mealIcons[type]?.color || "text-slate-400";
                      return (
                        <div key={type} className="flex items-start gap-3">
                          <Icon className={`w-4 h-4 mt-0.5 ${colorClass}`} />
                          <div>
                            <p className="text-white text-sm font-medium capitalize">{type}</p>
                            <p className="text-slate-300 text-sm">{name}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
