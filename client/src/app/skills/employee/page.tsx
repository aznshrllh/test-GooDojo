"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  RefreshCw,
  Check,
  Search,
  Users,
  FileCheck,
  Briefcase,
  Building,
} from "lucide-react";

import { getAllEmployees, addEmployeeSkill } from "@/actions/employee";
import { getSkillById } from "@/actions/skill";
import { AddEmployeeSkillData, Employee, SkillWithEmployees } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AddEmployeeSkillPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillId = searchParams.get("id")
    ? parseInt(searchParams.get("id")!)
    : null;

  const [skill, setSkill] = useState<SkillWithEmployees | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loadingSkill, setLoadingSkill] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  // Fetch skill data
  const fetchSkill = useCallback(async () => {
    if (!skillId) {
      toast.error("No skill ID provided");
      router.push("/skills");
      return;
    }

    setLoadingSkill(true);
    try {
      const result = await getSkillById(skillId);
      if ("message" in result) {
        toast.error(result.message);
        router.push("/skills");
      } else {
        setSkill(result);
      }
    } catch (error) {
      toast.error("Failed to fetch skill details");
      console.error(error);
      router.push("/skills");
    } finally {
      setLoadingSkill(false);
    }
  }, [skillId, router]);

  // Fetch all employees
  const fetchEmployees = useCallback(async () => {
    setLoadingEmployees(true);
    try {
      const result = await getAllEmployees();
      if ("message" in result) {
        toast.error(result.message);
      } else {
        setEmployees(result);
        setFilteredEmployees(result);
      }
    } catch (error) {
      toast.error("Failed to fetch employees");
      console.error(error);
    } finally {
      setLoadingEmployees(false);
    }
  }, []);

  // Initialize data on component mount
  useEffect(() => {
    fetchSkill();
    fetchEmployees();
  }, [fetchSkill, fetchEmployees]);

  // Filter employees based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.Department?.name.toLowerCase().includes(query) ||
        employee.JobPosition?.title.toLowerCase().includes(query)
    );

    setFilteredEmployees(filtered);
  }, [searchQuery, employees]);

  // Filter out employees who already have the skill
  const availableEmployees = filteredEmployees.filter(
    (employee) =>
      !skill?.Employees?.some(
        (skillEmployee) => skillEmployee.id === employee.id
      )
  );

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle adding skill to employee
  const handleAddSkill = async (employeeId: number) => {
    if (!skillId) return;

    setProcessingIds((prev) => [...prev, employeeId]);

    try {
      const data: AddEmployeeSkillData = {
        employee_id: employeeId,
        skill_id: skillId,
      };

      const result = await addEmployeeSkill(data);

      if ("message" in result && result.message.includes("Error")) {
        toast.error(result.message);
      } else {
        toast.success(`Skill added to employee successfully`);
        // Refresh skill data to update the employees list
        fetchSkill();
      }
    } catch (error) {
      toast.error(
        `Failed to add skill: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== employeeId));
    }
  };

  // Render loading state
  if (loadingSkill || !skill) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-2 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/skills")}
          >
            <ArrowLeft size={16} />
          </Button>
          <Skeleton className="h-8 w-72" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/skills")}
            title="Back to Skills"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add Employees to Skill</h1>
            <p className="text-muted-foreground">
              Assign employees to the &quot;{skill.name}&quot; skill
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            fetchSkill();
            fetchEmployees();
          }}
          title="Refresh"
        >
          <RefreshCw size={16} />
        </Button>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Skill Information */}
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">{skill.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {skill.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>
                    {new Date(skill.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ID</span>
                  <Badge variant="outline">{skill.id}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Employees</span>
                  <Badge>{skill.Employees?.length || 0}</Badge>
                </div>
              </div>

              {skill.Employees && skill.Employees.length > 0 ? (
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Current Employees with This Skill
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-auto pr-1">
                    {skill.Employees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex items-center gap-3 bg-muted/50 p-2 rounded-md"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {employee.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-muted/30 rounded-md">
                  <Users className="h-10 w-10 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No employees have this skill yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Employees List */}
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Available Employees</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <CardDescription>
                Add the {skill.name} skill to employees who don&apos;t have it
                yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingEmployees ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : availableEmployees.length === 0 ? (
                <Alert>
                  <FileCheck className="h-4 w-4" />
                  <AlertTitle>No employees available</AlertTitle>
                  <AlertDescription>
                    {filteredEmployees.length === 0 && searchQuery
                      ? "No employees match your search criteria"
                      : "All employees already have this skill or no employees available"}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableEmployees.map((employee) => {
                        const isProcessing = processingIds.includes(
                          employee.id
                        );
                        return (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {getInitials(employee.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">
                                    {employee.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {employee.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm">
                                  {employee.Department?.name || "N/A"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm">
                                  {employee.JobPosition?.title || "N/A"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddSkill(employee.id)}
                                disabled={isProcessing}
                                className="flex items-center gap-1"
                              >
                                {isProcessing ? (
                                  <>
                                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                    Adding...
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-3.5 w-3.5" />
                                    Add Skill
                                  </>
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {availableEmployees.length} of {employees.length}{" "}
                employees
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/skills")}
                className="flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                Back to Skills
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
