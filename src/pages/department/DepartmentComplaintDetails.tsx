import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

/*
  BACKEND / DATABASE OVERVIEW:

  This page is currently using demo/static complaint data.

  FINAL FLOW:

  Department Dashboard
        ↓
  Click "View Details"
        ↓
  GET /api/department/complaints/:complaint_id
        ↓
  Flask checks logged-in department
        ↓
  MySQL returns complaint details
        ↓
  Department updates status / remarks / resolution
        ↓
  PUT /api/department/complaints/:complaint_id
        ↓
  MySQL is updated
        ↓
  Citizen + Admin receive notification

  IMPORTANT:
  React must NOT connect directly to MySQL.
  React -> Flask API -> MySQL -> Flask API -> React
*/

type ComplaintStatus =
  | 'Submitted'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'

type Complaint = {
  id: string
  title: string
  category: string
  location: string
  description: string
  date: string
  status: ComplaintStatus
  department: string
  citizen: string
}

type DepartmentUser = {
  name: string
  email?: string
}

/*
  DEMO COMPLAINT DATA:

  This data is only for frontend demonstration.

  FINAL BACKEND:

  Replace this array with data from:

  GET /api/department/complaints/:complaint_id

  Backend should get the complaint from the MySQL
  "complaints" table.

  Important database relationships:

  complaints.citizen_id
          ↓
  users.user_id

  complaints.department_id
          ↓
  departments.department_id
*/

const complaints: Complaint[] = [
  {
    id: 'CC-1024',
    title: 'Large pothole on main road',
    category: 'Road / Transport',
    location: 'MG Road',
    description:
      'A large pothole has developed on the main road and is causing difficulty for vehicles and pedestrians.',
    date: '06 Oct 2026',
    status: 'Assigned',
    department: 'Road Department',
    citizen: 'Rahul Patil',
  },
  {
    id: 'CC-1027',
    title: 'Damaged road near school',
    category: 'Road / Transport',
    location: 'Station Road',
    description:
      'The road surface near the school is damaged and requires repair.',
    date: '05 Oct 2026',
    status: 'In Progress',
    department: 'Road Department',
    citizen: 'Amit Sharma',
  },
  {
    id: 'CC-1031',
    title: 'Water leakage from pipeline',
    category: 'Water Supply',
    location: 'Shivaji Nagar',
    description:
      'Water is continuously leaking from a damaged pipeline and creating water wastage.',
    date: '05 Oct 2026',
    status: 'Assigned',
    department: 'Water Department',
    citizen: 'Sneha Joshi',
  },
  {
    id: 'CC-1034',
    title: 'Street light not working',
    category: 'Electrical / Street Light',
    location: 'Market Area',
    description:
      'The street light is not working properly, making the area dark during night hours.',
    date: '04 Oct 2026',
    status: 'Resolved',
    department: 'Electrical Department',
    citizen: 'Akshay More',
  },
  {
    id: 'CC-1038',
    title: 'Garbage accumulation',
    category: 'Garbage / Cleaning',
    location: 'Main Market',
    description:
      'Garbage has accumulated near the market area and requires cleaning.',
    date: '04 Oct 2026',
    status: 'In Progress',
    department: 'Sanitation Department',
    citizen: 'Priya Shah',
  },
  {
    id: 'CC-1040',
    title: 'Blocked drainage line',
    category: 'Drainage',
    location: 'Nehru Nagar',
    description:
      'The drainage line is blocked and wastewater is collecting on the roadside.',
    date: '03 Oct 2026',
    status: 'Assigned',
    department: 'Drainage Department',
    citizen: 'Vikas Jadhav',
  },
  {
    id: 'CC-1043',
    title: 'Damaged garden equipment',
    category: 'Parks & Garden',
    location: 'Central Garden',
    description:
      'Some equipment in the public garden is damaged and needs maintenance.',
    date: '03 Oct 2026',
    status: 'Submitted',
    department: 'Parks & Garden Department',
    citizen: 'Neha Kulkarni',
  },
  {
    id: 'CC-1046',
    title: 'Unsafe area near public place',
    category: 'Safety',
    location: 'Bus Stand Area',
    description:
      'The area requires attention because citizens have reported safety concerns.',
    date: '02 Oct 2026',
    status: 'In Progress',
    department: 'Public Safety Department',
    citizen: 'Rohit Deshmukh',
  },
]

