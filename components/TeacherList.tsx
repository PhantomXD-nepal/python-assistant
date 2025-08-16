import { getSubjectColor } from "@/lib/utils";
import { Companion } from "@/types";
import Image from "next/image";

interface TeacherListProps {
  title: string;
  data: Companion[];
}

const TeacherList = ({ title, data }: TeacherListProps) => {
  return (
    <div className="rounded-[2rem] border border-black px-7 pt-7 pb-10 bg-white w-full">
      <h2 className="text-2xl font-bold mb-6 text-black">{title}</h2>

      <div className="space-y-1">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 pb-4 text-sm font-medium text-gray-600">
          <div className="col-span-6">Teacher</div>
          <div className="col-span-3">Subject</div>
          <div className="col-span-3 text-right">Duration</div>
        </div>

        {/* Lessons List */}
        <div className="space-y-3">
          {data.map((teacher) => (
            <div
              key={teacher.id}
              className="grid grid-cols-12 gap-4 items-center py-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {/* Lesson Info */}
              <div className="col-span-6 flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: getSubjectColor(teacher.subject) }}
                >
                  <Image
                    src={`/icons/${teacher.subject}.svg`}
                    alt={teacher.subject}
                    width={24}
                    height={24}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-black text-base leading-tight">
                    {teacher.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 leading-tight">
                    Topic: {teacher.topic}
                  </p>
                </div>
              </div>

              {/* Subject Badge */}
              <div className="col-span-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-black text-white`}
                >
                  {teacher.subject}
                </span>
              </div>

              {/* Duration */}
              <div className="col-span-3 text-right">
                <span className="text-black font-medium">
                  {teacher.duration} mins
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherList;
