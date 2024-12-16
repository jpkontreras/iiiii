interface MenuTreeHeaderProps {
  menuName: string;
  restaurantName: string;
}

export function MenuTreeHeader({
  menuName,
  restaurantName,
}: MenuTreeHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <h2 className="mb-2 text-3xl font-bold tracking-tight">{menuName}</h2>
      <p className="text-sm italic text-muted-foreground">{restaurantName}</p>
      <div className="mt-4 flex items-center justify-center">
        <div className="h-px w-24 bg-border" />
        <div className="mx-2 text-xl">✦</div>
        <div className="h-px w-24 bg-border" />
      </div>
    </div>
  );
}
