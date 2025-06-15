import { useEffect, useState } from "react";

const BorrowedList = (apiUrl) => {
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

  const fetchRecords = (query = "") => {
    const url = query
      ? `${apiUrl}/borrowed/search?query=${encodeURIComponent(query)}`
      : `${apiUrl}/borrowed`;

    fetch(url)
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchRecords(search);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const paginatedRecords = records.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(records.length / itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      borrowDate: formData.borrowDate,
      returnDate: formData.returnDate,
      bookId: parseInt(formData.bookId),
      memberId: parseInt(formData.memberId),
    };

    try {
      const res = await fetch(
        `${apiUrl}/borrowed${editingId ? `/${editingId}` : ""}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );
      if (!res.ok) throw new Error("Failed to submit");

      await fetchRecords();
      setFormData({ borrowDate: "", returnDate: "", bookId: "", memberId: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error submitting borrow:", err);
    }
  };

  const handleEdit = (record) => {
    const selectedBook = books.find((book) => book.title === record.book);
    const selectedMember = members.find(
      (member) => member.name === record.member
    );

    setFormData({
      bookId: selectedBook?.id || "",
      memberId: selectedMember?.id || "",
      borrowDate: record.borrow_date,
      returnDate: record.return_date,
    });
    setEditingId(record.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await fetch(`${apiUrl}/borrowed/${id}`, { method: "DELETE" });
        fetchRecords(search);
      } catch (err) {
        console.error("Error deleting record:", err);
      }
    }
  };

  return {
    paginatedRecords,
    totalPages,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    formData,
    setFormData,
    editingId,
    setEditingId,
    handleSubmit,
    handleEdit,
    handleDelete,
    books,
    members,
  };
};

export default BorrowedList;
