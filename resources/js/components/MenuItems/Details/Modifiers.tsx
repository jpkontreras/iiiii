import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function Modifiers() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Size Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label>Regular</Label>
                <Input value="+$0.00" readOnly />
              </div>
              <div className="flex-1">
                <Label>Large</Label>
                <Input value="+$1.00" readOnly />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Milk Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label>Regular Milk</Label>
                <Input value="+$0.00" readOnly />
              </div>
              <div className="flex-1">
                <Label>Almond Milk</Label>
                <Input value="+$0.50" readOnly />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label>Oat Milk</Label>
                <Input value="+$0.50" readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button variant="outline" className="w-full">
        + Add Modifier Group
      </Button>
    </div>
  );
}

export default Modifiers;
