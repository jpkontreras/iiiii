import { Input } from '@/components/ui/input';
import { Folders, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { useMenuItemDispatch } from './ctx';

function TreeSearch() {
  return (
    <Input
      type="search"
      id="search"
      placeholder="Search"
      className="w-full rounded-full"
    />
  );
}

function TreeEmptyState() {
  const dispatch = useMenuItemDispatch();

  const handleFirstElement = () => {
    dispatch({ type: 'current', value: 'add-element' });
  };

  return (
    <div className="grid h-4/6 place-items-center">
      <div className="grid place-items-center gap-y-4">
        <div className="grid h-32 w-32 place-items-center rounded-full bg-gray-200 p-4">
          <div className="grid h-20 w-20 items-center justify-center rounded-xl bg-gray-700">
            <Folders size={48} className="text-white" />
          </div>
        </div>
        <div className="grid place-items-center">
          <h4 className="font-black text-gray-950">No categories Yet</h4>
          <p className="text-xs text-gray-500">
            Start building your menu by adding
          </p>
          <p className="text-xs text-gray-500">your first category</p>
        </div>

        <Button
          className="w-full rounded-full bg-gray-700"
          onClick={handleFirstElement}
        >
          <Plus /> <span> Add Category</span>
        </Button>
      </div>
    </div>
  );
}

function Create() {}

export function Tree() {
  if (true) {
    return <TreeEmptyState />;
  }

  return (
    <div className="grid grid-rows-2 p-4">
      <TreeSearch />
      <TreeEmptyState />
    </div>
  );
}
