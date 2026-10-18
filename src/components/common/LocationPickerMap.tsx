import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface LocationPickerMapProps {
  latitude: number | null
  longitude: number | null
  onChange: (lat: number, lng: number) => void
  disabled?: boolean
  className?: string
}

// Crisp modern custom pin SVG marker
const createCustomMarkerIcon = (color = '#dc2626') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; width: 32px; height: 40px; transform: translate(-50%, -100%);">
        <svg viewBox="0 0 384 512" width="32" height="40" fill="${color}" style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.3));">
          <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
        </svg>
        <div style="position: absolute; top: 10px; left: 10px; width: 12px; height: 12px; border-radius: 50%; background: white;"></div>
      </div>
    `,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
  })
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
  disabled = false,
  className = '',
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  // Default fallback center (Kolhapur, Maharashtra: 16.7050, 74.2433)
  const defaultLat = 16.7050
  const defaultLng = 74.2433

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const initialLat = latitude ?? defaultLat
    const initialLng = longitude ?? defaultLng
    const initialZoom = latitude && longitude ? 15 : 12

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      zoomControl: true,
    })

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Add marker if coordinates are provided
    if (latitude !== null && longitude !== null) {
      const marker = L.marker([latitude, longitude], {
        icon: createCustomMarkerIcon(),
        draggable: !disabled,
      }).addTo(map)

      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)))
      })

      markerRef.current = marker
    }

    // Click on map to drop or move marker
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (disabled) return

      const newLat = Number(e.latlng.lat.toFixed(6))
      const newLng = Number(e.latlng.lng.toFixed(6))

      if (markerRef.current) {
        markerRef.current.setLatLng([newLat, newLng])
      } else {
        const marker = L.marker([newLat, newLng], {
          icon: createCustomMarkerIcon(),
          draggable: true,
        }).addTo(map)

        marker.on('dragend', () => {
          const pos = marker.getLatLng()
          onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)))
        })

        markerRef.current = marker
      }

      onChange(newLat, newLng)
    })

    mapInstanceRef.current = map

    // Fix map container dimensions after rendering
    setTimeout(() => {
      map.invalidateSize()
    }, 200)

    return () => {
      map.remove()
      mapInstanceRef.current = null
      markerRef.current = null
    }
  }, [])

  // Sync marker and view when coordinates change from parent props (e.g. "Detect GPS" button)
  useEffect(() => {
    if (!mapInstanceRef.current) return
    const map = mapInstanceRef.current

    if (latitude !== null && longitude !== null) {
      const currentPos = markerRef.current ? markerRef.current.getLatLng() : null
      const isDifferent =
        !currentPos ||
        Math.abs(currentPos.lat - latitude) > 0.00001 ||
        Math.abs(currentPos.lng - longitude) > 0.00001

      if (isDifferent) {
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude])
        } else {
          const marker = L.marker([latitude, longitude], {
            icon: createCustomMarkerIcon(),
            draggable: !disabled,
          }).addTo(map)

          marker.on('dragend', () => {
            const pos = marker.getLatLng()
            onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)))
          })

          markerRef.current = marker
        }

        map.setView([latitude, longitude], 16, { animate: true })
      }
    }
  }, [latitude, longitude, disabled, onChange])

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-slate-100 h-64 sm:h-72 w-full z-0">
        <div ref={mapContainerRef} className="h-full w-full" />

        {/* Map Overlay Badge */}
        <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          {latitude && longitude
            ? `${latitude.toFixed(5)}°, ${longitude.toFixed(5)}°`
            : 'Click on map to select spot'}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>📍 Click or drag the blue pin to pinpoint the exact defect location</span>
        <span>OpenStreetMap</span>
      </div>
    </div>
  )
}
