"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertCircle,
  Building,
  ChevronLeft,
  PlusCircle,
  SquareMinus,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

import {
  getTalentPoolById,
  addEmployeeToTalentPool,
  removeEmployeeFromTalentPool,
} from "@/actions/talentPool";
import { getAllEmployees } from "@/actions/employee";
import { Employee, TalentPoolWithEmployees } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ManageTalentPoolMembersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [talentPool, setTalentPool] = useState<TalentPoolWithEmployees | null>(
    null
  );
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [employeeToRemove, setEmployeeToRemove] = useState<Employee | null>(
    null
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("members");
  const { id } = useParams();
  const poolId = parseInt(id as string);

  // Fetch talent pool and employees on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [poolResult, employeesResult] = await Promise.all([
          getTalentPoolById(poolId),
          getAllEmployees(),
        ]);

        if ("message" in poolResult) {
          toast.error(poolResult.message);
          router.push("/talent-pools");
          return;
        } else {
          setTalentPool(poolResult);
        }

        if ("message" in employeesResult) {
          toast.error(employeesResult.message);
        } else {
          setAllEmployees(employeesResult);

          // Determine which employees are not already in the pool
          if (!("message" in poolResult)) {
            const poolMemberIds = new Set(
              poolResult.Employees?.map((emp) => emp.id) || []
            );

            setAvailableEmployees(
              employeesResult.filter((emp) => !poolMemberIds.has(emp.id))
            );
          }
        }
      } catch (error) {
        toast.error("Failed to load data");
        console.error(error);
        router.push("/talent-pools");
      } finally {
        setIsLoading(false);
      }
    };

    if (poolId) {
      fetchData();
    }
  }, [poolId, router]);

  // Add employee to talent pool
  const handleAddEmployee = async () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }

    setIsAdding(true);

    try {
      toast.loading("Adding employee to talent pool...");
      const result = await addEmployeeToTalentPool({
        talent_pool_id: poolId,
        employee_id: parseInt(selectedEmployee),
      });

      if ("message" in result && result.message.includes("Error")) {
        toast.dismiss();
        toast.error(result.message);
      } else {
        toast.dismiss();
        toast.success("Employee added to talent pool");

        // Update local state
        const addedEmployee = allEmployees.find(
          (emp) => emp.id === parseInt(selectedEmployee)
        );

        if (addedEmployee && talentPool) {
          // Add employee to pool members
          setTalentPool({
            ...talentPool,
            Employees: [
              ...(talentPool.Employees || []),
              {
                ...addedEmployee,
                TalentPoolEmployee: {
                  talent_pool_id: poolId,
                  employee_id: addedEmployee.id,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              },
            ],
          });

          // Remove from available employees
          setAvailableEmployees(
            availableEmployees.filter((emp) => emp.id !== addedEmployee.id)
          );

          // Reset selection
          setSelectedEmployee("");
        }
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to add employee");
      console.error(error);
    } finally {
      setIsAdding(false);
      setAddDialogOpen(false);
    }
  };

  // Remove employee from talent pool
  const handleRemoveEmployee = async () => {
    if (!employeeToRemove) return;

    setIsRemoving(true);

    try {
      toast.loading("Removing employee from talent pool...");
      const result = await removeEmployeeFromTalentPool(
        poolId,
        employeeToRemove.id
      );

      if ("message" in result && result.message.includes("Error")) {
        toast.dismiss();
        toast.error(result.message);
      } else {
        toast.dismiss();
        toast.success("Employee removed from talent pool");

        // Update local state
        if (talentPool) {
          // Remove from pool members
          setTalentPool({
            ...talentPool,
            Employees: (talentPool.Employees || []).filter(
              (emp) => emp.id !== employeeToRemove.id
            ),
          });

          // Add to available employees
          setAvailableEmployees([...availableEmployees, employeeToRemove]);
        }
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to remove employee");
      console.error(error);
    } finally {
      setIsRemoving(false);
      setEmployeeToRemove(null);
    }
  };

  // Filter employees based on search query
  const filteredMembers =
    talentPool?.Employees?.filter((emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-48 ml-4" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-5 w-full max-w-md" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="ml-auto">
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/talent-pools")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Talent Pools
        </Button>
        <h1 className="text-2xl font-bold ml-4">
          Manage Pool Members
          {talentPool && (
            <span className="text-muted-foreground font-normal text-lg ml-2">
              {talentPool.candidate_name}
            </span>
          )}
        </h1>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="members">
            <UsersRound className="mr-2 h-4 w-4" /> Members (
            {talentPool?.Employees?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="info">
            <UserRoundCheck className="mr-2 h-4 w-4" /> Pool Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <div className="relative w-full md:w-auto md:min-w-[300px]">
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4"
              />
            </div>

            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Employee to Talent Pool</DialogTitle>
                  <DialogDescription>
                    Select an employee to add to this talent pool
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <Select
                    value={selectedEmployee}
                    onValueChange={setSelectedEmployee}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEmployees.length === 0 ? (
                        <div className="p-2 text-center text-muted-foreground">
                          No available employees
                        </div>
                      ) : (
                        availableEmployees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id.toString()}>
                            {emp.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddEmployee}
                    disabled={isAdding || !selectedEmployee}
                  >
                    {isAdding ? "Adding..." : "Add to Pool"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pool Members</CardTitle>
              <CardDescription>
                {filteredMembers.length === 0
                  ? "No members in this talent pool yet"
                  : `Showing ${filteredMembers.length} member${
                      filteredMembers.length !== 1 ? "s" : ""
                    }`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredMembers.length === 0 ? (
                <div className="text-center py-10">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No members found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchQuery
                      ? "No members match your search query"
                      : "This talent pool doesn't have any members yet. Add employees to get started."}
                  </p>
                  {searchQuery && (
                    <Button
                      onClick={() => setSearchQuery("")}
                      variant="outline"
                      className="mt-6"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10">
                                  {employee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{employee.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {employee.JobPosition?.title || "No Position"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {employee.Department?.name || "No Department"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{employee.email}</div>
                            <div className="text-sm text-muted-foreground">
                              {employee.phone}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setEmployeeToRemove(employee);
                                handleRemoveEmployee();
                              }}
                              disabled={
                                isRemoving &&
                                employeeToRemove?.id === employee.id
                              }
                            >
                              <SquareMinus className="h-4 w-4 mr-1" />
                              {isRemoving &&
                              employeeToRemove?.id === employee.id
                                ? "Removing..."
                                : "Remove"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Talent Pool Information</CardTitle>
              <CardDescription>Details about this talent pool</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Pool Name
                  </h3>
                  <p className="text-lg">{talentPool?.candidate_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Status
                  </h3>
                  <Badge
                    variant={
                      talentPool?.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {talentPool?.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Email
                  </h3>
                  <p>{talentPool?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Phone
                  </h3>
                  <p>{talentPool?.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Created
                  </h3>
                  <p>
                    {new Date(talentPool?.createdAt || "").toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Last Updated
                  </h3>
                  <p>
                    {new Date(talentPool?.updatedAt || "").toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/talent-pools/edit/${poolId}`)}
                  >
                    Edit Pool Info
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentTab("members")}
                  >
                    <UsersRound className="h-4 w-4 mr-1" />
                    View Members
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
