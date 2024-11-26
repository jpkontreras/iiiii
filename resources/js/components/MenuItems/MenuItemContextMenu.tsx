import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Edit, MoveDown, MoveUp, Plus, Trash } from 'lucide-react';

interface MenuItemContextMenuProps {
  children: React.ReactNode;
  isCategory?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAddItem?: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function MenuItemContextMenu({
  children,
  isCategory,
  onEdit,
  onDelete,
  onAddItem,
  onMoveUp,
  onMoveDown,
}: MenuItemContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onEdit} className="gap-2">
          <Edit className="size-4" /> Edit
        </ContextMenuItem>
        {isCategory && (
          <ContextMenuItem onClick={onAddItem} className="gap-2">
            <Plus className="size-4" /> Add Item
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onMoveUp} className="gap-2">
          <MoveUp className="size-4" /> Move Up
        </ContextMenuItem>
        <ContextMenuItem onClick={onMoveDown} className="gap-2">
          <MoveDown className="size-4" /> Move Down
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={onDelete}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <Trash className="size-4" /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
