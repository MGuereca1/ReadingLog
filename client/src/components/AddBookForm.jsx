import { useState } from 'react'
import Modal from './Modal'

export default function AddBookForm(props) {
    const { isOpen, onClose, onAddBook } = props
    
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        totalPages: '',
        notes: '',
        cover: null
  })

    const [imgPreview, setImgPreview] = useState(null)

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleFileChange = (e)=>{
    const file = e.target.files[0]

    if (file) {
      // validate file type
      if(!file.type.startsWith('image/')){
        alert('Please select valid image file (PNG, JPG, etc.')
        return
      }

      // limit file size to 10mb
      if (file.size > 10 * 1024 * 1024){
        alert("File size must be less than 10MB")
        return
      }

      // convert to base64 for storage
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64String = event.target.result
        setFormData(prev => ({
          ...prev,
          cover: base64String
        }))
        setImgPreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      cover: null
    }))
    setImgPreview(null)
    
    // clear file input
    const fileInput = document.getElementById('cover')
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.author) {
      alert('Please fill in title and author')
      return
    }

    // Create the book object with reading sessions array
    const newBook = {
      id: Date.now(), // Simple ID generation
      title: formData.title,
      author: formData.author,
      totalPages: parseInt(formData.totalPages) || 0,
      currentPage: 0,
      progress: 0, // Will be calculated from reading sessions
      status: 'to-read',
      rating: 0,
      notes: formData.notes,
      cover: formData.cover, //add cover img to book object
      readingSessions: [], // Array to store reading sessions
      startDate: null,
      endDate: null
    }

    onAddBook(newBook);
    
    // Reset form
    setFormData({
      title: '',
      author: '',
      totalPages: '',
      notes: '',
      cover: null
    })
    setImgPreview(null)
    
    onClose()
  };

  const handleCancel = () => {
    // Reset form when canceling
    setFormData({
      title: '',
      author: '',
      totalPages: '',
      notes: '',
      cover: null
    })
    setImgPreview(null)
    onClose()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleCancel} 
      title="Add New Book"
      size="medium"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter book title"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Author *</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter author name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Total Pages</label>
          <input
            type="number"
            name="totalPages"
            value={formData.totalPages}
            onChange={handleChange}
            className="form-input"
            placeholder="Total number of pages"
            min="1"
          />
        </div>

        {/* book cover modifications, MODIFY SO CSS IS NOT HERE*/}
        <div className='form-group'>
          <label className='form-label'>Book cover</label>
          <input
            type='file'
            id='cover'
            accept='image/*'
            onChange={handleFileChange}
            className='form-input'
          />
        {imgPreview && (
          <div className='img-preview-container' style={{marginTop: '10px'}}>
            <img
              src={imgPreview}
              alt='Book cover preview'
              className='img-preview'
            />
            <button
              type='button'
              onClick={handleRemoveImage}
              className='btn-rmv-img'
              >
              Remove
            </button>
          </div>
        )}
        </div>
        
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Your overall thoughts on this book"
            rows="3"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            Add Book
          </button>
          <button type="button" onClick={handleCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}