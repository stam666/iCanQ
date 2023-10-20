import axios from "axios";

async function login(email: string, password: string) {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_API_URL + "/users/auth/login",
    {
      email,
      password,
    },
    {
        withCredentials: true,
    }
  );

  if (!res) {
    throw new Error("Failed to login");
  }

  return await res.data.data;
}

const authService = { login };
export default authService;
