import React, { useState } from "react";
import { X, Lock, CheckCircle } from "lucide-react";
import Button from "../ui/Button";
import FundingModal from "./FundingModal";
import projectsData from "../../data/projects"; // renamed for clarity

export default function ProjectDetailsModal({ project, onClose, user }) {
  const [showFundModal, setShowFundModal] = useState(false);
  if (!project) return null;

  // Safe % calculation
  const cleanNumber = (val) => parseInt(val?.replace(/[^0-9]/g, "")) || 0;
  const goal = cleanNumber(project.funding_goal);
  const raised = cleanNumber(project.raised);
  const percent = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;

  const similarProjects = projectsData.filter(
    (p) => p.domain === project.domain && p.id !== project.id
  );

  return (
    <>
      {showFundModal && (
        <FundingModal
          project={project}
          onClose={() => setShowFundModal(false)}
        />
      )}

      <div className="fixed inset-0 z-[100] p-4 flex justify-center items-center">
        {/* Click outside to close */}
        <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

        {/* Main Modal */}
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden relative flex flex-col md:flex-row">

          {/* Left section */}
          <div className="flex-1 overflow-y-auto p-6">
            <img
              src={project.image}
              alt={`${project.title} image`}
              className="rounded-xl w-full aspect-video object-cover mb-6"
            />

            <div className="flex gap-2 mb-3">
              {project.escrow_locked && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs">
                  <Lock size={12} /> Escrow Secured
                </span>
              )}
              {project.mentor_verified && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                  <CheckCircle size={12} /> Mentor Verified
                </span>
              )}
            </div>

            <h2 className="text-3xl font-serif font-bold mb-3">
              {project.title}
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              {project.long_description || project.description}
            </p>

            <Button
              className="w-full"
              onClick={() => setShowFundModal(true)}
            >
              Invest in project
            </Button>

            {/* Similar projects */}
            {similarProjects.length > 0 && (
              <div className="mt-10">
                <h3 className="font-semibold text-lg mb-3">Similar Projects</h3>
                <div className="space-y-3">
                  {similarProjects.slice(0, 2).map((p) => (
                    <div
                      key={p.id}
                      className="flex gap-3 items-center cursor-pointer hover:opacity-80"
                      onClick={() => {
                        onClose();
                      }}
                    >
                      <img
                        src={p.image}
                        className="h-12 w-12 rounded-lg object-cover"
                        alt=""
                      />
                      <div>
                        <p className="font-medium text-sm">{p.title}</p>
                        <p className="text-xs text-gray-500">{p.domain}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="w-80 bg-gray-50 p-6 hidden md:flex flex-col">
            <button className="ml-auto mb-4 text-gray-500 hover:text-black" onClick={onClose}>
              <X />
            </button>

            <p className="text-sm text-gray-600">Raised</p>
            <h3 className="text-2xl font-bold">{project.raised}</h3>
            <p className="text-xs text-gray-400 mb-3">
              Goal: {project.funding_goal}
            </p>

            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${percent}%` }}
              ></div>
            </div>

            <p className="text-xs text-gray-500 mt-2">{percent}% funded</p>
          </div>

        </div>
      </div>
    </>
  );
}
