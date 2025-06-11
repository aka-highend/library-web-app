import React, { useState } from "react";

const initialAuthors = [
  { id: 1, name: "F. Scott Fitzgerald" },
  { id: 2, name: "George Orwell" },
];

const AuthorList = () => {
  const [authors, setAuthors] = useState(initialAuthors);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = authors.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setAuthors(
        authors.map((a) =>
          a.id === editingId ? { ...formData, id: editingId } : a
        )
      );
    } else {
      setAuthors([...authors, { ...formData, id: authors.length + 1 }]);
    }
    setFormData({ name: "" });
    setEditingId(null);
  };

  const handleEdit = (author) => {
    setFormData(author);
    setEditingId(author.id);
  };

  const handleDelete = (id) => setAuthors(authors.filter((a) => a.id !== id));

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
