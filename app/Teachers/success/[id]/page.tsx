"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";

export default function CompanionSuccess() {
  const params = useParams();
  return (
    <main className="mx-auto px-14 flex flex-col items-center justify-center gap-8 bg-background min-h-screen max-w-[600px] pt-10 max-sm:px-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <CheckCircle className="w-24 h-24 text-green-500" />
            <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Companion Created!
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Your personalized learning companion has been successfully created
            and is ready to help you learn.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Link href="/">
            <Button className="bg-[#ff4444] hover:bg-[#ff3333] text-white rounded-[2rem] px-8 py-3 font-semibold">
              Go to Dashboard
            </Button>
          </Link>
          <Link href={`/Teachers/${params.id}`}>
            <Button
              variant="outline"
              className="border-black text-black hover:bg-gray-50 rounded-[2rem] px-8 py-3 font-semibold bg-transparent"
            >
              Go To Teacher Page
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
