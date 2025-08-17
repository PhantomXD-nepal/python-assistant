import { getSubjectColor } from "@/lib/utils"
import type { Companion } from "@/types"
import Image from "next/image"
import { Clock } from "lucide-react"

interface TeacherListProps {
  title: string
  data: Companion[]
}

const TeacherList = ({ title, data }: TeacherListProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 w-full shadow-sm">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground font-sans">{title}</h2>

      <div className="space-y-2">
        <div className="hidden md:grid grid-cols-12 gap-4 pb-4 text-sm font-medium text-muted-foreground border-b border-border">
          <div className="col-span-6">Teacher</div>
          <div className="col-span-3">Subject</div>
          <div className="col-span-3 text-right">Duration</div>
        </div>

        <div className="space-y-3">
          {data.map((teacher) => {
            const subjectColor = getSubjectColor(teacher.subject)

            return (
              <div
                key={teacher.id}
                className="bg-background rounded-xl border border-border p-4 hover:shadow-md transition-all duration-200 hover:border-primary/20 group"
              >
                <div className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 md:items-center">
                  {/* Teacher Info */}
                  <div className="md:col-span-6 flex items-center gap-3">
                    <div
                      className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105"
                      style={{ backgroundColor: subjectColor }}
                    >
                      <Image
                        src={`/icons/${teacher.subject}.svg`}
                        alt={teacher.subject}
                        width={24}
                        height={24}
                        className="md:w-7 md:h-7 filter brightness-0 invert"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground text-base md:text-lg leading-tight font-sans group-hover:text-primary transition-colors">
                        {teacher.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1 leading-tight line-clamp-1">
                        Topic: {teacher.topic}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:col-span-6 md:grid md:grid-cols-2">
                    {/* Subject Badge */}
                    <div className="md:col-span-1">
                      <span
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs md:text-sm font-medium text-white shadow-sm"
                        style={{ backgroundColor: subjectColor }}
                      >
                        {teacher.subject}
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="md:col-span-1 md:text-right">
                      <div className="flex items-center gap-1.5 text-muted-foreground md:justify-end">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{teacher.duration} mins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TeacherList
