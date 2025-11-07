import { useState } from 'react';
import { Canvas } from '@/components/Canvas';
import { Toolbar } from '@/components/Toolbar';
import { PageNavigation } from '@/components/PageNavigation';
import { useShapes } from '@/hooks/useShapes';
import { Tool, Page } from '@/types/shapes';

const Index = () => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [backendStorage, setBackendStorage] = useState<Page[]>([]);
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
    setBackendStorage(JSON.parse(JSON.stringify(pages)));
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
