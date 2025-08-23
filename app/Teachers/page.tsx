import { getAllTeacher } from "@/lib/actions/teacher.actions";
import CompanionCard from "@/components/TeacherCard";
import { getSubjectColor } from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import { SearchParams } from "@/types";

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
  const filters = await searchParams;
  const subject = filters.subject ? filters.subject : "";
  const topic = filters.topic ? filters.topic : "";

  const teachers = await getAllTeacher({ subject, topic });

  const uniqueTeachers = teachers ? Array.from(new Map(teachers.map(teacher => [teacher.id, teacher])).values()) : [];

  return (
    <main>
      <section className="flex justify-between gap-4 max-sm:flex-col">
        <h1>Companion Library</h1>
        <div className="flex gap-4">
          <SearchInput />
          <SubjectFilter />
        </div>
      </section>
      <section className="companions-grid">
        {uniqueTeachers.map((teacher: any) => (
          <CompanionCard
            key={teacher.id}
            {...teacher}
            color={getSubjectColor(teacher.subject)}

          />
        ))}
      </section>
    </main>
  );
};

export default CompanionsLibrary;
