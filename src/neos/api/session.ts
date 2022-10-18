import { BASE_URL, post, Credential } from "../common";

type LoginInput =
  | {
      ownerId: string;
      password: string;
      rememberMe?: boolean;
      secretMachineId?: string;
    }
  | {
      username: string;
      password: string;
      rememberMe?: boolean;
      secretMachineId?: string;
    }
  | {
      email: string;
      password: string;
      rememberMe?: boolean;
      secretMachineId?: string;
    };

export async function login(loginInput: LoginInput): Promise<Credential> {
  const response = await post(`${BASE_URL}api/userSessions`, loginInput);
  if (response.status !== 200) {
    throw new Error("login error");
  }
  return response.data;
}
