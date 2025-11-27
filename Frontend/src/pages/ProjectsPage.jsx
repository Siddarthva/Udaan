import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import ProjectDetailsModal from "../components/models/ProjectDetailsModal";
import projectsData from "../data/projects";

export default function ProjectsPage({ user }) {
  const [selectedProject, setSelectedProject] = useState(null);

  // 🔍 Global search term (project title)
  const [searchTerm, setSearchTerm] = useState("");

  // 🏷 Domain filter
  const [domainFilter, setDomainFilter] = useState("All");

  // ⏳ Loader state (fake API call)
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API delay
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800); // 0.8 sec delay
    return () => clearTimeout(t);
  }, []);

  // Filter projects by domain + title (case-insensitive)
  const filteredProjects = projectsData.filter(
    (project) =>
      (domainFilter === "All" || project.domain === domainFilter) &&
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-4xl font-bold">Discover Innovations</h2>
          <p className="text-gray-500 max-w-lg">
            Invest in the future. Browse verified projects.
          </p>
        </div>

        {/* 🔎 Global search by project title */}
        <div className="max-w-md w-full">
          <input
            type="text"
            placeholder="Search projects by title…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2F2F2F]"
          />
        </div>
      </div>

      {/* 🏷 Domain filters */}
      <div className="mb-8">
        <div className="inline-flex flex-wrap gap-2 bg-white px-3 py-2 rounded-xl border">
          {["All", "AgriTech", "HealthTech", "CleanTech"].map((cat) => (
            <button
              key={cat}
              onClick={() => setDomainFilter(cat)}
              className={`px-3 py-1 rounded-lg text-sm ${
                domainFilter === cat
                  ? "bg-[#2F2F2F] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ⏳ Loader OR Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="h-8 w-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
          <span className="ml-3 text-sm text-gray-500">
            Fetching latest projects…
          </span>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id}>
              <h3 className="font-serif text-lg font-bold mb-1">
                {project.title}
              </h3>
              <p className="text-xs text-gray-500 uppercase mb-2">
                {project.domain}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                {project.description}
              </p>

              <button
                onClick={() => setSelectedProject(project)}
                className="px-4 py-2 rounded-xl bg-black text-white text-sm"
              >
                View details
              </button>
            </Card>
          ))}

          {filteredProjects.length === 0 && (
            <p className="text-sm text-gray-500 col-span-full">
              No projects found for “{searchTerm}”.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
