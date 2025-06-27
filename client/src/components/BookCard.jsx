import { Star } from 'lucide-react';
const BookCard = ({ book, onClick }) => {
  return (
    <div 
      className="book-card"
      onClick={() => onClick && onClick(book)}
    >
      <div className="book-cover-container">
        <img 
          src={book.cover} 
          alt={book.title}
          className="book-cover"
        />
        <div className="progress-overlay">
          <div className="progress-container">
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill"
                style={{ width: `${book.progress}%` }}
              ></div>
            </div>
            <p className="progress-text">{book.progress}% complete</p>
          </div>
        </div>
      </div>
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">{book.author}</p>
      <div className="book-footer">
        <span className={`status-badge ${
          book.status === 'completed' ? 'status-completed' : 'status-reading'
        }`}>
          {book.status}
        </span>
        {book.rating > 0 && (
          <div className="rating-container">
            {[...Array(book.rating)].map((_, i) => (
              <Star key={i} className="star" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;