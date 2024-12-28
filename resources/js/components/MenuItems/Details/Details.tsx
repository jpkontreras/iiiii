import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function Details() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Coffee" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="basePrice">Base Price</Label>
        <Input
          id="basePrice"
          type="number"
          placeholder="4.00"
          step="0.01"
          min="0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter item description..."
          className="h-32"
        />
      </div>
    </div>
  );
}

export default Details;
