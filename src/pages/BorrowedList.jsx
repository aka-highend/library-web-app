import React from "react";

import { apiUrl } from "../utils/constants";
import useBorrowedList from "../hooks/useBorrowedList";

const BorrowedList = () => {
  const {
    paginatedRecords,
    search,
    setSearch,
    filterBorrowDate,
    setFilterBorrowDate,
    filterReturnDate,
    setFilterReturnDate,
    formData,
    setFormData,
    editingId,
    currentPage,
    setCurrentPage,
    handleSubmit,
    handleEdit,
    handleDelete,
    totalPages,
    books,
    members,
  } = useBorrowedList(apiUrl);

  return (
    <div>
      <h2>Borrowed Books</h2>
      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title or member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="date"
            className="form-control"
            value={filterBorrowDate}
            onChange={(e) => setFilterBorrowDate(e.target.value)}
            placeholder="Search borrow date"
          />
        </div>
        <div className="col">
          <input
            type="date"
            className="form-control"
            value={filterReturnDate}
            onChange={(e) => setFilterReturnDate(e.target.value)}
            placeholder="Search return date"
          />
        </div>
      </div>
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
            <th>Member</th>
            <th>Book</th>
            <th>Borrowed</th>
            <th>Return</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.member}</td>
              <td>{record.book}</td>
              <td>{record.borrow_date}</td>
              <td>{record.return_date}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(record)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(record.id)}
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
              key={i}
              className={`page-item ${i + 1 === currentPage ? "active" : ""}`}
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
