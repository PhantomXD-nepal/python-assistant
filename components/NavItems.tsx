"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Teachers", href: "/Teachers" },
  { label: "Plans", href: "/plans" },
  { label: "My Progress", href: "my-journey" },
];

const NavItems = () => {
  const pathName = usePathname();

  return (
    <nav className="flex items-center gap-4">
      {navItems.map(({ label, href }) => (
        <Link
          href={href}
          key={label}
          className={cn(
            pathName === href ? "text-blue-500" : "text-gray-700",
            "hover:text-blue-600 transition-colors"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default NavItems;
