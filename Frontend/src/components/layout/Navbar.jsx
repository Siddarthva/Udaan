import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Button from "../ui/Button";

export default function Navbar({ activePage, setPage, user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPage("auth");
  };

  const navItems = [
    { id: "feed", label: "Feed" },
    { id: "projects", label: "Projects" },
    { id: "inbox", label: "Inbox" },
    { id: "profile", label: "Profile" },
    { id: "trending", label: "Trending" },
  ];

  const navigate = (page) => {
    //if (!user && page !== "auth") return setPage("auth");    ****************
    setPage(page);
    setMenuOpen(false);
  };
  

  return (
    <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center fixed w-full top-0 z-50">
      {/* Logo */}
      <h1
        className="text-2xl font-serif font-bold cursor-pointer"
        onClick={() => navigate("feed")}
      >
        Udaan
      </h1>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`px-5 py-2 rounded-xl ${
              activePage === item.id
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => navigate(item.id)}
          >
            {item.label}
          </button>
        ))}

        {user ? (
          <>
            <span className="text-gray-600 font-medium ml-2">
              {user.name.split(" ")[0]}
            </span>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Button onClick={() => navigate("auth")}>Login</Button>
        )}
      </nav>

      {/* Mobile Nav Toggle */}
      <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute right-4 top-16 bg-white shadow-lg p-4 rounded-xl flex flex-col gap-3 w-40 md:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`px-4 py-2 rounded-lg ${
                activePage === item.id
                  ? "bg-black text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => navigate(item.id)}
            >
              {item.label}
            </button>
          ))}

          {user ? (
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button onClick={() => navigate("auth")}>Login</Button>
          )}
        </div>
      )}
    </header>
  );
}
