"use client";
import SettingsIcon from "@mui/icons-material/Settings";
import { signOut, useSession } from "next-auth/react";

export default function HomeTopBar() {
  const { data: session } = useSession();
  return (
    <div className="flex flex-row justify-between">
      <div className="space-y-2">
        <p className="text-xl font-medium">Hi, {session?.user.name}</p>
        <p>
          {session?.user.role === "restaurant"
            ? "Let's cook together"
            : "Are you hungry?"}
        </p>
      </div>
      <div
        onClick={() => signOut({ callbackUrl: "/login" })}
        className={
          "border-2 border-primary rounded-full px-3 text-primary h-fit py-1 flex flex-row justify-center space-x-2 hover:bg-primary hover:text-white transition-all duration-200"
        }
      >
        <SettingsIcon />
        <div className="font-medium">Log out</div>
      </div>
    </div>
  );
}
