import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADDED
import { supabase } from "../supabase";

export default function AddPost() {
  const navigate = useNavigate(); // ✅ ADDED

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(""); // 👈 empty initially
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ ONLY type validation
    if (!type) {
      alert("Нийтлэлийн төрөл сонгоно уу");
      return;
    }

    setLoading(true);

    let imageUrl = null;

    // Image is OPTIONAL now
    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(`posts/${fileName}`, image);

      if (uploadError) {
        alert(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("images")
        .getPublicUrl(`posts/${fileName}`);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("news").insert([
      {
        title,
        description,
        type,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("News added successfully!");
      navigate("/admin/news"); // ✅ ADDED (AUTO REDIRECT)
    }

    setLoading(false);
  };

  return (
    <div className="form-container full">
      <h1>Шинэ Мэдээ Нэмэх</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Гарчиг"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Мэдээ"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>
          Нийтлэлийн төрөл <span style={{ color: "red" }}>*</span>
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="" disabled>
            -- Сонгох --
          </option>
          <option value="Мэдээ">Мэдээ</option>
          <option value="Зар">Зар</option>
          <option value="БСА Зар">БСА Зар</option>
          <option value="Хурлын зар">Хурлын зар</option>
          <option value="Ажлын байрны зар">Ажлын байрны зар</option>
          <option value="Видео контент">Видео контент</option>
        </select>

        <input type="file" accept="image/*" onChange={handleImage} />

        {preview && <img src={preview} className="preview" alt="preview" />}

        <button className="upload-btn" disabled={loading}>
          {loading ? "Хадгалж байна..." : "Хадгалах"}
        </button>
      </form>
    </div>
  );
}
