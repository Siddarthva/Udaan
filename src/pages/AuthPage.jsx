import React, { useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import usersData from "../data/users";
import { CheckCircle } from "lucide-react";

export default function AuthPage({ setUser, setPage }) {
  const [role, setRole] = useState("innovator");

  const login = () => {
    setUser(usersData[role]);
    setPage("dashboard");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="p-8 text-center">
          <h2 className="font-serif text-2xl font-bold mb-6">Choose Your Role</h2>

          <div className="space-y-4 text-left mb-6">
            {["innovator", "mentor", "investor"].map(r => (
              <div
                key={r}
                className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between ${role === r ? "border-[#2F2F2F]" : "border-gray-300"}`}
                onClick={() => setRole(r)}
              >
                <span className="capitalize">{r}</span>
                {role === r && <CheckCircle size={18} />}
              </div>
            ))}
          </div>

          <Button onClick={login} className="w-full">Enter Platform</Button>
        </Card>
      </div>
    </div>
  );
}
