import React from "react";

import { apiUrl } from "../utils/constants";
import useAuthorList from "../hooks/useAuthorList";

const AuthorList = () => {
  const {
    paginatedAuthors,
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
  } = useAuthorList(apiUrl);

  return (
    <div className="container py-4">
      <h2 className="mb-3">Authors</h2>

      <input
        className="form-control mb-3"
        type="text"
        placeholder="Search author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <form
        onSubmit={handleSubmit}
        className="d-flex gap-2 flex-column flex-sm-row mb-4"
      >
        <input
          className="form-control"
          placeholder="Author name"
          value={formData.name}
          onChange={(e) => setFormData({ name: e.target.value })}
          required
        />
        <button className="btn btn-dark" type="submit">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th style={{ width: "130px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAuthors.map((author) => (
              <tr key={author.id}>
                <td>{author.name}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-warning w-100"
                      onClick={() => handleEdit(author)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger w-100"
                      onClick={() => handleDelete(author.id)}
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

export default AuthorList;
