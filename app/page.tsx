import CompanionCard from "@/components/TeacherCard";
import CompanionsList from "@/components/TeacherList";
import CTA from "@/components/CTA";
import { getAllTeacher } from "@/lib/actions/teacher.actions";
import { getRecentSessions } from "@/lib/actions/session.actions";
import { getSubjectColor } from "@/lib/utils";

const Page = async () => {
  const companions = await getAllTeacher({ limit: 3 });
  const recentSessions = await getRecentSessions();

  return (
    <main>
      <h1>Popular Companions</h1>

      <section className="home-section">
        {companions.map((companion: any) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={getSubjectColor(companion.subject)}
          />
        ))}
      </section>

      <section className="home-section">
        <CompanionsList title="Recent Sessions" data={recentSessions}></CompanionsList>
        <CTA />
      </section>
    </main>
  );
};

export default Page;
