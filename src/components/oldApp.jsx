import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import BookList from "./components/BookList";
import AuthorList from "./components/AuthorList";
import BorrowedList from "./components/BorrowedList";
import MemberList from "./components/MemberList";

import "bootstrap-icons/font/bootstrap-icons.css";
import "remixicon/fonts/remixicon.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";

const OldApp = () => {
  const [view, setView] = useState("books");

  const renderView = () => {
    switch (view) {
      case "authors":
        return <AuthorList />;
      case "members":
        return <MemberList />;
      case "borrowed":
        return <BorrowedList />;
      default:
        return <BookList />;
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#" onClick={() => setView("books")}>
            Library Manager
          </a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => setView("books")}
                >
                  Books
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => setView("authors")}
                >
                  Authors
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => setView("members")}
                >
                  Members
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={() => setView("borrowed")}
                >
                  Borrowed Books
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">{renderView()}</div>
    </>
  );
};

export default OldApp;
