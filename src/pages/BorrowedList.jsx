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
    <div className="container py-4">
      <h2 className="mb-3">Borrowed Books</h2>

      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by title or member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="date"
            className="form-control mb-3"
            value={filterBorrowDate}
            onChange={(e) => setFilterBorrowDate(e.target.value)}
            placeholder="Search borrow date"
          />
        </div>
        <div className="col">
          <input
            type="date"
            className="form-control mb-3"
            value={filterReturnDate}
            onChange={(e) => setFilterReturnDate(e.target.value)}
            placeholder="Search return date"
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column flex-md-row gap-2 mb-4"
      >
        <select
          className="form-select"
          value={formData.bookId}
          onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
          required
        >
          <option value="">Select Book</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>
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
        <input
          type="date"
          className="form-control"
          value={formData.borrowDate}
          onChange={(e) =>
            setFormData({ ...formData, borrowDate: e.target.value })
          }
          required
        />
        <input
          type="date"
          className="form-control"
          value={formData.returnDate}
          onChange={(e) =>
            setFormData({ ...formData, returnDate: e.target.value })
          }
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
              <th>Member</th>
              <th>Book</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
              <th style={{ width: "130px" }}>Actions</th>
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
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-warning w-100"
                      onClick={() => handleEdit(record)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger w-100"
                      onClick={() => handleDelete(record.id)}
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

export default BorrowedList;
