import { DivideIcon as LucideIcon } from 'lucide-react';

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface SideContent {
  id: string;
  title: string;
  items: string[];
  timing: number;
  position: 'left' | 'right';
  width: string;
  animation?: 'fade' | 'slide' | 'bounce';
}

export interface Reel {
  id: string;
  title: string;
  videoUrl: string;
  content: {
    main: string;
    sides: SideContent[];
  };
  timing: {
    start: number;
    duration?: number;
  };
  icon: LucideIcon;
}