import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  // text fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");

  // image states
  const [imageUrl, setImageUrl] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================================
     FETCH POST
  ================================ */
  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error.message);
      return;
    }

    if (data) {
      setTitle(data.title || "");
      setDescription(data.description || "");
      setType(data.type || ""); // ✅ used by select
      setImageUrl(data.image_url || "");
    }
  };

  /* ================================
     UPDATE POST
  ================================ */
  const updatePost = async () => {
    setLoading(true);

    let finalImageUrl = imageUrl;

    // upload new image if selected
    if (newImage) {
      const fileExt = newImage.name.split(".").pop();
      const filePath = `news/${id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("images") // your bucket name
        .upload(filePath, newImage, { upsert: true });

      if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      finalImageUrl = supabase.storage
        .from("images")
        .getPublicUrl(filePath).data.publicUrl;
    }

    const { error } = await supabase
      .from("news")
      .update({
        title,
        description,
        type, // ✅ selected value
        image_url: finalImageUrl,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/admin/news");
  };

  /* ================================
     UI
  ================================ */
  return (
    <div className="form-container">
      <h2>Мэдээ засах</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Гарчиг"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Товч мэдээ"
      />

      {/* ✅ TYPE SELECT (SAME AS ADD POST) */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="Мэдээ">Мэдээ</option>
        <option value="Зар">Зар</option>
        <option value="Мэдэгдэл">Мэдэгдэл</option>
      </select>

      {/* IMAGE SECTION */}
      <div style={{ marginTop: "16px" }}>
        <p style={{ fontWeight: 600 }}>Одоогийн зураг</p>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Current"
            style={{
              width: "100%",
              maxHeight: "220px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          />
        ) : (
          <p style={{ color: "#6b7280" }}>Зураг байхгүй</p>
        )}

        <p style={{ fontWeight: 600 }}>Зураг солих</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
        />
      </div>

      <button
        type="button"
        onClick={updatePost}
        disabled={loading}
        style={{ marginTop: "16px" }}
      >
        {loading ? "Хадгалж байна..." : "Хадгалах"}
      </button>
    </div>
  );
}
