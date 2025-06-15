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
    <div className="container py-4">
      <h2 className="mb-3">Books</h2>

      <input
        className="form-control mb-3"
        type="text"
        placeholder="Search book..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column flex-md-row gap-2 mb-4"
      >
        <input
          className="form-control"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <input
          className="form-control"
          placeholder="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
        />
        <input
          className="form-control"
          placeholder="Year"
          value={formData.publishing_year}
          onChange={(e) =>
            setFormData({ ...formData, publishing_year: e.target.value })
          }
          required
        />
        <select
          className="form-select"
          placeholder="Author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          required
        >
          <option value="">Author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.name}>
              {author.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-dark">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Year</th>
              <th>Author</th>
              <th style={{ width: "130px" }}>Actions</th>
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
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-warning w-100"
                      onClick={() => handleEdit(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger w-100"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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
