import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#ff4444] to-[#ff3333] text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 left-16 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#fccc41] rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-md">
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src="/images/logo.svg"
                alt="Saraswoti Logo"
                width={80}
                height={80}
              />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#fccc41] animate-pulse" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Start Learning Today!</h1>
            <p className="text-lg text-white/90">
              Join thousands of learners building their personalized AI tutors
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-[2rem] p-6 space-y-4">
            <h3 className="text-xl font-semibold">What you'll get:</h3>
            <ul className="space-y-2 text-left">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#fccc41] rounded-full"></div>
                <span>Unlimited AI learning companions</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#fccc41] rounded-full"></div>
                <span>Personalized learning paths</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#fccc41] rounded-full"></div>
                <span>Voice conversations</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#fccc41] rounded-full"></div>
                <span>Progress tracking</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Image
              src="/images/logo.svg"
              alt="Saraswoti Logo"
              width={60}
              height={60}
              className="mx-auto"
            />
            <h1 className="text-2xl font-bold mt-4">Create Account</h1>
            <p className="text-gray-600 mt-2">Start your learning journey</p>
          </div>

          {/* Desktop Title */}
          <div className="hidden lg:block text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">
              Start building your AI learning companions
            </p>
          </div>

          {/* Clerk Sign Up Component */}
          <div className="flex justify-center">
            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "border-black text-black hover:bg-gray-50 rounded-[2rem] font-medium",
                  socialButtonsBlockButtonText: "font-medium",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500",
                  formFieldInput:
                    "border-black rounded-[2rem] focus:border-black focus:ring-0 px-4 py-3",
                  formFieldLabel: "text-gray-700 font-medium",
                  formButtonPrimary:
                    "bg-[#ff4444] hover:bg-[#ff3333] rounded-[2rem] py-3 font-semibold",
                  footerActionLink:
                    "text-[#ff4444] hover:text-[#ff3333] font-medium",
                  identityPreviewText: "text-gray-700",
                  identityPreviewEditButton:
                    "text-[#ff4444] hover:text-[#ff3333]",
                  formFieldSuccessText: "text-green-600",
                  formFieldErrorText: "text-red-600",
                },
              }}
              redirectUrl="/dashboard"
            />
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-[#ff4444] hover:text-[#ff3333] font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="text-center text-sm text-gray-500">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-[#ff4444] hover:text-[#ff3333]">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-[#ff4444] hover:text-[#ff3333]"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
