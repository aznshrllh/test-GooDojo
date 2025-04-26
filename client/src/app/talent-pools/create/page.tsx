"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Save } from "lucide-react";

import { createTalentPool } from "@/actions/talentPool";
import { CreateTalentPoolData } from "@/types";

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

export default function CreateTalentPoolPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    const talentPoolData: CreateTalentPoolData = {
      candidate_name: values.candidate_name,
      email: values.email,
      phone: values.phone,
      status: values.status,
    };

    try {
      toast.loading("Creating talent pool...");
      const result = await createTalentPool(talentPoolData);

      if ("message" in result) {
        toast.dismiss();
        toast.error(result.message);
      } else {
        toast.dismiss();
        toast.success("Talent pool created successfully");
        router.push("/talent-pools");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to create talent pool");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-2xl font-bold ml-4">Create Talent Pool</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Talent Pool</CardTitle>
          <CardDescription>
            Create a new talent pool to group employees with similar skills or
            potential
          </CardDescription>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                  "Creating..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Create Pool
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
