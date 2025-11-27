import React, { useState, useEffect } from "react";

// Layout Components
import Navbar from "./components/layout/Navbar";
import MobileBottomNav from "./components/layout/MobileBottomNav";

// Pages
import LandingPage from "./pages/LandingPage";
import ProjectsPage from "./pages/ProjectsPage";
import FeedPage from "./pages/FeedPage";
import TrendingPage from "./pages/FeedPage"; // Temporary alias for News/Trending
import InboxPage from "./pages/InboxPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";

// Import Users for simulation login
import users from "./data/users";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState(null);

  // Page Routing
  const renderPage = () => {
    switch (activePage) {
      case "home": return <LandingPage setPage={setActivePage} />;
      case "projects": return <ProjectsPage user={user} />;
      case "feed": return <FeedPage user={user} />;
      case "trending": return <TrendingPage />;
      case "news": return <TrendingPage />;
      case "auth": return <AuthPage setUser={setUser} setPage={setActivePage} />;
      case "profile": return <ProfilePage user={user} />;
      case "dashboard": return <Dashboard user={user} />;
      case "inbox": return <InboxPage />;
      default: return <LandingPage setPage={setActivePage} />;
    }
  };

  useEffect(() => {
    console.log("Welcome to Udaan front-end build!");
  }, []);

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

      {/* Footer */}
      <footer className="hidden md:block bg-white py-12 border-t border-[#D8D8D3] text-center text-gray-400 text-sm">
        <p className="font-serif text-lg text-[#2F2F2F] font-bold mb-4">Udaan</p>
        <p>&copy; 2024 Udaan Innovation Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
