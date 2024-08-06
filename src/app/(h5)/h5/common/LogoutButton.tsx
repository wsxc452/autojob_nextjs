"use client";

import { SignOutButton, SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "antd";
function goLog() {}
function LogoutButton() {
  return (
    <SignedIn>
      {/* <SignOutButton redirectUrl="/h5/index"> */}
      {/* <Button type="primary">登出</Button> */}
      <UserButton />
      {/* </SignOutButton> */}
    </SignedIn>
  );
}

export default LogoutButton;
