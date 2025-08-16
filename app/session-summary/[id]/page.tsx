import { getSessionById } from "@/lib/actions/session.actions";
import { getSubjectColor } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";

interface SessionSummaryPageProps {
  params: {
    id: string;
  };
}

const SessionSummaryPage = async ({ params }: SessionSummaryPageProps) => {
  const session = await getSessionById(params.id);

  if (!session) {
    redirect("/my-journey");
  }

  const { teacher, summary } = session;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Session Summary</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <div
            className="size-[72px] flex items-center justify-center rounded-lg mr-4"
            style={{ backgroundColor: getSubjectColor(teacher.subject) }}
          >
            <Image
              src={`/icons/${teacher.subject}.svg`}
              alt={teacher.subject}
              width={35}
              height={35}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{teacher.name}</h2>
            <p className="text-lg text-gray-600">{teacher.subject}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Summary</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
        </div>
      </div>
    </main>
  );
};

export default SessionSummaryPage;
