export default function Loading() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20 animate-pulse">
      <div className="mx-auto max-w-[800px] px-6">
        <div className="h-5 w-32 bg-gray-200 rounded mb-8" />
        <div className="h-4 w-48 bg-gray-100 rounded mb-4" />
        <div className="h-12 w-full bg-gray-200 rounded mb-6" />
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-4 w-full bg-gray-100 rounded" />)}
        </div>
        <div className="h-12 w-56 bg-gray-200 rounded-full mt-12" />
      </div>
    </div>
  )
}
