import { Shape } from '@/types/shapes';

export const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
  ctx.save();
  
  const centerX = shape.x + (shape.width || 0) / 2;
  const centerY = shape.y + (shape.height || 0) / 2;
  
  if (shape.rotation) {
    ctx.translate(centerX, centerY);
    ctx.rotate((shape.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  }

  ctx.strokeStyle = shape.color || '#000000';
  ctx.fillStyle = shape.color || '#000000';
  ctx.lineWidth = shape.strokeWidth || 2;

  switch (shape.type) {
    case 'rectangle':
      ctx.strokeRect(shape.x, shape.y, shape.width || 0, shape.height || 0);
      break;
      
    case 'circle':
      ctx.beginPath();
      const radius = (shape.width || 0) / 2;
      ctx.arc(shape.x + radius, shape.y + radius, radius, 0, Math.PI * 2);
      ctx.stroke();
      break;
      
    case 'line':
      ctx.beginPath();
      ctx.moveTo(shape.x, shape.y);
      ctx.lineTo(shape.endX || shape.x, shape.endY || shape.y);
      ctx.stroke();
      break;
      
    case 'arrow':
      drawArrow(ctx, shape.x, shape.y, shape.endX || shape.x, shape.endY || shape.y);
      break;
      
    case 'pencil':
      if (shape.points && shape.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.stroke();
      }
      break;
      
    case 'text':
      ctx.font = `${shape.fontSize || 16}px ${shape.fontFamily || 'Arial'}`;
      ctx.fillText(shape.content || '', shape.x, shape.y);
      break;
  }

  ctx.restore();
};

const drawArrow = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
  const headLength = 15;
  const angle = Math.atan2(y2 - y1, x2 - x1);

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLength * Math.cos(angle - Math.PI / 6),
    y2 - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLength * Math.cos(angle + Math.PI / 6),
    y2 - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
};

export const isPointInShape = (x: number, y: number, shape: Shape): boolean => {
  switch (shape.type) {
    case 'rectangle':
      return (
        x >= shape.x &&
        x <= shape.x + (shape.width || 0) &&
        y >= shape.y &&
        y <= shape.y + (shape.height || 0)
      );
      
    case 'circle':
      const radius = (shape.width || 0) / 2;
      const centerX = shape.x + radius;
      const centerY = shape.y + radius;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      return distance <= radius;
      
    case 'line':
    case 'arrow':
      const distToLine = pointToLineDistance(
        x, y,
        shape.x, shape.y,
        shape.endX || shape.x, shape.endY || shape.y
      );
      return distToLine < 10;
      
    case 'pencil':
      if (!shape.points || shape.points.length === 0) return false;
      return shape.points.some(point => {
        const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
        return dist < 10;
      });
      
    case 'text':
      return (
        x >= shape.x &&
        x <= shape.x + 200 &&
        y >= shape.y - (shape.fontSize || 16) &&
        y <= shape.y
      );
      
    default:
      return false;
  }
};

const pointToLineDistance = (
  px: number, py: number,
  x1: number, y1: number,
  x2: number, y2: number
): number => {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  
  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
};
