import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

const LoginCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 현재 URL의 쿼리 스트링에서 'code' 값 추출
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      // 2. 백엔드에게 인가 코드 전달
      axios.get('http://localhost:8080/auth/kakao', { code })
        .then((response) => {
          // 3. 백엔드가 준 JWT 토큰 받기 (구조는 백엔드 설계에 따라 다름)
          const { token } = response.data;

          // 4. 토큰 저장 (예시: LocalStorage)
          localStorage.setItem('token', token);

          // 5. 로그인 완료 후 메인이나 대시보드로 리다이렉트
          navigate('/main');
        })
        .catch((error) => {
          console.error('카카오 로그인 실패:', error);
          alert('로그인에 실패했습니다.');
          navigate('/login');
        });
    } else {
      console.error('인가 코드가 URL에 없습니다.');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>로딩중</div>
  )
}

export default LoginCallbackPage