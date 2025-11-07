import { useState } from 'react';
import { Canvas } from '@/components/Canvas';
import { Toolbar } from '@/components/Toolbar';
import { PageNavigation } from '@/components/PageNavigation';
import { useShapes } from '@/hooks/useShapes';
import { Tool, Page } from '@/types/shapes';

const Index = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  // Initialize with sample shapes for demo
  const [backendStorage, setBackendStorage] = useState<Page[]>([
    {
      id: crypto.randomUUID(),
      name: 'Sample Page',
      shapes: [
        {
          id: crypto.randomUUID(),
          type: 'rectangle',
          x: 100,
          y: 100,
          width: 150,
          height: 100,
          color: '#3b82f6',
          strokeWidth: 2,
          pageId: '',
        },
        {
          id: crypto.randomUUID(),
          type: 'circle',
          x: 300,
          y: 150,
          width: 80,
          height: 80,
          color: '#10b981',
          strokeWidth: 2,
          pageId: '',
        },
        {
          id: crypto.randomUUID(),
          type: 'text',
          x: 150,
          y: 250,
          content: 'Sample Text',
          fontSize: 24,
          color: '#ef4444',
          pageId: '',
        },
      ],
    },
  ]);
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
    clearCurrentPage,
    loadPages,
  } = useShapes();

  const handleSaveToBackend = () => {
    // Append current pages to backend storage
    setBackendStorage(prev => [...prev, ...JSON.parse(JSON.stringify(pages))]);
  };

  const handleLoadFromBackend = () => {
    if (backendStorage.length > 0) {
      loadPages(backendStorage);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onSave={handleSaveToBackend}
        onLoad={handleLoadFromBackend}
        onClear={clearCurrentPage}
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
