"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Pencil,
  Trash,
  Plus,
  Users,
  Building,
  Search,
  MapPin,
  MoreHorizontal,
  Calendar,
  RefreshCw,
} from "lucide-react";

import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/actions/department";
import { CreateDepartmentData, Department } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(
    null
  );
  const [formData, setFormData] = useState<CreateDepartmentData>({
    name: "",
    location: "",
  });

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Filter departments based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDepartments(departments);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = departments.filter(
        (dept) =>
          dept.name.toLowerCase().includes(query) ||
          dept.location.toLowerCase().includes(query) ||
          dept.Employees?.some((emp) => emp.name.toLowerCase().includes(query))
      );
      setFilteredDepartments(filtered);
    }
  }, [searchQuery, departments]);

  // Fetch all departments
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const result = await getAllDepartments();

      if ("message" in result) {
        toast.error(result.message);
      } else {
        setDepartments(result);
        setFilteredDepartments(result);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Create new department
  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.loading("Creating department...");
    const result = await createDepartment(formData);

    if ("message" in result) {
      toast.dismiss();
      toast.error(result.message);
    } else {
      toast.dismiss();
      toast.success("Department created successfully");
      setCreateDialogOpen(false);
      setFormData({ name: "", location: "" });
      fetchDepartments();
    }
  };

  // Set up department for editing
  const handleEditSetup = (department: Department) => {
    setCurrentDepartment(department);
    setFormData({
      name: department.name,
      location: department.location,
    });
    setEditDialogOpen(true);
  };

  // Update department
  const handleUpdateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentDepartment || !formData.name || !formData.location) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.loading("Updating department...");
    const result = await updateDepartment(currentDepartment.id, formData);

    if ("message" in result && result.message.includes("Error")) {
      toast.dismiss();
      toast.error(result.message);
    } else {
      toast.dismiss();
      toast.success("Department updated successfully");
      setEditDialogOpen(false);
      setCurrentDepartment(null);
      setFormData({ name: "", location: "" });
      fetchDepartments();
    }
  };

  // Set up department for deletion
  const handleDeleteSetup = (department: Department) => {
    setCurrentDepartment(department);
    setDeleteDialogOpen(true);
  };

  // Delete department
  const handleDeleteDepartment = async () => {
    if (!currentDepartment) return;

    toast.loading("Deleting department...");
    const result = await deleteDepartment(currentDepartment.id);

    if ("message" in result && result.message.includes("Error")) {
      toast.dismiss();
      toast.error(result.message);
    } else {
      toast.dismiss();
      toast.success("Department deleted successfully");
      setDeleteDialogOpen(false);
      setCurrentDepartment(null);
      fetchDepartments();
    }
  };

  // Render skeletons during loading
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="mb-6">
          <Skeleton className="h-12 w-full mb-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, idx) => (
              <Card key={idx} className="shadow-sm">
                <CardHeader>
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-1/3" />
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization&apos;s departments and employees
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchDepartments}
            className="text-muted-foreground hover:text-primary"
          >
            <RefreshCw size={16} />
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus size={16} />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Department</DialogTitle>
                <DialogDescription>
                  Add a new department to your organization
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDepartment}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Engineering"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Floor 3, East Wing"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search departments or employees..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="rounded-md">
            <Users size={14} className="mr-1" />
            {departments.reduce(
              (acc, dept) => acc + (dept.Employees?.length || 0),
              0
            )}{" "}
            Total Employees
          </Badge>
          <Badge variant="outline" className="rounded-md">
            <Building size={14} className="mr-1" />
            {departments.length} Departments
          </Badge>
        </div>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.length === 0 && departments.length > 0 ? (
          <div className="col-span-full">
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="pt-6 text-center">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No results found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  No departments match your search criteria
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : departments.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="pt-6 text-center">
                <Building className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">
                  No departments found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Create your first department to get started
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Plus size={16} className="mr-2" />
                  Add Department
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredDepartments.map((department) => (
            <Card
              key={department.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">
                    {department.name}
                  </CardTitle>
                  <TooltipProvider>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleEditSetup(department)}
                          className="flex items-center cursor-pointer"
                        >
                          <Pencil size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteSetup(department)}
                          className="text-red-500 hover:text-red-600 flex items-center cursor-pointer"
                        >
                          <Trash size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipProvider>
                </div>
                <CardDescription className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin size={14} className="inline" />
                  <span>{department.location}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-md flex items-center"
                    >
                      <Users size={14} className="mr-1" />
                      {department.Employees?.length || 0} employees
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {new Date(department.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="employees" className="border-0">
                    <AccordionTrigger className="text-sm font-medium py-2 px-3 rounded-md bg-muted/50 hover:bg-muted no-underline">
                      <div className="flex items-center">
                        <Users size={15} className="mr-2" />
                        Employees
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-3">
                      {department.Employees &&
                      department.Employees.length > 0 ? (
                        <div className="rounded-md overflow-hidden border">
                          <Table>
                            <TableHeader className="bg-muted/50">
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right">
                                  Status
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {department.Employees.slice(0, 5).map(
                                (employee) => (
                                  <TableRow
                                    key={employee.id}
                                    className="hover:bg-muted/30"
                                  >
                                    <TableCell className="font-medium">
                                      {employee.name}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                      {employee.email}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Badge
                                        variant={
                                          employee.status === "Active"
                                            ? "default"
                                            : "secondary"
                                        }
                                        className="rounded-md"
                                      >
                                        {employee.status}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                          {department.Employees.length > 5 && (
                            <div className="bg-muted/30 py-2 px-3 text-xs text-muted-foreground flex items-center justify-center">
                              <span>
                                +{department.Employees.length - 5} more
                                employees
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/20 rounded-md flex items-center justify-center">
                          <span>No employees in this department</span>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Department Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>Update department information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateDepartment}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Department Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">
              Are you sure you want to delete this department?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the department{" "}
              <span className="font-semibold">{currentDepartment?.name}</span>{" "}
              and cannot be undone.
              {currentDepartment?.Employees &&
                currentDepartment.Employees.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-500 flex items-center gap-2">
                      <Users size={16} />
                      This department has{" "}
                      <strong>
                        {currentDepartment.Employees.length} employees
                      </strong>{" "}
                      associated with it. These employee records may be
                      affected.
                    </p>
                  </div>
                )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDepartment}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
