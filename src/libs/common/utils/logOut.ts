import axios from "axios";
import { BE_API_URL } from "@/libs/common/constants/api";
export function logOut() {
  return axios
    .post(
      `${BE_API_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      },
    )
    .then((res) => res.data);
}
