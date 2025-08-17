'use client';

import CompanionForm from "@/components/CompanionForm";
import { getUser } from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";
import LimitReachedModal from "@/components/LimitReachedModal";
import { useRouter } from "next/navigation";

const NewCompanionPage = () => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLimit = async () => {
      const user = await getUser();
      if (user && user.remaining_instances <= 0) {
        setShowModal(true);
      }
    };
    checkLimit();
  }, []);

  return (
    <main className="min-lg:w-1/3 min-md:w-2/3 items-center justify-center">
      <CompanionForm />
      <LimitReachedModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          router.push("/Teachers");
        }}
        message="You've reached your companion limit. Upgrade to create more companions and premium features."
      />
    </main>
  );
};

export default NewCompanionPage;