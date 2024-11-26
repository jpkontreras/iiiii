import { Card } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { GripVertical, Table } from 'lucide-react';
import { MenuItem } from '../../Pages/MenuItems/types';
import { DragDropView } from './DragDropView';
import { LivePreview } from './LivePreview';
import { MenuTable } from './MenuTable';
import { QuickAddForm } from './QuickAddForm';

interface Props {
  items: MenuItem[];
  onItemsChange: (items: MenuItem[]) => void;
}

export function MenuBuilder({ items, onItemsChange }: Props) {
  const handleAddItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Math.max(0, ...items.map((item) => item.id)) + 1,
    };
    onItemsChange([...items, newItem]);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <QuickAddForm onAdd={handleAddItem} />

        <Tabs defaultValue="table" className="mt-6">
          <TabsList>
            <TabsTrigger value="table">
              <Table className="mr-2 h-4 w-4" />
              Table View
            </TabsTrigger>
            <TabsTrigger value="dragdrop">
              <GripVertical className="mr-2 h-4 w-4" />
              Drag & Drop
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <MenuTable items={items} onItemsChange={onItemsChange} />
          </TabsContent>

          <TabsContent value="dragdrop">
            <DragDropView items={items} onItemsChange={onItemsChange} />
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="bg-slate-50 p-6">
        <LivePreview items={items} />
      </Card>
    </div>
  );
}
