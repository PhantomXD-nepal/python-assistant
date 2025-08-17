import CompanionCard from "@/components/TeacherCard"
import CompanionsList from "@/components/TeacherList"
import CTA from "@/components/CTA"
import { getAllTeacher } from "@/lib/actions/teacher.actions"
import { getRecentSessions } from "@/lib/actions/session.actions"
import { getSubjectColor } from "@/lib/utils"
import "katex/dist/katex.min.css"

const Page = async () => {
  const companions = await getAllTeacher({ limit: 3 })
  const recentSessions = await getRecentSessions()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-8 md:space-y-12">
        <header className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-sans">Popular Companions</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Discover AI-powered learning companions tailored to your educational needs
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {companions.map((companion: any) => (
            <CompanionCard key={companion.id} {...companion} color={getSubjectColor(companion.subject)} />
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <CompanionsList title="Recent Sessions" data={recentSessions} />
          </div>
          <div className="lg:col-span-1 flex justify-center lg:justify-start">
            <CTA />
          </div>
        </section>
      </div>
    </main>
  )
}

export default Page
