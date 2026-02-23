import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function EditProgram() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ================================
     FORM STATE
  ================================ */
  const [form, setForm] = useState({
    degree: "",
    major: "",
    university: "",
    country: "",
    city: "",
    duration: "",
    lang: "",
    tuition: "",
    description: "",
    video_url: "",
  });

  const [imgUrl, setImgUrl] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [imgRemoved, setImgRemoved] = useState(false); // ✅ ADDED
  const [loading, setLoading] = useState(false);

  /* ================================
     FETCH PROGRAM
  ================================ */
  useEffect(() => {
    fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      setForm({
        degree: data.degree || "",
        major: data.major || "",
        university: data.university || "",
        country: data.country || "",
        city: data.city || "",
        duration: data.duration || "",
        lang: data.lang || "",
        tuition: data.tuition || "",
        description: data.description || "",
        video_url: data.video_url || "",
      });

      setImgUrl(data.img_url || "");
    }
  };

  /* ================================
     HANDLE INPUT CHANGE
  ================================ */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================================
     REMOVE IMAGE (NEW)
  ================================ */
  const removeMainImage = () => {
    setImgUrl("");
    setNewImage(null);
    setImgRemoved(true);
  };

  /* ================================
     UPDATE PROGRAM
  ================================ */
  const updateProgram = async () => {
    setLoading(true);

    let finalImgUrl = imgRemoved ? null : imgUrl; // ✅ UPDATED

    try {
      // upload new image if selected
      if (newImage) {
        const ext = newImage.name.split(".").pop();
        const filePath = `programs/program_${id}_${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, newImage, { upsert: true });

        if (uploadError) throw uploadError;

        finalImgUrl = supabase.storage
          .from("images")
          .getPublicUrl(filePath).data.publicUrl;
      }

      const { error } = await supabase
        .from("programs")
        .update({
          degree: form.degree,
          major: form.major,
          university: form.university,
          country: form.country,
          city: form.city,
          duration: form.duration,
          lang: form.lang,
          tuition: form.tuition,
          description: form.description,
          video_url: form.video_url,
          img_url: finalImgUrl,
        })
        .eq("id", id);

      if (error) throw error;

      alert("Хөтөлбөр амжилттай засагдлаа");
      navigate("/admin/program");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     DELETE PROGRAM
  ================================ */
  const deleteProgram = async () => {
    const confirmDelete = window.confirm(
      "Та энэ хөтөлбөрийг устгахдаа итгэлтэй байна уу?"
    );

    if (!confirmDelete) return;

    setLoading(true);

    const { error } = await supabase
      .from("programs")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Хөтөлбөр устгагдлаа");
    navigate("/admin/program");
  };

  /* ================================
     UI
  ================================ */
  return (
    <div className="form-container full">
      <h1>Хөтөлбөр засах</h1>

      <input name="major" value={form.major} onChange={handleChange} placeholder="Major" />
      <input name="university" value={form.university} onChange={handleChange} placeholder="University" />
      <input name="country" value={form.country} onChange={handleChange} placeholder="Country" />
      <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
      <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration (e.g. 2+2)" />

      <select name="degree" value={form.degree} onChange={handleChange}>
        <option value="">Хөтөлбөр сонгох</option>
        <option value="Үндсэн">Үндсэн</option>
        <option value="Хамтарсан">Хамтарсан</option>
      </select>

      <input name="lang" value={form.lang} onChange={handleChange} placeholder="Language" />
      <input name="tuition" value={form.tuition} onChange={handleChange} placeholder="Tuition" />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />

      <input
        name="video_url"
        value={form.video_url}
        onChange={handleChange}
        placeholder="Video URL"
      />

      {/* IMAGE */}
      <div style={{ marginTop: "12px" }}>
        <p><b>Үндсэн зураг</b></p>

        {imgUrl ? (
          <div className="preview-wrapper">
            <img src={imgUrl} alt="Program" className="preview" />
            <button
              type="button"
              className="remove-btn"
              onClick={removeMainImage}
            >
              ✕
            </button>
          </div>
        ) : (
          <p>Зураг байхгүй</p>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setNewImage(e.target.files[0]);
            setImgRemoved(false);
          }}
        />
      </div>

      <div className="form-button-row">
        <button onClick={updateProgram} disabled={loading}>
          {loading ? "Хадгалж байна..." : "Хадгалах"}
        </button>

        <button
          onClick={deleteProgram}
          disabled={loading}
          className="danger-btn"
        >
          Устгах
        </button>
      </div>
    </div>
  );
}