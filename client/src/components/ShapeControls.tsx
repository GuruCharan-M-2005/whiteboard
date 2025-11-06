import { useState } from 'react';
import { Shape } from '@/types/shapes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, RotateCw } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ShapeControlsProps {
  shape: Shape;
  onUpdate: (updates: Partial<Shape>) => void;
  onDelete: () => void;
}

export const ShapeControls = ({ shape, onUpdate, onDelete }: ShapeControlsProps) => {
  const [color, setColor] = useState(shape.color || '#000000');
  const [rotation, setRotation] = useState(shape.rotation || 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className="absolute w-2 h-2 bg-primary rounded-full cursor-pointer"
          style={{
            left: shape.x + (shape.width || 0) + 10,
            top: shape.y,
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  onUpdate({ color: e.target.value });
                }}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  onUpdate({ color: e.target.value });
                }}
                className="flex-1"
              />
            </div>
          </div>

          {shape.type !== 'pencil' && (
            <div className="space-y-2">
              <Label>Rotation (degrees)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={rotation}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setRotation(val);
                    onUpdate({ rotation: val });
                  }}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newRotation = (rotation + 45) % 360;
                    setRotation(newRotation);
                    onUpdate({ rotation: newRotation });
                  }}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {shape.type === 'text' && (
            <>
              <div className="space-y-2">
                <Label>Text Content</Label>
                <Input
                  value={shape.content || ''}
                  onChange={(e) => onUpdate({ content: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Input
                  type="number"
                  value={shape.fontSize || 16}
                  onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
                />
              </div>
            </>
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="w-full gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Shape
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
