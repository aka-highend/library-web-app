import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import BookList from "./pages/BookList";
import AuthorList from "./pages/AuthorList";
import BorrowedList from "./pages/BorrowedList";
import MemberList from "./pages/MemberList";

import "bootstrap-icons/font/bootstrap-icons.css";
import "remixicon/fonts/remixicon.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import "./App.css";

const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <>
      <Router>
        <header className="custom-navbar">
          <div className="container d-flex justify-content-between align-items-center">
            <div className="main-header d-flex justify-content-between align-items-center">
              <h1 className="navbar-brand mb-0">Library</h1>
              <span
                className="burger btn text-white"
                onClick={toggleNav}
                aria-label="Toggle navigation"
              >
                &#9776;
              </span>
            </div>
            <ul
              className={`nav gap-3 align-items-center mobile-nav ${
                isNavOpen ? "show" : ""
              }`}
            >
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/authors"
                  onClick={closeNav}
                >
                  Authors
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/books"
                  onClick={closeNav}
                >
                  Books
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/members"
                  onClick={closeNav}
                >
                  Members
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  to="/borrowed-books"
                  onClick={closeNav}
                >
                  Borrowed
                </Link>
              </li>
            </ul>
          </div>
        </header>

        <div className="container">
          <Routes>
            <Route path="/books" element={<BookList />} />
            <Route path="/" element={<Navigate to="/books" />} />
            <Route path="/authors" element={<AuthorList />} />
            <Route path="/members" element={<MemberList />} />
            <Route path="/borrowed-books" element={<BorrowedList />} />
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
