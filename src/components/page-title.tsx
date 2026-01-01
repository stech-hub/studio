export function PageTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h2 className="text-3xl font-bold font-headline tracking-tight">{title}</h2>
      {description && <p className="text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}
