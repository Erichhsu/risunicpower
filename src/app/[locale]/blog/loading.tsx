export default function Loading() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="mx-auto max-w-[1100px] px-6 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded-lg mb-4" />
        <div className="h-6 w-96 bg-gray-100 rounded-lg mb-12" />
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="rounded-2xl border border-gray-200 p-8">
              <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-full bg-gray-200 rounded mb-3" />
              <div className="h-16 w-full bg-gray-100 rounded mb-4" />
              <div className="h-5 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
