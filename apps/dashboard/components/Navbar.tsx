"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant={"outline"}>Signin</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant={"default"}>Signup</Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer"
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {isDark ? <Sun /> : <Moon />}
      </Button>
    </header>
  );
}
