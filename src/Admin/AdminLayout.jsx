import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import "./Admin.css";  

export default function AdminLayout() {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
