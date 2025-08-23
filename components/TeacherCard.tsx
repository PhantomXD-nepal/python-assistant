"use client"
import Link from "next/link"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSubjectColor } from "@/lib/utils"

interface CompanionCardProps {
  id: string
  name: string
  topic: string
  subject: string
  duration: number
  color: string
}

const CompanionCard = ({ id, name, topic, subject, duration, color }: CompanionCardProps) => {
  const subjectColor = getSubjectColor(subject)

  return (
    <article className={`bg-card rounded-xl border p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20 w-full max-w-sm mx-auto group border-border`}>
      <div className="flex justify-between items-start mb-4">
        <div
          className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-sm"
          style={{ backgroundColor: subjectColor }}
        >
          {subject}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <h2 className="text-lg md:text-xl font-bold text-foreground font-sans leading-tight group-hover:text-primary transition-colors">
          {name}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{topic}</p>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{duration} minutes</span>
        </div>
      </div>

      <Link href={`/Teachers/${id}`} className="w-full block">
        <Button
          className="w-full text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: subjectColor,
            borderColor: subjectColor,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${subjectColor}dd`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = subjectColor
          }}
        >
          Launch Lesson
        </Button>
      </Link>
    </article>
  )
}

export default CompanionCard