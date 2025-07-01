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
  
  // Sample books data - now with reading sessions structure
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
      totalPages: 288,
      currentPage: 216,
      progress: 75,
      status: "reading",
      rating: 0,
      startDate: "2024-06-01",
      notes: "Fascinating concept about infinite lives.",
      readingSessions: [
        {
          id: 1,
          date: "2024-06-01",
          startPage: 1,
          endPage: 50,
          notes: "Great opening, really drew me in"
        },
        {
          id: 2,
          date: "2024-06-03",
          startPage: 51,
          endPage: 120,
          notes: "The concept is becoming clearer"
        },
        {
          id: 3,
          date: "2024-06-05",
          startPage: 121,
          endPage: 216,
          notes: "Really enjoying the different life scenarios"
        }
      ]
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
      totalPages: 320,
      currentPage: 320,
      progress: 100,
      status: "completed",
      rating: 5,
      startDate: "2024-05-15",
      endDate: "2024-05-28",
      notes: "Life-changing book about building good habits.",
      readingSessions: [
        {
          id: 4,
          date: "2024-05-15",
          startPage: 1,
          endPage: 80,
          notes: "Strong start, practical advice"
        },
        {
          id: 5,
          date: "2024-05-20",
          startPage: 81,
          endPage: 200,
          notes: "The 4 laws of behavior change are brilliant"
        },
        {
          id: 6,
          date: "2024-05-28",
          startPage: 201,
          endPage: 320,
          notes: "Finished! Already implementing the strategies"
        }
      ]
    }
  ])

  // Function to add a new book
  const handleAddBook = (newBook) => {
    setBooks(prev => [...prev, newBook])
  }

  // function to update and existing book
  const handleUpdateBook = (updatedBook) => {
    setBooks(prev => prev.map(book =>
      book.id === updatedBook.id ? updatedBook : book
    ))
    
    // Update the selected book if it's the same book being updated
    if (selectedBook && selectedBook.id === updatedBook.id) {
      setSelectedBook(updatedBook)
    }
  }

  // BookGrid component for bookshelf view
  const BookGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
      onAddBook={() => setShowAddForm(true)}
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
        key={selectedBook?.id}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        book={selectedBook}
        onUpdateBook={handleUpdateBook}
      />
    </Layout>
  )
}

export default App