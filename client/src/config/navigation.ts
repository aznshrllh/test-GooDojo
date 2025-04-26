import {
  Users,
  Building,
  Award,
  Briefcase,
  LineChart,
  UsersRound,
  LayoutDashboard,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of the HR system",
  },
  {
    title: "Employees",
    path: "/employees",
    icon: Users,
    description: "Manage employee records",
  },
  {
    title: "Departments",
    path: "/departments",
    icon: Building,
    description: "Organize company structure",
  },
  {
    title: "Job Positions",
    path: "/job-positions",
    icon: Briefcase,
    description: "Define roles and responsibilities",
  },
  {
    title: "Performances",
    path: "/performances",
    icon: LineChart,
    description: "Track employee performance",
  },
  {
    title: "Skills",
    path: "/skills",
    icon: Award,
    description: "Manage employee competencies",
  },
  {
    title: "Talent Pools",
    path: "/talent-pools",
    icon: UsersRound,
    description: "Group talented employees",
  },
];

// Helper function to get a page title based on the current path
export function getPageTitle(pathname: string): string {
  // Exact path match
  const exactMatch = navigationItems.find((item) => item.path === pathname);
  if (exactMatch) return exactMatch.title;

  // Check if it's a subpath
  for (const item of navigationItems) {
    if (item.path !== "/" && pathname.startsWith(`${item.path}/`)) {
      return item.title;
    }
  }

  // Default
  return "GooDojo HR";
}
