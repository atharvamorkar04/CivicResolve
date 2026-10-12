import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import PortalNavbar from '../../components/common/PortalNavbar'

// Standard civic categories for interface layout evaluation.
// Structured to be populated by GET /api/categories from MySQL in Phase 4.
const FALLBACK_CATEGORIES: Record<string, string[]> = {
  'Road & Transport': [
    'Potholes on Road',
    'Damaged Road Surface',
    'Broken Footpath / Sidewalk',
    'Traffic Signal Fault',
    'Missing or Damaged Signboard',
    'Dangerous Speed Breaker',
  ],
  'Water Supply': [
    'No Water Supply',
    'Low Water Pressure',
    'Water Pipeline Leakage',
    'Contaminated / Dirty Water',
    'Public Tap Damage',
  ],
  'Electrical & Street Lighting': [
    'Street Light Not Functioning',
    'Flickering Street Light',
    'Damaged Electrical Pole',
    'Exposed Electrical Wiring',
    'Dark Alley / Inadequate Lighting',
  ],
  'Sanitation & Solid Waste': [
    'Overflowing Garbage Bin',
    'Uncollected Street Waste',
    'Open Garbage Dumping',
    'Dead Animal Removal Needed',
  ],
  'Drainage & Sewage': [
    'Blocked Stormwater Drain',
    'Sewage Overflow on Street',
    'Missing or Broken Drain Cover',
    'Waterlogging / Flooding',
  ],
  'Parks & Public Gardens': [
    'Damaged Playground Equipment',
    'Broken Public Bench',
    'Overgrown Grass & Debris',
    'Damaged Walking Track',
  ],
  'Public Safety & Hazards': [
    'Open Manhole Hazard',
    'Unsafe Dilapidated Structure',
    'Fallen Tree Blocking Path',
    'Stray Animal Menace',
  ],
}

