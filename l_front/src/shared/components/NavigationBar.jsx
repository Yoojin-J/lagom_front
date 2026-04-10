import React, { useState } from 'react';
import '../styles/NavigationBar.css';

const NavigationBar = () => {
  // 현재 활성화된 메뉴를 관리하는 state
  const [activeIndex, setActiveIndex] = useState(0); // 처음에 첫 번째 메뉴(0번)가 active

  const menuItems = [
    '감정가계부',
    '행복통장',
    '리포트',
    '성취기록'
  ];

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="menu">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`menu-item ${activeIndex === index ? 'active' : ''}`}
          onClick={() => handleClick(index)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default NavigationBar;