"use client";

import InputText from "@/components/inputText";
import Link from "next/link";
import { useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import { useRouter } from "next/navigation";
import userService from "../../../libs/userService";
import React from "react";

type Props = {
  callbackUrl?: string;
};

export default function InformationPage(this: any, props: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isCustomer, setIsCustomer] = useState(true); // [true, false]
  const [isRestaurant, setIsRestaurant] = useState(false); // [true, false]
  const [role, setRole] = useState("customer"); // ["customer", "restaurant"
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantInfo, setRestaurantInfo] = useState("");
  const router = useRouter();

  React.useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    setEmail(localStorage.getItem("email") || "");
    setPassword(localStorage.getItem("password") || "");
  }, []);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };
  const handleSelectRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value);
    if (e.target.value === "customer") {
      setIsCustomer(true);
      setIsRestaurant(false);
    } else {
      setIsCustomer(false);
      setIsRestaurant(true);
    }
  };
  const handleRestaurantNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRestaurantName(e.target.value);
  };
  const handleRestaurantInfoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRestaurantInfo(e.target.value);
  };
  const handleSignUp = async () => {
    try {
      const signUp = await userService.signUp(
        email,
        username,
        firstName,
        lastName,
        role,
        password,
        restaurantName,
        restaurantInfo,
        true,
      );

      setFirstName("");
      setLastName("");
      setRole("customer");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      console.log(signUp);
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-white space-y-8">
      <div className="w-full flex flex-col items-center gap-12 p-16 pb-14 font-normal text-white bg-primary rounded-b-3xl">
        <div className="flex flex-row w-full">
          <div className="flex justify-start w-1/3">
            <Link href="/signup" className="">
              <ArrowBackIosNewIcon />
            </Link>
          </div>
          <div className="w-1/3 text-center">Sign Up</div>
        </div>

        <div className="text-center text-4xl">Information Detail</div>
      </div>
      <div className="flex pt-8 px-8 flex-col items-center gap-8 self-stretch">
        <div className="flex flex-col items-start gap-4 self-stretch">
          <InputText
            placeholder={"First Name"}
            value={firstName}
            onChange={handleFirstNameChange}
          />
          <InputText
            placeholder={"Last Name"}
            value={lastName}
            onChange={handleLastNameChange}
          />
          <div>
            <span>Select role</span>
          </div>
          <div className="flex justify-center ">
            <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
              <input
                name="role-customer"
                type="radio"
                className="relative float-left -ml-[1.5rem] mr-1 mt-0 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                value={"customer"}
                onChange={handleSelectRole}
                checked={isCustomer}
              />
              <label className="mt-px mb-0.5 inline-block pl-[0.15rem] hover:cursor-pointer">
                Customer
              </label>
            </div>
            <div className="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
              <input
                name="role-restaurant"
                type="radio"
                className="relative float-left -ml-[1.5rem] mr-1 mt-0  h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                value={"restaurant"}
                onChange={handleSelectRole}
                checked={isRestaurant}
              />
              <label className="mt-px mb-0.5 inline-block pl-[0.15rem] hover:cursor-pointer">
                Restaurant
              </label>
            </div>
          </div>
          {isRestaurant && !isCustomer && (
            <div className="flex flex-col w-full space-y-4">
              <InputText
                placeholder={"Restaurant Name"}
                value={restaurantName}
                onChange={handleRestaurantNameChange}
              />
              <InputText
                placeholder={"Restaurant Info"}
                value={restaurantInfo}
                onChange={handleRestaurantInfoChange}
              />
            </div>
          )}
          <button
            className="p-4 justify-center self-stretch rounded-2xl bg-primary"
            onClick={handleSignUp}
          >
            <span className="text-white text-16 font-normal">Sign Up</span>
          </button>
        </div>
      </div>
    </main>
  );
}
