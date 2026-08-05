export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-14 animate-pulse border-b bg-muted" />
      <main className="container mx-auto flex-1 px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto mb-12 h-10 w-2/3 max-w-lg animate-pulse rounded bg-muted" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
