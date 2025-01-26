import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ThreeBackground from './components/ThreeBackground';
import ReelSection from './components/ReelSection';
import ThemeEditor from './components/ThemeEditor';
import { GithubIcon, LinkedinIcon, InstagramIcon, YoutubeIcon, Code, Plus } from 'lucide-react';
import type { Reel, Theme } from './types/Reel';

const initialTheme: Theme = {
  primary: '#4A5D4B',
  secondary: '#F5F5DC',
  background: '#F5F5DC',
  text: '#4A5D4B'
};

const initialReels: Reel[] = [
  {
    id: 'intro',
    title: 'Welcome',
    videoUrl: '',
    content: {
      main: "Welcome to my portfolio",
      sides: [
        {
          id: 'intro-side-1',
          title: 'Quick Links',
          items: ['Portfolio', 'Projects', 'Contact'],
          timing: 2,
          position: 'right',
          width: '30%',
          animation: 'fade'
        }
      ]
    },
    timing: { start: 0 },
    icon: Code
  }
];

function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [reels, setReels] = useState(initialReels);
  const [theme, setTheme] = useState(initialTheme);

  const handleReelUpdate = (updatedReel: Reel) => {
    setReels(prev => prev.map(reel => 
      reel.id === updatedReel.id ? updatedReel : reel
    ));
  };

  const handleAddReel = () => {
    const newReel: Reel = {
      id: `reel-${Date.now()}`,
      title: 'New Reel',
      videoUrl: '',
      content: {
        main: "New Content",
        sides: []
      },
      timing: { start: 0 },
      icon: Code
    };
    setReels(prev => [...prev, newReel]);
  };

  const handleDeleteReel = (reelId: string) => {
    setReels(prev => prev.filter(reel => reel.id !== reelId));
  };

  return (
    <div 
      className="relative min-h-screen"
      style={{ 
        background: `linear-gradient(to bottom right, ${theme.background}, ${theme.primary})`,
        color: theme.text 
      }}
    >
      <ThreeBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: `${theme.secondary}CC` }}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            Portfolio
          </motion.div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: isEditMode ? theme.primary : theme.secondary,
                color: isEditMode ? theme.secondary : theme.primary
              }}
            >
              {isEditMode ? 'View Mode' : 'Edit Mode'}
            </button>
            
            {isEditMode && (
              <button
                onClick={handleAddReel}
                className="px-4 py-2 rounded flex items-center gap-2"
                style={{ backgroundColor: theme.primary, color: theme.secondary }}
              >
                <Plus className="w-4 h-4" /> Add Reel
              </button>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex space-x-6"
            >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <GithubIcon className="w-6 h-6 transition-colors" style={{ color: theme.primary }} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="w-6 h-6 transition-colors" style={{ color: theme.primary }} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <InstagramIcon className="w-6 h-6 transition-colors" style={{ color: theme.primary }} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <YoutubeIcon className="w-6 h-6 transition-colors" style={{ color: theme.primary }} />
              </a>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Theme Editor */}
      {isEditMode && <ThemeEditor theme={theme} onUpdate={setTheme} />}

      {/* Main Content */}
      <main className="container mx-auto relative z-10 py-20">
        {reels.map((reel, index) => (
          <ReelSection 
            key={reel.id} 
            reel={reel} 
            index={index}
            isEditMode={isEditMode}
            theme={theme}
            onUpdate={handleReelUpdate}
            onDelete={reels.length > 1 ? () => handleDeleteReel(reel.id) : undefined}
          />
        ))}
      </main>
    </div>
  );
}

export default App;