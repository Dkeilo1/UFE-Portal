import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function ProgramAddPost() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    major: "",
    country: "",
    city: "",
    university: "",
    duration: "",
    degree: "",
    description: "",
    language: "",
    tuition: "",
    video_url: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.major.trim()) {
      alert("Major is required");
      return;
    }

    setLoading(true);
    let imageUrl = null;

    try {
      /* 1️⃣ Upload image to images/programs folder */
      if (image) {
        const ext = image.name.split(".").pop();
        const fileName = `program_${Date.now()}.${ext}`;
        const filePath = `programs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("images") // ✅ bucket
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      /* 2️⃣ Insert into programs table */
      const { error } = await supabase.from("programs").insert([
        {
          major: form.major,
          country: form.country || null,
          city: form.city || null,
          university: form.university || null,
          duration: form.duration || null,
          degree: form.degree || null,
          description: form.description || null,
          lang: form.language || null,
          tuition: form.tuition || null,
          video_url: form.video_url || null,
          img_url: imageUrl,
        },
      ]);

      if (error) throw error;

      alert("Program added successfully!");
      navigate("/admin/program");
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container full">
      <h1>Хөтөлбөр нэмэх</h1>

      <form onSubmit={handleSubmit} className="program-form">
        <input
          name="major"
          placeholder="Major *"
          value={form.major}
          onChange={handleChange}
          required
        />

        <input
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />

        <input
          name="university"
          placeholder="University"
          value={form.university}
          onChange={handleChange}
        />

        <input
          name="duration"
          placeholder="Duration (e.g. 4 years)"
          value={form.duration}
          onChange={handleChange}
        />

        <select name="degree" value={form.degree} onChange={handleChange}>
          <option value="">Хөтөлбөр сонгох</option>
          <option value="Үндсэн">Үндсэн</option>
          <option value="Хамтарсан">Хамтарсан</option>
          <option value="Олон улсад дамжин суралцах хөтөлбөр /Rotation/">Олон улсад дамжин суралцах хөтөлбөр /Rotation/</option>
          <option value="Олон улсын мэргэжлийн дипломтой хөтөлбөр /BTEC/">Олон улсын мэргэжлийн дипломтой хөтөлбөр /BTEC/</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="language"
          placeholder="Language"
          value={form.language}
          onChange={handleChange}
        />

        <input
          name="tuition"
          placeholder="Tuition (USD)"
          value={form.tuition}
          onChange={handleChange}
        />

        <input
          name="video_url"
          placeholder="Video URL (YouTube / MP4)"
          value={form.video_url}
          onChange={handleChange}
        />

        <input type="file" accept="image/*" onChange={handleImage} />

        {preview && <img src={preview} alt="Preview" className="preview" />}

        <button className="upload-btn" disabled={loading}>
          {loading ? "Хадгалаж байна..." : "Хадгалах"}
        </button>
      </form>
    </div>
  );
}
