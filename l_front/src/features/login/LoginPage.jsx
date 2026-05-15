import React from 'react'
import './styles/LoginPage.css';
import kakaoBtn from './styles/KakaoLogin.png';
import KakaoIcon from '../../assets/icons/login/Kakao';

const LoginPage = () => {
  return (
    <div className='login-background'>
      <div className='login-container'>
        <div className='login-text'>
          <div className='login-img' />
          <div className='text1'>로그인</div>
          <div className='text2'>소셜로그인으로 간편하게 시작하세요</div>
        </div>
        <div className='login-kakao'>
          <div className='login-content'>
            <div className='icon'>
              <KakaoIcon />
            </div>
            <div className='text'>
              카카오 로그인
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage