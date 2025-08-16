import TeacherList from "@/components/TeacherList";
import { getUserSessions } from "@/lib/actions/session.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const HistoryPage = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const userSessions = await getUserSessions(userId);

  return (
    <main>
      <TeacherList title="Your Sessions" data={userSessions} />
    </main>
  );
};

export default HistoryPage;
