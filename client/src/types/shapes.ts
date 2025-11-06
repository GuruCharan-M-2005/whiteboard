export interface Shape {
  id: string;
  type: 'rectangle' | 'circle' | 'line' | 'arrow' | 'pencil' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  color?: string;
  strokeWidth?: number;
  fontSize?: number;
  fontFamily?: string;
  content?: string;
  pageId: string;
  points?: { x: number; y: number }[]; // For pencil and line
  endX?: number; // For line and arrow
  endY?: number; // For line and arrow
}

export interface Page {
  id: string;
  name: string;
  shapes: Shape[];
}

export type Tool = 'select' | 'pencil' | 'line' | 'circle' | 'rectangle' | 'arrow' | 'text';
