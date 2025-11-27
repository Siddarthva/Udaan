import React, { useState, useMemo } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import ProjectDetailsModal from "../components/models/ProjectDetailsModal";
import { Flame } from "lucide-react";
import projectsData from "../data/projects";

export default function ProjectsPage({ user }) {
  const [domainFilter, setDomainFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = useMemo(() => {
    return projectsData
      .filter(p =>
        (domainFilter === "All" || p.domain === domainFilter) &&
        (stageFilter === "All" || p.stage === stageFilter)
      )
      .sort((a, b) => b.trending_score - a.trending_score);
  }, [domainFilter, stageFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in pb-24">
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          user={user}
        />
      )}

      <div className="flex justify-between flex-col md:flex-row gap-6 mb-10">
        <div>
          <h2 className="font-serif text-4xl font-bold">Discover Innovations</h2>
          <p className="text-gray-500 max-w-lg">
            Invest in the future. Browse verified projects.
          </p>
        </div>

        <div className="space-y-3 text-right">
          <div className="bg-white px-3 py-2 rounded-xl border flex gap-2">
            {["All", "AgriTech", "HealthTech", "CleanTech"].map(cat => (
              <button
                key={cat}
                onClick={() => setDomainFilter(cat)}
                className={`px-3 py-1 rounded-lg text-sm ${domainFilter === cat
                  ? "bg-[#2F2F2F] text-white"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, idx) => (
          <Card key={project.id} className="p-0 overflow-hidden group cursor-pointer">
            {idx === 0 && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                <Flame size={12} /> Hot
              </div>
            )}
            <img src={project.image} className="h-48 w-full object-cover" />

            <div className="p-6">
              <h3 className="font-serif text-lg font-bold">{project.title}</h3>
              <p className="text-xs text-gray-500 uppercase">{project.domain}</p>
              <p className="text-gray-600 text-sm mt-2">{project.description}</p>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" className="flex-1 text-sm" onClick={() => setSelectedProject(project)}>
                  Details
                </Button>
                <Button className="flex-1 text-sm">Invest</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
