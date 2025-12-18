import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { apiPost } from "../api/api.js";
import {
  ShoppingCart,
  Loader2,
  CheckCircle2,
  Circle,
  Download,
  Printer,
  Search,
  Sparkles,
  Apple,
  Beef,
  Milk,
  Wheat,
  Cookie,
  Package,
  ChefHat,
  Trash2
} from "lucide-react";

export default function GroceryList() {
  const [list, setList] = useState(null);
  const [recipeName, setRecipeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const generateGroceryList = async () => {
    if (!recipeName.trim()) {
      alert("Please enter a recipe name.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiPost("/grocery", { recipe: recipeName });
      
      if (response && response.groceryList) {
        setList(response.groceryList);
        setCheckedItems(new Set());
      } else {
        alert("Failed to generate grocery list.");
        setList([]);
      }
    } catch (error) {
      console.error("Error generating grocery list:", error);
      alert("Could not generate grocery list.");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (index) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const clearList = () => {
    if (confirm("Are you sure you want to clear the grocery list?")) {
      setList(null);
      setRecipeName("");
      setCheckedItems(new Set());
    }
  };

  const categorizeItem = (item) => {
    const lower = item.toLowerCase();
    if (lower.match(/apple|banana|orange|berry|fruit|vegetable|lettuce|tomato|carrot|pepper|onion|garlic|potato|spinach|broccoli|cucumber|zucchini/)) return "produce";
    if (lower.match(/chicken|beef|pork|fish|meat|turkey|salmon|shrimp|bacon|sausage|lamb/)) return "meat";
    if (lower.match(/milk|cheese|yogurt|butter|cream|egg/)) return "dairy";
    if (lower.match(/bread|pasta|rice|cereal|flour|oat|noodle|tortilla|quinoa/)) return "grains";
    if (lower.match(/cookie|cake|candy|chocolate|snack|chip|ice cream/)) return "snacks";
    return "other";
  };

  const categoryIcons = {
    produce: { icon: Apple, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    meat: { icon: Beef, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    dairy: { icon: Milk, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    grains: { icon: Wheat, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    snacks: { icon: Cookie, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
    other: { icon: Package, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" }
  };

  const filteredItems = Array.isArray(list) ? list.filter((item) => {
    const matchesSearch = item.toLowerCase().includes(searchQuery.toLowerCase());
    const category = categorizeItem(item);
    const matchesFilter = filterCategory === "all" || category === filterCategory;
    return matchesSearch && matchesFilter;
  }) : [];

  const groupedItems = filteredItems.reduce((acc, item, idx) => {
    const category = categorizeItem(item);
    if (!acc[category]) acc[category] = [];
    acc[category].push({ item, originalIndex: list.indexOf(item) });
    return acc;
  }, {});

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const text = `Grocery List for: ${recipeName || "Recipe"}\n\n${Array.isArray(list) ? list.join("\n") : ""}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "grocery-list.txt";
    a.click();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-900 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <ShoppingCart className="w-14 h-14 text-cyan-400 mx-auto mb-3" />
            <h2 className="text-3xl font-bold text-white">Grocery List Generator</h2>
            <p className="text-slate-400">Generate ingredients list from any recipe</p>
          </div>

          {/* RECIPE INPUT */}
          <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="w-5 h-5 text-amber-400" />
              <h3 className="text-white font-bold">Enter Recipe Name</h3>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && generateGroceryList()}
                placeholder="e.g., Spaghetti Carbonara, Chocolate Cake..."
                className="flex-1 px-4 py-3 rounded-lg bg-slate-900 text-white border border-slate-700 focus:border-cyan-400 focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={generateGroceryList}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>

          {!list || !Array.isArray(list) || list.length === 0 ? (
            <div className="text-center text-slate-400 mt-20">
              <div className="bg-slate-800 rounded-2xl p-12 border border-slate-700">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {list && list.length === 0 && !loading ? "No Items Found" : "No Grocery List Yet"}
                </h3>
                <p className="text-slate-400 mb-6">
                  {list && list.length === 0 && !loading 
                    ? "No items found for this recipe. Try another one!"
                    : "Enter a recipe name above to generate your shopping list"}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-slate-700 rounded-full text-sm">Spaghetti Carbonara</span>
                  <span className="px-3 py-1 bg-slate-700 rounded-full text-sm">Chicken Curry</span>
                  <span className="px-3 py-1 bg-slate-700 rounded-full text-sm">Caesar Salad</span>
                  <span className="px-3 py-1 bg-slate-700 rounded-full text-sm">Chocolate Cake</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* RECIPE INFO & ACTIONS */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 mb-6 border border-cyan-500/20">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <p className="text-cyan-400 text-sm font-semibold">Recipe</p>
                    <h3 className="text-white text-xl font-bold">{recipeName || "Generated List"}</h3>
                    <p className="text-slate-400 text-sm">
                      {list?.length || 0} items • {checkedItems.size} checked
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrint}
                      className="p-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                      title="Print"
                    >
                      <Printer className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={clearList}
                      className="p-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      title="Clear List"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* SEARCH & FILTER */}
              <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
                  <input
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900 text-white border border-slate-700 focus:border-cyan-400 focus:outline-none"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setFilterCategory("all")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filterCategory === "all"
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    All ({list?.length || 0})
                  </button>
                  {Object.keys(categoryIcons).map((cat) => {
                    const count = list?.filter(item => categorizeItem(item) === cat).length || 0;
                    return (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                          filterCategory === cat
                            ? "bg-cyan-500 text-white"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ITEMS BY CATEGORY */}
              {Object.keys(groupedItems).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(groupedItems).map(([category, items]) => {
                    const { icon: Icon, color, bg, border } = categoryIcons[category];
                    return (
                      <div key={category} className={`bg-slate-800 rounded-xl overflow-hidden border ${border}`}>
                        <div className={`${bg} px-4 py-3 border-b ${border}`}>
                          <div className="flex items-center gap-2">
                            <Icon className={`w-5 h-5 ${color}`} />
                            <h3 className={`font-bold capitalize ${color}`}>
                              {category}
                            </h3>
                            <span className={`ml-auto text-sm ${color}`}>
                              {items.length} {items.length === 1 ? "item" : "items"}
                            </span>
                          </div>
                        </div>
                        <div className="divide-y divide-slate-700">
                          {items.map(({ item, originalIndex }) => (
                            <div
                              key={originalIndex}
                              onClick={() => toggleItem(originalIndex)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 cursor-pointer transition-colors group"
                            >
                              {checkedItems.has(originalIndex) ? (
                                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-600 group-hover:text-slate-500 flex-shrink-0" />
                              )}
                              <span
                                className={`text-white transition-all ${
                                  checkedItems.has(originalIndex)
                                    ? "line-through text-slate-500"
                                    : ""
                                }`}
                              >
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  <Search className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p>No items match your search</p>
                </div>
              )}

              {/* PROGRESS */}
              {list?.length > 0 && (
                <div className="mt-6 bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400 font-medium">Shopping Progress</span>
                    <span className="text-cyan-400 font-bold">
                      {Math.round((checkedItems.size / list.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
                      style={{
                        width: `${(checkedItems.size / list.length) * 100}%`
                      }}
                    />
                  </div>
                  <p className="text-slate-400 text-xs mt-2">
                    {checkedItems.size} of {list.length} items completed
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}