function getStatusClasses(status: ComplaintStatus) {
  switch (status) {
    case 'Submitted':
      return 'bg-slate-100 text-slate-700'

    case 'Assigned':
      return 'bg-blue-100 text-blue-700'

    case 'In Progress':
      return 'bg-amber-100 text-amber-700'

    case 'Resolved':
      return 'bg-green-100 text-green-700'

    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function DepartmentComplaintDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  /*
    DEPARTMENT AUTHENTICATION:

    Current demo:
    departmentUser is stored in localStorage.

    FINAL BACKEND:

    Use the authenticated Flask session/token.

    Suggested API:
    GET /api/auth/me

    Backend should return something like:

    {
      "user_id": 7,
      "name": "Road Department",
      "email": "road@civicresolve.com",
      "role": "department",
      "department_id": 1
    }

    Do NOT trust department_id or department name
    sent manually by the frontend.

    Flask must identify the logged-in department itself.
  */

  const storedDepartment = localStorage.getItem('departmentUser')

  let departmentUser: DepartmentUser | null = null

  if (storedDepartment) {
    try {
      departmentUser = JSON.parse(storedDepartment)
    } catch {
      localStorage.removeItem('departmentUser')
    }
  }

  /*
    CURRENT DEMO:

    Complaint is found from the static array.

    FINAL BACKEND:

    Replace this with:

    GET /api/department/complaints/:complaint_id

    Flask should:
    1. Check that the complaint exists.
    2. Get its department_id.
    3. Get the logged-in department_id.
    4. Compare both IDs.
    5. Return the complaint only if they match.

    This is important because a department must not
    access another department's complaint by changing
    the complaint ID in the URL.
  */

  const complaint = complaints.find((item) => item.id === id)

  /*
    FRONTEND AUTHORIZATION CHECK:

    This check is useful for the demo.

    FINAL SECURITY MUST ALSO BE DONE IN FLASK.

    Frontend checks:
    complaint.department === departmentUser.name

    Backend should check:
    complaints.department_id === logged_in_user.department_id

    Backend authorization is the actual security layer.
  */

  const isAuthorized =
    complaint &&
    departmentUser &&
    complaint.department === departmentUser.name

  /*
    CURRENT DEMO STATE:

    These values exist only in React memory.

    FINAL BACKEND:

    The initial status should come from the database.

    When the department changes the status,
    the new value should be sent to Flask.

    Suggested API:
    PUT /api/department/complaints/:complaint_id

    Request example:

    {
      "status": "In Progress",
      "remarks": "Repair work has started.",
      "resolution": ""
    }
  */

  const [status, setStatus] = useState<ComplaintStatus>(
    isAuthorized ? complaint.status : 'Assigned',
  )

  const [remarks, setRemarks] = useState('')
  const [resolution, setResolution] = useState('')
  const [resolutionPhoto, setResolutionPhoto] = useState<File | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  /*
    UPDATE COMPLAINT:

    CURRENT DEMO:
    Only shows a success message.

    FINAL BACKEND:

    On clicking Update Complaint:

    React should send:
    - complaint ID
    - new status
    - remarks
    - resolution details
    - resolution photo if selected

    Suggested API:
    PUT /api/department/complaints/:complaint_id

    Flask should then:

    1. Authenticate the department user.
    2. Verify department authorization.
    3. Verify complaint exists.
    4. Validate the requested status.
    5. Save status in complaints table.
    6. Save remarks.
    7. Save resolution information if applicable.
    8. Save status history.
    9. Save uploaded resolution photo.
    10. Create citizen notification.
    11. Create admin notification.
    12. Return success response.

    Example response:

    {
      "success": true,
      "message": "Complaint updated successfully"
    }
  */

  const handleUpdate = () => {
    setError('')
    setSuccess(false)

    /*
      VALIDATION:

      Resolution details are required before a department
      marks a complaint as Resolved.

      Backend MUST perform the same validation.

      Never rely only on frontend validation because
      frontend validation can be bypassed.
    */

    if (status === 'Resolved' && !resolution.trim()) {
      setError(
        'Please enter resolution details before marking the complaint as resolved.',
      )
      return
    }

    /*
      FINAL BACKEND REQUEST:

      Example concept:

      const formData = new FormData()

      formData.append('status', status)
      formData.append('remarks', remarks)
      formData.append('resolution_info', resolution)

      if (resolutionPhoto) {
        formData.append('resolution_photo', resolutionPhoto)
      }

      fetch(`/api/department/complaints/${complaint.id}`, {
        method: 'PUT',
        body: formData,
      })

      Do not manually set Content-Type when using FormData.
      The browser will set the correct multipart boundary.

      Show success ONLY after Flask returns a successful response.
    */

    setSuccess(true)

    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }

  /*
    DATABASE TABLES REQUIRED:

    complaints
    - complaint_id
    - citizen_id
    - title
    - category
    - subcategory
    - description
    - location
    - department_id
    - status
    - created_at
    - updated_at
    - resolution_info
    - resolved_at
    - resolved_by

    users
    - user_id
    - name
    - email
    - password_hash
    - role
    - department_id

    departments
    - department_id
    - department_name

    complaint_status_history
    - history_id
    - complaint_id
    - status
    - remarks
    - changed_by
    - changed_at

    complaint_photos
    - photo_id
    - complaint_id
    - photo_type
    - file_path
    - uploaded_by
    - uploaded_at

    notifications
    - notification_id
    - recipient_user_id
    - complaint_id
    - message
    - type
    - is_read
    - created_at
  */

  /*
    STATUS HISTORY:

    Every important status change should create a new
    record in complaint_status_history.

    Example:

    CC-1024 | Assigned | Department received complaint
    CC-1024 | In Progress | Repair work started
    CC-1024 | Resolved | Pothole repaired

    Do NOT overwrite old history records.

    The citizen timeline will later read these records
    using an API such as:

    GET /api/citizen/complaints/:complaint_id/timeline
  */

  if (!departmentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-slate-200">

          <div className="text-5xl">
            🔐
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Login Required
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Please sign in to access department complaints.
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Go to Login
          </button>

        </div>

      </div>
    )
  }

  /*
    UNAUTHORIZED COMPLAINT:

    If the complaint does not belong to the logged-in
    department, access is blocked.

    FINAL BACKEND:
    Flask must perform the same authorization check
    before returning complaint details or accepting updates.
  */

  if (!complaint || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-slate-200">

          <div className="text-5xl">
            🚫
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Access Restricted
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This complaint is not assigned to your department or could not be
            found.
          </p>

          <button
            type="button"
            onClick={() => navigate('/department/dashboard')}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
              🏛️
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                CivicResolve
              </h1>

              <p className="text-xs text-slate-500">
                Department Portal
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => navigate('/department/dashboard')}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ← Dashboard
          </button>

        </div>

      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        {/* Heading */}
        <div className="mb-6">

          <p className="text-sm font-medium text-blue-600">
            Complaint Details
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-3">

            <h2 className="text-3xl font-bold text-slate-900">
              {complaint.id}
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                status,
              )}`}
            >
              {status}
            </span>

          </div>

          <p className="mt-2 text-sm text-slate-500">
            Review the complaint and update its progress.
          </p>

        </div>

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            Complaint updated successfully.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Complaint Information */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Complaint Title
                </p>

                <h3 className="mt-1 text-2xl font-bold text-slate-900">
                  {complaint.title}
                </h3>

              </div>

              <div className="rounded-xl bg-blue-50 px-4 py-3 text-center">

                <p className="text-xs text-blue-600">
                  Submitted
                </p>

                <p className="mt-1 text-sm font-semibold text-blue-800">
                  {complaint.date}
                </p>

              </div>

            </div>

            {/* Basic Information */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Category
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {complaint.category}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Location
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {complaint.location}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Citizen
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {complaint.citizen}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Department
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {complaint.department}
                </p>
              </div>

            </div>

            {/* Description */}
            <div className="mt-6 border-t border-slate-200 pt-6">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Description
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {complaint.description}
              </p>

            </div>

            {/*
              COMPLAINT PHOTO:

              Current UI only shows a placeholder.

              FINAL BACKEND:

              Get citizen-uploaded complaint photos from:

              GET /api/department/complaints/:complaint_id/photos

              Suggested database table:
              complaint_photos

              The backend should return the stored file URL/path.

              Do not store large image files directly inside MySQL.
              Store the file in server/cloud storage and save its
              path or URL in MySQL.
            */}

            {/* Complaint Photo */}
            <div className="mt-6">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Complaint Photo
              </p>

              <div className="mt-2 flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">

                <div className="text-center">

                  <div className="text-4xl">
                    📷
                  </div>

                  <p className="mt-2 text-sm font-medium text-slate-600">
                    Complaint image preview
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Citizen uploaded image will appear here after backend
                    integration.
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* Update Panel */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

            <h3 className="text-xl font-semibold text-slate-900">
              Update Complaint
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Update the current progress and resolution information.
            </p>

            {/*
              STATUS UPDATE:

              Final allowed flow:

              Submitted
                  ↓
              Verified
                  ↓
              Assigned
                  ↓
              In Progress
                  ↓
              Resolved
                  ↓
              Closed

              Department should only be allowed to perform
              the status changes permitted by the final
              project rules.

              Flask must validate the status transition.
              Do not rely only on the select box.
            */}

            {/* Status */}
            <div className="mt-6">

              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Complaint Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as ComplaintStatus)
                  setError('')
                  setSuccess(false)
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Submitted">
                  Submitted
                </option>

                <option value="Assigned">
                  Assigned
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>
              </select>

            </div>

            {/*
              REMARKS:

              Current remarks are temporary React state.

              FINAL BACKEND:

              Save department remarks in the database.

              Suggested table:

              complaint_remarks
              - remark_id
              - complaint_id
              - user_id
              - remark
              - created_at

              OR remarks can be stored along with
              complaint_status_history when the remark
              belongs to a status update.

              Every remark should be associated with
              the department user who created it.
            */}

            {/* Remarks */}
            <div className="mt-5">

              <label
                htmlFor="remarks"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Remarks
              </label>

              <textarea
                id="remarks"
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value)
                  setError('')
                  setSuccess(false)
                }}
                rows={5}
                placeholder="Enter work progress or remarks..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/*
              RESOLUTION:

              Resolution details should be saved in the
              complaints table when the complaint is resolved.

              Suggested fields:

              resolution_info
              resolved_at
              resolved_by

              Backend should record which department user
              marked the complaint as resolved.

              Citizen should be able to see this information
              on the Complaint Details page.
            */}

            {/* Resolution */}
            <div className="mt-5">

              <label
                htmlFor="resolution"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Resolution Details
              </label>

              <textarea
                id="resolution"
                value={resolution}
                onChange={(e) => {
                  setResolution(e.target.value)
                  setError('')
                  setSuccess(false)
                }}
                rows={4}
                placeholder="Enter resolution details..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {status === 'Resolved' && (
                <p className="mt-1.5 text-xs text-slate-400">
                  Resolution details are required when marking a complaint as
                  resolved.
                </p>
              )}

            </div>

            {/*
              RESOLUTION PHOTO:

              Current file is stored only in React memory.

              FINAL BACKEND:

              Send the image using multipart/form-data.

              Flask should:
              1. Validate file type.
              2. Validate file size.
              3. Store the image safely.
              4. Save its path/URL in complaint_photos.
              5. Link it to the complaint ID.
              6. Record which department user uploaded it.

              Example:
              photo_type = "resolution"
            */}

            {/* Resolution Photo */}
            <div className="mt-5">

              <label
                htmlFor="resolution-photo"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Resolution Photo
              </label>

              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">

                <input
                  id="resolution-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setResolutionPhoto(file)
                    setSuccess(false)
                  }}
                  className="w-full text-sm text-slate-500"
                />

                {resolutionPhoto && (
                  <p className="mt-2 truncate text-xs font-medium text-blue-600">
                    Selected: {resolutionPhoto.name}
                  </p>
                )}

                <p className="mt-2 text-xs text-slate-400">
                  Resolution image upload will be connected to backend later.
                </p>

              </div>

            </div>

            {/*
              NOTIFICATIONS:

              After a successful update, Flask should create
              notifications where required.

              Examples:

              Status changed:
              "Complaint CC-1024 is now In Progress."

              Resolved:
              "Complaint CC-1024 has been resolved."

              Suggested APIs/tables:

              notifications table
              - notification_id
              - recipient_user_id
              - complaint_id
              - message
              - type
              - is_read
              - created_at

              Citizen notification:
              recipient = complaint.citizen_id

              Admin notification:
              recipient = Admin user

              The frontend should show success only after
              the backend confirms that the update was saved.
            */}

            {/* Update Button */}
            <button
              type="button"
              onClick={handleUpdate}
              className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99]"
            >
              Update Complaint
            </button>

          </section>

        </div>

      </main>

    </div>
  )
}

export default DepartmentComplaintDetails