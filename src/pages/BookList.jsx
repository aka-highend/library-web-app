import React from "react";

import { apiUrl } from "../utils/constants";
import useBookList from "../hooks/useBookList";

const BookList = () => {
  const {
    paginatedBooks,
    search,
    setSearch,
    formData,
    setFormData,
    editingId,
    currentPage,
    setCurrentPage,
    handleSubmit,
    handleEdit,
    handleDelete,
    totalPages,
    authors,
  } = useBookList(apiUrl);

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
              className="form-select"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              required
            >
              <option value="">Author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.name}>
                  {author.name}
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
