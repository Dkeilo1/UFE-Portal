import { useState } from "react";
import { supabase } from "../supabase";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Мэдээ"); // ✅ NEW
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!image) {
      alert("Select an image");
      setLoading(false);
      return;
    }

    // 1. Upload image
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

    // 2. Get public image URL
    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(`posts/${fileName}`);

    const imageUrl = data.publicUrl;

    // 3. Insert news into database (✅ type added)
    const { error } = await supabase.from("news").insert([
      {
        title,
        description,
        type, // ✅ SAVE TYPE
        image_url: imageUrl,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("News added successfully!");
      setTitle("");
      setDescription("");
      setType("Мэдээ");
      setImage(null);
      setPreview(null);
    }

    setLoading(false);
  };

  return (
    <div className="form-container full">
      <h1>Add New Post</h1>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* ✅ TYPE SELECT (ADDED HERE) */}
        <label>Нийтлэлийн төрөл</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Мэдээ">Мэдээ</option>
          <option value="Зар">Зар</option>
          <option value="Мэдэгдэл">Мэдэгдэл</option>
        </select>

        {/* Image */}
        <input type="file" accept="image/*" onChange={handleImage} />

        {preview && <img src={preview} className="preview" />}

        <button className="upload-btn" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
