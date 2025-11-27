import React, { useState, useEffect } from "react";

// Layout Components
import Navbar from "./components/layout/Navbar";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import "./index.css";

// Pages
import LandingPage from "./pages/LandingPage";
import ProjectsPage from "./pages/ProjectsPage";
import FeedPage from "./pages/FeedPage";
import TrendingPage from "./pages/FeedPage"; // Temporary alias
import InboxPage from "./pages/InboxPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";

const API_USER = "http://localhost:5000/api/users/me";

export default function App() {
  const [activePage, setActivePage] = useState("auth");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from backend if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(API_USER, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Token expired");
        const data = await res.json();
        setUser(data);
        setActivePage("dashboard");
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        setActivePage("auth");
      })
      .finally(() => setLoading(false));
  }, []);

  const renderPage = () => {
    if (!user && ["dashboard", "profile", "inbox", "projects", "feed", "trending"].includes(activePage)) {
      return <AuthPage setUser={setUser} setPage={setActivePage} />;
    }

    switch (activePage) {
      case "home":
        return <LandingPage setPage={setActivePage} />;
      case "projects":
        return <ProjectsPage user={user} />;
      case "feed":
        return <FeedPage user={user} />;
      case "trending":
      case "news":
        return <TrendingPage />;
      case "auth":
        return <AuthPage setUser={setUser} setPage={setActivePage} />;
      case "profile":
        return <ProfilePage user={user} />;
      case "dashboard":
        return <Dashboard user={user} />;
      case "inbox":
        return <InboxPage user={user} />;
      default:
        return <LandingPage setPage={setActivePage} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F3] text-[#2F2F2F] font-sans">
      
      <Navbar
        activePage={activePage}
        setPage={setActivePage}
        user={user}
        setUser={setUser}
      />

      <main className="min-h-screen">
        {renderPage()}
      </main>

      {activePage !== "auth" && (
        <MobileBottomNav activePage={activePage} setPage={setActivePage} />
      )}

      <footer className="hidden md:block bg-white py-12 border-t border-[#D8D8D3] text-center text-gray-400 text-sm">
        <p className="font-serif text-lg text-[#2F2F2F] font-bold mb-4">Udaan</p>
        <p>&copy; 2025 Udaan Innovation Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
