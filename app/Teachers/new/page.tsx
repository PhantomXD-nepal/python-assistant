"use client"

import CompanionForm from "@/components/CompanionForm"
import { getUser } from "@/lib/actions/user.actions"
import { useEffect, useState } from "react"
import LimitReachedModal from "@/components/LimitReachedModal"
import { useRouter } from "next/navigation"

const NewCompanionPage = () => {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkLimit = async () => {
      const user = await getUser()
      if (user && user.remaining_instances <= 0) {
        setShowModal(true)
      }
    }
    checkLimit()
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-2xl">
        <CompanionForm />
        <LimitReachedModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            router.push("/Teachers")
          }}
          message="You've reached your companion limit. Upgrade to create more companions and premium features."
        />
      </div>
    </main>
  )
}

export default NewCompanionPage
