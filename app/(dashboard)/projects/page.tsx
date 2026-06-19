"use client";
import { useState, useEffect } from "react";
import { Search, Eye, Code2, Download, Plus } from "lucide-react";

const categories = ["All", "AI Projects", "Full Stack Projects", "Data Analysis", "Automation"];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  
  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Guided Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Build real-world applications to add to your portfolio.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-brand text-brand-foreground rounded-lg font-medium hover:bg-brand-text transition-colors">
          <Plus className="w-4 h-4" />
          Suggest Project
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === c
                  ? "bg-foreground text-background"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        <div className="col-span-full py-12 flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-card">
          <Code2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No projects started</h3>
          <p className="text-sm text-muted-foreground mt-1 text-center max-w-md">
            Start your first guided project to build your portfolio and demonstrate your skills to potential employers.
          </p>
        </div>
      </div>
    </div>
  );
}
