"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarIcon, ChevronLeft, Save } from "lucide-react";
import { format } from "date-fns";

import { getPerformanceById, updatePerformance } from "@/actions/performance";
import { getAllEmployees } from "@/actions/employee";
import {
  CreatePerformanceData,
  Employee,
  PerformanceWithEmployee,
} from "@/types";

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define form validation schema
const formSchema = z.object({
  employee_id: z.string().min(1, "Please select an employee"),
  evaluation_date: z.date({
    required_error: "Please select an evaluation date",
  }),
  score: z.number().min(0).max(100),
  feedback: z
    .string()
    .min(10, "Feedback must be at least 10 characters")
    .max(1000, "Feedback must be less than 1000 characters"),
});

export default function EditPerformancePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [performance, setPerformance] =
    useState<PerformanceWithEmployee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const performanceId = parseInt(id as string);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_id: "",
      evaluation_date: new Date(),
      score: 75,
      feedback: "",
    },
  });

  // Fetch performance and employees on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [performanceResult, employeesResult] = await Promise.all([
          getPerformanceById(performanceId),
          getAllEmployees(),
        ]);

        if ("message" in performanceResult) {
          toast.error(performanceResult.message);
          router.push("/performances");
          return;
        } else {
          setPerformance(performanceResult);

          // Initialize form with fetched data
          form.reset({
            employee_id: performanceResult.employee_id.toString(),
            evaluation_date: new Date(performanceResult.evaluation_date),
            score: performanceResult.score,
            feedback: performanceResult.feedback,
          });
        }

        if ("message" in employeesResult) {
          toast.error(employeesResult.message);
        } else {
          setEmployees(employeesResult);
        }
      } catch (error) {
        toast.error("Failed to load performance data");
        console.error(error);
        router.push("/performances");
      } finally {
        setIsLoading(false);
      }
    };

    if (performanceId) {
      fetchData();
    }
  }, [performanceId, router, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Convert form values to API format
    const performanceData: Partial<CreatePerformanceData> = {
      employee_id: parseInt(values.employee_id),
      evaluation_date: values.evaluation_date.toISOString(),
      score: values.score,
      feedback: values.feedback,
    };

    try {
      toast.loading("Updating performance review...");
      const result = await updatePerformance(performanceId, performanceData);

      if ("message" in result && result.message.includes("Error")) {
        toast.dismiss();
        toast.error(result.message);
      } else {
        toast.dismiss();
        toast.success("Performance review updated successfully");
        router.push("/performances");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to update performance review");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get score label based on value
  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Average";
    return "Poor";
  };

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Get employee name by ID
  const getEmployeeName = (id: number): string => {
    const employee = employees.find((emp) => emp.id === id);
    return employee ? employee.name : "Unknown Employee";
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-8">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-48 ml-4" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-5 w-full max-w-md" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/performances")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold ml-4">
          Edit Performance Review
          {performance && (
            <span className="text-muted-foreground font-normal text-lg ml-2">
              for{" "}
              {performance.Employee?.name ||
                getEmployeeName(performance.employee_id)}
            </span>
          )}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Performance Evaluation</CardTitle>
          <CardDescription>
            Update this performance review information
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Employee Selection */}
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem
                            key={employee.id}
                            value={employee.id.toString()}
                          >
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The employee being evaluated
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Evaluation Date */}
              <FormField
                control={form.control}
                name="evaluation_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Evaluation Date</FormLabel>
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
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2000-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When the performance was evaluated
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Performance Score */}
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => {
                  const scoreValue = field.value || 0;
                  const scoreLabel = getScoreLabel(scoreValue);
                  const scoreColor = getScoreColor(scoreValue);

                  return (
                    <FormItem>
                      <FormLabel>Performance Score</FormLabel>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>0</span>
                          <span className={cn("font-medium", scoreColor)}>
                            {scoreValue} - {scoreLabel}
                          </span>
                          <span>100</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[scoreValue]}
                            onValueChange={(values) =>
                              field.onChange(values[0])
                            }
                          />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Rate the employee&apos;s performance from 0-100
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Feedback */}
              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide detailed feedback about the employee's performance..."
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include strengths, areas for improvement, and specific
                      examples
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/performances")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Updating..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
