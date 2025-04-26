"use client";

import { useState, useEffect } from "react";
import { getAllEmployees, deleteEmployee } from "@/actions/employee";
import { Employee } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import {
  Search,
  Plus,
  Download,
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";

// shadcn/ui components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee | null;
    direction: "ascending" | "descending";
  }>({ key: null, direction: "ascending" });

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const result = await getAllEmployees();

        if ("message" in result) {
          toast.error(result.message);
        } else {
          setEmployees(result);
          setFilteredEmployees(result);
        }
      } catch (error) {
        toast.error("Failed to fetch employees. Please try again later.");
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.Department?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (employee.JobPosition?.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const confirmDelete = (id: number) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (employeeToDelete === null) return;

    const id = employeeToDelete;
    setDeleteDialogOpen(false);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await deleteEmployee(id);
        if ("message" in result && result.message.includes("successfully")) {
          setEmployees(employees.filter((emp) => emp.id !== id));
          resolve("Employee deleted successfully");
        } else {
          reject("Failed to delete employee");
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        reject("An error occurred while deleting");
      }
    });

    toast.promise(promise, {
      loading: "Deleting employee...",
      success: (message) => message as string,
      error: (message) => message as string,
    });
  };

  const requestSort = (key: keyof Employee) => {
    let direction: "ascending" | "descending" = "ascending";

    if (sortConfig.key === key) {
      direction =
        sortConfig.direction === "ascending" ? "descending" : "ascending";
    }

    setSortConfig({ key, direction });

    const sortedData = [...filteredEmployees].sort((a, b) => {
      if (a[key] === null) return 1;
      if (b[key] === null) return -1;

      if (direction === "ascending") {
        return a[key] < b[key] ? -1 : 1;
      } else {
        return a[key] > b[key] ? -1 : 1;
      }
    });

    setFilteredEmployees(sortedData);
  };

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

  const exportToCSV = () => {
    // Create CSV content
    const headers = [
      "Name",
      "Email",
      "Department",
      "Position",
      "Status",
      "Hire Date",
    ];
    const csvRows = [headers];

    filteredEmployees.forEach((employee) => {
      csvRows.push([
        employee.name,
        employee.email,
        employee.Department?.name || "",
        employee.JobPosition?.title || "",
        employee.status,
        format(new Date(employee.hire_date), "yyyy-MM-dd"),
      ]);
    });

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");

    // Create a download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Set link properties
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `employees_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    link.style.display = "none";

    // Add to DOM, trigger download and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Employee Management</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your company employees, their roles, skills, and performances
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Employees</CardTitle>
            <CardDescription>Overall employee count</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <div className="text-3xl font-bold">{employees.length}</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Departments</CardTitle>
            <CardDescription>Total departments</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <div className="text-3xl font-bold">
                {
                  new Set(
                    employees.map((e) => e.Department?.name).filter(Boolean)
                  ).size
                }
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Employees</CardTitle>
            <CardDescription>Currently working</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <div className="text-3xl font-bold">
                {
                  employees.filter((e) => e.status.toLowerCase() === "active")
                    .length
                }
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Employees</CardTitle>
            <CardDescription>
              Manage your company staff and their details
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link href="/employees/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center border rounded-md px-3 mb-6">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <Input
              placeholder="Search by name, email, department or position..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="rounded-md border">
              <div className="p-4">
                <div className="grid grid-cols-6 gap-4 mb-4">
                  <Skeleton className="h-6 col-span-2" />
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 py-3 border-b last:border-0"
                  >
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 w-10" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="w-[300px]"
                      onClick={() => requestSort("name")}
                    >
                      <div className="flex items-center cursor-pointer">
                        Employee
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => requestSort("department_id")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Department
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => requestSort("job_position_id")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Position
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => requestSort("status")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => requestSort("hire_date")}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        Hire Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-10 text-muted-foreground"
                      >
                        No employees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials(employee.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {employee.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {employee.Department?.name || "-"}
                        </TableCell>
                        <TableCell>
                          {employee.JobPosition?.title || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(
                              employee.status
                            )} text-white transition-colors font-medium`}
                          >
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(employee.hire_date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Link href={`/employees/${employee.id}`}>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/employees/edit/${employee.id}`}>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => confirmDelete(employee.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between px-6 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
        </CardFooter>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
