import React from 'react'

type VideoEmbedProps = {
  type: 'youtube' | 'facebook'
  videoId: string
  title: string
  className?: string
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ type, videoId, title, className = '' }) => {
  if (type === 'youtube') {
    return (
      <div className={`relative overflow-hidden rounded-xl border border-slate-800 bg-black ${className}`}>
        <div className="relative pb-[56.25%]">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  if (type === 'facebook') {
    return (
      <div className={`relative overflow-hidden rounded-xl border border-slate-800 bg-black ${className}`}>
        <div className="relative pb-[56.25%]">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
              videoId
            )}&show_text=false&width=560`}
            title={title}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  return null
}

type VideoSectionProps = {
  videos: Array<{
    type: 'youtube' | 'facebook'
    videoId: string
    title: string
    description?: string
  }>
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videos }) => {
  if (videos.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
        Watch Speedway Action
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {videos.map((video, index) => (
          <div key={index} className="space-y-2">
            <VideoEmbed type={video.type} videoId={video.videoId} title={video.title} />
            {video.description && (
              <p className="text-xs text-slate-400">{video.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
