"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  const hiddenPaths = ["/sign-in", "/sign-up"];

  if (hiddenPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between mx-auto w-full px-14 py-4 bg-white max-sm:px-4 border-b border-gray-100">
      <Link
        href="/"
        className="text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors"
        aria-label="Go to homepage"
      >
        <div className="flex items-center gap-2.5 cursor-pointer">
          <Image
            src="/images/logo.svg"
            alt="Company Logo"
            width={40}
            height={40}
            priority
          />
        </div>
      </Link>

      <div className="flex items-center gap-8">
        <NavItems />
        <UserButton />
      </div>
    </nav>
  );
};

export default NavBar;
