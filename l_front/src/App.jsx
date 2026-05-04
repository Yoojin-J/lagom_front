import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router";
import './App.css'
import Header from './shared/components/Header'
import NavigationBar from './shared/components/NavigationBar'
import HappyBankPage from './features/happyBank/page'
import ExpensePage from './features/expense/ExpensePage'

function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className='app_content'>
      <Header />
      <NavigationBar activeIndex={activeTab} onTabChange={setActiveTab} />
      {activeTab === 1 && <HappyBankPage />}
      <Router>
        <Routes>
          <Route path='/expense' element={<ExpensePage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
