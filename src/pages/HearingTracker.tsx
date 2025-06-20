
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import HearingTracker from "@/components/calendar/HearingTracker";

const HearingTrackerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate("/tools")}>
          ← Back to Tools
        </Button>
        <h1 className="text-2xl font-bold">Hearing/Deadline Tracker</h1>
      </div>

      <div className="max-w-6xl mx-auto w-full">
        <HearingTracker />
      </div>
    </div>
  );
};

export default HearingTrackerPage;
