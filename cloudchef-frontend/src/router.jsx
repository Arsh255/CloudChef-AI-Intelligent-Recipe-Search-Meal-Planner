import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Preferences from "./pages/Preferences.jsx";
import SearchRecipes from "./pages/SearchRecipes.jsx";
import MealPlan from "./pages/MealPlan.jsx";
import GroceryList from "./pages/GroceryList.jsx";
import SavedPlans from "./pages/SavedPlans.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/preferences",
    element: (
      <ProtectedRoute>
        <Preferences />
      </ProtectedRoute>
    ),
  },

  {
    path: "/search",
    element: (
      <ProtectedRoute>
        <SearchRecipes />
      </ProtectedRoute>
    ),
  },

  {
    path: "/mealplan",
    element: (
      <ProtectedRoute>
        <MealPlan />
      </ProtectedRoute>
    ),
  },

  {
    path: "/grocery",
    element: (
      <ProtectedRoute>
        <GroceryList />
      </ProtectedRoute>
    ),
  },

  {
    path: "/saved",
    element: (
      <ProtectedRoute>
        <SavedPlans />
      </ProtectedRoute>
    ),
  },
]);
