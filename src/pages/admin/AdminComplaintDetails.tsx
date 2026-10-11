import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function AdminComplaintDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  /*
    BACKEND / DATABASE:
    Current complaint data is static demo data.

    FINAL VERSION:
    Fetch complaint details from Flask backend using complaint ID.

    Suggested API:
    GET /api/admin/complaints/:complaint_id

    Backend should:
    - Check Admin authentication.
    - Find complaint using complaint_id.
    - Get citizen details using citizen_id.
    - Get department using department_id.
    - Return complaint information.
    - Return current status.
    - Return location.
    - Return complaint photos.

    IMPORTANT:
    Admin authorization must be checked by Flask.
    Do not depend only on frontend route protection.
  */
  const complaints = {
    'CC-1024': {
      title: 'Road Maintenance Issue',
      category: 'Road & Transport',
      citizen: 'Rahul Patil',
      email: 'rahul.patil@example.com',
      contact: '+91 98765 43210',
      date: '02 October 2026',
      department: 'Road Department',
      status: 'In Progress',
      description:
        'There is a large pothole on the main road which is causing difficulty for vehicles and creating a safety risk for citizens.',
      location: 'Road near City Centre',
    },

    'CC-1023': {
      title: 'Garbage Not Collected',
      category: 'Garbage & Cleaning',
      citizen: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      contact: '+91 98765 12345',
      date: '01 October 2026',
      department: 'Sanitation Department',
      status: 'Pending',
      description:
        'Garbage has not been collected from the residential area for several days, resulting in an overflowing waste collection point.',
      location: 'Residential Area, Ward 12',
    },

    'CC-1022': {
      title: 'Street Light Not Working',
      category: 'Electrical & Street Lights',
      citizen: 'Amit Joshi',
      email: 'amit.joshi@example.com',
      contact: '+91 98765 67890',
      date: '30 September 2026',
      department: 'Electrical Department',
      status: 'Resolved',
      description:
        'The street light near the main road has stopped working, making the area dark and unsafe during night hours.',
      location: 'Main Road Junction',
    },

    'CC-1021': {
      title: 'Water Leakage',
      category: 'Water Supply',
      citizen: 'Sneha Kulkarni',
      email: 'sneha.kulkarni@example.com',
      contact: '+91 98765 24680',
      date: '29 September 2026',
      department: 'Water Department',
      status: 'In Progress',
      description:
        'A water pipeline is leaking continuously near the residential area and a significant amount of water is being wasted.',
      location: 'Shivaji Nagar Water Line',
    },

    'CC-1020': {
      title: 'Blocked Drain',
      category: 'Drainage & Sewage',
      citizen: 'Vikram More',
      email: 'vikram.more@example.com',
      contact: '+91 98765 13579',
      date: '28 September 2026',
      department: 'Drainage Department',
      status: 'Pending',
      description:
        'The roadside drainage line is blocked and dirty water is accumulating near the residential area.',
      location: 'Market Road Drain',
    },
  }

  const complaint =
    complaints[id as keyof typeof complaints] || complaints['CC-1024']

  /*
    BACKEND:
    These states are currently used only for frontend demonstration.

    FINAL VERSION:
    Initial values should come from the complaint returned by the backend.
    When Admin changes them, the new values should be sent to Flask.
  */
  const [department, setDepartment] = useState(complaint.department)
  const [status, setStatus] = useState(complaint.status)
  const [adminRemark, setAdminRemark] = useState('')
  const [resolutionInfo, setResolutionInfo] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    /*
      BACKEND / DATABASE:

      Current version only shows a success message.

      FINAL VERSION:
      Send the changed information to Flask backend.

      Suggested API:
      PUT /api/admin/complaints/:complaint_id

      Request data can include:
      {
        department_id,
        status,
        admin_remark,
        resolution_info
      }

      Backend should:
      1. Verify Admin authentication.
      2. Verify complaint exists.
      3. Validate selected department.
      4. Validate allowed status.
      5. Update complaints table.
      6. Save admin remark if provided.
      7. Save resolution information if provided.
      8. Add a record to complaint_status_history when status changes.
      9. Create a notification for the citizen when required.
      10. Create a notification for the department when a complaint is assigned.

      IMPORTANT:
      Database changes should happen only after backend validation.
    */
    setShowSuccess(true)
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
              Administration Portal
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/complaints')}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Complaints
          </button>

        </div>
      </header>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Heading */}
        <div className="mb-8">

          <p className="text-sm font-medium text-blue-700">
            Complaint Management
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Complaint Details
              </h2>

              <p className="mt-2 text-slate-500">
                Review complaint information and manage its progress.
              </p>
            </div>

            <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {id}
            </span>

          </div>

        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                ✓
              </div>

              <div>
                <p className="font-semibold text-emerald-800">
                  Complaint updated successfully
                </p>

                <p className="mt-1 text-sm text-emerald-700">
                  Department, status and complaint information have been saved.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* Complaint Information */}
        <div className="grid gap-6 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">

            <div className="border-b border-slate-200 px-6 py-5">

              <h3 className="text-lg font-bold text-slate-900">
                Complaint Information
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Details submitted by the citizen.
              </p>

            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Complaint ID
                </p>

                <p className="mt-2 font-semibold text-blue-700">
                  {id}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Submitted Date
                </p>

                <p className="mt-2 font-medium text-slate-800">
                  {complaint.date}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Complaint Title
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {complaint.title}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Category
                </p>

                <p className="mt-2 font-medium text-slate-800">
                  {complaint.category}
                </p>
              </div>

              <div className="sm:col-span-2">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <p className="mt-2 leading-7 text-slate-600">
                  {complaint.description}
                </p>

              </div>

            </div>

          </div>

          {/* Citizen Information */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">

              <h3 className="text-lg font-bold text-slate-900">
                Citizen Information
              </h3>

            </div>

            <div className="space-y-5 p-6">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Name
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {complaint.citizen}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  {complaint.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Contact
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  {complaint.contact}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/*
          BACKEND / DATABASE:

          Citizen information should come from the users table.

          Suggested relationship:
          complaints.citizen_id -> users.user_id

          Backend can use a JOIN to return:
          - citizen name
          - email
          - contact

          Do not allow Admin frontend to directly query the users table.
        */}

        {/* Location & Photo */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">

              <h3 className="text-lg font-bold text-slate-900">
                Issue Location
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Location submitted with the complaint.
              </p>

            </div>

            <div className="p-6">

              <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">

                <div className="text-center">

                  <div className="text-4xl">
                    📍
                  </div>

                  <p className="mt-3 font-semibold text-slate-700">
                    Location
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {complaint.location}
                  </p>

                </div>

              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">

              <h3 className="text-lg font-bold text-slate-900">
                Complaint Photo
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Photo submitted by the citizen.
              </p>

            </div>

            <div className="p-6">

              <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">

                <div className="text-center">

                  <div className="text-4xl">
                    📷
                  </div>

                  <p className="mt-3 font-semibold text-slate-700">
                    Complaint Image
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Photo for {complaint.title}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/*
          BACKEND / DATABASE — LOCATION:

          Current location is plain text.

          FINAL VERSION:
          Store location information in the complaints table.

          Suggested fields:
          - location
          - latitude (optional future feature)
          - longitude (optional future feature)

          Map functionality is currently postponed.

          BACKEND — PHOTO:

          Complaint photos should NOT be stored directly inside the
          complaints table as large image data.

          Suggested separate table:

          complaint_photos
          - photo_id
          - complaint_id
          - photo_type
          - file_path
          - uploaded_by
          - uploaded_at

          Backend should store the uploaded image in file storage
          and save only its path/URL in MySQL.

          Suggested API:
          GET /api/admin/complaints/:complaint_id/photos
        */}

        {/* Management */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <h3 className="text-lg font-bold text-slate-900">
              Complaint Management
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Assign the complaint and update its current status.
            </p>

          </div>

          <div className="grid gap-6 p-6 md:grid-cols-2">

            {/* Department */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Assigned Department
              </label>

              {/*
                BACKEND / DATABASE:

                Department list should eventually come from MySQL.

                Suggested API:
                GET /api/departments

                Suggested table:
                departments
                - department_id
                - department_name

                When Admin assigns a department, backend should save
                department_id in the complaints table.

                Example relationship:
                complaints.department_id -> departments.department_id
              */}
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value)
                  setShowSuccess(false)
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option>Road Department</option>
                <option>Water Department</option>
                <option>Electrical Department</option>
                <option>Sanitation Department</option>
                <option>Drainage Department</option>
                <option>Parks & Garden Department</option>
                <option>Public Safety Department</option>
              </select>

            </div>

            {/* Status */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Complaint Status
              </label>

              {/*
                BACKEND / DATABASE:

                Status should be stored in the complaints table.

                Suggested allowed status flow:
                Submitted -> Verified -> Assigned ->
                In Progress -> Resolved -> Closed

                Backend must validate that only authorized users
                can change complaint status.

                Every important status change should also be saved
                in complaint_status_history so the complete timeline
                is preserved.

                Suggested table:

                complaint_status_history
                - history_id
                - complaint_id
                - status
                - remarks
                - changed_by
                - changed_at
              */}
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setShowSuccess(false)
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option>Pending</option>
                <option>Verified</option>
                <option>Assigned</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>

            </div>

          </div>

          {/* Admin Remark */}
          <div className="px-6">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Admin Remark
            </label>

            {/*
              BACKEND / DATABASE:

              Admin remarks should be stored in MySQL.

              If remarks are part of the status history, they can be
              saved with complaint_status_history.

              If the project requires separate remarks, create:

              complaint_remarks
              - remark_id
              - complaint_id
              - user_id
              - remark
              - created_at

              Backend should record which Admin added the remark.
            */}
            <textarea
              value={adminRemark}
              onChange={(e) => {
                setAdminRemark(e.target.value)
                setShowSuccess(false)
              }}
              rows={4}
              placeholder="Add a remark about this complaint..."
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Resolution Information */}
          <div className="mt-6 px-6">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Resolution Information
            </label>

            {/*
              BACKEND / DATABASE:

              Resolution information should be saved when the complaint
              is resolved.

              Suggested field:
              complaints.resolution_info

              Backend should validate:
              - Only authorized Admin/Department can add resolution.
              - Resolution details should be present before marking
                complaint as Resolved.
              - Resolution date should be recorded.

              Suggested fields:
              - resolution_info
              - resolved_at
              - resolved_by
            */}
            <textarea
              value={resolutionInfo}
              onChange={(e) => {
                setResolutionInfo(e.target.value)
                setShowSuccess(false)
              }}
              rows={4}
              placeholder="Enter resolution details when the complaint is resolved..."
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-end">

            <button
              type="button"
              onClick={() => navigate('/admin/complaints')}
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              Save Changes
            </button>

          </div>

        </div>

        {/* Current Assignment */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <h3 className="text-lg font-bold text-slate-900">
              Current Assignment
            </h3>

          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Department
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {department}
              </p>

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </p>

              <span className="mt-2 inline-block rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                {status}
              </span>

            </div>

          </div>

        </div>

        {/*
          BACKEND / DATABASE — AFTER SAVE:

          After successful update, backend should:

          1. Update complaints table.
          2. Save department assignment.
          3. Save new complaint status.
          4. Save Admin remark.
          5. Save resolution information if provided.
          6. Add status history entry.
          7. Create citizen notification.
          8. Create department notification if assignment changed.

          Suggested response:
          {
            success: true,
            message: "Complaint updated successfully"
          }

          React should show the success message only after
          receiving a successful response from Flask.
        */}

      </section>

    </main>
  )
}

export default AdminComplaintDetails