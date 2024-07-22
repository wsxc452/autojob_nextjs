"use client";

import { useClerk } from "@clerk/nextjs";

export default function LogoutClient() {
  const { signOut } = useClerk();
  const logout = async () => {
    console.log("logout");
    const ret = await signOut({
      redirectUrl: "/h5/login",
    });
    console.log("ret", ret);
  };
  return (
    <div>
      <button
        onClick={logout}
        className="mx-auto my-5 block w-80 rounded-lg bg-blue-500 px-6  py-3 font-bold text-white transition duration-300 hover:bg-blue-600"
      >
        logout
      </button>
    </div>
  );
}
