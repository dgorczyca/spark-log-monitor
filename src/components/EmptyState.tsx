import { ChartLineUp } from '@phosphor-icons/react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="bg-muted rounded-full p-6 mb-4">
        <ChartLineUp size={48} className="text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No Monitoring Sections</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Get started by creating your first monitoring section. Define search rules to track
        specific patterns in your logs.
      </p>
      <p className="text-sm text-muted-foreground">
        Click the <span className="font-medium">"Add Section"</span> button above to begin
      </p>
    </div>
  )
}
