"use client";

import React, { createContext } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputText from "@/components/inputText";

export const userContext = createContext({
  username: "",
  email: "",
  password: "",
});

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    console.log(username);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const linkToSignIn = React.useMemo(() => {
    const handleLinkToSignIn = () => {
      try {
        router.push("/login");
      } catch (error) {
        console.error(error);
      }
    };
    return (
      <span
        className="text-blue text-sm font-normal underline underline-offset-1"
        onClick={handleLinkToSignIn}
      >
        Sign in
      </span>
    );
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-white space-y-8">
      <div className="w-full flex flex-col items-center gap-12 p-16 pb-14 font-normal text-white bg-primary rounded-b-3xl">
        <div className="text-center">Sign Up</div>
        <div className="text-center text-4xl">Create Account</div>
      </div>
      <div className="flex pt-8 px-8 flex-col items-center gap-8 self-stretch">
        <div className="flex flex-col items-start gap-4 self-stretch">
          <InputText
            placeholder={"Username"}
            value={username}
            onChange={handleUsernameChange}
          />
          <InputText
            placeholder={"Email"}
            value={email}
            onChange={handleEmailChange}
          />
          <InputText
            placeholder={"Password"}
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <userContext.Provider value={{ username, email, password }}>
          <Link
            href="/signup/information"
            className="p-4 justify-center self-stretch rounded-2xl bg-white border-2 border-primary text-center"
          >
            <span className="text-primary text-16 font-normal">Next</span>
          </Link>
        </userContext.Provider>
        <span className="text-normal text-xs font-normal">
          Already have an account {linkToSignIn}
        </span>
      </div>
    </main>
  );
}
