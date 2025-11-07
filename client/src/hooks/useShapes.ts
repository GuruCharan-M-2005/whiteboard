import { useState, useEffect, useCallback } from 'react';
import { Shape, Page } from '@/types/shapes';

const STORAGE_KEY = 'whiteboard-pages';

export const useShapes = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string>('');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedPages = JSON.parse(stored);
      setPages(parsedPages);
      setCurrentPageId(parsedPages[0]?.id || '');
    } else {
      // Create default page
      const defaultPage: Page = {
        id: crypto.randomUUID(),
        name: 'Page 1',
        shapes: [],
      };
      setPages([defaultPage]);
      setCurrentPageId(defaultPage.id);
    }
  }, []);

  // Save to localStorage whenever pages change
  useEffect(() => {
    if (pages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    }
  }, [pages]);

  const currentPage = pages.find(p => p.id === currentPageId);
  const shapes = currentPage?.shapes || [];

  const addShape = useCallback((shape: Shape) => {
    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? { ...page, shapes: [...page.shapes, shape] }
        : page
    ));
  }, [currentPageId]);

  const updateShape = useCallback((id: string, updates: Partial<Shape>) => {
    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? {
            ...page,
            shapes: page.shapes.map(shape =>
              shape.id === id ? { ...shape, ...updates } : shape
            )
          }
        : page
    ));
  }, [currentPageId]);

  const deleteShape = useCallback((id: string) => {
    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? { ...page, shapes: page.shapes.filter(shape => shape.id !== id) }
        : page
    ));
  }, [currentPageId]);

  const addPage = useCallback(() => {
    const newPage: Page = {
      id: crypto.randomUUID(),
      name: `Page ${pages.length + 1}`,
      shapes: [],
    };
    setPages(prev => [...prev, newPage]);
    setCurrentPageId(newPage.id);
  }, [pages.length]);

  const renamePage = useCallback((id: string, name: string) => {
    setPages(prev => prev.map(page => 
      page.id === id ? { ...page, name } : page
    ));
  }, []);

  const deletePage = useCallback((id: string) => {
    if (pages.length <= 1) return; // Don't delete the last page
    
    setPages(prev => {
      const filtered = prev.filter(page => page.id !== id);
      if (currentPageId === id) {
        setCurrentPageId(filtered[0].id);
      }
      return filtered;
    });
  }, [pages.length, currentPageId]);

  const clearCurrentPage = useCallback(() => {
    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? { ...page, shapes: [] }
        : page
    ));
  }, [currentPageId]);

  const loadPages = useCallback((newPages: Page[]) => {
    setPages(newPages);
    setCurrentPageId(newPages[0]?.id || '');
  }, []);

  return {
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
  };
};
