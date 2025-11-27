import React, { useState } from "react";
import { Menu, X, Bell, MessageSquare } from "lucide-react";
import Button from "../ui/Button";

export default function Navbar({ activePage, setPage, user, setUser }) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "feed", label: "Community" },
    { id: "trending", label: "Trending" },
    { id: "profile", label: "Profile" }
  ];

  return (
    <nav className="bg-[#F7F7F3] sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => setPage("home")}>
          <div className="h-10 w-10 bg-[#2F2F2F] text-white flex items-center justify-center rounded-lg mr-3 font-serif">U</div>
          <span className="font-serif text-2xl font-bold">Udaan</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          {navItems.map(i => (
            <button
              key={i.id}
              onClick={() => setPage(i.id)}
              className={activePage === i.id ? "font-bold" : "text-gray-500 hover:text-black"}
            >
              {i.label}
            </button>
          ))}
        </div>

        {/* Auth / Profile */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <Button onClick={() => setPage("auth")}>Login</Button>
          ) : (
            <div className="flex gap-4">
              <Bell className="cursor-pointer" onClick={() => setPage("profile")} />
              <MessageSquare className="cursor-pointer" onClick={() => setPage("inbox")} />
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>

      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="bg-white border-t p-4 flex flex-col gap-3">
          {navItems.map(i => (
            <button key={i.id} className="py-2" onClick={() => { setPage(i.id); setMenuOpen(false) }}>
              {i.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
