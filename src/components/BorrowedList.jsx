import React, { useState } from "react";

const initialBorrowed = [
  {
    id: 1,
    book: "The Great Gatsby",
    member: "Jack",
    borrow_date: "2023-01-01",
    return_date: "2023-01-15",
  },
];

const BorrowedList = () => {
  const [records, setRecords] = useState(initialBorrowed);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    book: "",
    member: "",
    borrow_date: "",
    return_date: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = records.filter(
    (r) =>
      r.book.toLowerCase().includes(search.toLowerCase()) ||
      r.member.toLowerCase().includes(search.toLowerCase()) ||
      r.borrow_date.includes(search)
  );
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setRecords(
        records.map((r) =>
          r.id === editingId ? { ...formData, id: editingId } : r
        )
      );
    } else {
      setRecords([...records, { ...formData, id: records.length + 1 }]);
    }
    setFormData({ book: "", member: "", borrow_date: "", return_date: "" });
    setEditingId(null);
  };

  const handleEdit = (r) => {
    setFormData(r);
    setEditingId(r.id);
  };

  const handleDelete = (id) => setRecords(records.filter((r) => r.id !== id));

  return (
    <div>
      <h2>Borrowed Books</h2>
      <input
        className="form-control mb-3"
        placeholder="Search by book title, member, borrow date..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <form onSubmit={handleSubmit} className="mb-4 row g-2">
        <div className="col">
          <input
            className="form-control"
            placeholder="Book"
            value={formData.book}
            onChange={(e) => setFormData({ ...formData, book: e.target.value })}
            required
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            placeholder="Member"
            value={formData.member}
            onChange={(e) =>
              setFormData({ ...formData, member: e.target.value })
            }
            required
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            placeholder="Borrow Date"
            value={formData.borrow_date}
            onChange={(e) =>
              setFormData({ ...formData, borrow_date: e.target.value })
            }
            required
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            placeholder="Return Date"
            value={formData.return_date}
            onChange={(e) =>
              setFormData({ ...formData, return_date: e.target.value })
            }
            required
          />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary">
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </form>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Book</th>
            <th>Member</th>
            <th>Borrowed</th>
            <th>Return</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((r) => (
            <tr key={r.id}>
              <td>{r.book}</td>
              <td>{r.member}</td>
              <td>{r.borrow_date}</td>
              <td>{r.return_date}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(r)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(r.id)}
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

export default BorrowedList;
