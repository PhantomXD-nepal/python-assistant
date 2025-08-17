import { getUserSessions } from "@/lib/actions/session.actions"
import TeacherList from "@/components/TeacherList"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/actions/user.actions"
import StatsCard from "@/components/StatsCard"
import Image from "next/image"

const MyJourneyPage = async () => {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const [sessionHistory, userData] = await Promise.all([getUserSessions(user.id), getUser()])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-2">
            My Journey
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Track your learning progress and achievements</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <StatsCard
            title="Current Plan"
            value={userData?.plan || "Free"}
            icon={<Image src="/icons/cap.svg" alt="plan" width={24} height={24} />}
          />
          <StatsCard
            title="Remaining Instances"
            value={userData?.remaining_instances || 0}
            icon={<Image src="/icons/plus.svg" alt="instances" width={24} height={24} />}
          />
          <StatsCard
            title="Total Sessions"
            value={sessionHistory?.length || 0}
            icon={<Image src="/icons/check.svg" alt="sessions" width={24} height={24} />}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border-0 p-6 sm:p-8">
          {sessionHistory && sessionHistory.length > 0 ? (
            <TeacherList title="Session History" data={sessionHistory} />
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image src="/icons/check.svg" alt="no sessions" width={24} height={24} className="opacity-50" />
              </div>
              <p className="text-gray-500 text-lg mb-2">No session history yet</p>
              <p className="text-gray-400 text-sm">Start your first learning session to see your progress here</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default MyJourneyPage
