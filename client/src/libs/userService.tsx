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

const authService = { login };
export default authService;
