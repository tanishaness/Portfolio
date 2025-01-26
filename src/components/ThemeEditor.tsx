import React from 'react';
import type { Theme } from '../types/Reel';

interface ThemeEditorProps {
  theme: Theme;
  onUpdate: (theme: Theme) => void;
}

export default function ThemeEditor({ theme, onUpdate }: ThemeEditorProps) {
  return (
    <div className="fixed right-4 top-20 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-xl z-50">
      <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Primary Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={theme.primary}
              onChange={(e) => onUpdate({ ...theme, primary: e.target.value })}
              className="w-8 h-8 rounded"
            />
            <input
              type="text"
              value={theme.primary}
              onChange={(e) => onUpdate({ ...theme, primary: e.target.value })}
              className="flex-1 px-2 py-1 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Secondary Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={theme.secondary}
              onChange={(e) => onUpdate({ ...theme, secondary: e.target.value })}
              className="w-8 h-8 rounded"
            />
            <input
              type="text"
              value={theme.secondary}
              onChange={(e) => onUpdate({ ...theme, secondary: e.target.value })}
              className="flex-1 px-2 py-1 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Background Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={theme.background}
              onChange={(e) => onUpdate({ ...theme, background: e.target.value })}
              className="w-8 h-8 rounded"
            />
            <input
              type="text"
              value={theme.background}
              onChange={(e) => onUpdate({ ...theme, background: e.target.value })}
              className="flex-1 px-2 py-1 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={theme.text}
              onChange={(e) => onUpdate({ ...theme, text: e.target.value })}
              className="w-8 h-8 rounded"
            />
            <input
              type="text"
              value={theme.text}
              onChange={(e) => onUpdate({ ...theme, text: e.target.value })}
              className="flex-1 px-2 py-1 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}