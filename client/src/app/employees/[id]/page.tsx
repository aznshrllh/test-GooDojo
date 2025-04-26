"use client";

import { useState, useEffect } from "react";
import { getEmployeeById } from "@/actions/employee";
import { Employee } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Building,
  Calendar,
  ChevronRight,
  Edit,
  Mail,
  MapPin,
  Phone,
  Star,
  Trophy,
  User,
} from "lucide-react";

// shadcn/ui components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function EmployeeDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployee() {
      if (!id) return;

      try {
        setLoading(true);
        const result = await getEmployeeById(Number(id));

        if ("message" in result) {
          toast.error(result.message);
        } else {
          setEmployee(result);
        }
      } catch (error) {
        toast.error(
          "Failed to fetch employee details. Please try again later."
        );
        console.error("Error fetching employee:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500 hover:bg-green-600";
      case "inactive":
        return "bg-red-500 hover:bg-red-600";
      case "on leave":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatPerformanceScore = (score: number) => {
    // Convert score from 0-5 scale to 0-100 scale for consistent styling
    const scorePercent = (score / 100) * 100;

    if (scorePercent >= 90) {
      return {
        label: "Excellent",
        color: "bg-green-100 text-green-800 border border-green-200",
        icon: "✓✓", // Double check mark for excellent
      };
    }
    if (scorePercent >= 75) {
      return {
        label: "Good",
        color: "bg-blue-100 text-blue-800 border border-blue-200",
        icon: "✓", // Check mark for good
      };
    }
    if (scorePercent >= 60) {
      return {
        label: "Satisfactory",
        color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        icon: "○", // Circle for satisfactory
      };
    }
    return {
      label: "Needs Improvement",
      color: "bg-red-100 text-red-800 border border-red-200",
      icon: "!", // Exclamation for needs improvement
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/employees">Employees</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink>
                {loading ? <Skeleton className="h-4 w-24" /> : employee?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {!loading && employee && (
          <Link href={`/employees/edit/${employee.id}`}>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Employee
            </Button>
          </Link>
        )}
      </div>

      {loading ? (
        <LoadingState />
      ) : employee ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-1 shadow-sm">
              <CardHeader>
                <CardTitle>Employee Profile</CardTitle>
                <CardDescription>Personal information</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {getInitials(employee.name)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{employee.name}</h2>
                <p className="text-muted-foreground">
                  {employee.JobPosition?.title || "No Position"}
                </p>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(
                    employee.status
                  )} text-white mt-2`}
                >
                  {employee.status}
                </Badge>

                <Separator className="my-4" />

                <div className="space-y-2 w-full">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{employee.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{employee.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {employee.Department?.name || "No Department"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {employee.Department?.location || "No Location"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      Hired:{" "}
                      {format(new Date(employee.hire_date), "MMMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-2 shadow-sm">
              <Tabs defaultValue="overview">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Employee Details</CardTitle>
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>

                <CardContent>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Department
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <Building className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-medium">
                              {employee.Department?.name || "Not Assigned"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {employee.Department?.location || "No Location"}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Position
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <Briefcase className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-medium">
                              {employee.JobPosition?.title || "Not Assigned"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Employment
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Status</p>
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(
                                employee.status
                              )} text-white mt-1`}
                            >
                              {employee.status}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Hire Date</p>
                            <p className="text-sm">
                              {format(
                                new Date(employee.hire_date),
                                "MMMM d, yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="skills">
                    {employee.Skills && employee.Skills.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {employee.Skills.map((skill) => {
                          // Generate a color based on the skill name (for visual categorization)
                          const getSkillColor = (name: string) => {
                            const lowerName = name.toLowerCase();
                            if (
                              lowerName.includes("javascript") ||
                              lowerName.includes("react") ||
                              lowerName.includes("node") ||
                              lowerName.includes("python") ||
                              lowerName.includes("java") ||
                              lowerName.includes("programming") ||
                              lowerName.includes("coding") ||
                              lowerName.includes("development")
                            ) {
                              return "bg-green-100 text-green-800 border border-green-200";
                            } else if (
                              lowerName.includes("management") ||
                              lowerName.includes("leadership") ||
                              lowerName.includes("project") ||
                              lowerName.includes("planning")
                            ) {
                              return "bg-blue-100 text-blue-800 border border-blue-200";
                            } else if (
                              lowerName.includes("marketing") ||
                              lowerName.includes("sales") ||
                              lowerName.includes("communication") ||
                              lowerName.includes("presentation")
                            ) {
                              return "bg-yellow-100 text-yellow-800 border border-yellow-200";
                            } else {
                              return "bg-red-100 text-red-800 border border-red-200";
                            }
                          };

                          const skillColor = getSkillColor(skill.name);

                          return (
                            <Card
                              key={skill.id}
                              className="overflow-hidden border-l-4"
                              style={{
                                borderLeftColor: skillColor.includes("green")
                                  ? "#16a34a"
                                  : skillColor.includes("blue")
                                  ? "#2563eb"
                                  : skillColor.includes("yellow")
                                  ? "#ca8a04"
                                  : "#dc2626",
                              }}
                            >
                              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <div>
                                  <CardTitle className="text-base font-medium">
                                    {skill.name}
                                  </CardTitle>
                                </div>
                                <Badge className={skillColor}>
                                  {skillColor.includes("green")
                                    ? "Technical"
                                    : skillColor.includes("blue")
                                    ? "Management"
                                    : skillColor.includes("yellow")
                                    ? "Business"
                                    : "Other"}
                                </Badge>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  {skill.description}
                                </p>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-1">
                          No skills recorded
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          This employee doesn&apos;t have any registered skills
                          yet.
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="performance">
                    {employee.Performances &&
                    employee.Performances.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead>Rating</TableHead>
                              <TableHead className="w-[50%]">
                                Feedback
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {employee.Performances.sort(
                              (a, b) =>
                                new Date(b.evaluation_date).getTime() -
                                new Date(a.evaluation_date).getTime()
                            ).map((performance) => {
                              const rating = formatPerformanceScore(
                                performance.score
                              );
                              return (
                                <TableRow key={performance.id}>
                                  <TableCell>
                                    {format(
                                      new Date(performance.evaluation_date),
                                      "MMM d, yyyy"
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <div
                                        className="w-8 h-8 rounded-full mr-2 flex items-center justify-center font-medium"
                                        style={{
                                          backgroundColor:
                                            performance.score >= 90
                                              ? "#dcfce7" // green bg
                                              : performance.score >= 75
                                              ? "#dbeafe" // blue bg
                                              : performance.score >= 60
                                              ? "#fef9c3" // yellow bg
                                              : "#fee2e2", // red bg
                                          color:
                                            performance.score >= 90
                                              ? "#166534" // green text
                                              : performance.score >= 75
                                              ? "#1e40af" // blue text
                                              : performance.score >= 60
                                              ? "#854d0e" // yellow text
                                              : "#b91c1c", // red text
                                          border: `1px solid ${
                                            performance.score >= 90
                                              ? "#bbf7d0" // green border
                                              : performance.score >= 75
                                              ? "#bfdbfe" // blue border
                                              : performance.score >= 60
                                              ? "#fef08a" // yellow border
                                              : "#fecaca" // red border
                                          }`,
                                        }}
                                      >
                                        {performance.score.toFixed(1)}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={rating.color}>
                                      <span className="mr-1">
                                        {rating.icon}
                                      </span>
                                      {rating.label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="max-w-xs">
                                    <div className="relative">
                                      <p className="text-sm line-clamp-2">
                                        {performance.feedback}
                                      </p>
                                      {performance.feedback &&
                                        performance.feedback.length > 100 && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-primary mt-1 h-auto p-0"
                                            onClick={() => {
                                              toast.info(
                                                <div className="max-w-lg">
                                                  <h4 className="text-base font-medium mb-1">
                                                    Performance Feedback
                                                  </h4>
                                                  <p className="text-sm">
                                                    {performance.feedback}
                                                  </p>
                                                  <p className="text-xs text-muted-foreground mt-2">
                                                    {format(
                                                      new Date(
                                                        performance.evaluation_date
                                                      ),
                                                      "MMMM d, yyyy"
                                                    )}
                                                  </p>
                                                </div>,
                                                { duration: 8000 }
                                              );
                                            }}
                                          >
                                            Read full feedback
                                          </Button>
                                        )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                        <h3 className="text-lg font-medium mb-1">
                          No performance records
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          This employee doesn&apos;t have any performance
                          evaluations yet.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <User className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Employee Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The employee you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/employees">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="col-span-1 shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center">
          <Skeleton className="h-24 w-24 rounded-full mb-4" />
          <Skeleton className="h-8 w-48 mb-1" />
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-6 w-20" />
          <Separator className="my-4" />
          <div className="space-y-3 w-full">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-2 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-10 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
