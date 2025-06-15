
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CaseLawFinder = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/features")}
        >
          ← Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Case Law Finder</h1>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <p className="text-gray-700 text-lg">Coming soon! Find judgments by keyword/section.</p>
      </div>
    </div>
  );
};

export default CaseLawFinder;
