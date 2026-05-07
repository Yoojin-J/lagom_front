import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './App.css'
import Header from './shared/components/Header'
import NavigationBar from './shared/components/NavigationBar'
import CalendarPage from './features/calendar/CalendarPage';
import HappyBankPage from './features/happyBank/page'
import ExpensePage from './features/expense/ExpensePage'

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

  return (
    <div className='app_content'>
      {/* <Header />
      <NavigationBar activeIndex={activeTab} onTabChange={setActiveTab} />
      {activeTab === 1 && <HappyBankPage />} */}
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<CalendarPage />} />
            <Route path='/happyBank' element={<HappyBankPage />} />
          </Route>

          <Route path='/expense' element={<ExpensePage />} />
          <Route path="/expense/:id" element={<ExpensePage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
