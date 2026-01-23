import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Program() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("programs")
      .select(`
        id,
        degree,
        major,
        university,
        country,
        city,
        duration,
        lang,
        tuition,
        description,
        img_url,
        video_url,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching programs:", error.message);
      setPrograms([]);
    } else {
      setPrograms(data || []);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div className="news-header">
        <h2>Хамтарсан хөтөлбөр</h2>

        <button
          className="news-add-btn"
          onClick={() => navigate("/admin/program/add")}
        >
          Хөтөлбөр нэмэх
        </button>
      </div>

      {/* Table */}
      <table className="program-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Degree</th>
            <th>Major</th>
            <th>University</th>
            <th>Country</th>
            <th>City</th>
            <th>Duration</th>
            <th>Language</th>
            <th>Tuition</th>
            <th>Description</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="11" style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : programs.length === 0 ? (
            <tr>
              <td colSpan="11" style={{ textAlign: "center" }}>
                No programs found
              </td>
            </tr>
          ) : (
            programs.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.degree}</td>
                <td>{item.major}</td>
                <td>{item.university}</td>
                <td>{item.country}</td>
                <td>{item.city}</td>
                <td>{item.duration}</td>
                <td>{item.lang}</td> {/* ✅ FIXED */}
                <td>{item.tuition}</td>
                <td className="truncate">{item.description}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(`/admin/program/edit/${item.id}`)
                    }
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
