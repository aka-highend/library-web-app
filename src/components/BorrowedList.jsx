import React, { useEffect, useState } from "react";

import { apiUrl } from "../utils/constants";

const BorrowedList = () => {
  const [records, setRecords] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    borrowDate: "",
    returnDate: "",
    bookId: "",
    memberId: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchRecords = () => {
    fetch(`${apiUrl}/borrowed`)
      .then((res) => res.json())
      .then((data) => {
        const formattedRecords = data.map((item) => ({
          id: item.id,
          book: item.book?.title || "-",
          member: item.member?.name || "-",
          borrow_date: item.borrowDate,
          return_date: item.returnDate,
        }));
        setRecords(formattedRecords);
      })
      .catch((err) => {
        console.error("Failed to fetch borrowed data:", err);
      });
  };

  const fetchBooks = () => {
    fetch(`${apiUrl}/books`)
      .then((res) => res.json())
      .then(setBooks)
      .catch((err) => console.error("Fetch books error:", err));
  };

  const fetchMembers = () => {
    fetch(`${apiUrl}/members`)
      .then((res) => res.json())
      .then(setMembers)
      .catch((err) => console.error("Fetch members error:", err));
  };

  useEffect(() => {
    fetchRecords();
    fetchBooks();
    fetchMembers();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      borrowDate: formData.borrowDate,
      returnDate: formData.returnDate,
      bookId: parseInt(formData.bookId),
      memberId: parseInt(formData.memberId),
    };

    await fetch(`${apiUrl}/borrowed${editingId ? `/${editingId}` : ""}`, {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((newItem) => {
        setRecords((prev) => [
          ...prev,
          {
            id: newItem.id,
            book: newItem.book?.title || "-",
            member: newItem.member?.name || "-",
            borrow_date: newItem.borrowDate,
            return_date: newItem.returnDate,
          },
        ]);
        fetchRecords();
        setFormData({
          bookId: "",
          memberId: "",
          borrowDate: "",
          returnDate: "",
        });
        setEditingId(null);
      })
      .catch((err) => console.error("Error submitting borrow:", err));
  };

  const handleEdit = (record) => {
    setFormData({
      bookId: record.book.id,
      memberId: record.member.id,
      borrowDate: record.borrow_date,
      returnDate: record.return_date,
    });
    setEditingId(record?.id);
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
          <select
            className="form-select"
            value={formData.bookId}
            onChange={(e) =>
              setFormData({ ...formData, bookId: e.target.value })
            }
            required
          >
            <option value="">Select Book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <select
            className="form-select"
            value={formData.memberId}
            onChange={(e) =>
              setFormData({ ...formData, memberId: e.target.value })
            }
            required
          >
            <option value="">Select Member</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <input
            type="date"
            className="form-control"
            value={formData.borrowDate}
            onChange={(e) =>
              setFormData({ ...formData, borrowDate: e.target.value })
            }
            required
          />
        </div>
        <div className="col">
          <input
            type="date"
            className="form-control"
            value={formData.returnDate}
            onChange={(e) =>
              setFormData({ ...formData, returnDate: e.target.value })
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
