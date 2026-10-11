import { useState } from 'react'

const categoryData: Record<string, string[]> = {
  'Road & Transport': [
    'Potholes',
    'Damaged Road',
    'Road Cracks',
    'Footpath Damage',
    'Broken Footpath',
    'Traffic Signal',
    'Road Sign / Signboard',
    'Speed Breaker',
    'Illegal Parking',
    'Public Transport',
    'Bus Stop',
    'Traffic Congestion',
    'Road Construction Issue',
    'Manhole on Road',
    'Other Road Issue',
  ],

  'Garbage & Cleaning': [
    'Garbage Not Collected',
    'Overflowing Garbage Bin',
    'Open Garbage Dump',
    'Street Cleaning',
    'Public Place Cleanliness',
    'Waste Disposal',
    'Plastic Waste',
    'Dead Animal',
    'Foul Smell',
    'Other Sanitation Issue',
  ],

  'Electrical & Street Lights': [
    'Street Light Not Working',
    'Broken Street Light',
    'Flickering Light',
    'Dark Street / Poor Lighting',
    'Electrical Pole Damage',
    'Exposed Electrical Wire',
    'Fallen Electric Pole',
    'Other Electrical Issue',
  ],

  'Water Supply': [
    'No Water Supply',
    'Low Water Pressure',
    'Water Leakage',
    'Broken Water Pipeline',
    'Dirty / Contaminated Water',
    'Water Tank Issue',
    'Public Tap Issue',
    'Illegal Water Connection',
    'Other Water Issue',
  ],

  'Drainage & Sewage': [
    'Blocked Drain',
    'Overflowing Drain',
    'Sewage Overflow',
    'Open Drain',
    'Broken Drain Cover',
    'Bad Smell from Drain',
    'Waterlogging',
    'Flooded Area',
    'Other Drainage Issue',
  ],

  'Public Safety': [
    'Unsafe Area',
    'Broken Safety Barrier',
    'Open Manhole',
    'Dangerous Structure',
    'Fallen Tree',
    'Stray Animal',
    'Fire Safety Issue',
    'Public Hazard',
    'Other Safety Issue',
  ],

  'Parks & Public Spaces': [
    'Park Maintenance',
    'Damaged Playground Equipment',
    'Broken Bench',
    'Damaged Walking Track',
    'Tree Maintenance',
    'Overgrown Grass',
    'Public Garden Issue',
    'Open Space Issue',
    'Other Park Issue',
  ],

  'Trees & Environment': [
    'Fallen Tree',
    'Dangerous Tree Branch',
    'Tree Cutting',
    'Tree Plantation Request',
    'Air Pollution',
    'Noise Pollution',
    'Water Pollution',
    'Environmental Damage',
    'Other Environmental Issue',
  ],

  'Public Buildings & Infrastructure': [
    'Government Building Maintenance',
    'Public Toilet',
    'Community Hall',
    'Public Facility Damage',
    'Broken Door / Window',
    'Building Maintenance',
    'Public Property Damage',
    'Other Infrastructure Issue',
  ],

  'Public Toilets & Sanitation': [
    'Toilet Not Available',
    'Dirty Public Toilet',
    'Broken Toilet',
    'Water Not Available',
    'Toilet Maintenance',
    'Bad Odour',
    'Other Toilet Issue',
  ],

  'Traffic & Parking': [
    'Traffic Signal Not Working',
    'Illegal Parking',
    'Parking Availability',
    'Wrong Parking',
    'Traffic Sign Damage',
    'Zebra Crossing Issue',
    'Road Divider Damage',
    'Speed Breaker Issue',
    'Other Traffic Issue',
  ],

  'Public Information & Signage': [
    'Missing Signboard',
    'Damaged Signboard',
    'Wrong Information',
    'Street Name Board',
    'Direction Sign',
    'Public Notice Board',
    'Other Signage Issue',
  ],

  'Digital / Civic Services': [
    'Public Wi-Fi Issue',
    'Digital Service Issue',
    'Online Civic Service Issue',
    'Information Not Updated',
    'Website / Portal Issue',
    'Other Digital Service Issue',
  ],

  'Stray Animals': [
    'Stray Dogs',
    'Stray Cattle',
    'Injured Animal',
    'Animal Menace',
    'Dead Animal',
    'Other Animal Issue',
  ],

  'Other Civic Issues': [
    'Encroachment',
    'Unauthorized Construction',
    'Illegal Dumping',
    'Public Property Damage',
    'Other Civic Issue',
  ],
}

