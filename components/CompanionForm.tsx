'use client';

import type React from "react";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { subjects } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ImageIcon, Upload } from "lucide-react";
import { CreateTeacher } from "@/lib/actions/teacher.actions";

const formSchema = z.object({
  name: z.string().min(1, { message: "Companion name is required." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  topic: z.string().min(1, { message: "Topic is required." }),
  voice: z.string().min(1, { message: "Voice is required." }),
  style: z.string().min(1, { message: "Style is required." }),
  duration: z.number().min(1, { message: "Duration is required." }),
});

const CompanionForm = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      topic: "",
      voice: "",
      style: "",
      duration: 15,
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const teacher = await CreateTeacher(values);
      if (teacher) {
        router.push("/Teachers/success/" + teacher.id);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("You have no remaining instances")
      ) {
        setShowLimitModal(true);
      } else {
        console.error("Error creating companion:", error);
        // Optionally: show a generic error toast or modal
      }
    }
  };

  return (
    <>
      <div className="mx-auto px-14 flex flex-col gap-8 bg-background min-h-screen max-w-[600px] pt-10 max-sm:px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">Companion Builder</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <FormLabel className="text-base font-medium text-gray-700">
                Companion icon
              </FormLabel>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Companion"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-black rounded-[2rem] px-4 py-2 text-sm font-medium hover:bg-gray-50 bg-transparent"
                    asChild
                  >
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload image
                    </label>
                  </Button>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-gray-700">
                    Companion name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the companion name - ex: Calculus King"
                      {...field}
                      className="border-black bg-white focus-visible:ring-0 focus-visible:border-black rounded-[2rem] px-4 py-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-gray-700">
                    Subject
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="border-black bg-white focus:ring-0 focus:border-black rounded-[2rem] px-4 py-3 h-auto capitalize">
                        <SelectValue placeholder="Select the subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem
                            value={subject}
                            key={subject}
                            className="capitalize"
                          >
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-gray-700">
                    What should this companion teach?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the topic you want to learn - ex: Derivatives"
                      {...field}
                      className="border-black bg-white focus-visible:ring-0 focus-visible:border-black rounded-[2rem] px-4 py-3 min-h-[80px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="voice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-gray-700">
                    Voice Type
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="border-black bg-white focus:ring-0 focus:border-black rounded-[2rem] px-4 py-3 h-auto">
                        <SelectValue placeholder="Select voice type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-gray-700">
                    Speaking Style
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="border-black bg-white focus:ring-0 focus:border-black rounded-[2rem] px-4 py-3 h-auto">
                        <SelectValue placeholder="Select speaking style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-gray-700">
                    Estimated session duration (minutes)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="15"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="border-black bg-white focus-visible:ring-0 focus-visible:border-black rounded-[2rem] px-4 py-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-[#ff4444] hover:bg-[#ff3333] text-white rounded-[2rem] py-4 text-base font-semibold"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Building Companion..."
                  : "Build Companion"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {showLimitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-xl text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Out of Instances
            </h2>
            <p className="text-gray-600 mb-6">
              You have used all your available instances to create teachers.
              Please upgrade your plan to create more.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowLimitModal(false)}
              >
                Close
              </Button>
              <Button onClick={() => router.push('/plans')}>
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanionForm;