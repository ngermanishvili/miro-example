"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface SignOutProps {
  isExpanded: boolean;
}

const SignOut = ({ isExpanded }: SignOutProps) => {
  return (
    <button
      onClick={() => signOut()}
      className={`
        w-full flex items-center gap-3 p-2
        text-gray-400 hover:text-white rounded-lg hover:bg-gray-800
        ${isExpanded ? "justify-start" : "justify-center"}
        text-sm
      `}
    >
      <LogOut className="w-5 h-5" />
      {isExpanded && <span className="whitespace-nowrap">გასვლა</span>}
    </button>
  );
};

export { SignOut };
