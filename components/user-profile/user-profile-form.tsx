"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
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

const securityQuestions = [
  "What was the name of your first pet?",
  "In which city were you born?",
  "What was your mother's maiden name?",
  "What was the name of your first school?",
  "What is your favorite book?",
  "What is the name of the street you grew up on?",
  "What was the make and model of your first car?",
  "What is your father's middle name?",
  "What is the name of your childhood best friend?",
  "What was your dream job as a child?",
  "What was the first concert you attended?",
  "What is the name of your favorite teacher?",
  "What was the name of your first employer?",
  "Where did you go on your first vacation?",
  "What was your childhood nickname?",
  "What is the name of your favorite childhood toy?",
];

const formSchema = z.object({
  username: z.string(),
  securityQuestion: z.string({
    required_error: undefined,
  }),
  securityAnswer: z.string().min(1, {
    message: "Security answer is required.",
  }),
});

const UserProfileForm = () => {
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: session?.user?.username || "",
      securityQuestion: "",
      securityAnswer: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/users/update-security", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: session?.user?.username,
          securityQuestion: values.securityQuestion,
          securityAnswer: values.securityAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update security information");
      }

      // Reset form after successful update
      form.reset({
        username: session?.user?.username || "",
        securityQuestion: "",
        securityAnswer: "",
      });

      toast.success("Security information updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update security information");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled
                  value={session?.user?.username || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="securityQuestion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Security Question</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a security question" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {securityQuestions.map((question) => (
                    <SelectItem key={question} value={question}>
                      {question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="securityAnswer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Security Answer</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your answer"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Update Profile
        </Button>
      </form>
    </Form>
  );
};

export default UserProfileForm;
