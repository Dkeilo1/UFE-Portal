import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li onClick={() => navigate("/admin/news")}>
          Зар, мэдээ
        </li>

        <li onClick={() => navigate("/admin/international")}>
          Хөтөлбөрийн танилцуулга
        </li>

        <li onClick={() => navigate("/admin/scholarship")}>
          Амжилт, тэтгэлгийн бүртгэл
        </li>

        <li onClick={logout} style={{ color: "red" }}>
          Гарах
        </li>
      </ul>
    </div>
  );
}
