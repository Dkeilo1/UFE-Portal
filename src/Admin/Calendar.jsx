import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Calendar() {
  const navigate = useNavigate();
  const [calendar, setCalendar] = useState([]);

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    const { data, error } = await supabase
      .from("calendar")
      .select("*")
      .order("date", { ascending: false });

    if (!error) {
      setCalendar(data || []);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div className="news-header">
        <h2>Календарь</h2>

        <button
          className="news-add-btn"
          onClick={() => navigate("/admin/calendar/add")}
        >
          Календарь нэмэх
        </button>
      </div>

      {/* Table */}
      <table className="news-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Гарчиг</th>
            <th>Огноо</th>
            <th>Төрөл</th>
            <th>Үйлдэл</th>
          </tr>
        </thead>

        <tbody>
          {calendar.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                Одоогоор бүртгэл алга байна
              </td>
            </tr>
          )}

          {calendar.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>
                {item.date
                  ? new Date(item.date).toLocaleDateString()
                  : "-"}
              </td>
              <td>{item.type}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/admin/calendar/edit/${item.id}`)
                  }
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
