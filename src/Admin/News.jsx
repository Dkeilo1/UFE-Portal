import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function News() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const { data } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    setNews(data || []);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div className="news-header">
        <h2>Бүх мэдээ</h2>

        <button
          className="news-add-btn"
          onClick={() => navigate("/admin/add-post")}
        >
          Мэдээ нэмэх
        </button>
      </div>

      {/* Table */}
      <table className="news-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Нийтлэлийн гарчиг</th>
            <th>Товч мэдээ</th>
            <th>Төрөл</th>
            <th>Огноо</th>
            <th>Үйлдэл</th>
          </tr>
        </thead>

        <tbody>
          {news.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td className="truncate">
                {item.description}
              </td>
              <td>{item.type}</td>
              <td>
                {new Date(item.created_at).toLocaleDateString()}
              </td>
              <td>
                <button 
                className="edit-btn"
                onClick={() => navigate(`/admin/edit-post/${item.id}`)}
                >
                Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
