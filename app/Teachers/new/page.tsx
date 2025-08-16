import CompanionForm from "@/components/CompanionForm";
import { getRemainingInstances } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";

const NewCompanion = async () => {
  const remainingInstances = await getRemainingInstances();
  const canCreateCompanion = remainingInstances > 0;

  return (
    <main className="min-lg:w-1/3 min-md:w-2/3 items-center justify-center">
      {canCreateCompanion ? (
        <CompanionForm />
      ) : (
        <article className="companion-limit">
          <Image
            src="/images/limit.svg"
            alt="Companion limit reached"
            width={360}
            height={230}
          />
          <div className="cta-badge">Upgrade your plan</div>
          <h1>You’ve Reached Your Limit</h1>
          <p>
            You’ve reached your companion limit. Upgrade to create more
            companions and premium features.
          </p>
          <Link
            href="/plans"
            className="btn-primary w-full justify-center"
          >
            Upgrade My Plan
          </Link>
        </article>
      )}
    </main>
  );
};

export default NewCompanion;