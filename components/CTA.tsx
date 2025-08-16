import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Plus,
  FlaskRoundIcon as Flask,
  Calculator,
  Code,
  GraduationCap,
  Users,
  Volume2,
  ScrollText,
} from "lucide-react";

const CTA = () => {
  return (
    <div className="bg-[#2c2c2c] text-white rounded-[2rem] px-7 py-10 flex flex-col items-center text-center gap-5 w-full max-w-[400px] relative overflow-hidden">
      {/* Badge */}
      <div className="bg-[#fccc41] rounded-[2rem] px-3 py-1.5 text-black text-sm font-medium">
        Start learning your way.
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold leading-tight">
        Build a Personalize Learning Companion
      </h2>

      {/* Description */}
      <p className="text-white/90 text-sm leading-relaxed max-w-[280px]">
        Pick a name, subject, voice, & personality — and start learning through
        voice conversations that feel natural and fun.
      </p>

      {/* Floating Icons */}
      <div className="relative w-full h-32 my-4">
        {/* Flask - Top Left */}
        <div className="absolute top-0 left-8 w-10 h-10 bg-[#E6E6FA] rounded-lg flex items-center justify-center">
          <Flask className="w-5 h-5 text-black" />
        </div>

        {/* Code - Top Right */}
        <div className="absolute top-2 right-4 w-10 h-10 bg-[#FFB6C1] rounded-lg flex items-center justify-center">
          <Code className="w-5 h-5 text-black" />
        </div>

        {/* Calculator - Left */}
        <div className="absolute top-12 left-2 w-10 h-10 bg-[#FFE4B5] rounded-lg flex items-center justify-center">
          <Calculator className="w-5 h-5 text-black" />
        </div>

        {/* Graduation Cap - Center */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center border-2 border-yellow-400">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>

        {/* Users - Right */}
        <div className="absolute top-12 right-8 w-10 h-10 bg-[#98FB98] rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-black" />
        </div>

        {/* Volume - Bottom Left */}
        <div className="absolute bottom-4 left-6 w-10 h-10 bg-[#BDE7FF] rounded-lg flex items-center justify-center">
          <Volume2 className="w-5 h-5 text-black" />
        </div>

        {/* Scroll - Bottom Right */}
        <div className="absolute bottom-0 right-2 w-10 h-10 bg-[#F5DEB3] rounded-lg flex items-center justify-center">
          <ScrollText className="w-5 h-5 text-black" />
        </div>
      </div>

      {/* CTA Button */}
      <Link href={"/Teachers/new"}>
        <Button className="bg-[#ff4444] hover:bg-[#ff3333] text-white rounded-xl w-full justify-center gap-2 py-3 font-semibold transition-colors">
          <Plus className="w-4 h-4" />
          Build New Companion
        </Button>
      </Link>
    </div>
  );
};

export default CTA;
