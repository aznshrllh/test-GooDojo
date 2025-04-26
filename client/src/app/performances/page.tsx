"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Activity,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Trash2,
  UserCircle,
} from "lucide-react";

import { getAllPerformances, deletePerformance } from "@/actions/performance";
import { getAllEmployees } from "@/actions/employee";
import { Employee, PerformanceWithEmployee } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PerformancesPage() {
  const router = useRouter();
  const [performances, setPerformances] = useState<PerformanceWithEmployee[]>(
    []
  );
  const [filteredPerformances, setFilteredPerformances] = useState<
    PerformanceWithEmployee[]
  >([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [performanceToDelete, setPerformanceToDelete] =
    useState<PerformanceWithEmployee | null>(null);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch performances and employees on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [performancesResult, employeesResult] = await Promise.all([
          getAllPerformances(),
          getAllEmployees(),
        ]);

        if ("message" in performancesResult) {
          toast.error(performancesResult.message);
        } else {
          setPerformances(performancesResult);
          setFilteredPerformances(performancesResult);
        }

        if ("message" in employeesResult) {
          toast.error(employeesResult.message);
        } else {
          setEmployees(employeesResult);
        }
      } catch (error) {
        toast.error("Failed to load performance data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters when any filter changes
  useEffect(() => {
    let filtered = [...performances];

    // Apply employee filter
    if (selectedEmployee !== "all") {
      filtered = filtered.filter(
        (perf) => perf.employee_id === parseInt(selectedEmployee)
      );
    }

    // Apply rating filter
    if (selectedRating !== "all") {
      const [min, max] = selectedRating.split("-").map(Number);
      filtered = filtered.filter(
        (perf) => perf.score >= min && perf.score <= (max || 100)
      );
    }

    // Apply year filter
    if (selectedYear !== "all") {
      filtered = filtered.filter(
        (perf) =>
          new Date(perf.evaluation_date).getFullYear() ===
          parseInt(selectedYear)
      );
    }

    // Apply search filter (on employee name or feedback text)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (perf) =>
          perf.Employee?.name.toLowerCase().includes(query) ||
          perf.feedback.toLowerCase().includes(query)
      );
    }

    setFilteredPerformances(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    selectedEmployee,
    selectedRating,
    selectedYear,
    searchQuery,
    performances,
  ]);

  // Calculate available years from performance data
  const availableYears = Array.from(
    new Set(
      performances.map((perf) => new Date(perf.evaluation_date).getFullYear())
    )
  ).sort((a, b) => b - a); // Sort descending (newest first)

  // Handle delete confirmation
  const confirmDelete = (performance: PerformanceWithEmployee) => {
    setPerformanceToDelete(performance);
    setDeleteDialogOpen(true);
  };

  // Handle delete performance
  const handleDeletePerformance = async () => {
    if (!performanceToDelete) return;

    toast.loading("Deleting performance record...");
    const result = await deletePerformance(performanceToDelete.id);

    if ("message" in result && result.message.includes("Error")) {
      toast.dismiss();
      toast.error(result.message);
    } else {
      toast.dismiss();
      toast.success("Performance record deleted successfully");

      // Remove deleted performance from state
      setPerformances((prev) =>
        prev.filter((p) => p.id !== performanceToDelete.id)
      );

      setPerformanceToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedEmployee("all");
    setSelectedRating("all");
    setSelectedYear("all");
  };

  // Get score badge color
  const getScoreBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 75) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredPerformances.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredPerformances.slice(startIndex, endIndex);

  // Pagination UI helpers
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-full max-w-md" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="ml-auto">
                      <Skeleton className="h-6 w-16" />
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
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Performance Evaluations</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track employee performance reviews
          </p>
        </div>
        <Button onClick={() => router.push("/performances/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Evaluation
        </Button>
      </div>

      {/* Filters section */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-grow md:flex-grow-0 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by employee or feedback..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-full md:w-[180px]">
            <UserCircle className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select Employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Employees</SelectLabel>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={String(employee.id)}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={selectedRating} onValueChange={setSelectedRating}>
          <SelectTrigger className="w-full md:w-[150px]">
            <Star className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Score Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Score Range</SelectLabel>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="90-100">Excellent (90-100)</SelectItem>
              <SelectItem value="75-89">Good (75-89)</SelectItem>
              <SelectItem value="60-74">Average (60-74)</SelectItem>
              <SelectItem value="0-59">Poor (0-59)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full md:w-[150px]">
            <Activity className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Year</SelectLabel>
              <SelectItem value="all">All Years</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={resetFilters}>
          <Filter className="mr-2 h-4 w-4" /> Reset Filters
        </Button>
      </div>

      {/* Results */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>
              Performance Reviews ({filteredPerformances.length})
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Customize view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>
            {filteredPerformances.length === 0
              ? "No performance reviews found"
              : "Showing page " + currentPage + " of " + totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPerformances.length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No reviews found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No performance reviews match your current filters.
              </p>
              <Button onClick={resetFilters} variant="outline" className="mt-6">
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Review Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((performance) => (
                    <TableRow key={performance.id}>
                      <TableCell>
                        <div className="font-medium">
                          {performance.Employee?.name || "Unknown"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {performance.employee_id}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(performance.evaluation_date)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getScoreBadge(performance.score)}
                          variant="outline"
                        >
                          {performance.score}/100
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="line-clamp-2 text-sm">
                          {performance.feedback}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Open menu</span>
                              <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/performances/edit/${performance.id}`
                                )
                              }
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => confirmDelete(performance)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination controls */}
          {filteredPerformances.length > 0 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={!canGoPrevious}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={!canGoNext}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">
              Delete Performance Review
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this performance review for{" "}
              <strong>{performanceToDelete?.Employee?.name}</strong> dated{" "}
              {performanceToDelete &&
                formatDate(performanceToDelete.evaluation_date)}
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeletePerformance}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
