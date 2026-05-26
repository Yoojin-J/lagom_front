import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const getHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// PATCH /users/me/nickname - 닉네임 수정
export const updateNickname = async (nickname) => {
  const { data } = await axios.patch(
    `${BASE_URL}/users/me/nickname`,
    { nickname },
    { headers: getHeader() }
  );
  return data;
};

// 로그아웃 - 프론트에서 토큰 삭제
export const logout = () => {
  localStorage.removeItem('token');
};

// DELETE /users/me - 회원 탈퇴
export const deleteAccount = async () => {
  await axios.delete(`${BASE_URL}/users/me`, { headers: getHeader() });
  localStorage.removeItem('token');
};
