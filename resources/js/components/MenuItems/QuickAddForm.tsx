import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';

interface QuickAddFormProps {
  parentId?: number;
  onSubmit: (data: { name: string; price: number }) => void;
  onCancel: () => void;
}

export function QuickAddForm({
  parentId,
  onSubmit,
  onCancel,
}: QuickAddFormProps) {
  const [data, setData] = useState({ name: '', price: 0 });
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (data.name.trim()) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <div className="flex flex-1 gap-2">
        <Input
          ref={nameInputRef}
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className="h-8"
          placeholder="Item name..."
          autoFocus
        />
        <Input
          type="number"
          value={data.price || ''}
          onChange={(e) =>
            setData({ ...data, price: parseFloat(e.target.value) || 0 })
          }
          className="h-8 w-32"
          placeholder="Price..."
          step="0.01"
          min="0"
        />
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button type="submit" variant="ghost" size="icon" className="h-8 w-8">
          <Check className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onCancel}
        >
          <X className="size-4" />
        </Button>
      </div>
    </form>
  );
}
