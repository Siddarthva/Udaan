import React, { useEffect, useState } from "react";
import { Lightbulb, Rocket, Wallet, Users, Target } from "lucide-react";

export default function Dashboard({ user }) {
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    if (!profile) {
      const fetchUser = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setProfile(data.user);
      };
      fetchUser();
    }
  }, [profile]);

  if (!profile) return <div className="p-12 text-center">Loading...</div>;

  const isInnovator = profile.role === "Innovator";
  const isInvestor = profile.role === "Investor";
  const isMentor = profile.role === "Mentor";

  return (
    <div className="p-6 max-w-5xl mx-auto pt-24">
      <h1 className="text-3xl font-bold mb-4">
        Hello {profile.name.split(" ")[0]}, welcome back! 👋
      </h1>

      <p className="text-gray-600 mb-8">
        You are logged in as: <strong>{profile.role}</strong>
      </p>

      {/* Innovator Dashboard UI */}
      {isInnovator && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow-xl rounded-2xl">
            <Lightbulb size={40} />
            <h3 className="font-semibold mt-4">Your Projects</h3>
            <p className="text-gray-500 text-sm">Manage and update progress</p>
            <button className="mt-4 w-full bg-black text-white rounded-xl py-2">
              Add New Project 🚀
            </button>
          </div>

          <div className="p-6 bg-white shadow-xl rounded-2xl">
            <Rocket size={40} />
            <h3 className="font-semibold mt-4">Funding Status</h3>
            <p className="text-gray-500 text-sm">Track your achievements</p>
          </div>

          <div className="p-6 bg-white shadow-xl rounded-2xl">
            <Target size={40} />
            <h3 className="font-semibold mt-4">Recommended Mentors</h3>
            <p className="text-gray-500 text-sm">Get expert guidance</p>
          </div>
        </div>
      )}

      {/* Investor Dashboard UI */}
      {isInvestor && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow-xl rounded-2xl">
            <Wallet size={40} />
            <h3 className="font-semibold mt-4">Investment Portfolio</h3>
            <p className="text-gray-500 text-sm">Track your returns</p>
          </div>

          <div className="p-6 bg-white shadow-xl rounded-2xl">
            <Rocket size={40} />
            <h3 className="font-semibold mt-4">Startups to Invest</h3>
            <p className="text-gray-500 text-sm">Based on your interests</p>
            <button className="mt-4 w-full bg-black text-white rounded-xl py-2">
              Browse Projects 💼
            </button>
          </div>

          <div className="p-6 bg-white shadow-xl rounded-2xl">
            <Users size={40} />
            <h3 className="font-semibold mt-4">Connect with Founders</h3>
            <p className="text-gray-500 text-sm">New partnership requests</p>
          </div>
        </div>
      )}

      {/* Mentor Dashboard UI */}
      {isMentor && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow-xl rounded-2xl">
            <Users size={40} />
            <h3 className="font-semibold mt-4">Mentee Requests</h3>
            <p className="text-gray-500 text-sm">
              Guide young innovators!
            </p>
          </div>

          <div className="p-6 bg-white shadow-xl rounded-2xl">
            <Target size={40} />
            <h3 className="font-semibold mt-4">Your Expertise</h3>
            <p className="text-gray-500 text-sm">{profile.domain}</p>
          </div>

          <div className="p-6 bg-white shadow-xl rounded-2xl">
            <Lightbulb size={40} />
            <h3 className="font-semibold mt-4">Upcoming Sessions</h3>
            <p className="text-gray-500 text-sm">Schedule & reminders</p>
          </div>
        </div>
      )}
    </div>
  );
}
