import React from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { TrendingUp, Bell } from "lucide-react";

export default function Dashboard({ user }) {
  if (!user) return <div className="p-12 text-center">Login to access dashboard.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-24">
      <div className="flex justify-between mb-10">
        <h2 className="font-serif text-3xl font-bold">Hello, {user.name}</h2>
        <Button variant="outline" icon={Bell}>Notifications</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="bg-[#2F2F2F] text-white">
          <p className="opacity-80 text-sm">Profile Views</p>
          <p className="text-3xl font-bold">1,245</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600">Funding Progress</p>
          <p className="text-3xl font-bold">70%</p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full">
            <div className="bg-green-600 h-1.5 w-[70%]"></div>
          </div>
        </Card>

        <Card>
          <p className="text-sm text-gray-600">Pending Tasks</p>
          <p className="text-3xl font-bold">3</p>
        </Card>
      </div>
    </div>
  );
}
