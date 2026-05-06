import { useEffect, useRef, useState } from 'react';
import '../styles/NavigationBar.css';

const NavigationBar = ({ onTabChange, initialTab = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(initialTab);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef([]);

  const menuItems = ['감정가계부', '행복통장', '리포트', '성취기록'];

  const handleClick = (index) => {
    setActiveIndex(index);
    onTabChange?.(index);
  };

  useEffect(() => {
    const tab = tabRefs.current[activeIndex];
    if (tab) {
      setIndicatorStyle({
        left: tab.offsetLeft,
        width: tab.offsetWidth,
      });
    }
  }, [activeIndex]);

  return (
    <div className="menu">
      <div className="menu__indicator" style={indicatorStyle} />
      {menuItems.map((item, index) => (
        <div
          key={index}
          ref={(el) => (tabRefs.current[index] = el)}
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
