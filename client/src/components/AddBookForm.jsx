import { useState } from 'react'
import Modal from './Modal'

export default function AddBookForm(props) {
    const { isOpen, onClose, onAddBook } = props
    
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        totalPages: '',
        currentPage: 0,
        notes: ''
  })

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.author) {
      alert('Please fill in title and author')
      return
    }

    //!!!!!!!!!!!! MODIFY FOR START AND END PAGE!!!!!!!!!!!!!!!!!

    // Create the book object
    const newBook = {
      id: Date.now(), // Simple ID generation
      title: formData.title,
      author: formData.author,
      totalPages: parseInt(formData.totalPages) || 0,
      currentPage: parseInt(formData.currentPage) || 0,
      progress: formData.totalPages ? Math.round((formData.currentPage / formData.totalPages) * 100) : 0,
      status: formData.currentPage === 0 ? 'to-read' : 'reading',
      rating: 0,
      startDate: new Date().toISOString().split('T')[0],
      notes: formData.notes
    }

    onAddBook(newBook);
    
    // Reset form
    setFormData({
      title: '',
      author: '',
      totalPages: '',
      currentPage: 0,
      notes: ''
    })
    
    onClose()
  };

  const handleCancel = () => {
    // Reset form when canceling
    setFormData({
      title: '',
      author: '',
      totalPages: '',
      currentPage: 0,
      notes: ''
    })
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

        <div className="form-group">
          <label className="form-label">Current Page</label>
          <input
            type="number"
            name="currentPage"
            value={formData.currentPage}
            onChange={handleChange}
            className="form-input"
            placeholder="Page you're currently on"
            min="0"
            max={formData.totalPages || undefined}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Your thoughts about this book..."
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