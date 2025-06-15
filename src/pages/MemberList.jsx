import React from "react";

import useMemberList from "../hooks/useMemberList";
import { apiUrl } from "../utils/constants";

const MemberList = () => {
  const {
    paginatedMembers,
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
  } = useMemberList(apiUrl);

  return (
    <div className="container py-4">
      <h2 className="mb-3">Members</h2>

      <input
        className="form-control mb-3"
        type="text"
        placeholder="Search member..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <form
        onSubmit={handleSubmit}
        className="d-flex gap-2 flex-column flex-sm-row mb-4"
      >
        <input
          className="form-control"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          className="form-control"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          className="form-control"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              <th>Email</th>
              <th>Phone</th>
              <th style={{ width: "130px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-warning w-100"
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger w-100"
                      onClick={() => handleDelete(member.id)}
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

export default MemberList;
