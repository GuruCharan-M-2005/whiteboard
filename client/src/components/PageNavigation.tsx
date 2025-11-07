import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Edit2, Check } from 'lucide-react';
import { Page } from '@/types/shapes';

interface PageNavigationProps {
  pages: Page[];
  currentPageId: string;
  onPageChange: (id: string) => void;
  onAddPage: () => void;
  onRenamePage: (id: string, name: string) => void;
  onDeletePage: (id: string) => void;
}

export const PageNavigation = ({
  pages,
  currentPageId,
  onPageChange,
  onAddPage,
  onRenamePage,
  onDeletePage,
}: PageNavigationProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEdit = (page: Page) => {
    setEditingId(page.id);
    setEditName(page.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onRenamePage(editingId, editName.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-card border-b border-border overflow-x-auto">
      {pages.map((page) => (
        <div
          key={page.id}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
            currentPageId === page.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80'
          }`}
        >
          {editingId === page.id ? (
            <div className="flex items-center gap-1">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                className="h-6 w-24 px-2 text-sm"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={saveEdit}
              >
                <Check className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onPageChange(page.id)}
                className="text-sm font-medium"
              >
                {page.name}
              </button>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                onClick={() => startEdit(page)}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              {pages.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                  onClick={() => onDeletePage(page.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </>
          )}
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onAddPage}
        className="h-8 w-8 p-0"
        title="Add Page"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
