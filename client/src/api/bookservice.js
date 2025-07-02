// integrate the exsiting frontend with the backend

const API_BASE_URL = 'http://localhost:5050/api'

class BookService{
    // get all books
    static async getAllBooks(){
        try{
            const response = await fetch(`${API_BASE_URL}/books`)
            
            if(!response.ok){
                throw  new Error(`HTTP error! status: ${response.status}`)
            }
            return await response.json()
        } catch (err){
            console.error('Error fetching books: ', err)
            throw err
        }
    }

    // get a single book by ID
    static async getBookbyId(id){
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return await response.json()
        } catch (err) {
            console.error('Error fetching book: ', err)
            throw err
        }
    }

    // create new book
    static async createBook(bookData) {
        try {
            const response = await fetch(`${API_BASE_URL}/books`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return await response.json()
        } catch (err) {
            console.error('Error fetching book: ', err)
            throw err
        }
    }

    // update book (for reading sessions, ratings)
    static async updateBook(id, updateData) {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            })

         if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return await response.json()
        } catch (err) {
            console.error('Error updating book: ', err)
            throw err
        }
    }

    // deleting a book
    static async deleteBook(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`,{
                method: 'DELETE',
            })

         if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return await response.json()
        } catch (err) {
            console.error('Error deleting book: ', err)
            throw err
        }
    }
}

export default BookService