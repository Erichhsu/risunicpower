export default function CategoryLoading() {
  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <div className="animate-pulse">
          <div className="h-[1.6rem] w-[12rem] bg-[#e2e8ef] rounded mb-8" />
          <div className="mb-16">
            <div className="w-14 h-14 bg-[#e2e8ef] rounded-lg mb-4" />
            <div className="h-[4rem] w-[30rem] bg-[#e2e8ef] rounded mb-2" />
            <div className="h-[1.8rem] w-[40rem] bg-[#e2e8ef] rounded" />
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#e2e8ef] overflow-hidden">
                <div className="aspect-[4/3] bg-[#e2e8ef]" />
                <div className="p-6">
                  <div className="h-[2rem] w-[80%] bg-[#e2e8ef] rounded mb-2" />
                  <div className="h-[1.6rem] w-[60%] bg-[#e2e8ef] rounded mb-4" />
                  <div className="space-y-1 mb-4">
                    {[1, 2, 3].map(j => <div key={j} className="h-[1.4rem] w-[70%] bg-[#e2e8ef] rounded" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
