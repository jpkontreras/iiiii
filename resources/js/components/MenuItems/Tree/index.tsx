import { MenuEntry } from '@/types';
import { useMemo, useState } from 'react';
import { Tree, UncontrolledTreeEnvironment } from 'react-complex-tree';
import { MenuTreeDataProvider } from './MenuTreeDataProvider';
import { RenderItem, RenderItemArrow, RenderItemTitle } from './MenuTreeParts';

interface MenuTreeProps {
  items: MenuEntry[];
  onItemsChange?: (items: MenuEntry[]) => void;
}

type MenuItemType = 'category' | 'item' | 'modifier';

function MenuTree({ items, onItemsChange }: MenuTreeProps) {
  const dataProvider = useMemo(() => new MenuTreeDataProvider(items), [items]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  return (
    <UncontrolledTreeEnvironment<MenuEntry>
      dataProvider={dataProvider}
      getItemTitle={(item) => item.data.name}
      viewState={{
        ['menu-tree']: {
          expandedItems,
        },
      }}
      canDragAndDrop={false}
      canDropOnFolder={false}
      canReorderItems={false}
      onExpandItem={(item) => {
        setExpandedItems((prev) => [...prev, item.index as string]);
      }}
      onCollapseItem={(item) => {
        setExpandedItems((prev) =>
          prev.filter((i) => i !== (item.index as string)),
        );
      }}
      renderItemArrow={RenderItemArrow}
      renderItemTitle={RenderItemTitle}
      renderItem={RenderItem}
      renderTreeContainer={({ children, containerProps }) => (
        <ul {...containerProps} className="flex w-full flex-col">
          {children}
        </ul>
      )}
      renderItemsContainer={({ children, containerProps }) => (
        <ul {...containerProps} className="flex w-full flex-col">
          {children}
        </ul>
      )}
    >
      <Tree treeId="menu-tree" rootItem="root" treeLabel="Menu Structure" />
    </UncontrolledTreeEnvironment>
  );
}

export default MenuTree;
