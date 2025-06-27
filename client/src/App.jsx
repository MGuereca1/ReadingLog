import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './components/layout'
import BookTable from './components/BookTable'
import AddBookForm from './components/AddBookForm'
import BookModal from './components/BookModal'
import BookCard from './components/BookCard'

function App() {
  // Add these state variables that were missing
  const [viewMode, setViewMode] = useState('bookshelf'); // 'bookshelf' or 'list'
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null) //for bookmodal
  
  // Sample books data - replace with your actual data
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
      progress: 75,
      status: "reading",
      rating: 0,
      startDate: "2024-06-01",
      notes: "Fascinating concept about infinite lives."
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
      progress: 100,
      status: "completed",
      rating: 5,
      startDate: "2024-05-15",
      endDate: "2024-05-28",
      notes: "Life-changing book about building good habits."
    },
    {
      id: 3,
      title: "Dune",
      author: "Frank Herbert",
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
      progress: 45,
      status: "reading",
      rating: 0,
      startDate: "2024-06-10",
      notes: "Complex world-building. Taking notes to keep track of all the characters."
    }
  ]);

  // Function to add a new book
  const handleAddBook = (newBook) => {
    setBooks(prev => [...prev, newBook]);
  }

  // function to update and existing book
  const handleUpdateBook = (updatedBook) => {
    setBooks(prev => prev.map(book =>
      book.id === updatedBook.id ? updatedBook : book
    ))
  }

  // BookGrid component for bookshelf view
  const BookGrid = () => (
  <div className="book-grid">
    {books.map((book) => (
      <BookCard 
        key={book.id}
        book={book} 
        onClick={(book) => setSelectedBook(book)} 
      />
    ))}
  </div>
)

  return (
    <Layout
      books={books}
      viewMode={viewMode}
      setViewMode={setViewMode}
      onAddBook={() => setShowAddForm(true)} // Fixed: was OnAddBook, should be onAddBook
    >
      {/* book grid or table placed here */}
      {viewMode === 'bookshelf' ? (
        <BookGrid />
      ) : (
        <BookTable 
          books={books} 
          onBookClick={(book) => setSelectedBook(book)}
        />
      )}

      <AddBookForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAddBook={handleAddBook}
      />

      {/* Bookmodal for viewing/editing book details */}
      <BookModal
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        book={selectedBook}
        onUpdateBook={handleUpdateBook}
      />
    </Layout>
  )
}

export default App