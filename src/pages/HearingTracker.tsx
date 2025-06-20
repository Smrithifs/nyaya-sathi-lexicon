
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import HearingTrackerComponent from "@/components/calendar/HearingTracker";

const HearingTracker = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/tools")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </div>

        <HearingTrackerComponent />
      </div>
    </div>
  );
};

export default HearingTracker;
