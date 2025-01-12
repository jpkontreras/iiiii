import { NotepadText, Plus } from 'lucide-react';
import { Button } from '../ui/button';

function ItemsEmptyState() {
  return (
    <div className="grid h-4/6 place-items-center">
      <div className="grid place-items-center gap-y-4">
        <div className="grid h-32 w-32 place-items-center rounded-full bg-gray-200 p-4">
          <div className="grid h-20 w-20 items-center justify-center rounded-xl bg-black">
            <NotepadText size={48} className="text-white" />
          </div>
        </div>
        <div className="grid place-items-center">
          <h4 className="font-black text-gray-950">No Items Yet</h4>
          <p className="text-xs text-gray-500">
            Add Items to start building your menu
          </p>
          <p className="text-xs text-gray-500">Categories are optional</p>
        </div>

        <Button className="w-full rounded-full">
          <Plus /> <span> Add Item</span>
        </Button>
      </div>
    </div>
  );
}

export function Items() {
  if (true) {
    return <ItemsEmptyState />;
  }

  return <></>;
}
