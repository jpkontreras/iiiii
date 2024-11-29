import { Badge } from '@/components/ui/badge';
import { Tag } from '@/types';

interface MenuTreeTagsProps {
  tags: Tag[];
}

export function MenuTreeTags({ tags }: MenuTreeTagsProps) {
  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={tag.type === 'dietary' ? 'outline' : 'default'}
          className="text-xs"
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}
