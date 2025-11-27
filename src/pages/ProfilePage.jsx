import React, { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EditProfileModal from "../components/models/EditProfileModal";
import projectsData from "../data/projects";

export default function ProfilePage({ user }) {
  const [showEdit, setShowEdit] = useState(false);

  if (!user) return <div className="p-12 text-center">Please login</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      {showEdit && <EditProfileModal user={user} onClose={() => setShowEdit(false)} />}

      <Card className="mb-8">
        <div className="bg-[#CBD4CE] h-32"></div>

        <div className="px-8 pb-8">
          <div className="relative -mt-16 flex justify-between items-end">
            <div className="h-32 w-32 bg-gray-300 rounded-full flex items-center justify-center text-3xl font-serif">
              {user.avatar}
            </div>
            <Button variant="outline" onClick={() => setShowEdit(true)}>Edit Profile</Button>
          </div>

          <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
          <p className="text-gray-600">{user.handle}</p>
        </div>
      </Card>

      <h3 className="font-serif font-bold mb-4">Your Projects</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {projectsData.filter(p => p.founder === user.name).map(p => (
          <Card key={p.id} className="p-6">
            <h4 className="font-bold">{p.title}</h4>
            <p className="text-sm text-gray-600">{p.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
