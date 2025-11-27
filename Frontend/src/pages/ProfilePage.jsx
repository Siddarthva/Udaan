import React, { useEffect, useState } from "react";

export default function ProfilePage({ user }) {
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const res = await fetch("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await res.json();
          if (data.success) {
            setProfile(data.user);
          }
        } catch (err) {
          console.log("Profile fetch error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [user]);

  if (loading) return <div className="p-12 text-center">Loading profile...</div>;

  if (!profile)
    return (
      <div className="p-12 text-center">
        Unable to load profile. Please login again.
      </div>
    );

  const isInnovator = profile.role === "Innovator";
  const isInvestor = profile.role === "Investor";
  const isMentor = profile.role === "Mentor";

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg mt-10 border border-gray-200">
      <h1 className="text-3xl font-bold mb-2 text-black">{profile.name}</h1>

      <p className="text-gray-600 mb-1">{profile.email}</p>

      <span className="inline-block px-4 py-1 mt-2 mb-4 bg-blue-600 text-white rounded-full text-sm font-medium capitalize">
        {profile.role}
      </span>

      {/* Bio */}
      {profile.bio && (
        <p className="text-gray-900 font-medium mb-6 leading-relaxed">
          {profile.bio}
        </p>
      )}

      <div className="space-y-4 text-gray-700">
        {/* Innovator UI */}
        {isInnovator && (
          <>
            {profile.domain && (
              <p>
                <span className="font-semibold">Domain:</span>{" "}
                {profile.domain}
              </p>
            )}
            {profile.skills?.length > 0 && (
              <p>
                <span className="font-semibold">Skills:</span>{" "}
                {profile.skills.join(", ")}
              </p>
            )}
          </>
        )}

        {/* Investor UI */}
        {isInvestor && (
          <>
            {profile.domain && (
              <p>
                <span className="font-semibold">Invests In:</span>{" "}
                {profile.domain}
              </p>
            )}

            {profile.budgetRange && (
              <p>
                <span className="font-semibold">Investment Range:</span>{" "}
                {profile.budgetRange}
              </p>
            )}
          </>
        )}

        {/* Mentor UI */}
        {isMentor && (
          <>
            {profile.domain && (
              <p>
                <span className="font-semibold">Expertise:</span>{" "}
                {profile.domain}
              </p>
            )}

            {profile.experience && (
              <p>
                <span className="font-semibold">Experience:</span>{" "}
                {profile.experience} years
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
