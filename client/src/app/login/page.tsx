"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

type Props = {
  callbackUrl?: string;
};
export default function LoginPage(props: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSignIn = async () => {
    setUsername("");
    setPassword("");

    try {
      await signIn("credentials", {
        email: username,
        password: password,
        redirect: true,
        callbackUrl: props.callbackUrl ?? "http://localhost:3000",
      });
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
          <input
            type="text"
            placeholder="Username/Email Address"
            value={username}
            onChange={handleUsernameChange}
            className="text-white-dark-hover p-4 items-start gap-2 self-stretch rounded-2xl border border-white-normal-hover bg-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className="text-white-dark-hover p-4 items-start gap-2 self-stretch rounded-2xl border border-white-normal-hover bg-white"
          />
        </div>
        <button
          className="p-4 justify-center self-stretch rounded-2xl bg-primary"
          onClick={handleSignIn}
        >
          <span className="text-white text-16 font-normal">Sign In</span>
        </button>
      </div>
    </main>
  );
}