function ReportIssue() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [complaintId, setComplaintId] = useState('')

  const subcategories = selectedCategory
    ? categoryData[selectedCategory] || []
    : []

  const handleSubmit = () => {

    // ---------------------------------------------------------
    // BACKEND TODO: COMPLAINT SUBMISSION
    // ---------------------------------------------------------
    //
    // Current frontend only generates a random complaint ID
    // for demonstration.
    //
    // Replace this entire demo submission logic with a Flask API.
    //
    // Suggested API:
    // POST /api/complaints
    //
    // React should send:
    // {
    //   title,
    //   category,
    //   subcategory,
    //   description,
    //   location,
    //   photo
    // }
    //
    // IMPORTANT:
    // citizen_id should NOT be manually trusted from the frontend.
    // Flask should get the logged-in citizen's ID from authentication.
    //
    // Backend flow:
    // React Form
    //      ↓
    // Flask API
    //      ↓
    // Validate complaint data
    //      ↓
    // Identify logged-in citizen
    //      ↓
    // Generate complaint ID
    //      ↓
    // Save complaint in MySQL
    //      ↓
    // Assign initial status = Submitted
    //      ↓
    // Create status-history record
    //      ↓
    // Create citizen notification
    //      ↓
    // Return complaint ID to React

    const newComplaintId = `CC-${Math.floor(1000 + Math.random() * 9000)}`

    // FRONTEND DEMO ONLY:
    // Backend should generate the actual complaint ID.
    //
    // Suggested format:
    // CC-1024
    //
    // The ID should be unique in the database.

    setComplaintId(newComplaintId)
    setIsSubmitted(true)

    // BACKEND TODO:
    // After successful API response, use the complaint ID
    // returned by Flask instead of the random ID above.
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-700">
              CivicResolve
            </h1>

            <p className="text-xs text-slate-500">
              Report Civic Issue
            </p>
          </div>

          <button
            onClick={() => window.location.href = '/dashboard'}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Dashboard
          </button>

        </div>
      </header>

      {/* Page Content */}
      <section className="mx-auto max-w-4xl px-6 py-10">

        {/* Page Heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-700">
            Civic Issue Reporting
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            Report a Civic Issue
          </h2>

          <p className="mt-2 text-slate-500">
            Provide the details below to help the concerned department
            understand and resolve the issue.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

          {/* Issue Title */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Issue Title
            </label>

            <input
              type="text"
              placeholder="Enter a short title for the issue"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            {/* BACKEND TODO:
                Save this value in the complaints table.

                Suggested database column:
                title VARCHAR(...)
            */}

          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Category
            </label>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="" disabled>
                Select issue category
              </option>

              {Object.keys(categoryData).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* BACKEND TODO:
                Save the selected category in the complaints table.

                Backend can also use the category to determine
                the concerned department.

                Example:
                Road & Transport
                    ↓
                Road Department

                Water Supply
                    ↓
                Water Department

                Electrical & Street Lights
                    ↓
                Electrical Department

                IMPORTANT:
                Department assignment should be validated by backend,
                not trusted only from frontend.
            */}

          </div>

          {/* Subcategory */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Subcategory
            </label>

            <select
              disabled={!selectedCategory}
              defaultValue=""
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="" disabled>
                {selectedCategory
                  ? 'Select subcategory'
                  : 'Select category first'}
              </option>

              {subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>

            {/* BACKEND TODO:
                Save the selected subcategory with the complaint.

                Suggested column:
                subcategory

                Category + subcategory can help Admin and Department
                understand the exact type of civic issue.
            */}

          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              rows={5}
              placeholder="Describe the issue in detail..."
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            {/* BACKEND TODO:
                Save description in the complaints table.

                Suggested column:
                description TEXT
            */}

          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Location / Address
            </label>

            <input
              type="text"
              placeholder="Enter the location or address of the issue"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-xs text-slate-500">
              Please provide the exact location so the concerned department
              can identify the issue easily.
            </p>

            {/* BACKEND TODO:
                Save the location/address in the complaints table.

                Suggested column:
                location TEXT or VARCHAR(...)

                Future map integration can additionally store:
                latitude
                longitude

                Map functionality is intentionally postponed
                in the current frontend version.
            */}

          </div>

          {/* Location Preview */}
          <div className="mb-6">

            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">
                Location Preview
              </label>

              <span className="text-xs font-medium text-blue-700">
                Map integration
              </span>
            </div>

            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl">
                  📍
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  Map Location
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Interactive map will be integrated later.
                </p>
              </div>

            </div>

            {/* BACKEND TODO:
                Map integration is postponed for now.

                Later, if required:
                - Frontend can send latitude and longitude.
                - Backend stores them with the complaint.
                - Backend should validate the received coordinates.
            */}

          </div>

          {/* Photo Upload */}
          <div className="mb-8">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Upload Photo
            </label>

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl">
                📷
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-700">
                Add a photo of the issue
              </p>

              <p className="mt-1 text-xs text-slate-500">
                A clear photo can help the department understand the issue.
              </p>

              <input
                type="file"
                accept="image/*"
                className="mx-auto mt-4 block w-full max-w-xs text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />

              {/* BACKEND TODO:
                  The selected image should be uploaded to the backend.

                  Suggested API:
                  POST /api/complaints
                  using multipart/form-data

                  Recommended flow:
                  1. Flask receives the image.
                  2. Validate file type and size.
                  3. Store the image in a proper upload/storage location.
                  4. Save only the file path/URL in MySQL.
                  5. Link the photo with complaint_id.

                  Suggested table:
                  complaint_photos
                  -------------------------
                  photo_id
                  complaint_id
                  file_path
                  uploaded_at
                  uploaded_by
                  -------------------------

                  Do NOT store large image binary data directly in
                  the complaints table unless the backend team has
                  specifically chosen that architecture.
              */}

            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => window.location.href = '/dashboard'}
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-blue-700 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              Submit Complaint
            </button>

          </div>

          {/* Submit Backend Notes */}
          {/* BACKEND TODO:
              Before accepting a complaint, backend should validate:

              - Logged-in citizen is authenticated.
              - Title is present.
              - Category is valid.
              - Subcategory belongs to selected category.
              - Description is present.
              - Location is present.
              - Uploaded photo, if provided, is a valid image.

              After saving the complaint:

              Initial status:
              Submitted

              Suggested status-history record:
              complaint_id
              status = "Submitted"
              changed_by = citizen_id
              changed_at

              Suggested complaint table:
              complaints
              ------------------------------------------------
              complaint_id
              citizen_id
              title
              category
              subcategory
              description
              location
              department_id
              status
              created_at
              updated_at
              resolution_info
              ------------------------------------------------

              Backend can then assign the complaint to the
              appropriate department.

              Example:
              complaint.category = "Road & Transport"
                    ↓
              department_id = Road Department

              After assignment:
              create notification for citizen.

              Suggested notification:
              "Your complaint CC-1024 has been submitted successfully."
          */}

          {/* Success Message */}
          {isSubmitted && (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">

              <p className="text-sm font-semibold text-emerald-800">
                Complaint Submitted Successfully
              </p>

              <p className="mt-2 text-sm text-emerald-700">
                Your complaint has been registered successfully.
              </p>

              <p className="mt-3 text-sm font-bold text-emerald-800">
                Complaint ID: {complaintId}
              </p>

              <button
                type="button"
                onClick={() => window.location.href = '/dashboard'}
                className="mt-4 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Go to Dashboard
              </button>

              {/* BACKEND TODO:
                  The complaint ID shown here should come from
                  the Flask API response.

                  Example API response:
                  {
                    success: true,
                    complaintId: "CC-1024",
                    status: "Submitted",
                    message: "Complaint submitted successfully."
                  }

                  After receiving this response:
                  - Show the returned complaint ID.
                  - Show the success message.
                  - Optionally create/update the citizen notification.
              */}

            </div>
          )}

        </div>

        {/* Information Note */}
        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">

          <p className="text-sm font-semibold text-blue-800">
            Before submitting
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-700">
            Please make sure that the information provided is accurate and
            the location details are correct.
          </p>

        </div>

      </section>

    </main>
  )
}

export default ReportIssue