function ReportIssue() {
  const navigate = useNavigate()

  // Form Fields
  const [title, setTitle] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'Standard' | 'Urgent'>('Standard')

  // Location & Geolocation
  const [streetAddress, setStreetAddress] = useState('')
  const [landmark, setLandmark] = useState('')
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  // Photo Attachment
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  // Subcategories derived strictly from currently selected category
  const subcategoryList = selectedCategory ? FALLBACK_CATEGORIES[selectedCategory] || [] : []

  // When category changes, immediately clear incompatible subcategory
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
    setSelectedSubcategory('')
    setFormError(null)
  }

  // Handle Photo Selection
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Photo size exceeds 5MB limit. Please choose a smaller photo.')
      return
    }

    setSelectedPhoto(file)
    const reader = new FileReader()
    reader.onload = () => {
      setPhotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    setFormError(null)
  }

  const handleRemovePhoto = () => {
    setSelectedPhoto(null)
    setPhotoPreview(null)
  }

  // Handle Browser Geolocation
  const handleCaptureLocation = () => {
    setGeoLoading(true)
    setGeoError(null)

    if (!navigator.geolocation) {
      setGeoLoading(false)
      setGeoError('Geolocation is not supported by your browser. Please enter the address manually.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false)
        setCoordinates({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        })
        setGeoError(null)
      },
      (error) => {
        setGeoLoading(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('Location permission was denied. Please enter your street address and landmarks manually below.')
            break
          case error.POSITION_UNAVAILABLE:
            setGeoError('GPS position is currently unavailable. Please enter your address details manually.')
            break
          case error.TIMEOUT:
            setGeoError('Location request timed out. Please enter your address details manually.')
            break
          default:
            setGeoError('Unable to detect location. Please specify the address manually.')
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  // Form Submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    setNotice(null)

    if (!title.trim()) {
      setFormError('Please enter a clear complaint title.')
      return
    }

    if (!selectedCategory) {
      setFormError('Please select a complaint category.')
      return
    }

    if (!selectedSubcategory) {
      setFormError('Please select a specific subcategory.')
      return
    }

    if (!streetAddress.trim()) {
      setFormError('Please provide a street address or location description.')
      return
    }

    if (!description.trim() || description.trim().length < 15) {
      setFormError('Please provide a descriptive explanation (at least 15 characters).')
      return
    }

    setIsSubmitting(true)

    // PHASE 3 SPECIFICATION:
    // Prepare separate category, subcategory, photo, and geolocation values for future PHP backend.
    setTimeout(() => {
      setIsSubmitting(false)
      setNotice(
        'Complaint details validated successfully! Real database storage will be connected in Phase 4 via the PHP REST API.'
      )
    }, 600)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <PortalNavbar role="citizen" />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 py-8 animate-fade-in">
        {/* Page Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-xs font-semibold text-slate-500 hover:text-blue-700 transition inline-flex items-center gap-1 mb-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Report a Civic Issue
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Provide accurate details, photos, and location coordinates for efficient municipal dispatch.
          </p>
        </div>

        {/* Notice Banners */}
        {notice && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 animate-fade-in">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h2 className="text-sm font-bold text-emerald-900">Submission Form Validated</h2>
                <p className="mt-1 text-xs sm:text-sm text-emerald-800 leading-relaxed">{notice}</p>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/my-complaints')}
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition"
                  >
                    View Complaints
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTitle('')
                      setSelectedCategory('')
                      setSelectedSubcategory('')
                      setDescription('')
                      setStreetAddress('')
                      setLandmark('')
                      setCoordinates(null)
                      setSelectedPhoto(null)
                      setPhotoPreview(null)
                      setNotice(null)
                    }}
                    className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition"
                  >
                    Submit Another Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {formError && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-700 animate-fade-in">
            <strong>Validation Error:</strong> {formError}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Category & Subcategory */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-extrabold">
                1
              </span>
              Issue Classification
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label htmlFor="category-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Municipal Category *
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">-- Select Category --</option>
                  {Object.keys(FALLBACK_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-400">
                  Select the primary infrastructure category
                </p>
              </div>

              {/* Subcategory */}
              <div>
                <label htmlFor="subcategory-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Specific Subcategory *
                </label>
                <select
                  id="subcategory-select"
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  disabled={!selectedCategory}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">
                    {selectedCategory ? '-- Select Subcategory --' : 'First choose a category above'}
                  </option>
                  {subcategoryList.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-400">
                  Changing category resets this selection
                </p>
              </div>
            </div>

            {/* Severity / Priority */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Issue Severity Level
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                <button
                  type="button"
                  onClick={() => setPriority('Standard')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition ${
                    priority === 'Standard'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Standard Maintenance
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('Urgent')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition ${
                    priority === 'Urgent'
                      ? 'border-rose-600 bg-rose-50 text-rose-700 ring-1 ring-rose-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ⚠️ Urgent Safety Risk
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Details & Description */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-extrabold">
                2
              </span>
              Description & Details
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="complaint-title" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Complaint Title *
                </label>
                <input
                  id="complaint-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deep pothole causing vehicular damage near school"
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="complaint-desc" className="block text-xs font-semibold text-slate-700">
                    Detailed Description *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {description.length} characters (min 15)
                  </span>
                </div>
                <textarea
                  id="complaint-desc"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail: when it began, exact location specifics, and danger posed to citizens..."
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Location Pinpoint */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-extrabold">
                  3
                </span>
                Location Pinpoint
              </h2>

              <button
                type="button"
                onClick={handleCaptureLocation}
                disabled={geoLoading}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition disabled:opacity-50"
              >
                {geoLoading ? (
                  <span>Detecting GPS...</span>
                ) : (
                  <>
                    <span>📍</span> Detect Current GPS
                  </>
                )}
              </button>
            </div>

            {/* Geolocation status / error */}
            {geoError && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <strong>Location Note:</strong> {geoError}
              </div>
            )}

            {coordinates && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center justify-between">
                <span>
                  <strong>GPS Tagged:</strong> {coordinates.lat}° N, {coordinates.lng}° E
                </span>
                <button
                  type="button"
                  onClick={() => setCoordinates(null)}
                  className="text-emerald-700 hover:underline font-bold text-[11px]"
                >
                  Clear GPS
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="street-address" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Street Address / Area *
                </label>
                <input
                  id="street-address"
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. Shivaji Road, Sector 3"
                  required
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="landmark" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Prominent Landmark
                </label>
                <input
                  id="landmark"
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Municipal Primary School"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Photo Evidence Upload */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-extrabold">
                4
              </span>
              Photo Evidence (Optional)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Attaching an on-site photograph helps field crews verify severity and dispatch appropriate machinery.
            </p>

            {photoPreview ? (
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={photoPreview}
                    alt="Issue preview"
                    className="h-16 w-16 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800 truncate max-w-xs">
                      {selectedPhoto?.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {selectedPhoto ? `${(selectedPhoto.size / 1024).toFixed(1)} KB` : ''}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                >
                  Remove Photo
                </button>
              </div>
            ) : (
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 hover:bg-slate-50 cursor-pointer transition"
              >
                <div className="text-3xl mb-2">📷</div>
                <p className="text-xs font-semibold text-slate-700">
                  Click to select or drag and drop photo
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supported formats: JPG, PNG, WebP (Max 5MB)
                </p>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submission Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              By submitting, you confirm that the provided civic defect information is accurate.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-xl bg-blue-700 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-blue-700/20 hover:bg-blue-800 transition active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? 'Validating Submission...' : 'Submit Civic Complaint'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ReportIssue