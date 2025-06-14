import React, { useEffect, useState } from "react";

import { apiUrl } from "../utils/constants";

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchMembers = () => {
    fetch(`${apiUrl}/members`)
      .then((res) => res.json())
      .then((data) => {
        const formattedMembers = data.map((member) => ({
          id: member?.id || "-",
          name: member?.name || "-",
          email: member?.email || "-",
          phone: member?.phone || "-",
        }));
        setMembers(formattedMembers);
      })
      .catch((err) => console.error("Failed to fetch members:", err));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
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
      email: formData.email,
      phone: formData.phone,
    };

    try {
      const response = await fetch(
        `${apiUrl}/members${editingId ? `/${editingId}` : ""}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error("Failed to submit new member");
      await fetchMembers();
      setFormData({ name: "", email: "", phone: "" });
      setEditingId(null);
    } catch (error) {
      console.error("Error submitting member: ", error);
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member?.name,
      email: member?.email,
      phone: member?.phone,
    });
    setEditingId(member?.id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/members/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete member");

      fetchMembers();
    } catch (error) {
      console.error("Error deleting member: ", error);
    }
  };

  return (
    <div>
      <h2>Members</h2>
      <input
        className="form-control mb-3"
        placeholder="Search member..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <form onSubmit={handleSubmit} className="mb-4 row g-2">
        <div className="col">
          <input
            className="form-control"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
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
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.phone}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(member)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(member.id)}
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

export default MemberList;
