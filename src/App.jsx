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
  return (
    <>
      <Router>
        <header className="custom-navbar">
          <div className="container d-flex flex-wrap justify-content-between align-items-center">
            <h1 className="navbar-brand mb-0">Library</h1>
            <ul className="nav gap-3 align-items-center">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/books">
                  Books
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/authors">
                  Authors
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/members">
                  Members
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/borrowed-books">
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
