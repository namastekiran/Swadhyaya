export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-400 rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading</p>
      </div>
    </div>
  );
}
