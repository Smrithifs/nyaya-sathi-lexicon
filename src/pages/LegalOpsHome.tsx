
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Scale, 
  FileText, 
  Search, 
  BookOpen, 
  Navigation,
  PenTool,
  Mic,
  Languages,
  CheckCircle,
  ClipboardList,
  Calendar,
  HelpCircle,
  Flashlight,
  ArrowLeft,
  ClipboardCheck
} from "lucide-react";
import RoleFeatureChat from "./RoleFeatureChat";

const lawyerFeatures = [
  {
    title: "Contract Generator",
    description: "Generate professional legal contracts with AI assistance",
    icon: FileText,
    route: "/contract-generator",
    useChat: false
  },
  {
    title: "Legal Q&A (NyayaBot)",
    description: "Get instant answers to Indian legal questions",
    icon: HelpCircle,
    route: "/legal-qna",
    useChat: true
  },
  {
    title: "Case Law Finder",
    description: "Search and find relevant case law and precedents",
    icon: Search,
    route: "/case-law-finder",
    useChat: false
  },
  {
    title: "Section Explainer",
    description: "Get detailed explanations of legal sections",
    icon: BookOpen,
    route: "/section-explainer",
    useChat: true
  },
  {
    title: "Bare Act Navigator",
    description: "Navigate through legal acts efficiently",
    icon: Navigation,
    route: "/bare-act-navigator",
    useChat: true
  },
  {
    title: "Legal Draft Templates",
    description: "Generate professional legal document templates",
    icon: PenTool,
    route: "/legal-draft-templates",
    useChat: false
  },
  {
    title: "Voice Dictation → Legal Format",
    description: "Convert voice recordings to legal documents",
    icon: Mic,
    route: "/voice-dictation",
    useChat: false
  },
  {
    title: "Multi-Language Support",
    description: "Translate legal documents and responses",
    icon: Languages,
    route: "/multi-language-support",
    useChat: true
  },
  {
    title: "Citation Checker",
    description: "Verify and check legal citations",
    icon: CheckCircle,
    route: "/citation-checker",
    useChat: true
  },
  {
    title: "Client Brief Summary Tool",
    description: "Summarize client briefs and documents",
    icon: ClipboardList,
    route: "/summarizer",
    useChat: true
  },
  {
    title: "Hearing/Deadline Tracker",
    description: "Track court dates and deadlines",
    icon: Calendar,
    route: "/hearing-tracker",
    useChat: false
  }
];

const studentFeatures = [
  {
    title: "Legal Q&A (NyayaBot)",
    description: "Student-friendly legal question answering",
    icon: HelpCircle,
    route: "/legal-qna",
    useChat: true
  },
  {
    title: "Flashcards (Legal Terms)",
    description: "Create flashcards for legal terminology",
    icon: Flashlight,
    route: null,
    useChat: true
  },
  {
    title: "Syllabus Tracker",
    description: "Track your law school syllabus and study progress",
    icon: ClipboardCheck,
    route: null,
    useChat: true
  }
];

const LegalOpsHome = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"lawyer" | "student" | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const handleFeatureClick = (feature: any) => {
    if (feature.useChat) {
      setSelectedFeature(feature.title);
    } else if (feature.route) {
      navigate(feature.route);
    }
  };

  const handleBack = () => {
    if (selectedFeature) {
      setSelectedFeature(null);
    } else if (selectedRole) {
      setSelectedRole(null);
    } else {
      navigate("/");
    }
  };

  // Show role selection screen
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
          
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Scale className="w-12 h-12 text-blue-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">LegalOps AI</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Your AI-powered legal assistant for Indian law
            </p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">
              Please select your role to get started
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
              onClick={() => setSelectedRole("lawyer")}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scale className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Practicing Lawyer
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Access professional legal tools for practice, client work, and case management
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Contract generation</li>
                  <li>• Case law research</li>
                  <li>• Legal drafting tools</li>
                  <li>• Client brief summaries</li>
                </ul>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300"
              onClick={() => setSelectedRole("student")}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Law Student
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Study tools and resources designed for law school success
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Quiz generation</li>
                  <li>• Case brief summaries</li>
                  <li>• Study plan creation</li>
                  <li>• Legal flashcards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show feature chat if a feature is selected
  if (selectedFeature && selectedRole) {
    return (
      <RoleFeatureChat 
        featureName={selectedFeature}
        role={selectedRole}
        onBack={handleBack}
      />
    );
  }

  // Show features dashboard based on selected role
  const features = selectedRole === "lawyer" ? lawyerFeatures : studentFeatures;
  const roleTitle = selectedRole === "lawyer" ? "Practicing Lawyer" : "Law Student";
  const roleColor = selectedRole === "lawyer" ? "blue" : "green";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack}>
              ← Back
            </Button>
            <div className="flex items-center gap-3">
              <Scale className={`w-8 h-8 text-${roleColor}-600`} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">LegalOps AI</h1>
                <p className={`text-${roleColor}-600 font-medium`}>{roleTitle} Dashboard</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border border-gray-200"
                onClick={() => handleFeatureClick(feature)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 bg-${roleColor}-100 rounded-lg flex items-center justify-center mb-3`}>
                    <IconComponent className={`w-6 h-6 text-${roleColor}-600`} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LegalOpsHome;
