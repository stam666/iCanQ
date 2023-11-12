"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  callbackUrl?: string;
};
export default function LoginPage(props: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
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
        redirect: false,
        callbackUrl: props.callbackUrl ?? "/",
      }).then((value) => {
        if (value && value?.ok) {
          window.location.href = "/";
        } else {
          toast.error("Invalid Username/Email Address or Password.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const linkToSignUp = React.useMemo(() => {
    const handleLinkToSignUp = () => {
      try {
        router.push("/signup");
      } catch (error) {
        console.error(error);
      }
    };
    return (
      <span
        className="text-blue text-sm font-normal underline underline-offset-1 hover:cursor-pointer"
        onClick={handleLinkToSignUp}
      >
        Sign Up
      </span>
    );
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-white space-y-8">
      <div className="w-full flex flex-col items-center gap-12 p-16 pb-14 font-normal text-white bg-primary rounded-b-3xl">
        <div className="text-center">Sign in</div>
        <div className="text-center text-4xl">Welcome Back!</div>
      </div>
      <div className="flex pt-8 px-8 flex-col items-center gap-8 self-stretch">
        <form className="flex flex-col items-start gap-4 self-stretch">
          <input
            autoComplete="username"
            type="text"
            placeholder="Username/Email Address"
            value={username}
            onChange={handleUsernameChange}
            className="text-white-dark-hover p-4 items-start gap-2 self-stretch rounded-2xl border border-white-normal-hover bg-white"
          />
          <input
            autoComplete="current-password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="text-white-dark-hover p-4 items-start gap-2 self-stretch rounded-2xl border border-white-normal-hover bg-white"
          />
        </form>
        <button
          className="p-4 justify-center self-stretch rounded-2xl bg-primary"
          onClick={handleSignIn}
        >
          <span className="text-white text-16 font-normal">Sign In</span>
        </button>
        <span className="text-normal text-xs font-normal">
          {"Don't have an account"} {linkToSignUp}
        </span>
      </div>
    </main>
  );
}
