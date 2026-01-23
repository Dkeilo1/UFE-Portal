import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AdminLayout from "./Admin/AdminLayout";
import AddPost from "./Admin/AddPost";
import AdminLogin from "./Admin/AdminLogin";
import ProtectedAdmin from "./Admin/ProtectedAdmin";
import News from "./Admin/News";
import EditPost from "./Admin/EditPost";

// ✅ PROGRAM IMPORTS
import Program from "./Admin/Program";
import ProgramAddPost from "./Admin/ProgramAddPost";
import EditProgram from "./Admin/EditProgram";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedAdmin>
            <AdminLayout />
          </ProtectedAdmin>
        }
      >
        {/* NEWS */}
        <Route index element={<News />} />
        <Route path="news" element={<News />} />
        <Route path="add-post" element={<AddPost />} />
        <Route path="edit-post/:id" element={<EditPost />} />

        {/* PROGRAM */}
        <Route path="program" element={<Program />} />
        <Route path="program/add" element={<ProgramAddPost />} />
        <Route path="/admin/program/edit/:id" element={<EditProgram />} />
      </Route>
    </Routes>
  );
}

export default App;
