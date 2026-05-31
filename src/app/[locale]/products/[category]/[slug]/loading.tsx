export default function ProductDetailLoading() {
  return (
    <main className="pt-32 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-[clamp(2rem,5vw,8rem)]">
        <div className="animate-pulse">
          <div className="h-[1.6rem] w-[20rem] bg-[#e2e8ef] rounded mb-12" />
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <div className="aspect-square bg-[#e2e8ef] rounded-2xl" />
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#e2e8ef] rounded-lg" />
                <div className="h-[1.4rem] w-[8rem] bg-[#e2e8ef] rounded" />
              </div>
              <div className="h-[4rem] w-[90%] bg-[#e2e8ef] rounded mb-3" />
              <div className="h-[1.8rem] w-[60%] bg-[#e2e8ef] rounded mb-6" />
              <div className="h-[2rem] w-full bg-[#e2e8ef] rounded mb-2" />
              <div className="h-[2rem] w-full bg-[#e2e8ef] rounded mb-2" />
              <div className="h-[2rem] w-[80%] bg-[#e2e8ef] rounded mb-8" />
              <div className="flex gap-4 mb-8">
                <div className="h-[5rem] w-[16rem] bg-[#e2e8ef] rounded-full" />
                <div className="h-[5rem] w-[16rem] bg-[#e2e8ef] rounded-full" />
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(j => <div key={j} className="h-[2.4rem] w-[6rem] bg-[#e2e8ef] rounded-full" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
