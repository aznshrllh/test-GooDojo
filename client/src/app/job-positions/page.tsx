"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Pencil,
  Trash,
  Plus,
  BriefcaseBusiness,
  Building,
  Search,
  ArrowUpRight,
  MoreHorizontal,
  Calendar,
  RefreshCw,
} from "lucide-react";

import {
  getAllJobPositions,
  createJobPosition,
  updateJobPosition,
  deleteJobPosition,
} from "@/actions/jobPosition";
import { getAllDepartments } from "@/actions/department";
import { CreateJobPositionData, Department, JobPosition } from "@/types";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function JobPositionsPage() {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [filteredPositions, setFilteredPositions] = useState<JobPosition[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<JobPosition | null>(
    null
  );
  const [formData, setFormData] = useState<CreateJobPositionData>({
    title: "",
    department_id: 0,
  });

  // Fetch job positions and departments on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter job positions based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPositions(jobPositions);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = jobPositions.filter(
        (pos) =>
          pos.title.toLowerCase().includes(query) ||
          pos.Department?.name.toLowerCase().includes(query)
      );
      setFilteredPositions(filtered);
    }
  }, [searchQuery, jobPositions]);

  // Fetch all job positions and departments
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [positionsResult, departmentsResult] = await Promise.all([
        getAllJobPositions(),
        getAllDepartments(),
      ]);

      if ("message" in positionsResult) {
        toast.error(positionsResult.message);
      } else {
        setJobPositions(positionsResult);
        setFilteredPositions(positionsResult);
      }

      if (!("message" in departmentsResult)) {
        setDepartments(departmentsResult);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle department select change
  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department_id: parseInt(value) }));
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Create new job position
  const handleCreatePosition = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.department_id) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.loading("Creating job position...");
    const result = await createJobPosition(formData);

    if ("message" in result) {
      toast.dismiss();
      toast.error(result.message);
    } else {
      toast.dismiss();
      toast.success("Job position created successfully");
      setCreateDialogOpen(false);
      setFormData({ title: "", department_id: 0 });
      fetchData();
    }
  };

  // Set up job position for editing
  const handleEditSetup = (position: JobPosition) => {
    setCurrentPosition(position);
    setFormData({
      title: position.title,
      department_id: position.department_id,
    });
    setEditDialogOpen(true);
  };

  // Update job position
  const handleUpdatePosition = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPosition || !formData.title || !formData.department_id) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.loading("Updating job position...");
    const result = await updateJobPosition(currentPosition.id, formData);

    if ("message" in result && result.message.includes("Error")) {
      toast.dismiss();
      toast.error(result.message);
    } else {
      toast.dismiss();
      toast.success("Job position updated successfully");
      setEditDialogOpen(false);
      setCurrentPosition(null);
      setFormData({ title: "", department_id: 0 });
      fetchData();
    }
  };

  // Set up job position for deletion
  const handleDeleteSetup = (position: JobPosition) => {
    setCurrentPosition(position);
    setDeleteDialogOpen(true);
  };

  // Delete job position
  const handleDeletePosition = async () => {
    if (!currentPosition) return;

    toast.loading("Deleting job position...");
    const result = await deleteJobPosition(currentPosition.id);

    if ("message" in result && result.message.includes("Error")) {
      toast.dismiss();
      toast.error(result.message);
    } else {
      toast.dismiss();
      toast.success("Job position deleted successfully");
      setDeleteDialogOpen(false);
      setCurrentPosition(null);
      fetchData();
    }
  };

  // Get department name by id
  const getDepartmentName = (departmentId: number) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department?.name || "Unknown Department";
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
          <h1 className="text-3xl font-bold text-primary">Job Positions</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization&apos;s job positions and roles
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchData}
            className="text-muted-foreground hover:text-primary"
          >
            <RefreshCw size={16} />
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus size={16} />
                Add Position
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Job Position</DialogTitle>
                <DialogDescription>
                  Add a new job position to your organization
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreatePosition}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department_id">Department</Label>
                    <Select
                      value={
                        formData.department_id
                          ? formData.department_id.toString()
                          : ""
                      }
                      onValueChange={handleDepartmentChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            placeholder="Search positions or departments..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="rounded-md">
            <BriefcaseBusiness size={14} className="mr-1" />
            {jobPositions.length} Job Positions
          </Badge>
          <Badge variant="outline" className="rounded-md">
            <Building size={14} className="mr-1" />
            {departments.length} Departments
          </Badge>
        </div>
      </div>

      {/* Job Position Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPositions.length === 0 && jobPositions.length > 0 ? (
          <div className="col-span-full">
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="pt-6 text-center">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No results found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  No job positions match your search criteria
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
        ) : jobPositions.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="pt-6 text-center">
                <BriefcaseBusiness className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">
                  No job positions found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Create your first job position to get started
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Plus size={16} className="mr-2" />
                  Add Job Position
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredPositions.map((position) => (
            <Card
              key={position.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">
                    {position.title}
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
                          onClick={() => handleEditSetup(position)}
                          className="flex items-center cursor-pointer"
                        >
                          <Pencil size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteSetup(position)}
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
                  <Building size={14} className="inline" />
                  <span>
                    {position.Department?.name ||
                      getDepartmentName(position.department_id)}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <Badge
                      variant="outline"
                      className="rounded-md flex items-center bg-muted/20"
                    >
                      <Building size={14} className="mr-1" />
                      {position.Department?.location || "Unknown location"}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {new Date(position.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <ArrowUpRight size={12} className="mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Job Position Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Job Position</DialogTitle>
            <DialogDescription>
              Update job position information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePosition}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={
                    formData.department_id
                      ? formData.department_id.toString()
                      : ""
                  }
                  onValueChange={handleDepartmentChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

      {/* Delete Job Position Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">
              Are you sure you want to delete this job position?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the job position{" "}
              <span className="font-semibold">{currentPosition?.title}</span>{" "}
              and cannot be undone.
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-amber-600 flex items-center gap-2">
                  <BriefcaseBusiness size={16} />
                  Warning: Deleting this job position may affect employee
                  records that reference it.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePosition}
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
