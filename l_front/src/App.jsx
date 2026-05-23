import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import './App.css'
import Header from './shared/components/Header'
import NavigationBar from './shared/components/NavigationBar'
import CalendarPage from './features/calendar/CalendarPage';
import HappyBankPage from './features/happyBank/page'
import AchievementPage from './features/achievement/page'
import ReportPage from './features/report/page'
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
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

  return (
    <div className='app_content'>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            {/*<Route path="/" element={<Navigate to={`/calendar/${currentYear}/${currentMonth}`} replace />} />*/}
            <Route path="/calendar" element={<Navigate to={`/calendar/${currentYear}/${currentMonth}`} replace />} />
            <Route path="/calendar/:year/:month" element={<CalendarPage />} />

            <Route path='/happybank' element={<HappyBankPage />} />
            <Route path='/happybank/setup' element={<HappyBankPage />} />
            <Route path='/happybank/:accountId' element={<HappyBankPage />} />
            <Route path='/happybank/:accountId/edit' element={<HappyBankPage />} />
            <Route path='/happybank/:accountId/deposit' element={<HappyBankPage />} />
            <Route path='/happybank/:accountId/withdraw' element={<HappyBankPage />} />

            <Route path='/record' element={<AchievementPage />} />
            <Route path='/record/:accountId' element={<AchievementPage />} />

            <Route path='/report' element={<ReportPage />} />
          </Route>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/oauth/callback/kakao' element={<LoginCallbackPage />} />
          <Route path='/expense' element={<ExpensePage />} />
          <Route path="/expense/:id" element={<ExpensePage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
