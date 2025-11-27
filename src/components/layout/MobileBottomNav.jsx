import React from "react";
import { Home, Briefcase, MessageSquare, User } from "lucide-react";

const menu = [
  { id: "home", label: "Home", icon: Home },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "feed", label: "Feed", icon: MessageSquare },
  { id: "profile", label: "Profile", icon: User },
];

export default function MobileBottomNav({ activePage, setPage }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t z-50">
      <div className="flex justify-around h-16">
        {menu.map(i => (
          <button
            key={i.id}
            className={`flex flex-col pt-2 items-center ${
              activePage === i.id ? "text-[#2F2F2F]" : "text-gray-400"
            }`}
            onClick={() => setPage(i.id)}
          >
            <i.icon size={22} />
            <span className="text-xs">{i.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
