import React from "react";
import Card from "../components/ui/Card";

export default function TrendingPage() {
  return (
    <div className="space-y-10">

      {/* Hero */}
      <section className="bg-white rounded-3xl shadow p-8">
        <h1 className="text-3xl font-serif font-bold mb-4">Discover Innovation 🚀</h1>
        <p className="text-gray-600">
          Explore top projects, rising innovators & trending ideas on Udaan.
        </p>
      </section>

      {/* Trending Projects */}
      <section>
        <h2 className="text-xl font-semibold mb-3">🔥 Trending Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4">⚙️ AI Drone Delivery System</Card>
          <Card className="p-4">💊 HealthTech Smart Pill</Card>
          <Card className="p-4">🌱 Smart Agri IoT Bot</Card>
          <Card className="p-4">🚗 EV Battery Swap Network</Card>
        </div>
      </section>

      {/* Top Innovators */}
      <section>
        <h2 className="text-xl font-semibold mb-3">🏆 Top Innovators</h2>
        <div className="flex gap-4 overflow-x-auto">
          {["Aarav", "Meera", "Rohan", "Zara"].map((name) => (
            <Card key={name} className="p-4 min-w-[160px] text-center">
              ⭐ {name}
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Updates */}
      <section>
        <h2 className="text-xl font-semibold mb-3">📰 Latest Activity</h2>
        <Card className="p-4 text-gray-600">
          Coming soon… 🚧 Latest posts & startup updates here
        </Card>
      </section>

    </div>
  );
}
