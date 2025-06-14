import React, { useState, useEffect } from "react";

import { apiUrl } from "../utils/constants";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
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
        const formattedBook = data.map((book) => ({
          id: book?.id,
          title: book?.title,
          category: book?.category,
          publishing_year: book?.publishingYear,
          author: book?.author || "Unknown",
          authorId: book?.authorId || (book?.author && book?.author.id),
        }));
        setBooks(formattedBook);
      })
      .catch((err) => console.error("Failed to fetch books:", err));
  };

  useEffect(() => {
    fetchBooks();
    fetch(`${apiUrl}/authors`)
      .then((res) => res.json())
      .then((data) => setAuthors(data))
      .catch((err) => console.error("Failed to fetch authors:", err));
  }, []);

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const matchedAuthor = authors.find(
    (a) => a.name.toLowerCase() === formData.author.toLowerCase()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!matchedAuthor) {
      console.error("Author not found!");
      return;
    }

    const requestBody = {
      title: formData.title,
      category: formData.category,
      publishingYear: parseInt(formData.publishing_year),
      author: {
        id: matchedAuthor?.id,
      },
    };

    try {
      const response = await fetch(
        `${apiUrl}/books${editingId ? `/${editingId}` : ""}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error("Failed to submit new book");

      await fetchBooks();
      setFormData({
        title: "",
        category: "",
        publishing_year: "",
        author: "",
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error submitting book:", error);
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book?.title,
      category: book?.category,
      publishing_year: book?.publishing_year,
      author: book?.author || "",
    });
    setEditingId(book?.id);
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
            <select
              className="form-control"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              required
            >
              <option value="">Author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
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
