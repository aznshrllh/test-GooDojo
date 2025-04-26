"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Mail,
  Phone,
  Plus,
  Search,
  Settings,
  Trash2,
  Users,
} from "lucide-react";

import { getAllTalentPools, deleteTalentPool } from "@/actions/talentPool";
import { TalentPoolWithEmployees } from "@/types";

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
  SelectItem,
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

export default function TalentPoolsPage() {
  const router = useRouter();
  const [talentPools, setTalentPools] = useState<TalentPoolWithEmployees[]>([]);
  const [filteredPools, setFilteredPools] = useState<TalentPoolWithEmployees[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [poolToDelete, setPoolToDelete] =
    useState<TalentPoolWithEmployees | null>(null);
  const [pageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch talent pools on component mount
  useEffect(() => {
    const fetchTalentPools = async () => {
      setIsLoading(true);
      try {
        const result = await getAllTalentPools();
        if ("message" in result) {
          toast.error(result.message);
        } else {
          setTalentPools(result);
          setFilteredPools(result);
        }
      } catch (error) {
        toast.error("Failed to load talent pools");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalentPools();
  }, []);

  // Apply filters when search query or status changes
  useEffect(() => {
    let filtered = [...talentPools];

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (pool) => pool.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pool) =>
          pool.candidate_name.toLowerCase().includes(query) ||
          pool.email.toLowerCase().includes(query)
      );
    }

    setFilteredPools(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedStatus, searchQuery, talentPools]);

  // Handle delete confirmation
  const confirmDelete = (talentPool: TalentPoolWithEmployees) => {
    setPoolToDelete(talentPool);
    setDeleteDialogOpen(true);
  };

  // Handle delete talent pool
  const handleDeleteTalentPool = async () => {
    if (!poolToDelete) return;

    toast.loading("Deleting talent pool...");
    const result = await deleteTalentPool(poolToDelete.id);

    if ("message" in result && result.message.includes("Error")) {
      toast.dismiss();
      toast.error(result.message);
    } else {
      toast.dismiss();
      toast.success("Talent pool deleted successfully");

      // Remove deleted pool from state
      setTalentPools((prev) => prev.filter((p) => p.id !== poolToDelete.id));

      setPoolToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredPools.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredPools.slice(startIndex, endIndex);

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
          <h1 className="text-3xl font-bold">Talent Pools</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track specialized talent groups
          </p>
        </div>
        <Button onClick={() => router.push("/talent-pools/create")}>
          <Plus className="mr-2 h-4 w-4" /> New Talent Pool
        </Button>
      </div>

      {/* Filters section */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-grow md:flex-grow-0 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search talent pools..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
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
            <CardTitle>Talent Pools ({filteredPools.length})</CardTitle>
          </div>
          <CardDescription>
            {filteredPools.length === 0
              ? "No talent pools found"
              : `Showing page ${currentPage} of ${totalPages}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPools.length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">
                No talent pools found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No talent pools match your current filters.
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
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((pool) => (
                    <TableRow key={pool.id}>
                      <TableCell>
                        <div className="font-medium">{pool.candidate_name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {pool.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" /> {pool.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" /> {pool.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            pool.status === "Active" ? "default" : "secondary"
                          }
                        >
                          {pool.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{pool.Employees?.length || 0} members</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Open menu</span>
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/talent-pools/edit/${pool.id}`)
                              }
                            >
                              Edit Pool
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/talent-pools/members/${pool.id}`)
                              }
                            >
                              Manage Members
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => confirmDelete(pool)}
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
          {filteredPools.length > 0 && (
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
              Delete Talent Pool
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the talent pool{" "}
              <strong>{poolToDelete?.candidate_name}</strong>? This will also
              remove all member associations. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteTalentPool}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
