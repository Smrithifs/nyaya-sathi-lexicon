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
import { FileText, Bot, BookText } from "lucide-react";

const features: { title: string; href: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "Contract Generator",
    href: "/contract-generator",
    description: "Create legal agreements in seconds.",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: "NyayaBot Q&A",
    href: "/qabot",
    description: "AI legal answers based on Indian law.",
    icon: <Bot className="w-5 h-5" />,
  },
  {
    title: "Summarizer",
    href: "/summarizer",
    description: "Turn long documents into clear summaries.",
    icon: <BookText className="w-5 h-5" />,
  },
  {
    title: "All LegalOps Features",
    href: "/features",
    description: "Role-detection, tools, and document upload.",
    icon: <Bot className="w-5 h-5" />,
  },
];

const TopNav: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="fixed top-0 left-0 w-full z-30 flex items-center justify-between px-6 md:px-10 h-16 bg-black/25 backdrop-blur border-b border-white/10">
      <Link to="/" className="text-xl font-extrabold text-white font-serif tracking-wide">
        LegalOps
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white/80 hover:text-white hover:bg-white/10", {
                  "underline text-white font-bold": location.pathname === "/",
                })}
              >
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/about">
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white/80 hover:text-white hover:bg-white/10", {
                  "underline text-white font-bold": location.pathname === "/about",
                })}
              >
                About
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white/80 hover:text-white hover:bg-white/10 data-[state=open]:bg-white/10">Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px] bg-black/80 backdrop-blur border border-white/10 text-white rounded-lg">
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
              </ul>
            </NavigationMenuContent>
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
    <li>
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
          <p className="line-clamp-2 text-sm leading-snug text-white/70 pl-7">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default TopNav;
