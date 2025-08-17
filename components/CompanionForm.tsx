"use client"

import type React from "react"
import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { subjects } from "@/constants"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { ImageIcon, Upload, Sparkles } from "lucide-react"
import { CreateTeacher } from "@/lib/actions/teacher.actions"
import { getSubjectColor } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(1, { message: "Companion name is required." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  topic: z.string().min(1, { message: "Topic is required." }),
  voice: z.string().min(1, { message: "Voice is required." }),
  style: z.string().min(1, { message: "Style is required." }),
  duration: z.number().min(1, { message: "Duration is required." }),
})

const CompanionForm = () => {
  const router = useRouter()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string>("")

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
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const teacher = await CreateTeacher(values)
      if (teacher) {
        router.push("/Teachers/success/" + teacher.id)
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("You have no remaining instances")) {
        setShowLimitModal(true)
      } else {
        console.error("Error creating companion:", error)
        // Optionally: show a generic error toast or modal
      }
    }
  }

  const subjectColor = selectedSubject ? getSubjectColor(selectedSubject) : "#6b7280"

  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div
          className="px-6 py-8 text-center text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${subjectColor} 0%, ${subjectColor}dd 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-90" />
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Companion Builder</h1>
            <p className="text-sm opacity-90">Create your personalized AI learning companion</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <FormLabel className="text-base font-semibold text-gray-800">Companion Avatar</FormLabel>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div
                    className="w-20 h-20 border-2 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner"
                    style={{ borderColor: subjectColor }}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Companion"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
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
                      className="border-2 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-50 bg-white transition-all duration-200"
                      style={{ borderColor: subjectColor, color: subjectColor }}
                      asChild
                    >
                      <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Avatar
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
                    <FormLabel className="text-base font-semibold text-gray-800">Companion Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Calculus King, Grammar Guru, History Helper"
                        {...field}
                        className="border-2 bg-white focus-visible:ring-0 rounded-xl px-4 py-3 text-base transition-all duration-200"
                        style={{
                          borderColor: field.value ? subjectColor : "#d1d5db",
                          focusVisibleBorderColor: subjectColor,
                        }}
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
                    <FormLabel className="text-base font-semibold text-gray-800">Subject Area</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedSubject(value)
                        }}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger
                          className="border-2 bg-white focus:ring-0 rounded-xl px-4 py-3 h-auto capitalize text-base transition-all duration-200"
                          style={{
                            borderColor: field.value ? getSubjectColor(field.value) : "#d1d5db",
                          }}
                        >
                          <SelectValue placeholder="Choose your subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem value={subject} key={subject} className="capitalize text-base py-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: getSubjectColor(subject) }}
                                ></div>
                                {subject}
                              </div>
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
                    <FormLabel className="text-base font-semibold text-gray-800">Learning Focus</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what you want to learn (e.g., Derivatives and their applications, Essay writing techniques, World War II timeline)"
                        {...field}
                        className="border-2 bg-white focus-visible:ring-0 rounded-xl px-4 py-3 min-h-[100px] resize-none text-base transition-all duration-200"
                        style={{
                          borderColor: field.value ? subjectColor : "#d1d5db",
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="voice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-gray-800">Voice Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <SelectTrigger
                            className="border-2 bg-white focus:ring-0 rounded-xl px-4 py-3 h-auto text-base transition-all duration-200"
                            style={{
                              borderColor: field.value ? subjectColor : "#d1d5db",
                            }}
                          >
                            <SelectValue placeholder="Select voice" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male" className="text-base py-3">
                              Male Voice
                            </SelectItem>
                            <SelectItem value="female" className="text-base py-3">
                              Female Voice
                            </SelectItem>
                            <SelectItem value="neutral" className="text-base py-3">
                              Neutral Voice
                            </SelectItem>
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
                      <FormLabel className="text-base font-semibold text-gray-800">Teaching Style</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <SelectTrigger
                            className="border-2 bg-white focus:ring-0 rounded-xl px-4 py-3 h-auto text-base transition-all duration-200"
                            style={{
                              borderColor: field.value ? subjectColor : "#d1d5db",
                            }}
                          >
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="formal" className="text-base py-3">
                              Formal & Academic
                            </SelectItem>
                            <SelectItem value="casual" className="text-base py-3">
                              Casual & Relaxed
                            </SelectItem>
                            <SelectItem value="friendly" className="text-base py-3">
                              Friendly & Supportive
                            </SelectItem>
                            <SelectItem value="professional" className="text-base py-3">
                              Professional
                            </SelectItem>
                            <SelectItem value="enthusiastic" className="text-base py-3">
                              Enthusiastic & Energetic
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-gray-800">Session Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="15"
                        {...field}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="border-2 bg-white focus-visible:ring-0 rounded-xl px-4 py-3 text-base transition-all duration-200"
                        style={{
                          borderColor: field.value ? subjectColor : "#d1d5db",
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full text-white rounded-xl py-4 text-base font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
                  style={{
                    backgroundColor: subjectColor,
                    boxShadow: `0 4px 20px ${subjectColor}40`,
                  }}
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Building Your Companion..." : "Create My Companion"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {showLimitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Companion Limit Reached</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              You've used all your available companion slots. Upgrade your plan to create more AI tutors and unlock
              premium features.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button variant="outline" onClick={() => setShowLimitModal(false)} className="rounded-xl px-6 py-2.5">
                Maybe Later
              </Button>
              <Button
                onClick={() => router.push("/plans")}
                className="rounded-xl px-6 py-2.5 bg-blue-600 hover:bg-blue-700"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CompanionForm
