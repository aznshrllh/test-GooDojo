"use client";

import { useState, useEffect } from "react";
import { getEmployeeById, updateEmployee } from "@/actions/employee";
import { getAllDepartments } from "@/actions/department";
import { getAllJobPositions } from "@/actions/jobPosition";
import { Employee, Department, JobPosition } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ChevronRight, Loader2, Save } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Form schema for employee data validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .min(6, { message: "Phone number must be at least 6 characters." }),
  department_id: z.coerce
    .number()
    .positive({ message: "Please select a department." }),
  job_position_id: z.coerce
    .number()
    .positive({ message: "Please select a job position." }),
  hire_date: z.date({ required_error: "Please select a hire date." }),
  status: z.enum(["active", "inactive", "on leave"], {
    required_error: "Please select an employment status.",
  }),
});

export default function EditEmployeePage() {
  const router = useRouter();
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [filteredPositions, setFilteredPositions] = useState<JobPosition[]>([]);

  // Initialize form with zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department_id: 0,
      job_position_id: 0,
      hire_date: new Date(),
      status: "active",
    },
  });

  // Fetch employee data and related entities on component mount
  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch employee data
        const employeeResult = await getEmployeeById(Number(id));
        if ("message" in employeeResult) {
          toast.error(employeeResult.message);
          return;
        }

        setEmployee(employeeResult);

        // Fetch departments and positions using server actions
        const [departmentsResult, positionsResult] = await Promise.all([
          getAllDepartments(),
          getAllJobPositions(),
        ]);

        if (!("message" in departmentsResult)) {
          setDepartments(departmentsResult);
        } else {
          toast.error(
            `Failed to load departments: ${departmentsResult.message}`
          );
        }

        if (!("message" in positionsResult)) {
          setPositions(positionsResult);
        } else {
          toast.error(
            `Failed to load job positions: ${positionsResult.message}`
          );
        }

        // Populate the form with employee data
        form.reset({
          name: employeeResult.name,
          email: employeeResult.email,
          phone: employeeResult.phone,
          department_id: employeeResult.department_id,
          job_position_id: employeeResult.job_position_id,
          hire_date: new Date(employeeResult.hire_date),
          status: employeeResult.status.toLowerCase() as
            | "active"
            | "inactive"
            | "on leave",
        });
      } catch (error) {
        toast.error("Failed to load employee data. Please try again later.");
        console.error("Error fetching employee data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, form]);

  // Filter positions based on selected department
  const watchedDepartmentId = form.watch("department_id");

  useEffect(() => {
    if (watchedDepartmentId && positions.length > 0) {
      const filtered = positions.filter(
        (position) => position.department_id === Number(watchedDepartmentId)
      );
      setFilteredPositions(filtered);

      // If current position doesn't match the department, clear it
      const currentPositionId = form.getValues("job_position_id");
      const positionExists = filtered.some(
        (p) => p.id === Number(currentPositionId)
      );

      if (!positionExists && currentPositionId) {
        form.setValue("job_position_id", 0);
      }
    } else {
      setFilteredPositions([]);
    }
  }, [watchedDepartmentId, positions, form]);

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!id) return;

    setSubmitting(true);

    const formattedData = {
      ...values,
      hire_date: format(values.hire_date, "yyyy-MM-dd"),
    };

    try {
      const result = await updateEmployee(Number(id), formattedData);

      if ("message" in result) {
        if (result.message.includes("successfully")) {
          toast.success("Employee updated successfully");
          router.push(`/employees/${id}`);
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error("Failed to update employee. Please try again.");
      console.error("Error updating employee:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
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
              <BreadcrumbLink href={`/employees/${id}`}>
                {loading ? <Skeleton className="h-4 w-24" /> : employee?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink>Edit</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Edit Employee</CardTitle>
          <CardDescription>
            Update the employee information and click save when you&apos;re
            done.
          </CardDescription>
        </CardHeader>

        {loading ? (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john.doe@example.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectItem
                                key={department.id}
                                value={department.id.toString()}
                              >
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {field.value > 0 &&
                            departments.find((d) => d.id === field.value)
                              ?.location}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="job_position_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value.toString()}
                          disabled={filteredPositions.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredPositions.map((position) => (
                              <SelectItem
                                key={position.id}
                                value={position.id.toString()}
                              >
                                {position.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {filteredPositions.length === 0 &&
                            "Please select a department first"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hire_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Hire Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Employment Status</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="active" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Active
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="inactive" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Inactive
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="on leave" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                On Leave
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-5">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/employees/${id}`)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}
