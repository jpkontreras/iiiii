import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES, MenuItem } from '../types';

interface Props {
  onAdd: (item: Omit<MenuItem, 'id'>) => void;
}

export function QuickAddForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !category) return;

    onAdd({
      name,
      price: parseFloat(price),
      category,
      description: '',
      tags: [],
    });

    setName('');
    setPrice('');
    setCategory(CATEGORIES[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <Input
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-grow"
      />
      <Input
        type="number"
        step="0.01"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-24"
      />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit">
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </form>
  );
}
