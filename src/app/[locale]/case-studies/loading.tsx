export default function Loading() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20 animate-pulse">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="h-10 w-48 bg-gray-200 rounded-lg mb-4" />
        <div className="h-6 w-80 bg-gray-100 rounded-lg mb-12" />
        <div className="space-y-6">
          {[1,2].map(i => (
            <div key={i} className="rounded-2xl border border-gray-200 p-8 flex gap-6">
              <div className="h-14 w-14 rounded-xl bg-gray-200 shrink-0" />
              <div className="flex-1">
                <div className="h-7 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-5 w-1/2 bg-gray-100 rounded mb-2" />
                <div className="h-10 w-full bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
