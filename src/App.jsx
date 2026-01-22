import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AdminLayout from "./Admin/AdminLayout";
import AddPost from "./Admin/AddPost";
import AdminLogin from "./Admin/AdminLogin";
import ProtectedAdmin from "./Admin/ProtectedAdmin";
import News from "./Admin/News";
import EditPost from "./Admin/EditPost";
function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />

      {/* Admin login */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedAdmin>
            <AdminLayout />
          </ProtectedAdmin>
        }
      >
        <Route index element={<News />} />
        <Route path="news" element={<News />} />
        <Route path="add-post" element={<AddPost />} />
        <Route path="edit-post/:id" element={<EditPost />} />
      </Route>
    </Routes>
  );
}

export default App;
