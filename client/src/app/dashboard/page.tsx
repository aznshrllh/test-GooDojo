import Link from "next/link";
import { Suspense } from "react";
import {
  Users,
  Building,
  Award,
  Briefcase,
  LineChart,
  UsersRound,
  TrendingUp,
  UserCheck,
  Calendar,
  BadgeCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

import { getAllEmployees } from "@/actions/employee";
import { getAllDepartments } from "@/actions/department";
import { getAllJobPositions } from "@/actions/jobPosition";
import { getAllPerformances } from "@/actions/performance";
import { getAllSkills } from "@/actions/skill";
import { getAllTalentPools } from "@/actions/talentPool";

function MetricSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-20 mb-2" />
        <Skeleton className="h-2 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-1/2" />
      </CardFooter>
    </Card>
  );
}

async function DashboardMetrics() {
  const [
    employees,
    departments,
    jobPositions,
    performances,
    skills,
    talentPools,
  ] = await Promise.all([
    getAllEmployees(),
    getAllDepartments(),
    getAllJobPositions(),
    getAllPerformances(),
    getAllSkills(),
    getAllTalentPools(),
  ]);

  const employeesCount = "message" in employees ? 0 : employees.length;
  const departmentsCount = "message" in departments ? 0 : departments.length;
  const positionsCount = "message" in jobPositions ? 0 : jobPositions.length;
  const performancesCount = "message" in performances ? 0 : performances.length;
  const skillsCount = "message" in skills ? 0 : skills.length;
  const talentPoolsCount = "message" in talentPools ? 0 : talentPools.length;

  // Calculate metrics
  const metrics = [
    {
      title: "Total Employees",
      icon: Users,
      value: employeesCount,
      change: "+2.5%",
      trend: "up",
      path: "/employees",
      color: "bg-blue-500",
    },
    {
      title: "Departments",
      icon: Building,
      value: departmentsCount,
      change: "0%",
      trend: "neutral",
      path: "/departments",
      color: "bg-indigo-500",
    },
    {
      title: "Job Positions",
      icon: Briefcase,
      value: positionsCount,
      change: "+1",
      trend: "up",
      path: "/job-positions",
      color: "bg-purple-500",
    },
    {
      title: "Performance Reviews",
      icon: LineChart,
      value: performancesCount,
      change: "+12.3%",
      trend: "up",
      path: "/performances",
      color: "bg-emerald-500",
    },
    {
      title: "Skills Tracked",
      icon: Award,
      value: skillsCount,
      change: "+3",
      trend: "up",
      path: "/skills",
      color: "bg-amber-500",
    },
    {
      title: "Talent Pools",
      icon: UsersRound,
      value: talentPoolsCount,
      change: "New",
      trend: "up",
      path: "/talent-pools",
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <Card
          key={metric.title}
          className="overflow-hidden transition-all hover:shadow-md"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${metric.color}/10`}>
                <metric.icon
                  className={`h-4 w-4 text-${metric.color.split("-")[1]}-500`}
                />
              </div>
            </div>
            <CardDescription>
              {metric.trend === "up"
                ? "Growing"
                : metric.trend === "down"
                ? "Decreasing"
                : "Stable"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <Progress value={75} className="h-1 mt-2 bg-muted" />
          </CardContent>
          <CardFooter>
            <Link href={metric.path} className="w-full">
              <Button
                variant="ghost"
                className="w-full justify-start p-0 h-auto text-xs text-muted-foreground hover:text-foreground"
              >
                View Details
                <span
                  className={`ml-auto ${
                    metric.trend === "up"
                      ? "text-emerald-500"
                      : metric.trend === "down"
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {metric.change}
                </span>
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

interface DetailCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  linkText: string;
  href: string;
  className?: string;
}

function DetailCard({
  icon: Icon,
  title,
  description,
  linkText,
  href,
  className = "",
}: DetailCardProps) {
  return (
    <Card className={`transition-all hover:shadow-md ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button variant="outline" className="w-full">
            {linkText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to GooDojo HR
        </h1>
        <p className="text-muted-foreground mt-2">
          Your centralized dashboard for HR management and analytics
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <MetricSkeleton key={i} />
            ))}
          </div>
        }
      >
        <DashboardMetrics />
      </Suspense>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DetailCard
            icon={UserCheck}
            title="Employee Management"
            description="Manage employee profiles, contact information, and employment history."
            linkText="Manage Employees"
            href="/employees"
          />

          <DetailCard
            icon={TrendingUp}
            title="Performance Reviews"
            description="Track employee performance, evaluations, and improvement metrics."
            linkText="View Performance"
            href="/performances"
          />

          <DetailCard
            icon={BadgeCheck}
            title="Skill Management"
            description="Record and track employee skills, certifications, and competencies."
            linkText="Manage Skills"
            href="/skills"
          />

          <DetailCard
            icon={Building}
            title="Department Structure"
            description="Organize your company's departments, teams, and reporting structures."
            linkText="View Departments"
            href="/departments"
          />

          <DetailCard
            icon={Briefcase}
            title="Job Positions"
            description="Define job roles, responsibilities, and career advancement paths."
            linkText="Manage Positions"
            href="/job-positions"
          />

          <DetailCard
            icon={UsersRound}
            title="Talent Pools"
            description="Group high-potential employees for development and succession planning."
            linkText="View Talent Pools"
            href="/talent-pools"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Employee performance distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className="h-full w-full flex items-end justify-around gap-2">
              <div className="relative h-[70%] w-10 bg-emerald-500 rounded-t-md">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                  70%
                </span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-white">
                  Exc
                </span>
              </div>
              <div className="relative h-[85%] w-10 bg-blue-500 rounded-t-md">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                  85%
                </span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-white">
                  Good
                </span>
              </div>
              <div className="relative h-[40%] w-10 bg-amber-500 rounded-t-md">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                  40%
                </span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-white">
                  Avg
                </span>
              </div>
              <div className="relative h-[20%] w-10 bg-red-500 rounded-t-md">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                  20%
                </span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-white">
                  Poor
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/performances" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                View All Performance Reviews
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reviews</CardTitle>
            <CardDescription>Schedule for the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  employee: "Sarah Johnson",
                  date: "May 5, 2025",
                  department: "Marketing",
                },
                {
                  employee: "Michael Chen",
                  date: "May 12, 2025",
                  department: "Engineering",
                },
                {
                  employee: "Priya Patel",
                  date: "May 18, 2025",
                  department: "Design",
                },
              ].map((review) => (
                <div
                  key={review.employee}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{review.employee}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.department}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary py-1 px-2 rounded-full">
                    {review.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/performances" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Manage Review Schedule
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
