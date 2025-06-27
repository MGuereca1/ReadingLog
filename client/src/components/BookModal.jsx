import {Star} from 'lucide-react'
import Modal from './Modal'

export default function BookModal(props){
    const { isOpen, onClose, book, onUpdateBook} = props

    if(!book) return null

    const updateBookProgress = (progress) => {
        const updatedBook = {
            ...book,
            progress: parseInt(progress),
            status: progress === 100 ? 'completed' : progress > 0 ? 'reading':'to-read',
            endDate: progress === 1000 ? new Date().toISOString().split('T')[0] : book.endDate
        }
        onUpdateBook(updatedBook)
    }

    const updateBookRating = (rating) => {
    const updatedBook = { ...book, rating }
    onUpdateBook(updatedBook);
  }

    const updateBookNotes = (notes) => {
        const updatedBook = { ...book, notes }
        onUpdateBook(updatedBook);
    }

    const getStatusColor = (status) => {
        switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'reading':
            return 'bg-blue-100 text-blue-800';
        case 'to-read':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={book.title}
        size="large"
        >
        <div className="book-modal-content">
            {/* Book Info Section */}
            <div className="book-info-section">
            <div className="book-cover-container">
                <img 
                src={book.cover || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop"} 
                alt={book.title}
                className="book-cover-large"
                />
            </div>
            
            <div className="book-details">
                <p className="book-author">by {book.author}</p>
                <div className="book-dates">
                <p className="book-date">Started: {book.startDate}</p>
                {book.endDate && (
                    <p className="book-date">Finished: {book.endDate}</p>
                )}
                </div>
                <div className="book-status-container">
                <span className={`book-status-badge ${getStatusColor(book.status)}`}>
                    {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                </span>
                </div>
                {book.totalPages && (
                <p className="book-pages">
                    {book.currentPage || 0} of {book.totalPages} pages
                </p>
                )}
            </div>
            </div>

            {/* Progress Section */}
            <div className="form-group">
            <label className="form-label">
                Progress: {book.progress}%
            </label>
            <input
                type="range"
                min="0"
                max="100"
                value={book.progress}
                onChange={(e) => updateBookProgress(e.target.value)}
                className="progress-slider"
            />
            <div className="progress-bar">
                <div 
                className="progress-fill"
                style={{ width: `${book.progress}%` }}
                />
            </div>
            </div>

            {/* Rating Section */}
            <div className="form-group">
            <label className="form-label">Rating</label>
            <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`star-rating ${
                    star <= book.rating 
                        ? 'star-filled' 
                        : 'star-empty'
                    }`}
                    onClick={() => updateBookRating(star)}
                />
                ))}
                {book.rating > 0 && (
                <button 
                    onClick={() => updateBookRating(0)}
                    className="clear-rating-btn"
                >
                    Clear
                </button>
                )}
            </div>
            </div>

            {/* Notes Section */}
            <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
                value={book.notes || ''}
                onChange={(e) => updateBookNotes(e.target.value)}
                className="form-textarea"
                rows="4"
                placeholder="Your thoughts about this book..."
            />
            </div>

            {/* Reading Stats */}
            {book.status === 'completed' && book.startDate && book.endDate && (
            <div className="reading-stats">
                <h4 className="stats-title">Reading Stats</h4>
                <div className="stats-grid">
                <div className="stat-item">
                    <span className="stat-label">Days to Complete:</span>
                    <span className="stat-value">
                    {Math.ceil((new Date(book.endDate) - new Date(book.startDate)) / (1000 * 60 * 60 * 24))}
                    </span>
                </div>
                {book.totalPages && (
                    <div className="stat-item">
                    <span className="stat-label">Pages per Day:</span>
                    <span className="stat-value">
                        {Math.round(book.totalPages / Math.ceil((new Date(book.endDate) - new Date(book.startDate)) / (1000 * 60 * 60 * 24)))}
                    </span>
                    </div>
                )}
                </div>
            </div>
            )}
        </div>
        </Modal>
  )
}