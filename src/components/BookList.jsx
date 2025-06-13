import React, { useState, useEffect } from "react";

import { apiUrl } from "../utils/constants";

const BookList = () => {
  const [books, setBooks] = useState([]);
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

  const fetchBooks = () => {
    fetch(`${apiUrl}/books`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((book) => ({
          id: book.id,
          title: book.title,
          category: book.category,
          publishing_year: book.publishingYear,
          author: book.author || "Unknown",
        }));
        setBooks(formatted);
      })
      .catch((err) => console.error("Failed to fetch books:", err));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const payload = {
  //     title: formData.title,
  //     category: formData.category,
  //     publishingYear: parseInt(formData.publishing_year),
  //     author: {
  //       id: parseInt(formData.author),
  //     },
  //   };

  //   try {
  //     if (editingId) {
  //       // PUT update
  //       const response = await fetch(`${apiUrl}/books/${editingId}`, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       });
  //       if (!response.ok) throw new Error("Failed to update book");
  //     } else {
  //       // POST add
  //       const response = await fetch(`${apiUrl}/books`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       });
  //       if (!response.ok) throw new Error("Failed to add book");
  //     }

  //     // Refresh book list
  //     fetchBooks();
  //     setFormData({ title: "", category: "", publishing_year: "", author: "" });
  //     setEditingId(null);
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //   }
  // };

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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/books/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete book");
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

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
