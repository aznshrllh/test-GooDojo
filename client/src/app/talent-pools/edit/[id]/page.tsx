"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Save } from "lucide-react";

import { getTalentPoolById, updateTalentPool } from "@/actions/talentPool";
import { CreateTalentPoolData, TalentPoolWithEmployees } from "@/types";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define form validation schema
const formSchema = z.object({
  candidate_name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(6, "Phone number is too short")
    .max(20, "Phone number is too long"),
  status: z.string().refine((val) => ["Active", "Inactive"].includes(val), {
    message: "Status must be Active or Inactive",
  }),
});

export default function EditTalentPoolPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [talentPool, setTalentPool] = useState<TalentPoolWithEmployees | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const poolId = parseInt(id as string);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidate_name: "",
      email: "",
      phone: "",
      status: "Active",
    },
  });

  // Fetch talent pool on component mount
  useEffect(() => {
    const fetchTalentPool = async () => {
      setIsLoading(true);
      try {
        const result = await getTalentPoolById(poolId);

        if ("message" in result) {
          toast.error(result.message);
          router.push("/talent-pools");
          return;
        } else {
          setTalentPool(result);

          // Initialize form with fetched data
          form.reset({
            candidate_name: result.candidate_name,
            email: result.email,
            phone: result.phone,
            status: result.status,
          });
        }
      } catch (error) {
        toast.error("Failed to load talent pool");
        console.error(error);
        router.push("/talent-pools");
      } finally {
        setIsLoading(false);
      }
    };

    if (poolId) {
      fetchTalentPool();
    }
  }, [poolId, router, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    const talentPoolData: Partial<CreateTalentPoolData> = {
      candidate_name: values.candidate_name,
      email: values.email,
      phone: values.phone,
      status: values.status,
    };

    try {
      toast.loading("Updating talent pool...");
      const result = await updateTalentPool(poolId, talentPoolData);

      if ("message" in result && result.message.includes("Error")) {
        toast.dismiss();
        toast.error(result.message);
      } else {
        toast.dismiss();
        toast.success("Talent pool updated successfully");
        router.push("/talent-pools");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to update talent pool");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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
            <Skeleton className="h-10 w-full" />
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
          onClick={() => router.push("/talent-pools")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold ml-4">
          Edit Talent Pool
          {talentPool && (
            <span className="text-muted-foreground font-normal text-lg ml-2">
              {talentPool.candidate_name}
            </span>
          )}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Talent Pool</CardTitle>
          <CardDescription>Update talent pool information</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Pool Name */}
              <FormField
                control={form.control}
                name="candidate_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pool Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Leadership Development"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The name of this talent pool group
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., leadership@company.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Contact email for this talent group
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 555-123-4567" {...field} />
                    </FormControl>
                    <FormDescription>
                      Contact phone number for this talent group
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Set the operational status of this talent pool
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
                onClick={() => router.push("/talent-pools")}
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
