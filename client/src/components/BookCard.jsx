// Add this to your BookCard component
import { useState } from 'react';
import {Trash2 } from 'lucide-react';

const BookCard = ({ book, onClick, onDeleteBook }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent opening the modal
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    onDeleteBook(book.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="book-card" onClick={() => onClick(book)}>
      {/* modify image size */}
      <img className="book-cover" src={book.cover} alt={book.title} />
      <div className="book-info">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
      </div>
      
      {/* Delete button */}
      <button 
        className="delete-btn-card" 
        onClick={handleDeleteClick}
        title="Delete book"
      >
        {/* have been using lucide reatc for project instead of fontawesome */}
        <Trash2 size={16} />
      </button>

      {/* Confirmation dialog */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={handleCancelDelete}>
          <div className="delete-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p>Delete "{book.title}"?</p>
            <div className="delete-confirm-buttons">
              <button onClick={handleConfirmDelete} className="confirm-delete-btn">
                Delete
              </button>
              <button onClick={handleCancelDelete} className="cancel-delete-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCard;