import { getUserSessions } from "@/lib/actions/session.actions";
import TeacherList from "@/components/TeacherList";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/actions/user.actions";
import StatsCard from "@/components/StatsCard";
import Image from "next/image";

const MyJourneyPage = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const [sessionHistory, userData] = await Promise.all([
    getUserSessions(user.id),
    getUser(),
  ]);

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6 text-black">My Journey</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Current Plan"
          value={userData?.plan || 'Free'}
          icon={<Image src="/icons/cap.svg" alt="plan" width={32} height={32} />}
        />
        <StatsCard
          title="Remaining Instances"
          value={userData?.remaining_instances || 0}
          icon={<Image src="/icons/plus.svg" alt="instances" width={32} height={32} />}
        />
        <StatsCard
          title="Total Sessions"
          value={sessionHistory?.length || 0}
          icon={<Image src="/icons/check.svg" alt="sessions" width={32} height={32} />}
        />
      </div>

      {sessionHistory && sessionHistory.length > 0 ? (
        <TeacherList title="Session History" data={sessionHistory} />
      ) : (
        <p>You have no session history yet.</p>
      )}
    </main>
  );
};

export default MyJourneyPage;
