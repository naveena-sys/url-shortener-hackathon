import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { urlApi } from "../services/api";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [longUrl, setLongUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const loadUrls = async () => {
    try {
      const res = await urlApi.getAll();
      setUrls(res.data.urls || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUrls();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!longUrl) return;

    try {
      setLoading(true);

      const res = await urlApi.create({
        longUrl,
      });

      setShortUrl(res.data.url.shortUrl);
      setLongUrl("");

      await loadUrls();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
      <h1>?? URL Shortener Dashboard</h1>

      <p>
        Welcome, <strong>{user?.name}</strong>
      </p>

      <button onClick={logout}>
        Logout
      </button>

      <hr />

      <h2>Create Short URL</h2>

      <form onSubmit={handleCreate}>
        <input
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="https://example.com"
          style={{
            width: "70%",
            padding: "10px",
            marginRight: "10px"
          }}
        />

        <button type="submit">
          {loading ? "Creating..." : "Create"}
        </button>
      </form>

      {shortUrl && (
        <div style={{ marginTop: "20px" }}>
          <strong>Short URL:</strong>
          <br />
          <a href={shortUrl} target="_blank">
            {shortUrl}
          </a>
        </div>
      )}

      <hr />

      <h2>Your URLs</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Clicks</th>
          </tr>
        </thead>

        <tbody>
          {urls.map((url) => (
            <tr key={url._id}>
              <td>
                <a href={url.shortUrl} target="_blank">
                  {url.shortUrl}
                </a>
              </td>

              <td>{url.totalClicks || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
