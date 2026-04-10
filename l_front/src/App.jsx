import { useState } from 'react'
import './App.css'
import Header from './shared/components/Header'
import NavigationBar from './shared/components/NavigationBar'

function App() {

  return (
    <div className='app_content'>
      <Header />
      <NavigationBar />
    </div>
  )
}

export default App
