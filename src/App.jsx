import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import BookList from "./components/BookList";
import AuthorList from "./components/AuthorList";
import BorrowedList from "./components/BorrowedList";
import MemberList from "./components/MemberList";

import "bootstrap-icons/font/bootstrap-icons.css";
import "remixicon/fonts/remixicon.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

const App = () => {
  return (
    <>
      <Router>
        <div className="container mt-4">
          <nav className="mb-4">
            <ul className="nav nav-pills flex-wrap gap-2 justify-content-center justify-content-md-start">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Books
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/authors">
                  Authors
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/members">
                  Members
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/borrowed-books">
                  Borrowed Books
                </Link>
              </li>
            </ul>
          </nav>
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
