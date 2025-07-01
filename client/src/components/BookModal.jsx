import { useState, useEffect } from 'react'
import {Star, Plus, Trash2} from 'lucide-react'
import Modal from './Modal'

// shows the book info

export default function BookModal(props){
    const { isOpen, onClose, book, onUpdateBook} = props
    
    const [newSession, setNewSession] = useState({
        date: new Date().toISOString().split('T')[0],
        startPage: '',
        endPage: '',
        notes: ''
    })

    const [showAddSession, setShowAddSession] = useState(false)

    // Reset form when book changes or modal closes
    useEffect(() => {
        if (!isOpen) {
            setShowAddSession(false)
            setNewSession({
                date: new Date().toISOString().split('T')[0],
                startPage: '',
                endPage: '',
                notes: ''
            })
        }
    }, [isOpen, book?.id])

    if(!book) return null

    // Calculate progress based on reading sessions
    const calculateProgress = (sessions, totalPages) => {
        if (!totalPages || sessions.length === 0) return 0
        
        // Get the highest end page from all sessions
        const maxPageRead = Math.max(...sessions.map(session => session.endPage))
        return Math.min(Math.round((maxPageRead / totalPages) * 100), 100)
    }

    // Calculate total pages read
    const calculatePagesRead = (sessions) => {
        if (sessions.length === 0) return 0
        return Math.max(...sessions.map(session => session.endPage))
    }

    // Determine book status based on progress
    const getBookStatus = (progress) => {
        if (progress === 0) return 'to-read'
        if (progress === 100) return 'completed'
        return 'reading'
    }

    const handleAddSession = () => {
        if (!newSession.startPage || !newSession.endPage) {
            alert('Please fill in start and end pages')
            return
        }

        if (parseInt(newSession.endPage) < parseInt(newSession.startPage)) {
            alert('End page must be greater than or equal to start page')
            return
        }

        if (book.totalPages && parseInt(newSession.endPage) > book.totalPages) {
            alert('End page cannot exceed total pages')
            return
        }

        const session = {
            id: Date.now(),
            date: newSession.date,
            startPage: parseInt(newSession.startPage),
            endPage: parseInt(newSession.endPage),
            notes: newSession.notes
        }

        // Ensure readingSessions array exists
        const currentSessions = book.readingSessions || []
        const updatedSessions = [...currentSessions, session]
        const progress = calculateProgress(updatedSessions, book.totalPages)
        const status = getBookStatus(progress)

        const updatedBook = {
            ...book,
            readingSessions: updatedSessions,
            progress,
            status,
            currentPage: calculatePagesRead(updatedSessions),
            startDate: book.startDate || (updatedSessions.length > 0 ? updatedSessions[0].date : null),
            endDate: progress === 100 ? newSession.date : (progress < 100 ? null : book.endDate)
        }

        console.log('Adding session:', session)
        console.log('Updated book:', updatedBook)
        onUpdateBook(updatedBook)

        // Reset form
        setNewSession({
            date: new Date().toISOString().split('T')[0],
            startPage: '',
            endPage: '',
            notes: ''
        })
        setShowAddSession(false)
    }

    const handleDeleteSession = (sessionId) => {
        // Ensure readingSessions array exists
        const currentSessions = book.readingSessions || []
        const updatedSessions = currentSessions.filter(session => session.id !== sessionId)
        const progress = calculateProgress(updatedSessions, book.totalPages)
        const status = getBookStatus(progress)

        const updatedBook = {
            ...book,
            readingSessions: updatedSessions,
            progress,
            status,
            currentPage: calculatePagesRead(updatedSessions),
            endDate: progress === 100 ? book.endDate : null
        }

        console.log('Deleting session:', sessionId)
        console.log('Updated sessions:', updatedSessions)
        console.log('Updated book:', updatedBook)
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
                <p className="book-date">Started: {book.startDate || 'Not started'}</p>
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
                    {book.currentPage || 0} of {book.totalPages} pages ({book.progress}%)
                </p>
                )}
            </div>
            </div>

            {/* Progress Bar */}
            <div className="form-group">
                <label className="form-label">Progress: {book.progress}%</label>
                <div className="progress-bar">
                    <div 
                    className="progress-fill"
                    style={{ width: `${book.progress}%` }}
                    />
                </div>
            </div>

            {/* Reading Sessions Section */}
            <div className="form-group">
                <div className="reading-sessions-header">
                    <label className="form-label">Reading Sessions</label>
                    <button 
                        onClick={() => setShowAddSession(!showAddSession)}
                        className="btn-small btn-primary"
                    >
                        <Plus size={16} />
                        Add Session
                    </button>
                </div>

                {/* Add Session Form */}
                {showAddSession && (
                    <div className="add-session-form">
                        <div className="session-form-row">
                            <div className="form-group-small">
                                <label className="form-label-small">Date</label>
                                <input
                                    type="date"
                                    value={newSession.date}
                                    onChange={(e) => setNewSession(prev => ({...prev, date: e.target.value}))}
                                    className="form-input-small"
                                />
                            </div>
                            <div className="form-group-small">
                                <label className="form-label-small">Start Page</label>
                                <input
                                    type="number"
                                    value={newSession.startPage}
                                    onChange={(e) => setNewSession(prev => ({...prev, startPage: e.target.value}))}
                                    className="form-input-small"
                                    min="1"
                                    max={book.totalPages}
                                />
                            </div>
                            <div className="form-group-small">
                                <label className="form-label-small">End Page</label>
                                <input
                                    type="number"
                                    value={newSession.endPage}
                                    onChange={(e) => setNewSession(prev => ({...prev, endPage: e.target.value}))}
                                    className="form-input-small"
                                    min="1"
                                    max={book.totalPages}
                                />
                            </div>
                        </div>
                        <div className="form-group-small">
                            <label className="form-label-small">Session Notes (Optional)</label>
                            <input
                                type="text"
                                value={newSession.notes}
                                onChange={(e) => setNewSession(prev => ({...prev, notes: e.target.value}))}
                                className="form-input-small"
                                placeholder="Notes about this reading session..."
                            />
                        </div>
                        <div className="session-form-buttons">
                            <button onClick={handleAddSession} className="btn-small btn-primary">
                                Add Session
                            </button>
                            <button 
                                onClick={() => setShowAddSession(false)} 
                                className="btn-small btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Sessions List */}
                <div className="sessions-list">
                    {(book.readingSessions && book.readingSessions.length > 0) ? (
                        [...(book.readingSessions)].sort((a, b) => new Date(b.date) - new Date(a.date)).map((session) => (
                            <div key={session.id} className="session-item">
                                <div className="session-info">
                                    <div className="session-date">{session.date}</div>
                                    <div className="session-pages">
                                        Pages {session.startPage} - {session.endPage} 
                                        <span className="pages-read">({session.endPage - session.startPage + 1} pages)</span>
                                    </div>
                                    {session.notes && (
                                        <div className="session-notes">{session.notes}</div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => handleDeleteSession(session.id)}
                                    className="btn-small btn-danger"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="no-sessions">No reading sessions yet. Add one to start tracking your progress!</p>
                    )}
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
                    <span className="stat-label">Average Pages per Day:</span>
                    <span className="stat-value">
                        {Math.round(book.totalPages / Math.ceil((new Date(book.endDate) - new Date(book.startDate)) / (1000 * 60 * 60 * 24)))}
                    </span>
                    </div>
                )}
                {book.readingSessions && book.readingSessions.length > 0 && (
                    <div className="stat-item">
                    <span className="stat-label">Total Reading Sessions:</span>
                    <span className="stat-value">{book.readingSessions.length}</span>
                    </div>
                )}
                </div>
            </div>
            )}
        </div>
        </Modal>
  )
}