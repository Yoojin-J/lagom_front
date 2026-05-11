import '../styles/NavigationBar.css';
import { NavLink } from 'react-router-dom';

const menuItems = ['감정가계부', '행복통장', '리포트', '성취기록'];

/**
 * @param {number} activeIndex - 현재 활성 탭 인덱스
 * @param {Function} onTabChange - 탭 변경 핸들러
 */
const NavigationBar = ({ activeIndex, onTabChange }) => {
  return (
    // <div className="menu">
    //   {menuItems.map((item, index) => (
    //     <div
    //       key={index}
    //       className={`menu-item ${activeIndex === index ? 'active' : ''}`}
    //       onClick={() => onTabChange(index)}
    //     >
    //       {item}
    //     </div>
    //   ))}
    // </div>

    <div className='menu'>
      <NavLink to="/calendar" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
        감정가계부
      </NavLink>
      <NavLink to="/happyBank" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
        행복통장
      </NavLink>
      <NavLink to="/report" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>리포트</NavLink>
      <NavLink to="/record" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>성취기록</NavLink>
    </div>
  );
};

export default NavigationBar;
