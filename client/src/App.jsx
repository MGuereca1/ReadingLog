import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './components/layout'
import BookTable from './components/BookTable'
import AddBookForm from './components/AddBookForm'
import BookModal from './components/BookModal'
import BookCard from './components/BookCard'
import BookService from './api/bookservice'

function App() {
  // Add these state variables that were missing
  const [viewMode, setViewMode] = useState('bookshelf'); // 'bookshelf' or 'list'
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null) //for bookmodal

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false) // Track if we've tried to load books
  
  // load books from API component mount
  useEffect(()=>{
    loadBooks()
  }, [])

  // function to load all books from the API
  const loadBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const booksData = await BookService.getAllBooks()

      // transform data to match your frontend structure
      const transformedBooks = booksData.map(book => ({
        ...book,
        id: book._id, //mongodb uses _id but frontend uses id
        cover: book.cover || `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop&auto=format&q=80&sig=${book._id}`, // fallback cover
        readingSessions: book.readingSessions || []
      }))
      
      setBooks(transformedBooks)
      setHasAttemptedLoad(true)
    } catch (err) {
      console.error('Failed to load books: ', err)
      // Only show error if we have attempted to load and there might be existing books
      if (hasAttemptedLoad || books.length > 0) {
        setError('Failed to load books. Please try again.')
      }
      setHasAttemptedLoad(true)
    } finally {
      setLoading(false)
    }
  }

// Function to add a new book
  const handleAddBook = async (newBookData) => {
    try {
      const createdBook = await BookService.createBook(newBookData);
      
      // Transform the created book to match frontend structure
      const transformedBook = {
        ...createdBook,
        id: createdBook._id,
        cover: createdBook.cover || `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop&auto=format&q=80&sig=${createdBook._id}`,
        readingSessions: createdBook.readingSessions || []
      };
      
      setBooks(prev => [...prev, transformedBook]);
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add book:', err);
      setError('Failed to add book. Please try again.');
    }
  };

  // Function to update an existing book
  const handleUpdateBook = async (updatedBookData) => {
    try {
      // Use MongoDB _id for the API call
      const bookId = updatedBookData._id || updatedBookData.id;
      
      // Prepare data for API (remove frontend-specific fields)
      const apiUpdateData = {
        title: updatedBookData.title,
        author: updatedBookData.author,
        totalPages: updatedBookData.totalPages,
        notes: updatedBookData.notes,
        rating: updatedBookData.rating,
        readingSessions: updatedBookData.readingSessions
      };
      
      const updatedBook = await BookService.updateBook(bookId, apiUpdateData);
      
      // Transform the updated book
      const transformedBook = {
        ...updatedBook,
        id: updatedBook._id,
        cover: updatedBook.cover || updatedBookData.cover,
        readingSessions: updatedBook.readingSessions || []
      };
      
      // Update local state
      setBooks(prev => prev.map(book =>
        book.id === transformedBook.id ? transformedBook : book
      ));
      
      // Update selected book if it's the same book
      if (selectedBook && selectedBook.id === transformedBook.id) {
        setSelectedBook(transformedBook);
      }
    } catch (err) {
      console.error('Failed to update book:', err);
      setError('Failed to update book. Please try again.');
    }
  };

  // Function to delete a book
  const handleDeleteBook = async (bookId) => {
    try {
      await BookService.deleteBook(bookId);
      setBooks(prev => prev.filter(book => book.id !== bookId));
      
      // Close modal if the deleted book was selected
      if (selectedBook && selectedBook.id === bookId) {
        setSelectedBook(null);
      }
    } catch (err) {
      console.error('Failed to delete book:', err);
      setError('Failed to delete book. Please try again.');
    }
  };

  // BookGrid component for bookshelf view
  const BookGrid = () => (
    <div className="bookgrid">
      {books.map((book) => (
        <BookCard 
          key={book.id}
          book={book} 
          onClick={(book) => setSelectedBook(book)} 
        />
      ))}
    </div>
  )

  // Show loading state
  if (loading && !hasAttemptedLoad) {
    return (
      <Layout
        books={books}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddBook={() => setShowAddForm(true)}
      >
        <div className="loading">Loading books...</div>
      </Layout>
    )
  }

  return (
    <Layout
      books={books}
      viewMode={viewMode}
      setViewMode={setViewMode}
      onAddBook={() => setShowAddForm(true)}
    >
      {/* Only show error if we have books or have previously attempted to load */}
      {error && (hasAttemptedLoad || books.length > 0) && (
        <div className="error">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="error-btn"
          >
            X
          </button>
        </div>
      )}

      {/* Show empty state if no books and no error */}
      {!loading && books.length === 0 && !error && (
        <div className="empty-state">
          <p>No books in your reading log yet. Add your first book to get started!</p>
        </div>
      )}

      {/* book grid or table placed here */}
      {books.length > 0 && (
        viewMode === 'bookshelf' ? (
          <BookGrid />
        ) : (
          <BookTable 
            books={books} 
            onBookClick={(book) => setSelectedBook(book)}
            onDeleteBook={handleDeleteBook}
          />
        )
      )}

      <AddBookForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAddBook={handleAddBook}
      />

      {/* Bookmodal for viewing/editing book details */}
      <BookModal
        key={selectedBook?.id}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        book={selectedBook}
        onUpdateBook={handleUpdateBook}
        onDeleteBook={handleDeleteBook}
      />
    </Layout>
  )
}

export default App