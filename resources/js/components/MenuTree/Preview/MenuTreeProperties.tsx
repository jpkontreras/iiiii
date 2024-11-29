import {
  MenuItemProperties as MenuItemPropertiesType,
  PropertyOption,
} from '@/types';

interface MenuTreePropertiesProps {
  properties: MenuItemPropertiesType;
}

const formatPropertyOption = (option: PropertyOption): string => {
  if (option.price === 0) return option.name;
  return `${option.name} (+$${option.price.toFixed(2)})`;
};

const formatPropertyKey = (key: string): string => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function MenuTreeProperties({ properties }: MenuTreePropertiesProps) {
  if (!properties) return null;

  return (
    <div className="mt-3 space-y-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
      {Object.entries(properties).map(([key, value]) => {
        if (key === 'base_price') return null;

        // Handle array of strings
        if (Array.isArray(value) && typeof value[0] === 'string') {
          return (
            <div key={key} className="flex flex-col">
              <span className="font-medium">{formatPropertyKey(key)}</span>
              <span className="text-sm">{value.join(', ')}</span>
            </div>
          );
        }

        // Handle array of objects with name and price
        if (Array.isArray(value) && typeof value[0] === 'object') {
          return (
            <div key={key} className="flex flex-col">
              <span className="font-medium">{formatPropertyKey(key)}</span>
              <span className="text-sm">
                {(value as PropertyOption[])
                  .map(formatPropertyOption)
                  .join(', ')}
              </span>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
