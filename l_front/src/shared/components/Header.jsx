import React from 'react'
import { useNavigate } from 'react-router-dom';
import Settings from '../../assets/icons/common/Settings';
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className='Header'>
      <div className='logo'>
        logo
      </div>
      <div className='setting' onClick={() => navigate('/setting')} style={{ cursor: 'pointer' }}>
        <Settings />
      </div>
    </div>
  )
}

export default Header