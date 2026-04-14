import { useState } from 'react'
import './App.css'
import Header from './shared/components/Header'
import NavigationBar from './shared/components/NavigationBar'
import HappyBankPage from './features/happyBank/page'

function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className='app_content'>
      <Header />
      <NavigationBar activeIndex={activeTab} onTabChange={setActiveTab} />
      {activeTab === 1 && <HappyBankPage />}
    </div>
  )
}

export default App
