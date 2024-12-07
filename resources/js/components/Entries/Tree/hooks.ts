// hooks/useTreeActions.ts
import { MenuItem } from '@/types';
import { useCallback } from 'react';
import { TreeDataProvider } from './treeDataProvider';

export function useTreeActions(provider: TreeDataProvider) {
  const addMenuItem = useCallback(
    (name: string, parentId?: string) => {
      const newItem: MenuItem = {
        id: crypto.randomUUID(),
        name,
        children: [],
      };
      provider.addItem(newItem, parentId);
    },
    [provider],
  );

  const removeMenuItem = useCallback(
    (itemId: string) => {
      provider.removeItem(itemId);
    },
    [provider],
  );

  const updateMenuItem = useCallback(
    (itemId: string, updates: Partial<MenuItem>) => {
      provider.updateItem(itemId, updates);
    },
    [provider],
  );

  return {
    addMenuItem,
    removeMenuItem,
    updateMenuItem,
  };
}
