import { useRef, useEffect, useState, useCallback } from 'react';
import { Shape, Tool } from '@/types/shapes';
import { drawShape, isPointInShape } from '@/utils/canvasUtils';
import { ShapeControls } from './ShapeControls';

interface CanvasProps {
  shapes: Shape[];
  activeTool: Tool;
  currentPageId: string;
  onAddShape: (shape: Shape) => void;
  onUpdateShape: (id: string, updates: Partial<Shape>) => void;
  onDeleteShape: (id: string) => void;
}

export const Canvas = ({
  shapes,
  activeTool,
  currentPageId,
  onAddShape,
  onUpdateShape,
  onDeleteShape,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const selectedShape = shapes.find(s => s.id === selectedShapeId);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const handleResize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      redraw();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redraw canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'hsl(var(--grid-color))';
    ctx.lineWidth = 0.5;
    const gridSize = 20;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw all shapes
    shapes.forEach(shape => drawShape(ctx, shape));

    // Draw current shape being created
    if (currentShape) {
      drawShape(ctx, currentShape);
    }

    // Draw selection
    if (selectedShape) {
      ctx.strokeStyle = 'hsl(var(--selection-stroke))';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      if (selectedShape.type === 'rectangle' || selectedShape.type === 'circle' || selectedShape.type === 'text') {
        ctx.strokeRect(
          selectedShape.x - 5,
          selectedShape.y - 5,
          (selectedShape.width || 0) + 10,
          (selectedShape.height || 0) + 10
        );
      }
      
      ctx.setLineDash([]);
    }
  }, [shapes, currentShape, selectedShape]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'select') {
      const clickedShape = [...shapes].reverse().find(shape => 
        isPointInShape(x, y, shape)
      );
      
      if (clickedShape) {
        setSelectedShapeId(clickedShape.id);
        setDragOffset({
          x: x - clickedShape.x,
          y: y - clickedShape.y,
        });
        setIsDrawing(true);
      } else {
        setSelectedShapeId(null);
      }
    } else {
      setIsDrawing(true);
      const newShape: Shape = {
        id: crypto.randomUUID(),
        type: activeTool,
        x,
        y,
        width: 0,
        height: 0,
        color: '#000000',
        strokeWidth: 2,
        rotation: 0,
        pageId: currentPageId,
        points: activeTool === 'pencil' ? [{ x, y }] : undefined,
        endX: x,
        endY: y,
        content: activeTool === 'text' ? 'Text' : undefined,
        fontSize: 16,
        fontFamily: 'Arial',
      };
      setCurrentShape(newShape);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'select' && selectedShapeId) {
      onUpdateShape(selectedShapeId, {
        x: x - dragOffset.x,
        y: y - dragOffset.y,
      });
    } else if (currentShape) {
      if (activeTool === 'pencil') {
        setCurrentShape({
          ...currentShape,
          points: [...(currentShape.points || []), { x, y }],
        });
      } else if (activeTool === 'line' || activeTool === 'arrow') {
        setCurrentShape({
          ...currentShape,
          endX: x,
          endY: y,
        });
      } else {
        setCurrentShape({
          ...currentShape,
          width: Math.abs(x - currentShape.x),
          height: Math.abs(y - currentShape.y),
          x: Math.min(currentShape.x, x),
          y: Math.min(currentShape.y, y),
        });
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentShape && activeTool !== 'select') {
      onAddShape(currentShape);
      setCurrentShape(null);
    }
    setIsDrawing(false);
  };

  return (
    <div ref={containerRef} className="relative flex-1 bg-[hsl(var(--canvas-bg))]">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="cursor-crosshair"
      />
      
      {selectedShape && (
        <ShapeControls
          shape={selectedShape}
          onUpdate={(updates) => onUpdateShape(selectedShape.id, updates)}
          onDelete={() => {
            onDeleteShape(selectedShape.id);
            setSelectedShapeId(null);
          }}
        />
      )}
    </div>
  );
};
