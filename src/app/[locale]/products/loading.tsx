export default function ProductsLoading() {
  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <div className="animate-pulse">
          <div className="h-[4rem] w-[200px] bg-[#e2e8ef] rounded-lg mb-4" />
          <div className="h-[2px] w-[120px] bg-[#e2e8ef] rounded mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="p-8 bg-white rounded-2xl border border-[#e2e8ef]">
                <div className="w-14 h-14 bg-[#e2e8ef] rounded-lg mb-4" />
                <div className="h-[2.4rem] w-[70%] bg-[#e2e8ef] rounded mb-2" />
                <div className="h-[1.6rem] w-[50%] bg-[#e2e8ef] rounded mb-4" />
                <div className="flex gap-2 mb-6">
                  <div className="h-[2.4rem] w-[6rem] bg-[#e2e8ef] rounded-full" />
                  <div className="h-[2.4rem] w-[8rem] bg-[#e2e8ef] rounded-full" />
                </div>
                <div className="h-[1.6rem] w-[8rem] bg-[#e2e8ef] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
