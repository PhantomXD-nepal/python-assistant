"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

// Define the subjects that match your design
const subjects = [
  "Science",
  "Business",
  "Language",
  "History",
  "Coding",
  "Economics",
  "Geography",
  "Finance",
  "Maths",
  "Social",
];

const SubjectFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSubject = searchParams.get("subject") || "all";

  const handleSubjectChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("subject");
    } else {
      params.set("subject", value);
    }

    // Reset to first page when filtering
    params.delete("page");

    router.replace(`?${params.toString()}`);
  };

  return (
    <Select value={currentSubject} onValueChange={handleSubjectChange}>
      <SelectTrigger className="w-48 bg-white border-gray-300 max-sm:w-full">
        <SelectValue placeholder="Select subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Subjects</SelectItem>
        {subjects.map((subject) => (
          <SelectItem key={subject} value={subject.toLowerCase()}>
            {subject}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubjectFilter;
