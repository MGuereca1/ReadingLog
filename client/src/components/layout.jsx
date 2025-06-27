import { useState } from "react";
import { Book, Plus, Grid, List, User, Star, Calendar} from "lucide-react"

export default function Layout(props){
    const  {books, viewMode, setViewMode, onAddBook, children} = props

    // calculate stats
    const totalBooks = books.length
    const currentlyReading = books.filter(book => book.status === 'reading').length
    const completed = books.filter(book => book.status === 'completed').length
    const avgRating = books.filter(book => book.rating > 0).length > 0 
    ? Math.round( 
        books.filter(book => book.rating > 0)
            .reduce((acc, book) => acc + book.rating, 0) /
        books.filter(book => book.rating > 0).length * 10 
    ) / 10
    :0

     const Header = (
        <header className="header">
            <div className="header-left">
                <Book className="app-icon" />
                <div>
                    <h1 className="title">My Reading Log</h1>
                    <p className="subtitle">Keep track of your reading</p>
                </div>
            </div>
            
            <div className="header-controls">
                <button onClick={onAddBook} className="add-book-btn">
                    <Plus className="btn-icon" />
                    Add Book
                </button>
                
                <div className="toggle-btns">
                    <button
                        onClick={() => setViewMode('bookshelf')}
                        className={`toggle-btn ${viewMode === 'bookshelf' ? 'active' : ''}`}
                    >
                        <Grid className="btn-icon" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                    >
                        <List className="btn-icon" />
                    </button>
                </div>
            </div>
        </header>
    );

    const StatusBar = (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-header">
                    <Book className="stat-icon blue" />
                    <span className="stat-number">{totalBooks}</span>
                </div>
                <p className="stat-label">Total Books</p>
            </div>
            
            <div className="stat-card">
                <div className="stat-header">
                    <User className="stat-icon green" />
                    <span className="stat-number">{currentlyReading}</span>
                </div>
                <p className="stat-label">Currently Reading</p>
            </div>
            
            <div className="stat-card">
                <div className="stat-header">
                    <Star className="stat-icon yellow" />
                    <span className="stat-number">{completed}</span>
                </div>
                <p className="stat-label">Completed</p>
            </div>
            
            <div className="stat-card">
                <div className="stat-header">
                    <Calendar className="stat-icon purple" />
                    <span className="stat-number">{avgRating}</span>
                </div>
                <p className="stat-label">Avg Rating</p>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            <div className="main-content">
                {Header}
                {StatusBar}
                <main className="content">
                    {children}
                </main>
            </div>
        </div>
    );
}