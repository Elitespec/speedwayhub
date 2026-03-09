import React from 'react'

type Props = {
  lat: number
  lng: number
  name: string
}

export const MapEmbed: React.FC<Props> = ({ lat, lng, name }) => {
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`
  return (
    <div id="map" className="mt-4 overflow-hidden rounded-2xl border border-slate-800">
      <iframe
        title={name}
        src={src}
        className="h-64 w-full md:h-80"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
