
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Bot, 
  BookText, 
  Search, 
  Calendar, 
  Mic, 
  BookOpen, 
  Scale,
  Navigation,
  PenTool,
  CheckCircle,
  ClipboardList,
  ClipboardCheck,
  Languages,
  HelpCircle
} from "lucide-react";

const features: { title: string; href: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "Contract Generator",
    href: "/contract-generator",
    description: "Draft legal agreements in seconds",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: "Legal Draft Templates",
    href: "/legal-draft-templates",
    description: "Generate petitions, bail apps, and more",
    icon: <PenTool className="w-5 h-5" />,
  },
  {
    title: "Case Law Finder",
    href: "/case-law-finder",
    description: "Search & explain Indian Supreme Court cases",
    icon: <Search className="w-5 h-5" />,
  },
  {
    title: "Deadline Tracker",
    href: "/hearing-tracker",
    description: "Track hearings with calendar view",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    title: "Voice Dictation → Legal Format",
    href: "/voice-dictation",
    description: "Convert voice notes to court-ready drafts",
    icon: <Mic className="w-5 h-5" />,
  },
  {
    title: "NyayaBot Q&A",
    href: "/legal-qna",
    description: "Ask legal questions based on Indian law",
    icon: <HelpCircle className="w-5 h-5" />,
  },
  {
    title: "Client Brief Summarizer",
    href: "/summarizer",
    description: "Summarize lengthy client documents",
    icon: <BookText className="w-5 h-5" />,
  },
  {
    title: "Citation Checker",
    href: "/citation-checker",
    description: "Validate case citations and links",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  {
    title: "Bare Act Navigator",
    href: "/bare-act-navigator",
    description: "Browse sections and chapters of Indian laws",
    icon: <Navigation className="w-5 h-5" />,
  },
  {
    title: "Section Explainer",
    href: "/section-explainer",
    description: "Understand individual legal provisions",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    title: "Multi-Language Support",
    href: "/multi-language-support",
    description: "Translate legal documents",
    icon: <Languages className="w-5 h-5" />,
  },
  {
    title: "All Tools & Features",
    href: "/tools",
    description: "Discover everything in one place",
    icon: <Scale className="w-5 h-5" />,
  },
];

const TopNav: React.FC = () => {
  const location = useLocation();
  
  const scrollToTools = () => {
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="ivo-nav">
      <div className="ivo-container">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--ivo-secondary), #0099cc)' }}>
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold" style={{ color: 'var(--ivo-primary)' }}>LegalOps</span>
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "ivo-nav-link bg-transparent text-base font-medium", {
                      "font-semibold": location.pathname === "/",
                    })}
                    style={{ color: location.pathname === "/" ? 'var(--ivo-secondary)' : 'var(--ivo-gray-700)' }}
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className="bg-transparent ivo-nav-link text-base font-medium"
                  style={{ color: 'var(--ivo-gray-700)' }}
                >
                  Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[650px] p-8 border border-gray-100 rounded-3xl shadow-2xl" style={{ 
                    background: 'var(--ivo-white)',
                    borderColor: 'var(--ivo-gray-200)',
                    boxShadow: 'var(--ivo-shadow-lg)'
                  }}>
                    <div className="mb-8 text-center">
                      <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--ivo-primary)' }}>Legal Tools & Features</h3>
                      <p className="ivo-text-small">Access all tools in one place — drafting, tracking, studying, research & more</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {features.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          to={component.href}
                          icon={component.icon}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about">
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "ivo-nav-link bg-transparent text-base font-medium")}
                    style={{ color: location.pathname === "/about" ? 'var(--ivo-secondary)' : 'var(--ivo-gray-700)' }}
                  >
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), "ivo-nav-link bg-transparent text-base font-medium cursor-pointer")}
                  onClick={scrollToTools}
                  style={{ color: 'var(--ivo-gray-700)' }}
                >
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string, icon: React.ReactNode }
>(({ className, title, children, icon, to, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <Link
        ref={ref}
        to={to}
        className={cn(
          "block select-none space-y-2 rounded-2xl p-4 leading-none no-underline outline-none ivo-transition hover:shadow-md",
          className
        )}
        style={{
          border: '1px solid var(--ivo-gray-200)',
          background: 'var(--ivo-white)'
        }}
        {...props}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--ivo-secondary), #0099cc)' }}>
            {icon}
          </div>
          <div className="text-base font-semibold leading-none" style={{ color: 'var(--ivo-primary)' }}>{title}</div>
        </div>
        <p className="line-clamp-2 ivo-text-small pl-13">
          {children}
        </p>
      </Link>
    </NavigationMenuLink>
  );
});
ListItem.displayName = "ListItem";

export default TopNav;
