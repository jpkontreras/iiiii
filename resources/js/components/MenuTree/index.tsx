import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useMemo, useRef, useState } from 'react';
import {
  StaticTreeDataProvider,
  Tree,
  TreeItem,
  TreeItemIndex,
  UncontrolledTreeEnvironment,
} from 'react-complex-tree';
import { MenuTreeRenderer } from './MenuTreeRenderer';

export function MenuTree() {
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const items = useRef<Record<TreeItemIndex, TreeItem<string>>>({
    root: {
      index: 'root',
      canMove: true,
      isFolder: true,
      children: ['components'],
      data: 'root',
      canRename: true,
    },
    components: {
      index: 'components',
      isFolder: true,
      children: ['inputs', 'display', 'feedback', 'navigation', 'layout'],
      data: 'UI Components',
    },
    inputs: {
      index: 'inputs',
      isFolder: true,
      children: ['button', 'input', 'checkbox', 'form'],
      data: 'Input Components',
    },
    display: {
      index: 'display',
      isFolder: true,
      children: ['avatar', 'badge', 'card'],
      data: 'Display Components',
    },
    feedback: {
      index: 'feedback',
      isFolder: true,
      children: ['alert', 'alert-dialog', 'dialog'],
      data: 'Feedback Components',
    },
    navigation: {
      index: 'navigation',
      isFolder: true,
      children: ['menubar', 'dropdown', 'command'],
      data: 'Navigation Components',
    },
    layout: {
      index: 'layout',
      isFolder: true,
      children: ['accordion', 'calendar'],
      data: 'Layout Components',
    },
    // Individual components
    accordion: { data: 'Accordion', index: 'accordion' },
    'alert-dialog': { data: 'Alert Dialog', index: 'alert-dialog' },
    alert: { data: 'Alert', index: 'alert' },
    avatar: { data: 'Avatar', index: 'avatar' },
    badge: { data: 'Badge', index: 'badge' },
    button: { data: 'Button', index: 'button' },
    calendar: { data: 'Calendar', index: 'calendar' },
    card: { data: 'Card', index: 'card' },
    checkbox: { data: 'Checkbox', index: 'checkbox' },
    command: { data: 'Command', index: 'command' },
    dialog: { data: 'Dialog', index: 'dialog' },
    dropdown: { data: 'Dropdown Menu', index: 'dropdown' },
    form: { data: 'Form', index: 'form' },
    input: { data: 'Input', index: 'input' },
    label: { data: 'Label', index: 'label' },
    menubar: { data: 'Menubar', index: 'menubar' },
  });

  const dataProvider = useMemo(() => {
    const provider = new StaticTreeDataProvider(
      items.current,
      (item, data) => ({
        ...item,
        data,
      }),
    );

    provider.onDidChangeTreeData((changedItemIds) => {
      console.log('Tree data changed:', changedItemIds);
    });

    return provider;
  }, [items]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <UncontrolledTreeEnvironment
                dataProvider={dataProvider}
                getItemTitle={(item) => item.data}
                viewState={{
                  ['menu-tree']: {
                    expandedItems: [
                      'root',
                      'components',
                      'inputs',
                      'display',
                      'feedback',
                      'navigation',
                      'layout',
                    ],
                  },
                }}
                canSearch={!isEditing}
                canSearchByStartingTyping={!isEditing}
                canDragAndDrop
                canReorderItems
                canDropOnFolder
                renderItem={(props) => (
                  <MenuTreeRenderer
                    {...props}
                    addingToCategory={addingToCategory}
                    setAddingToCategory={(id) => {
                      setAddingToCategory(id);
                      setIsEditing(!!id);
                    }}
                    handleQuickAdd={(parentId, data) => {
                      setAddingToCategory(null);
                      setIsEditing(false);
                    }}
                  />
                )}
                renderItemsContainer={({ children, containerProps }) => (
                  <ul
                    {...containerProps}
                    className={cn('flex flex-col gap-[2px] pl-3')}
                  >
                    {children}
                  </ul>
                )}
                renderTreeContainer={({ children, containerProps }) => (
                  <SidebarMenu {...containerProps} className="gap-[2px]">
                    {children}
                  </SidebarMenu>
                )}
              >
                <Tree
                  treeId="menu-tree"
                  rootItem="root"
                  treeLabel="UI Components"
                />
              </UncontrolledTreeEnvironment>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </div>
  );
}
