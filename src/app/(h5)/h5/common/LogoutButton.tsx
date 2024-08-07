"use client";
import { SignOutButton, SignedIn, UserButton } from "@clerk/nextjs";
function LogoutButton() {
  return (
    <SignedIn>
      <div className="mr-2 mt-2 flex flex-row items-center justify-center gap-2">
        <span className="text-sm">hi: </span>
        <UserButton />
      </div>
    </SignedIn>
  );
}

export default LogoutButton;
