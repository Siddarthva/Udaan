import React, { useState } from "react";

// Layout
import Navbar from "./components/layout/Navbar";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import "./index.css";

// Pages
import LandingPage from "./pages/LandingPage";
import ProjectsPage from "./pages/ProjectsPage";
import FeedPage from "./pages/FeedPage";
import TrendingPage from "./pages/TrendingPage"; // ⭐ Correct import!
import InboxPage from "./pages/InboxPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const [user] = useState({
    name: "Developer Mode",
    email: "dev@udaan.com",
    role: "Innovator",
  });

  // ⭐ Default page is Explore (Trending)
  const [activePage, setActivePage] = useState("trending");

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <LandingPage setPage={setActivePage} />;
      case "trending":
        return <TrendingPage user={user} />;
      case "feed":
        return <FeedPage user={user} />;
      case "projects":
        return <ProjectsPage user={user} />;
      case "profile":
        return <ProfilePage user={user} />;
      case "dashboard":
        return <Dashboard user={user} />;
      case "inbox":
        return <InboxPage user={user} />;
      default:
        return <TrendingPage user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F3] text-[#2F2F2F] font-sans">

      {/* Fixed Navbar */}
      <Navbar
        activePage={activePage}
        setPage={setActivePage}
        user={user}
      />

      {/* Centered consistent layout */}
      <main className="w-full flex justify-center pt-24 pb-28">
        <div className="w-full max-w-6xl px-4 md:px-8">
          {renderPage()}
        </div>
      </main>

      {/* Mobile Navigation */}
      {activePage !== "home" && (
        <MobileBottomNav activePage={activePage} setPage={setActivePage} />
      )}

      {/* Footer */}
      <footer className="hidden md:block bg-white py-10 border-t border-[#D8D8D3] text-center text-gray-400 text-sm">
        <p className="font-serif text-lg text-[#2F2F2F] font-bold mb-4">
          Udaan
        </p>
        <p>&copy; 2025 Udaan Innovation Platform. All rights reserved.</p>
      </footer>

    </div>
  );
}
