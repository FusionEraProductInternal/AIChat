import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import TrainerDashboard from './components/TrainerDashboard'
import EmbedGenerator from './components/EmbedGenerator'
import TestChatbot from './components/TestChatbot'
import Navbar from './components/Navbar'

// Load saved config from localStorage on startup
function loadSavedConfig() {
  try {
    const saved = localStorage.getItem('tf-trained-config')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export default function App() {
  const [trainedConfig, setTrainedConfig] = useState(loadSavedConfig)

  const handleTrained = (config) => {
    setTrainedConfig(config)
    try {
      if (config) {
        localStorage.setItem('tf-trained-config', JSON.stringify(config))
      } else {
        localStorage.removeItem('tf-trained-config')
      }
    } catch {}
  }

  return (
    <div className="min-h-screen bg-ios-bg">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/train" element={<TrainerDashboard onTrained={handleTrained} />} />
        <Route path="/embed" element={<EmbedGenerator config={trainedConfig} />} />
        <Route path="/test" element={<TestChatbot trainingData={trainedConfig?.trainingData} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}
