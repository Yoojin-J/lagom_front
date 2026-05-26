import React from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className='Header'>
      <div className='logo'>
        logo
      </div>
      <div className='setting' onClick={() => navigate('/setting')} style={{ cursor: 'pointer' }}>
        설정
      </div>
    </div>
  )
}

export default Header