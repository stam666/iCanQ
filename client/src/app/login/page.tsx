"use client"

import React, { useState } from "react";
import authService from "@/libs/userService"; // Import login function from userService.tsx
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Specify the event type
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Specify the event type
    setPassword(e.target.value);
  };
  const router = useRouter()

  const handleSignIn = async () => {
    // Handle the sign-in logic or print the inputs
    setUsername("");
    setPassword("");

    try {
      const res = await authService.login(username, password);
      router.push('/')
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-white space-y-8">
      <div className="w-full flex flex-col items-center gap-12 p-16 pb-14 font-normal text-white bg-primary rounded-b-3xl">
        <div className="text-center">Sign in</div>
        <div className="text-center text-4xl">Welcome Back!</div>
      </div>
      <div className="flex pt-8 px-8 flex-col items-center gap-8 self-stretch">
        <div className="flex flex-col items-start gap-4 self-stretch">
          <div className="p-4 items-start gap-2 self-stretch rounded-2xl border border-white-normal-hover bg-white">
            <input
              type="text"
              placeholder="Username/Email Address"
              value={username}
              onChange={handleUsernameChange}
              className="text-white-dark-hover"
            />
          </div>
          <div className="p-4 items-start gap-2 self-stretch rounded-2xl border border-white-normal-hover bg-white">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="text-white-dark-hover"
            />
          </div>
        </div>
        <button
          className="p-4 justify-center self-stretch rounded-2xl bg-primary"
          onClick={handleSignIn}
        >
          <span className="text-white text-16 font-normal">
            Sign In
          </span>
        </button>
      </div>
    </main>
  );
}
