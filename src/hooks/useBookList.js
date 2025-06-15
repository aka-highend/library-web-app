import { useEffect, useState } from "react";

const useBookList = (apiUrl) => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    publishing_year: "",
    author: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAuthors = () => {
    fetch(`${apiUrl}/authors`)
      .then((res) => res.json())
      .then((data) => setAuthors(data))
      .catch((err) => console.error("Fetch authors error:", err));
  };

  const fetchBooks = (query = "") => {
    const url = query
      ? `${apiUrl}/books/search?query=${encodeURIComponent(query)}`
      : `${apiUrl}/books`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const formattedBook = data.map((book) => ({
          id: book?.id,
          title: book?.title,
          category: book?.category,
          publishing_year: book?.publishingYear,
          author: book?.author || "Unknown",
        }));
        setBooks(formattedBook);
      })
      .catch((err) => {
        console.error("Failed to fetch books:", err);
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchBooks(search);
      fetchAuthors();

      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const paginatedBooks = books.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(books.length / itemsPerPage);

  const matchedAuthor = authors.find(
    (a) => a.name.toLowerCase() === formData.author.toLowerCase()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!matchedAuthor) {
      console.error("Author not found!");
      return;
    }

    const requestBody = {
      title: formData.title,
      category: formData.category,
      publishingYear: parseInt(formData.publishing_year),
      author: {
        id: matchedAuthor?.id,
      },
    };

    try {
      const response = await fetch(
        `${apiUrl}${editingId ? `/edit-book/${editingId}` : "/add-book"}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error("Failed to submit new book");

      await fetchBooks();
      setFormData({
        title: "",
        category: "",
        publishing_year: "",
        author: "",
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error submitting book:", error);
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book?.title,
      category: book?.category,
      publishing_year: book?.publishing_year,
      author: book?.author || "",
    });
    setEditingId(book?.id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${apiUrl}/delete-book/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        window.alert(
          "Cannot delete book due to associative relation with authors or borrowed records."
        );
        return;
      }

      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return {
    paginatedBooks,
    totalPages,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    formData,
    setFormData,
    editingId,
    setEditingId,
    authors,
    handleSubmit,
    handleEdit,
    handleDelete,
  };
};

export default useBookList;
