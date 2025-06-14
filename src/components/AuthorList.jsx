import React, { useEffect, useState } from "react";

import { apiUrl } from "../utils/constants";

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAuthors = () => {
    fetch(`${apiUrl}/authors`)
      .then((res) => res.json())
      .then((data) => {
        const formattedAuthor = data.map((author) => ({
          id: author?.id,
          name: author?.name,
        }));
        setAuthors(formattedAuthor);
      })
      .catch((err) => console.error("Failed to fetch authors:", err));
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const filtered = authors.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      name: formData.name,
    };

    try {
      const response = await fetch(
        `${apiUrl}/authors${editingId ? `/${editingId}` : ""}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error("Failed to submit new author");

      await fetchAuthors();
      setFormData({ name: "" });
      setEditingId(null);
    } catch (error) {
      console.error("Error submitting author: ", error);
    }
  };

  const handleEdit = (author) => {
    setFormData({
      name: author?.name,
    });
    setEditingId(author?.id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this author?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${apiUrl}/authors/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete author");
      fetchAuthors();
    } catch (error) {
      console.error("Error deleting author: ", error);
    }
  };

  return (
    <div>
      <h2>Authors</h2>
      <input
        className="form-control mb-3"
        placeholder="Search author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <form onSubmit={handleSubmit} className="mb-4 d-flex gap-2">
        <input
          className="form-control"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ name: e.target.value })}
          required
        />
        <button className="btn btn-primary">
          {editingId ? "Update" : "Add"}
        </button>
      </form>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((author) => (
            <tr key={author.id}>
              <td>{author.name}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(author)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(author.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default AuthorList;
