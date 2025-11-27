import React from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function LandingPage({ setPage }) {
  return (
    <div className="animate-fade-in">
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <h1 className="font-serif text-5xl lg:text-7xl font-bold text-[#2F2F2F]">
                Fueling the next wave of <span className="italic text-gray-500">innovation.</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Connect with verified mentors, secure escrow-backed funding, and launch your startup.
              </p>

              <div className="flex gap-4">
                <Button onClick={() => setPage("projects")} className="h-14 px-8 text-lg rounded-2xl">
                  Explore Projects
                </Button>
                <Button variant="outline" onClick={() => setPage("auth")} className="h-14 px-8 text-lg rounded-2xl">
                  Start Innovation
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-[#CBD4CE] rounded-full filter blur-3xl opacity-30"></div>
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7"
                alt="Innovation"
                className="relative rounded-[2rem] shadow-2xl object-cover h-[500px] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-bold">A Structured Path to Success</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Launchpad", desc: "Idea validation & prototyping phase.", icon: "🚀" },
              { title: "Support Arena", desc: "Mentorship & market fit analysis.", icon: "🛡️" },
              { title: "Acceleration", desc: "Scaling & major funding rounds.", icon: "⚡" }
            ].map((item, idx) => (
              <Card key={idx} className="text-center p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-serif text-xl font-bold">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
