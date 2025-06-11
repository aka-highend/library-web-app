import React, { useState } from "react";

const initialBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    category: "Fiction",
    publishing_year: 2020,
    author: "F. Scott Fitzgerald",
  },
  {
    id: 2,
    title: "1984",
    category: "Dystopian",
    publishing_year: 2015,
    author: "George Orwell",
  },
];

const BookList = () => {
  const [books, setBooks] = useState(initialBooks);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    publishing_year: "",
    author: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setBooks(
        books.map((b) =>
          b.id === editingId ? { ...formData, id: editingId } : b
        )
      );
    } else {
      const newBook = { ...formData, id: books.length + 1 };
      setBooks([...books, newBook]);
    }
    setFormData({ title: "", category: "", publishing_year: "", author: "" });
    setEditingId(null);
  };

  const handleEdit = (book) => {
    setFormData(book);
    setEditingId(book.id);
  };

  const handleDelete = (id) => setBooks(books.filter((b) => b.id !== id));

  return (
    <div>
      <h2>Books</h2>

      <input
        className="form-control mb-3"
        placeholder="Search title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col">
            <input
              className="form-control"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="col">
            <input
              className="form-control"
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            />
          </div>
          <div className="col">
            <input
              className="form-control"
              placeholder="Year"
              value={formData.publishing_year}
              onChange={(e) =>
                setFormData({ ...formData, publishing_year: e.target.value })
              }
              required
            />
          </div>
          <div className="col">
            <input
              className="form-control"
              placeholder="Author"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              required
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update" : "Add"} Book
            </button>
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Year</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.category}</td>
                <td>{book.publishing_year}</td>
                <td>{book.author}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav>
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              className={`page-item ${i + 1 === currentPage ? "active" : ""}`}
              key={i}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default BookList;
