import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tool } from '@/types/shapes';
import {
  MousePointer2,
  Pencil,
  Minus,
  Circle,
  Square,
  ArrowRight,
  Type,
  Download,
  Upload,
  Trash2,
} from 'lucide-react';

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
}

export const Toolbar = ({ activeTool, onToolChange, onSave, onLoad, onClear }: ToolbarProps) => {
  const tools = [
    { id: 'select' as Tool, icon: MousePointer2, label: 'Select' },
    { id: 'pencil' as Tool, icon: Pencil, label: 'Pencil' },
    { id: 'line' as Tool, icon: Minus, label: 'Line' },
    { id: 'circle' as Tool, icon: Circle, label: 'Circle' },
    { id: 'rectangle' as Tool, icon: Square, label: 'Rectangle' },
    { id: 'arrow' as Tool, icon: ArrowRight, label: 'Arrow' },
    { id: 'text' as Tool, icon: Type, label: 'Text' },
  ];

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border">
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={activeTool === tool.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onToolChange(tool.id)}
            className="h-9 w-9"
            title={tool.label}
          >
            <tool.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      
      <Separator orientation="vertical" className="h-6 mx-2" />
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onSave} className="gap-2">
          <Upload className="h-4 w-4" />
          Save to Backend
        </Button>
        <Button variant="outline" size="sm" onClick={onLoad} className="gap-2">
          <Download className="h-4 w-4" />
          Load from Backend
        </Button>
        <Button variant="outline" size="sm" onClick={onClear} className="gap-2">
          <Trash2 className="h-4 w-4" />
          Clear Canvas
        </Button>
      </div>
    </div>
  );
};
