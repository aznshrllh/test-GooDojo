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
    if (score >= 4.5) return { label: "Excellent", color: "bg-emerald-500" };
    if (score >= 3.5) return { label: "Good", color: "bg-green-500" };
    if (score >= 2.5) return { label: "Satisfactory", color: "bg-yellow-500" };
    if (score >= 1.5)
      return { label: "Needs Improvement", color: "bg-orange-500" };
    return { label: "Poor", color: "bg-red-500" };
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
                      <div className="space-y-4">
                        {employee.Skills.map((skill) => (
                          <Card key={skill.id}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base font-medium">
                                {skill.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                {skill.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
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
                                    {performance.score.toFixed(1)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={`${rating.color} text-white`}
                                    >
                                      {rating.label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="max-w-xs">
                                    <p className="text-sm line-clamp-2">
                                      {performance.feedback}
                                    </p>
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
