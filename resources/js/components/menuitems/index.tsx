import {
  MenuItemProvider,
  useMenuItem,
  useMenuItemDispatch,
} from '@/components/menuitems/ctx';
import { Items } from '@/components/menuitems/items';
import { Tree } from '@/components/menuitems/tree';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';

function ResizableView() {
  const dispatch = useMenuItemDispatch();
  const { currentAction } = useMenuItem();
  const [isResizing, setIsResizing] = useState(false);
  const rightPanel = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    if (rightPanel.current) {
      console.log({ currentAction });

      if (rightPanel.current.isCollapsed()) {
        rightPanel.current.expand();
      }

      if (currentAction === 'add-element') {
        rightPanel.current?.collapse();
      }
    }
  }, [currentAction, dispatch, rightPanel]);

  const panelClasses = cn(
    'rounded bg-white',
    !isResizing && 'transition-all duration-300 ease-in-out',
  );

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className={cn('h-full bg-gray-200 p-2')}
    >
      <ResizablePanel defaultSize={30} className={panelClasses}>
        <Tree />
      </ResizablePanel>

      <ResizableHandle
        className="w-2 bg-gray-200"
        onDragging={(e) => setIsResizing(e)}
      />

      <ResizablePanel
        ref={rightPanel}
        defaultSize={70}
        className={panelClasses}
        collapsible={true}
      >
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={95} className="bg-white">
            <Items />
          </ResizablePanel>
          <ResizableHandle className="w-2 bg-gray-200" />

          <ResizablePanel defaultSize={5} className="bg-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            quidem quo qui corporis hic laborum accusantium obcaecati facilis,
            explicabo repellat voluptates autem sed. Alias rem dolorum commodi
            amet culpa totam.
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function MenuItems() {
  return (
    <MenuItemProvider>
      <ResizableView />
    </MenuItemProvider>
  );
}

export default MenuItems;
