import axios from 'axios';
import { BE_API_URL } from '@/libs/common/constants/api';
import { EErrorMessage } from '../constants/error';
import { SearchUserQueryInterface } from '../interfaces/search_user_query.interface';
import {
  UserUpdateInterface,
  UserUpdatePasswordInterface,
} from '../interfaces/update-user.interface';
const BASE_URL = BE_API_URL || 'http://localhost:3000';
const customAxiosWithCredentials = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});
export const generateRefreshToken = async () => {
  try {
    axios.post(
      `${BASE_URL}/auth/refresh`,
      {},
      {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    throw error;
  }
};
customAxiosWithCredentials.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    console.log('Error', error.response);

    if (
      error.response.status === 401 &&
      error.response.data.message == EErrorMessage.TOKEN_INVALID &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          }
        );
        return customAxiosWithCredentials(originalRequest);
      } catch (refreshError) {
        console.log('Refresh error', refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export function getUser() {
  return customAxiosWithCredentials.get(`/auth/getMe`).then((res) => res.data);
}
export function searchUsers(query?: SearchUserQueryInterface) {
  if (query) {
    let searchQuery = `/users?`;
    searchQuery = query.searchTerm
      ? `${searchQuery}searchTerm=${query.searchTerm}&`
      : searchQuery;
    searchQuery = query.page
      ? `${searchQuery}page=${query.page}&`
      : searchQuery;
    searchQuery = query.sort
      ? `${searchQuery}sort=${query.sort}&`
      : searchQuery;
    searchQuery = query.isVerified
      ? `${searchQuery}isVerified=${query.isVerified}&`
      : searchQuery;
    searchQuery = query.role
      ? `${searchQuery}role_role=${query.role}&`
      : searchQuery;
    searchQuery = searchQuery.slice(0, -1);
    return customAxiosWithCredentials.get(searchQuery).then((res) => res.data);
  }
  return customAxiosWithCredentials.get(`/users`).then((res) => res.data);
}
export function deleteUser(id: string) {
  return customAxiosWithCredentials
    .delete(`/users/${id}`)
    .then((res) => res.data);
}
export function updateUser(data: UserUpdateInterface) {
  return customAxiosWithCredentials
    .patch(`/users/profile`, data)
    .then((res) => res.data);
}
export function getUserById(id: string) {
  return customAxiosWithCredentials.get(`/users/${id}`).then((res) => res.data);
}
export function updatePassword(data: UserUpdatePasswordInterface) {
  return customAxiosWithCredentials
    .patch(`/auth/password`, data)
    .then((res) => res.data);
}
