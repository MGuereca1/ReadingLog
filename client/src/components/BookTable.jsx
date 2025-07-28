import { Star, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function BookTable({ books, onBookClick, onDeleteBook }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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

  const handleDeleteClick = (book, e) => {
    e.stopPropagation(); // Prevent row click
    setDeleteConfirm(book.id);
  };

  const handleConfirmDelete = (bookId, e) => {
    e.stopPropagation();
    onDeleteBook(bookId);
    setDeleteConfirm(null);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setDeleteConfirm(null);
  };

  if (books.length === 0) {
    return (
      <div className="empty-state">
        <p>No books in your library yet. Click "Add Book" to get started!</p>
      </div>
    );
  }

  return (
    <div className="book-table-container">
      <div className="table-wrapper">
        <table className="book-table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Book</th>
              <th className="table-header-cell">Author</th>
              <th className="table-header-cell">Progress</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Rating</th>
              <th className="table-header-cell">Date Started</th>
              {onDeleteBook && <th className="table-header-cell">Actions</th>}
            </tr>
          </thead>
          <tbody className="table-body">
            {books.map((book) => (
              <tr 
                key={book.id} 
                className="table-row"
                onClick={() => onBookClick && onBookClick(book)}
              >
                <td className="table-cell">
                  <div className="book-info">
                    <img 
                      src={book.cover} 
                      alt={book.title}
                      className="book-cover-small"
                    />
                    <span className="book-title">{book.title}</span>
                  </div>
                </td>
                <td className="table-cell">
                  <span className="book-author">{book.author}</span>
                </td>
                <td className="table-cell">
                  <div className="progress-container">
                    <div className="progress-bar-small">
                      <div 
                        className="progress-fill-small"
                        style={{ width: `${book.progress || 0}%` }}
                      />
                    </div>
                    <span className="progress-text">{book.progress || 0}%</span>
                  </div>
                </td>
                <td className="table-cell">
                  <span className={`status-badge ${getStatusColor(book.status)}`}>
                    {book.status ? book.status.charAt(0).toUpperCase() + book.status.slice(1) : 'Unknown'}
                  </span>
                </td>
                <td className="table-cell">
                  {book.rating > 0 ? (
                    <div className="rating-display">
                      {[...Array(book.rating)].map((_, i) => (
                        <Star key={i} className="star-small star-filled-small" />
                      ))}
                    </div>
                  ) : (
                    <span className="no-rating">-</span>
                  )}
                </td>
                <td className="table-cell">
                  <span className="date-text">{book.startDate || '-'}</span>
                </td>
                {onDeleteBook && (
                  <td className="table-cell">
                    {deleteConfirm === book.id ? (
                      <div className="delete-confirm-inline">
                        <button 
                          onClick={(e) => handleConfirmDelete(book.id, e)}
                          className="confirm-delete-btn"
                          title="Confirm delete"
                        >
                          Yes
                        </button>
                        <button 
                          onClick={handleCancelDelete}
                          className="cancel-delete-btn"
                          title="Cancel delete"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => handleDeleteClick(book, e)}
                        className="delete-btn-table"
                        title="Delete book"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}