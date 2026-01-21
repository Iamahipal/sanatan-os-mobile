import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import TempleDetail from './pages/TempleDetail';
import { AudioProvider } from './context/AudioContext';
import AudioDock from './components/audio/AudioDock';
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();

  return (
    <AudioProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="temples/:id" element={<TempleDetail />} />
            {/* Placeholders for future routes */}
            <Route path="temples" element={<Navigate to="/" replace />} />
            <Route path="saved" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <AudioDock />
    </AudioProvider>
  );
}

export default App;
