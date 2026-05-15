import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useState } from 'react';
import './App.css'
import Header from './shared/components/Header'
import NavigationBar from './shared/components/NavigationBar'
import CalendarPage from './features/calendar/CalendarPage';
import HappyBankPage from './features/happyBank/page'
import AchievementPage from './features/achievement/page'
import ReportPage from './features/report/page'
import ExpensePage from './features/expense/ExpensePage'

const MainLayout = () => (
  <>
    <Header />
    <NavigationBar />
    <Outlet />
  </>
);

function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className='app_content'>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<CalendarPage />} />
            <Route path='/happybank' element={<HappyBankPage />} />
            <Route path='/record' element={<AchievementPage />} />
            <Route path='/report' element={<ReportPage />} />
          </Route>
          <Route path='/expense' element={<ExpensePage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
