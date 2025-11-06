import { useState } from 'react';
import { Canvas } from '@/components/Canvas';
import { Toolbar } from '@/components/Toolbar';
import { PageNavigation } from '@/components/PageNavigation';
import { useShapes } from '@/hooks/useShapes';
import { Tool } from '@/types/shapes';
import { toast } from 'sonner';

const Index = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const {
    shapes,
    addShape,
    updateShape,
    deleteShape,
    pages,
    currentPageId,
    setCurrentPageId,
    addPage,
    renamePage,
    deletePage,
  } = useShapes();

  const handleSync = () => {
    toast.info('Backend sync not implemented yet. Shapes are saved locally!');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onSync={handleSync}
      />
      
      <PageNavigation
        pages={pages}
        currentPageId={currentPageId}
        onPageChange={setCurrentPageId}
        onAddPage={addPage}
        onRenamePage={renamePage}
        onDeletePage={deletePage}
      />
      
      <Canvas
        shapes={shapes}
        activeTool={activeTool}
        currentPageId={currentPageId}
        onAddShape={addShape}
        onUpdateShape={updateShape}
        onDeleteShape={deleteShape}
      />
    </div>
  );
};

export default Index;
