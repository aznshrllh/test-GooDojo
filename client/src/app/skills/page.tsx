"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Pencil,
  Trash,
  Plus,
  Code2,
  Search,
  Users,
  MoreHorizontal,
  Calendar,
  RefreshCw,
  Zap,
  Tag,
  ArrowUpDown,
  ChevronDown,
  ArrowUpAZ,
  ArrowDownZA,
  Hash,
} from "lucide-react";

import {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/actions/skill";
import { CreateSkillData, SkillWithEmployees } from "@/types";

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
import { Textarea } from "@/components/ui/textarea";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

// Define sort options
type SortField = "id" | "employees" | "name";
type SortOrder = "asc" | "desc";

interface SortOption {
  field: SortField;
  order: SortOrder;
  label: string;
  icon: React.ReactNode;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillWithEmployees[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<SkillWithEmployees[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<SkillWithEmployees | null>(
    null
  );
  const [formData, setFormData] = useState<CreateSkillData>({
    name: "",
    description: "",
  });

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Define sort options
  const sortOptions: SortOption[] = [
    {
      field: "id",
      order: "asc",
      label: "ID (Low to High)",
      icon: <Hash size={16} className="mr-2" />,
    },
    {
      field: "id",
      order: "desc",
      label: "ID (High to Low)",
      icon: <Hash size={16} className="mr-2" />,
    },
    {
      field: "employees",
      order: "desc",
      label: "Most Employees",
      icon: <Users size={16} className="mr-2" />,
    },
    {
      field: "employees",
      order: "asc",
      label: "Least Employees",
      icon: <Users size={16} className="mr-2" />,
    },
    {
      field: "name",
      order: "asc",
      label: "Name (A-Z)",
      icon: <ArrowUpAZ size={16} className="mr-2" />,
    },
    {
      field: "name",
      order: "desc",
      label: "Name (Z-A)",
      icon: <ArrowDownZA size={16} className="mr-2" />,
    },
  ];

  // Fetch all skills
  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAllSkills();

      if ("message" in result) {
        toast.error(result.message);
      } else {
        setSkills(result);
        // Apply initial sorting to the filtered skills
        const sorted = sortSkills(result, sortField, sortOrder);
        setFilteredSkills(sorted);
      }
    } catch (error) {
      toast.error("Failed to fetch skills");
      console.error("Error fetching skills:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sortField, sortOrder]);

  // Fetch skills on component mount
  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Filter skills based on search query and sort
  useEffect(() => {
    let filtered = [...skills];

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = skills.filter(
        (skill) =>
          skill.name.toLowerCase().includes(query) ||
          skill.description.toLowerCase().includes(query) ||
          skill.Employees?.some((emp) => emp.name.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered = sortSkills(filtered, sortField, sortOrder);

    setFilteredSkills(filtered);
  }, [searchQuery, skills, sortField, sortOrder]);

  // Sort skills based on selected field and order
  const sortSkills = (
    skillsToSort: SkillWithEmployees[],
    field: SortField,
    order: SortOrder
  ): SkillWithEmployees[] => {
    return [...skillsToSort].sort((a, b) => {
      if (field === "id") {
        return order === "asc" ? a.id - b.id : b.id - a.id;
      } else if (field === "employees") {
        const countA = a.Employees?.length || 0;
        const countB = b.Employees?.length || 0;
        return order === "asc" ? countA - countB : countB - countA;
      } else if (field === "name") {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return order === "asc" ? -1 : 1;
        if (nameA > nameB) return order === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });
  };

  // Handle sort change
  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

  // Get current sort label
  const getCurrentSortLabel = () => {
    const option = sortOptions.find(
      (opt) => opt.field === sortField && opt.order === sortOrder
    );
    return option?.label || "Sort By";
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Create new skill
  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.loading("Creating skill...");
    const result = await createSkill(formData);

    if ("message" in result) {
      toast.dismiss();
      toast.error(result.message);
    } else {
      toast.dismiss();
      toast.success("Skill created successfully");
      setCreateDialogOpen(false);
      setFormData({ name: "", description: "" });
      fetchSkills();
    }
  };

  // Set up skill for editing
  const handleEditSetup = (skill: SkillWithEmployees) => {
    setCurrentSkill(skill);
    setFormData({
      name: skill.name,
      description: skill.description,
    });
    setEditDialogOpen(true);
  };

  // Update skill
  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentSkill || !formData.name || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.loading("Updating skill...");
    const result = await updateSkill(currentSkill.id, formData);

    if ("message" in result && result.message.includes("Error")) {
      toast.dismiss();
      toast.error(result.message);
    } else {
      toast.dismiss();
      toast.success("Skill updated successfully");
      setEditDialogOpen(false);
      setCurrentSkill(null);
      setFormData({ name: "", description: "" });
      fetchSkills();
    }
  };

  // Set up skill for deletion
  const handleDeleteSetup = (skill: SkillWithEmployees) => {
    setCurrentSkill(skill);
    setDeleteDialogOpen(true);
  };

  // Delete skill
  const handleDeleteSkill = async () => {
    if (!currentSkill) return;

    toast.loading("Deleting skill...");
    const result = await deleteSkill(currentSkill.id);

    if ("message" in result && result.message.includes("Error")) {
      toast.dismiss();
      toast.error(result.message);
    } else {
      toast.dismiss();
      toast.success("Skill deleted successfully");
      setDeleteDialogOpen(false);
      setCurrentSkill(null);
      fetchSkills();
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate skill popularity (percentage of employees with this skill)
  const calculatePopularity = (skill: SkillWithEmployees) => {
    const totalEmployees = skills.reduce(
      (total, s) => Math.max(total, s.Employees?.length || 0),
      0
    );

    if (totalEmployees === 0) return 0;
    return Math.min(
      100,
      Math.round(((skill.Employees?.length || 0) * 100) / totalEmployees)
    );
  };

  // Get skill category based on name (for visualization only)
  const getSkillCategory = (name: string) => {
    const lowerName = name.toLowerCase();
    if (
      lowerName.includes("javascript") ||
      lowerName.includes("react") ||
      lowerName.includes("node") ||
      lowerName.includes("sql") ||
      lowerName.includes("python") ||
      lowerName.includes("java") ||
      lowerName.includes("c#") ||
      lowerName.includes("php")
    ) {
      return "Technical";
    } else if (
      lowerName.includes("management") ||
      lowerName.includes("leadership") ||
      lowerName.includes("project") ||
      lowerName.includes("planning")
    ) {
      return "Management";
    } else if (
      lowerName.includes("marketing") ||
      lowerName.includes("sales") ||
      lowerName.includes("communication")
    ) {
      return "Business";
    } else if (
      lowerName.includes("financial") ||
      lowerName.includes("analysis") ||
      lowerName.includes("accounting")
    ) {
      return "Finance";
    } else {
      return "Other";
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
          <h1 className="text-3xl font-bold">Skills Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage employee skills across your organization
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchSkills}
            className="text-muted-foreground hover:text-primary"
          >
            <RefreshCw size={16} />
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus size={16} />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Skill</DialogTitle>
                <DialogDescription>
                  Add a new skill to your organization&apos;s catalog
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSkill}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="JavaScript"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Programming language for web development"
                      rows={3}
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

      {/* Search, Sort and Stats */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills or employees..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {getCurrentSortLabel()}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={`${option.field}-${option.order}`}
                  onClick={() => handleSortChange(option.field, option.order)}
                  className="cursor-pointer flex items-center"
                >
                  {option.icon}
                  {option.label}
                  {sortField === option.field && sortOrder === option.order && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary"></div>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="rounded-md">
            <Zap size={14} className="mr-1" />
            {skills.length} Skills
          </Badge>
          <Badge variant="outline" className="rounded-md">
            <Users size={14} className="mr-1" />
            {skills.reduce(
              (acc, skill) => acc + (skill.Employees?.length || 0),
              0
            )}{" "}
            Employees Skilled
          </Badge>
        </div>
      </div>

      {/* Skills Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.length === 0 && skills.length > 0 ? (
          <div className="col-span-full">
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="pt-6 text-center">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No results found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  No skills match your search criteria
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
        ) : skills.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="pt-6 text-center">
                <Code2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No skills found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Create your first skill to get started
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Plus size={16} className="mr-2" />
                  Add Skill
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredSkills.map((skill) => {
            const category = getSkillCategory(skill.name);
            const popularity = calculatePopularity(skill);
            const employeeCount = skill.Employees?.length || 0;

            return (
              <Card
                key={skill.id}
                className="overflow-hidden transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          category === "Technical"
                            ? "default"
                            : category === "Management"
                            ? "secondary"
                            : category === "Business"
                            ? "outline"
                            : category === "Finance"
                            ? "destructive"
                            : "outline"
                        }
                        className="rounded-md"
                      >
                        {category}
                      </Badge>
                      <CardTitle className="text-xl font-semibold">
                        {skill.name}
                      </CardTitle>
                    </div>
                    <TooltipProvider>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleEditSetup(skill)}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil size={14} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteSetup(skill)}
                            className="text-red-500 hover:text-red-600 flex items-center cursor-pointer"
                          >
                            <Trash size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipProvider>
                  </div>
                  <CardDescription className="mt-1 line-clamp-2">
                    {skill.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-muted-foreground">
                          Popularity
                        </span>
                        <span className="font-medium">{popularity}%</span>
                      </div>
                      <Progress value={popularity} className="h-2" />
                    </div>

                    <div className="mt-2">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Users size={14} className="mr-2" />
                        Employees ({employeeCount})
                      </h4>

                      {employeeCount > 0 ? (
                        <div>
                          <div className="flex -space-x-2 overflow-hidden mb-2">
                            {skill.Employees?.slice(0, 5).map((employee) => (
                              <Tooltip key={employee.id}>
                                <TooltipTrigger asChild>
                                  <Avatar className="border-2 border-background">
                                    <AvatarFallback className="bg-muted text-xs">
                                      {getInitials(employee.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{employee.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {employee.email}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                            {employeeCount > 5 && (
                              <Avatar className="border-2 border-background bg-muted">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                  +{employeeCount - 5}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No employees have this skill yet
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    <Calendar size={14} className="mr-2" />
                    {new Date(skill.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <Badge variant="outline" className="rounded-sm">
                    <Tag size={12} className="mr-1" />
                    {skill.id.toString().padStart(3, "0")}
                  </Badge>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Skill Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>Update skill information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSkill}>
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
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
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

      {/* Delete Skill Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">
              Are you sure you want to delete this skill?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the skill{" "}
              <span className="font-semibold">{currentSkill?.name}</span> and
              cannot be undone.
              {currentSkill?.Employees && currentSkill.Employees.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-500 flex items-center gap-2">
                    <Users size={16} />
                    This skill is associated with{" "}
                    <strong>{currentSkill.Employees.length} employees</strong>.
                    These employee records may be affected.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSkill}
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
