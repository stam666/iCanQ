import axios from "axios";

async function login(input: string, password: string) {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "/users/auth/login",
    {
      input,
      password,
    },
  );

  if (!res) {
    throw new Error("Failed to login");
  }

  return await res.data;
}

async function signUp(
  email: string,
  userName: string,
  firstName: string,
  lastName: string,
  role: string,
  password: string,
  restaurantName?: string,
  restaurantInfo?: string,
  openStatus?: boolean,
) {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "/users/auth/register",
    {
      email,
      userName,
      firstName,
      lastName,
      role,
      password,
      restaurantName,
      restaurantInfo,
      openStatus,
    },
  );
  if (!res) {
    throw new Error("Failed to sign up");
  }
  return await res.data;
}

const authService = { login, signUp };
export default authService;
