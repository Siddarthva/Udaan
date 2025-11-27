import React, { useState, useMemo } from "react";
import Card from "../components/ui/Card";
import ProjectDetailsModal from "../components/models/ProjectDetailsModal";
import projectsData from "../data/projects";

export default function TrendingPage({ user }) {
  const [selectedProject, setSelectedProject] = useState(null);

  // Sort projects by trending score (highest 1st)
  const trendingProjects = useMemo(() => {
    return [...projectsData]
      .sort((a, b) => b.trending_score - a.trending_score)
      .slice(0, 6); // Show top 6
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-24">
      {/* Details modal */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          user={user}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <h2 className="font-serif text-4xl font-bold">Trending Projects</h2>
        <p className="text-gray-500 max-w-xl">
          Based on traction, investor interest, platform buzz, and funding progress.
        </p>
      </div>

      {/* Trending Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trendingProjects.map((project, idx) => (
          <Card key={project.id}>
            {/* Highlight #1 */}
            {idx === 0 && (
              <div className="mb-2 inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                🔥 Hot & Rising
              </div>
            )}

            <h3 className="font-serif text-lg font-bold mb-1">
              {project.title}
            </h3>
            <p className="text-xs text-gray-500 uppercase mb-2">
              {project.domain}
            </p>

            <p className="text-gray-600 text-sm mb-4">
              {project.description}
            </p>

            {/* Trending score */}
            <p className="text-xs text-gray-500 mb-4">
              Trending Score: <span className="font-semibold">{project.trending_score}</span>
            </p>

            <button
              onClick={() => setSelectedProject(project)}
              className="px-4 py-2 rounded-xl bg-black text-white text-sm"
            >
              View details
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
