import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState } from 'react';
import type { Reel, SideContent, Theme } from '../types/Reel';
import { Settings2, Plus, Trash2, Clock } from 'lucide-react';

interface ReelSectionProps {
  reel: Reel;
  index: number;
  isEditMode: boolean;
  theme: Theme;
  onUpdate: (updatedReel: Reel) => void;
  onDelete?: () => void;
}

export default function ReelSection({ reel, index, isEditMode, theme, onUpdate, onDelete }: ReelSectionProps) {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [visibleSideContent, setVisibleSideContent] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (videoRef.current && inView) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, [inView]);

  useEffect(() => {
    if (inView && videoRef.current && !isEditMode) {
      const timers: NodeJS.Timeout[] = [];
      setVisibleSideContent([]);

      reel.content.sides.forEach(side => {
        const timer = setTimeout(() => {
          setVisibleSideContent(prev => [...prev, side.id]);
        }, side.timing * 1000);
        timers.push(timer);
      });

      const timeUpdateHandler = () => {
        if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime);
        }
      };

      videoRef.current.addEventListener('timeupdate', timeUpdateHandler);

      return () => {
        timers.forEach(timer => clearTimeout(timer));
        setVisibleSideContent([]);
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', timeUpdateHandler);
        }
      };
    }
  }, [inView, reel.content.sides, isEditMode]);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdate({
        ...reel,
        videoUrl: url
      });
    }
  };

  const handleAddSideContent = () => {
    const newSide: SideContent = {
      id: `side-${Date.now()}`,
      title: 'New Section',
      items: ['New Item'],
      timing: currentTime,
      position: 'right',
      width: '30%',
      animation: 'fade'
    };
    onUpdate({
      ...reel,
      content: {
        ...reel.content,
        sides: [...reel.content.sides, newSide]
      }
    });
  };

  const handleUpdateSideContent = (sideId: string, updates: Partial<SideContent>) => {
    onUpdate({
      ...reel,
      content: {
        ...reel.content,
        sides: reel.content.sides.map(side => 
          side.id === sideId ? { ...side, ...updates } : side
        )
      }
    });
  };

  const handleDeleteSideContent = (sideId: string) => {
    onUpdate({
      ...reel,
      content: {
        ...reel.content,
        sides: reel.content.sides.filter(side => side.id !== sideId)
      }
    });
  };

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[100vh] w-full relative"
      style={{ backgroundColor: theme.background }}
    >
      {/* Video Timer (Edit Mode) */}
      {isEditMode && (
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full z-20">
          <Clock className="inline-block w-4 h-4 mr-2" />
          {currentTime.toFixed(2)}s
        </div>
      )}

      {/* Main Content with Video */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[315px] h-[560px] bg-black rounded-lg overflow-hidden relative">
          {isEditMode && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-white z-10"
            >
              Click to Upload Video
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
          />
          {reel.videoUrl ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              loop
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
            >
              <source src={reel.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              No video uploaded
            </div>
          )}
        </div>
      </div>

      {/* Side Content */}
      {reel.content.sides.map((side) => (
        <motion.div
          key={side.id}
          initial={{ opacity: 0, x: side.position === 'left' ? -50 : 50 }}
          animate={isEditMode || visibleSideContent.includes(side.id) 
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: side.position === 'left' ? -50 : 50 }
          }
          style={{
            position: 'absolute',
            [side.position]: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: side.width,
            backgroundColor: theme.secondary,
            color: theme.text
          }}
          className="p-6 rounded-lg shadow-xl backdrop-blur-sm"
        >
          {isEditMode ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={side.title}
                  onChange={(e) => handleUpdateSideContent(side.id, { title: e.target.value })}
                  className="w-full p-2 rounded border"
                />
                <button
                  onClick={() => handleDeleteSideContent(side.id)}
                  className="ml-2 p-2 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm mb-1">Timing (seconds)</label>
                  <input
                    type="number"
                    value={side.timing}
                    onChange={(e) => handleUpdateSideContent(side.id, { timing: Number(e.target.value) })}
                    className="w-full p-2 rounded border"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Position</label>
                  <select
                    value={side.position}
                    onChange={(e) => handleUpdateSideContent(side.id, { 
                      position: e.target.value as 'left' | 'right'
                    })}
                    className="w-full p-2 rounded border"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Width</label>
                  <input
                    type="text"
                    value={side.width}
                    onChange={(e) => handleUpdateSideContent(side.id, { width: e.target.value })}
                    className="w-full p-2 rounded border"
                    placeholder="30%"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Animation</label>
                  <select
                    value={side.animation}
                    onChange={(e) => handleUpdateSideContent(side.id, { 
                      animation: e.target.value as 'fade' | 'slide' | 'bounce'
                    })}
                    className="w-full p-2 rounded border"
                  >
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="bounce">Bounce</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Content Items</label>
                {side.items.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...side.items];
                        newItems[i] = e.target.value;
                        handleUpdateSideContent(side.id, { items: newItems });
                      }}
                      className="flex-1 p-2 rounded border"
                    />
                    <button
                      onClick={() => {
                        const newItems = side.items.filter((_, index) => index !== i);
                        handleUpdateSideContent(side.id, { items: newItems });
                      }}
                      className="p-2 text-red-500 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    handleUpdateSideContent(side.id, { 
                      items: [...side.items, 'New Item'] 
                    });
                  }}
                  className="w-full p-2 bg-gray-100 rounded flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-semibold mb-4">{side.title}</h3>
              <ul className="space-y-3">
                {side.items.map((item, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-current rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </motion.div>
      ))}

      {/* Edit Mode Controls */}
      {isEditMode && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          )}
          <button
            onClick={handleAddSideContent}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}
    </motion.section>
  );
}