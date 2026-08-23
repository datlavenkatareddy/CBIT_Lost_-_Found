import { useState } from 'react'

function ReportItem() {
  const [reportType, setReportType] = useState('lost')
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    description: '',
    location: '',
    date: '',
    reportedBy: '',
    rollNo: '',
    contact: '',
    email: ''
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [successMsg, setSuccessMsg] = useState('')

  // Handle form field changes (controlled form)
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Handle image file selection using FileReader
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Form validation using JavaScript and Regular Expressions
  const validate = () => {
    const newErrors = {}

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required.'
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category.'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.'
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required.'
    }
    if (!formData.date) {
      newErrors.date = 'Date is required.'
    }
    if (!formData.reportedBy.trim()) {
      newErrors.reportedBy = 'Your name is required.'
    }

    // Roll number required only for lost items
    if (reportType === 'lost' && !formData.rollNo.trim()) {
      newErrors.rollNo = 'Roll number is required for lost item reports.'
    }

    // Phone validation using regex - Indian mobile number (10 digits, starts with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required.'
    } else if (!phoneRegex.test(formData.contact.trim())) {
      newErrors.contact = 'Enter a valid 10-digit Indian mobile number.'
    }

    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccessMsg('')

    if (!validate()) {
      return
    }

    // Create new item object
    const newItem = {
      id: Date.now(),
      type: reportType,
      itemName: formData.itemName.trim(),
      category: formData.category,
      description: formData.description.trim(),
      location: formData.location.trim(),
      date: formData.date,
      reportedBy: formData.reportedBy.trim(),
      rollNo: reportType === 'lost' ? formData.rollNo.trim() : '',
      contact: formData.contact.trim(),
      email: formData.email.trim(),
      image: imagePreview || '',
      status: 'active'
    }

    // Save to sessionStorage so it persists during navigation
    const existing = JSON.parse(sessionStorage.getItem('reportedItems') || '[]')
    existing.push(newItem)
    sessionStorage.setItem('reportedItems', JSON.stringify(existing))

    setSuccessMsg('Report submitted successfully!')

    // Reset form
    setFormData({
      itemName: '',
      category: '',
      description: '',
      location: '',
      date: '',
      reportedBy: '',
      rollNo: '',
      contact: '',
      email: ''
    })
    setImagePreview(null)
    setErrors({})

    // Reset file input
    const fileInput = document.getElementById('imageInput')
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="container mt-4 mb-4">
      <h2>Report an Item</h2>
      <p className="text-muted">What would you like to report?</p>

      {/* Report type toggle */}
      <div className="btn-group mb-4" role="group" aria-label="Report type">
        <button
          type="button"
          className={`btn report-type-btn ${reportType === 'lost' ? 'btn-danger' : 'btn-outline-danger'}`}
          onClick={() => { setReportType('lost'); setErrors({}); setSuccessMsg('') }}
        >
          Lost Item
        </button>
        <button
          type="button"
          className={`btn report-type-btn ${reportType === 'found' ? 'btn-success' : 'btn-outline-success'}`}
          onClick={() => { setReportType('found'); setErrors({}); setSuccessMsg('') }}
        >
          Found Item
        </button>
      </div>

      {/* Success alert */}
      {successMsg && (
        <div className="alert alert-success" role="alert">
          {successMsg}
        </div>
      )}

      {/* Report form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="itemName" className="form-label">Item Name *</label>
            <input
              type="text"
              className={`form-control ${errors.itemName ? 'is-invalid' : ''}`}
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
            />
            {errors.itemName && <div className="invalid-feedback">{errors.itemName}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="category" className="form-label">Category *</label>
            <select
              className={`form-select ${errors.category ? 'is-invalid' : ''}`}
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Documents">Documents</option>
              <option value="Books">Books</option>
              <option value="Accessories">Accessories</option>
              <option value="Others">Others</option>
            </select>
            {errors.category && <div className="invalid-feedback">{errors.category}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description *</label>
          <textarea
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="location" className="form-label">Location *</label>
            <input
              type="text"
              className={`form-control ${errors.location ? 'is-invalid' : ''}`}
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            {errors.location && <div className="invalid-feedback">{errors.location}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="date" className="form-label">
              {reportType === 'lost' ? 'Date Lost' : 'Date Found'} *
            </label>
            <input
              type="date"
              className={`form-control ${errors.date ? 'is-invalid' : ''}`}
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <div className="invalid-feedback">{errors.date}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="reportedBy" className="form-label">Your Name *</label>
            <input
              type="text"
              className={`form-control ${errors.reportedBy ? 'is-invalid' : ''}`}
              id="reportedBy"
              name="reportedBy"
              value={formData.reportedBy}
              onChange={handleChange}
            />
            {errors.reportedBy && <div className="invalid-feedback">{errors.reportedBy}</div>}
          </div>

          {/* Roll Number - shown only for Lost reports */}
          {reportType === 'lost' && (
            <div className="col-md-6 mb-3">
              <label htmlFor="rollNo" className="form-label">Roll Number *</label>
              <input
                type="text"
                className={`form-control ${errors.rollNo ? 'is-invalid' : ''}`}
                id="rollNo"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="e.g. 23A91A0501"
              />
              {errors.rollNo && <div className="invalid-feedback">{errors.rollNo}</div>}
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="contact" className="form-label">Contact Number *</label>
            <input
              type="tel"
              className={`form-control ${errors.contact ? 'is-invalid' : ''}`}
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
            />
            {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">Email *</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. name@cbit.ac.in"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
        </div>

        {/* Image upload */}
        <div className="mb-3">
          <label htmlFor="imageInput" className="form-label">Item Image</label>
          <input
            type="file"
            className="form-control"
            id="imageInput"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleImageChange}
          />
          <div className="form-text">Optional. Accepted formats: JPG, PNG, WebP</div>
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div className="mb-3">
            <p className="mb-1"><strong>Image Preview:</strong></p>
            <img src={imagePreview} alt="Preview" className="img-thumbnail image-preview" />
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Submit Report
        </button>
      </form>
    </div>
  )
}

export default ReportItem
