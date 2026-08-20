import EmptyState from './EmptyState'

export default function ComingSoon({ title, phase }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-2xl text-primary">{title}</h2>
      <EmptyState
        title="Coming in a later phase"
        description={`${title} will be built out in ${phase} once the backend for it is ready.`}
      />
    </div>
  )
}
