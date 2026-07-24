import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import TrainerDashboard from './components/TrainerDashboard'
import EmbedGenerator from './components/EmbedGenerator'
import TestChatbot from './components/TestChatbot'
import Navbar from './components/Navbar'

export default function App() {
  const [trainedConfig, setTrainedConfig] = useState(null)

  return (
    <div className="min-h-screen bg-ios-bg">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/train" element={<TrainerDashboard onTrained={setTrainedConfig} />} />
        <Route path="/embed" element={<EmbedGenerator config={trainedConfig} />} />
        <Route path="/test" element={<TestChatbot />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}
