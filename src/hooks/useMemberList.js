import { useEffect, useState } from "react";

const useMemberList = (apiUrl) => {
  const [members, setMembers] = useState([]);
  const [borrowedBooksByMember, setBorrowedBooksByMember] = useState({});
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchMembers = async (query = "") => {
    const url = query
      ? `${apiUrl}/members/search?query=${encodeURIComponent(query)}`
      : `${apiUrl}/members`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const formattedMembers = data.map((member) => ({
        id: member?.id,
        name: member?.name,
        email: member?.email,
        phone: member?.phone,
      }));
      setMembers(formattedMembers);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const res = await fetch(`${apiUrl}/borrowed`);
      const data = await res.json();

      const grouped = data.reduce((acc, item) => {
        const memberId = item.member?.id;
        if (!acc[memberId]) acc[memberId] = [];
        acc[memberId].push({
          id: item.id,
          title: item.book?.title,
          borrowDate: item.borrowDate,
          returnDate: item.returnDate,
        });
        return acc;
      }, {});
      setBorrowedBooksByMember(grouped);
    } catch (err) {
      console.error("Failed to fetch borrowed books:", err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMembers(search);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const paginatedMembers = members.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(members.length / itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    };

    try {
      const response = await fetch(
        `${apiUrl}${editingId ? `/edit-member/${editingId}` : "/add-member"}`,
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${apiUrl}/delete-member/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        window.alert(
          "Cannot delete member with borrowed books due to its association. Please return the books first."
        );
        return;
      }

      fetchMembers();
    } catch (error) {
      console.error("Error deleting member: ", error);
    }
  };

  return {
    paginatedMembers,
    borrowedBooksByMember,
    totalPages,
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
  };
};

export default useMemberList;
