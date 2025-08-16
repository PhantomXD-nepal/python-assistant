import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#fccc41] rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-16 w-40 h-40 bg-[#ff4444] rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-400 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-md">
          <div className="flex justify-center">
            <Image
              src="/images/logo.svg"
              alt="Saraswoti Logo"
              width={80}
              height={80}
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Welcome Back!</h1>
            <p className="text-lg text-white/80">
              Continue your learning journey with your personalized AI
              companions
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <div className="w-12 h-12 bg-[#E6E6FA] rounded-lg flex items-center justify-center">
              <span className="text-2xl">🧪</span>
            </div>
            <div className="w-12 h-12 bg-[#FFE4B5] rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="w-12 h-12 bg-[#BDE7FF] rounded-lg flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <div className="w-12 h-12 bg-[#FFB6C1] rounded-lg flex items-center justify-center">
              <span className="text-2xl">💻</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
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
            <h1 className="text-2xl font-bold mt-4">Sign In</h1>
            <p className="text-gray-600 mt-2">Welcome back to Saraswoti</p>
          </div>

          {/* Desktop Title */}
          <div className="hidden lg:block text-center">
            <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
            <p className="text-gray-600 mt-2">
              Welcome back to your learning journey
            </p>
          </div>

          {/* Clerk Sign In Component */}
          <div className="flex justify-center">
            <SignIn
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
                },
              }}
              redirectUrl="/dashboard"
            />
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-[#ff4444] hover:text-[#ff3333] font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
