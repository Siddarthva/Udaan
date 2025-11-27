import React, { useState } from "react";
import Button from "../ui/Button";
import { X } from "lucide-react";

export default function EditProfileModal({ user, onClose }) {
  const [bio, setBio] = useState(user.bio);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

      <div className="bg-white p-6 rounded-2xl max-w-md w-full relative">
        <button className="absolute right-4 top-4" onClick={onClose}><X /></button>

        <h3 className="font-bold text-lg mb-4">Edit Profile</h3>

        <textarea
          className="w-full border p-3 rounded-lg mb-4"
          rows="4"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <Button className="w-full" onClick={onClose}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
