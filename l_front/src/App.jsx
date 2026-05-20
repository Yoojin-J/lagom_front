import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import './App.css'
import Header from './shared/components/Header'
import NavigationBar from './shared/components/NavigationBar'
import CalendarPage from './features/calendar/CalendarPage';
import HappyBankPage from './features/happyBank/page'
import ExpensePage from './features/expense/ExpensePage'
import LoginPage from './features/login/LoginPage';
import LoginCallbackPage from './features/login/LoginCallbackPage';

// Header, NavigationBar 가 필요한 화면 
const MainLayout = () => (
  <>
    <Header />
    <NavigationBar />
    <Outlet /> {/* 이 자리에 자식 컴포넌트들이 렌더링됨 */}
  </>
);

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

  return (
    <div className='app_content'>
      {/* <Header />
      <NavigationBar activeIndex={activeTab} onTabChange={setActiveTab} />
      {activeTab === 1 && <HappyBankPage />} */}
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to={`/calendar/${currentYear}/${currentMonth}`} replace />} />
            <Route path="/calendar/:year/:month" element={<CalendarPage />} />
            {/* <Route path="/" element={<CalendarPage />} /> */}
            <Route path='/happyBank' element={<HappyBankPage />} />
          </Route>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/auth/kakao' element={<LoginCallbackPage />} />
          <Route path='/expense' element={<ExpensePage />} />
          <Route path='/expense/:id' element={<ExpensePage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
