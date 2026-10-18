import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface LocationViewMapProps {
  latitude: number | string
  longitude: number | string
  address?: string | null
  title?: string
  className?: string
  pinColor?: string
}

// Crisp modern custom pin SVG marker
const createViewMarkerIcon = (color = '#dc2626') => {
  return L.divIcon({
    className: 'custom-view-leaflet-marker',
    html: `
      <div style="position: relative; width: 32px; height: 40px; transform: translate(-50%, -100%);">
        <svg viewBox="0 0 384 512" width="32" height="40" fill="${color}" style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.35));">
          <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
        </svg>
        <div style="position: absolute; top: 10px; left: 10px; width: 12px; height: 12px; border-radius: 50%; background: white;"></div>
      </div>
    `,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  })
}

export default function LocationViewMap({
  latitude,
  longitude,
  address,
  title = 'Defect Location',
  className = '',
  pinColor = '#dc2626',
}: LocationViewMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  const latNum = Number(latitude)
  const lngNum = Number(longitude)
  const isValidCoords = !isNaN(latNum) && !isNaN(lngNum) && latNum !== 0 && lngNum !== 0

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current || !isValidCoords) return

    const map = L.map(mapContainerRef.current, {
      center: [latNum, lngNum],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: false, // Prevents accidental page scrolling
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    const marker = L.marker([latNum, lngNum], {
      icon: createViewMarkerIcon(pinColor),
    }).addTo(map)

    const popupHtml = `
      <div style="font-family: inherit; font-size: 12px; padding: 2px;">
        <strong style="color: #0f172a; display: block; margin-bottom: 3px;">${title}</strong>
        ${address ? `<p style="color: #475569; margin: 0; font-size: 11px;">${address}</p>` : ''}
        <p style="color: #64748b; margin: 3px 0 0 0; font-size: 10px; font-family: monospace;">${latNum.toFixed(6)}, ${lngNum.toFixed(6)}</p>
      </div>
    `
    marker.bindPopup(popupHtml).openPopup()

    mapInstanceRef.current = map

    setTimeout(() => {
      map.invalidateSize()
    }, 200)

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [latNum, lngNum, pinColor, title, address, isValidCoords])

  if (!isValidCoords) {
    return (
      <div className="h-44 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
        No geographic coordinates available for this complaint.
      </div>
    )
  }

  const googleMapsUrl = `https://www.google.com/maps?q=${latNum},${lngNum}`

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="relative rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-slate-100 h-56 sm:h-64 w-full z-0">
        <div ref={mapContainerRef} className="h-full w-full" />

        {/* Coordinates Badge */}
        <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-200 shadow-sm text-[11px] font-mono text-slate-700">
          {latNum.toFixed(5)}°, {lngNum.toFixed(5)}°
        </div>
      </div>

      {/* Action bar below map */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Interactive OpenStreetMap</span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-blue-700 transition"
        >
          <span>🗺️ Open in Google Maps</span>
          <span className="text-[10px] text-slate-400">↗</span>
        </a>
      </div>
    </div>
  )
}
