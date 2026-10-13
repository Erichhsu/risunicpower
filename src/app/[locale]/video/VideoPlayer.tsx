'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
  src: string
  poster: string
  title?: string
}

export default function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isNativeHls, setIsNativeHls] = useState(false)
  const [hlsSupported, setHlsSupported] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // iOS/Safari 原生支持 HLS（.m3u8），直接用
    const nativeHls = video.canPlayType('application/vnd.apple.mpegurl')
    if (nativeHls) {
      setIsNativeHls(true)
      video.src = src
      return
    }

    // Chrome/Firefox/桌面端：用 hls.js 解析
    let hls: any = null
    let disposed = false
    ;(async () => {
      try {
        const Hls = (await import('hls.js')).default
        if (disposed) return
        if (Hls.isSupported()) {
          hls = new Hls({ enableWorker: true })
          hls.loadSource(src)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {})
          })
        } else {
          setHlsSupported(false)
        }
      } catch (e) {
        setHlsSupported(false)
      }
    })()

    return () => {
      disposed = true
      if (hls) hls.destroy()
    }
  }, [src])

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
      <video
        ref={videoRef}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full object-contain"
        aria-label={title || 'Company video'}
      />
      {!hlsSupported && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-6 text-center">
          Your browser does not support HLS video playback.
        </div>
      )}
    </div>
  )
}
