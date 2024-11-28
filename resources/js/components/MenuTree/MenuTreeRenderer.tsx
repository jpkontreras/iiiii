import { Button } from '@/components/ui/button';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ChevronRight, Component, Folder, PlusCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { TreeItem, TreeItemRenderContext } from 'react-complex-tree';
import { QuickAddForm } from '../MenuItems/QuickAddForm';

interface RenderItemArrowProps {
  context: TreeItemRenderContext<never>;
  isFolder: boolean;
}

interface RenderItemContentProps {
  title: React.ReactNode;
  isFolder: boolean;
  onAddClick?: () => void;
}

interface MenuTreeRendererProps {
  item: TreeItem<string>;
  depth: number;
  children: React.ReactNode;
  title: React.ReactNode;
  context: TreeItemRenderContext<never>;
  addingToCategory: string | null;
  setAddingToCategory: (id: string | null) => void;
  handleQuickAdd: (
    parentId: string,
    data: { name: string; price: number },
  ) => void;
}

function RenderItemArrow({ context, isFolder }: RenderItemArrowProps) {
  if (!isFolder) {
    return <span className="ml-4" />;
  }

  return (
    <span
      {...context.arrowProps}
      className={cn(
        'flex size-4 items-center justify-center text-muted-foreground transition-transform duration-200',
        context.isExpanded && 'rotate-90',
      )}
    >
      <ChevronRight className="size-3" />
    </span>
  );
}

function RenderItemContent({
  title,
  isFolder,
  onAddClick,
}: RenderItemContentProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex w-full items-center gap-2">
      {isFolder ? (
        <Folder className="size-4 shrink-0 text-muted-foreground" />
      ) : (
        <Component className="size-4 shrink-0 text-muted-foreground" />
      )}
      <div className="flex flex-1 items-center gap-x-1">
        <span className="flex-1 truncate">{title}</span>
        {isFolder && (
          <Button
            ref={buttonRef}
            variant="ghost"
            size="icon"
            className="size-7 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onAddClick?.();
            }}
            data-add-button
          >
            <PlusCircle className="size-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function MenuTreeRenderer({
  item,
  depth,
  children,
  title,
  context,
  addingToCategory,
  setAddingToCategory,
  handleQuickAdd,
}: MenuTreeRendererProps) {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!addingToCategory) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      // Don't close if clicking the add button or the form
      if (
        target.closest('[data-add-button]') ||
        (formRef.current && formRef.current.contains(target))
      ) {
        return;
      }

      setAddingToCategory(null);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAddingToCategory(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [addingToCategory, setAddingToCategory]);

  // Hide form on selection change
  useEffect(() => {
    if (context.isSelected) {
      setAddingToCategory(null);
    }
  }, [context.isSelected, setAddingToCategory]);

  if (item.index === 'root') return <>{children}</>;

  const itemId = item.index.toString();
  const isAddingHere = addingToCategory === itemId;
  const isSibling = false;

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          {...context.itemContainerWithoutChildrenProps}
          {...context.interactiveElementProps}
          type="button"
          size="default"
          isActive={context.isSelected}
          className={cn(
            'group relative',
            context.isDraggingOver && 'bg-sidebar-accent/50',
            isSibling && 'mb-1',
            isAddingHere && 'mb-2',
          )}
          style={{
            paddingLeft: depth > 0 ? `${depth * 12}px` : undefined,
          }}
        >
          <div className="flex items-center gap-2">
            <RenderItemArrow context={context} isFolder={!!item.isFolder} />
            <RenderItemContent
              title={title}
              isFolder={!!item.isFolder}
              onAddClick={() => {
                if (item.isFolder && !context.isExpanded) {
                  context.expandItem?.();
                }
                setAddingToCategory(itemId);
              }}
            />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {isAddingHere && (
        <SidebarMenuItem>
          <div
            ref={formRef}
            className={cn(
              'mb-1 rounded-sm bg-sidebar-accent',
              depth > 0 ? `ml-[${(depth + 1) * 12}px]` : 'ml-8',
            )}
          >
            <QuickAddForm
              parentId={parseInt(itemId)}
              onSubmit={(data) => handleQuickAdd(itemId, data)}
              onCancel={() => setAddingToCategory(null)}
            />
          </div>
        </SidebarMenuItem>
      )}
      {children}
    </>
  );
}
