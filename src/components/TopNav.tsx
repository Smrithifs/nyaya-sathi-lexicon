
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
  Flashlight,
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
  return (
    <nav className="fixed top-0 left-0 w-full z-30 flex items-center justify-between px-6 md:px-10 h-16 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <Link to="/" className="flex items-center gap-2">
        <Scale className="w-6 h-6 text-blue-400" />
        <span className="text-xl font-bold text-white">LegalOps</span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white/80 hover:text-white hover:bg-white/10", {
                  "text-blue-400 font-medium": location.pathname === "/",
                })}
              >
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white/80 hover:text-white hover:bg-white/10 data-[state=open]:bg-white/10">
              Tools
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[600px] p-4 bg-slate-900/95 backdrop-blur border border-white/10 text-white rounded-lg">
                <div className="mb-3 text-center">
                  <h3 className="text-lg font-semibold text-white mb-1">Legal Tools & Features</h3>
                  <p className="text-sm text-white/70">Access all tools in one place — drafting, tracking, studying, research & more</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
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
                className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white/80 hover:text-white hover:bg-white/10", {
                  "text-blue-400 font-medium": location.pathname === "/about",
                })}
              >
                About
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
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
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 focus:bg-white/10",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          {icon}
          <div className="text-sm font-medium leading-none text-white">{title}</div>
        </div>
        <p className="line-clamp-2 text-xs leading-snug text-white/70 pl-7">
          {children}
        </p>
      </Link>
    </NavigationMenuLink>
  );
});
ListItem.displayName = "ListItem";

export default TopNav;
