import { useEffect, useState } from "react";

const useAuthorList = (apiUrl) => {
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAuthors = (query = "") => {
    const url = query
      ? `${apiUrl}/authors/search?query=${encodeURIComponent(query)}`
      : `${apiUrl}/authors`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const formattedAuthor = data.map((author) => ({
          id: author?.id,
          name: author?.name,
          books: author?.books || [],
        }));
        setAuthors(formattedAuthor);
      })
      .catch((err) => {
        console.error("Failed to fetch authors:", err);
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAuthors(search);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const paginatedAuthors = authors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(authors.length / itemsPerPage);

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

  return {
    paginatedAuthors,
    search,
    setSearch,
    formData,
    setFormData,
    editingId,
    setEditingId,
    currentPage,
    setCurrentPage,
    totalPages,
    handleSubmit,
    handleEdit,
    handleDelete,
  };
};

export default useAuthorList;
