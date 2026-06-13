import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { urlApi } from "../services/api";

export default function Dashboard() {
const { user, logout } = useAuth();

const [longUrl, setLongUrl] = useState("");
const [urls, setUrls] = useState([]);
const [shortUrl, setShortUrl] = useState("");
const [loading, setLoading] = useState(false);
const [qrImage, setQrImage] = useState("");

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

  setShortUrl(
  `${import.meta.env.VITE_API_URL.replace("/api", "")}/${res.data.url.shortCode}`
);
  setLongUrl("");

  await loadUrls();
} catch (err) {
  alert(err.response?.data?.message || "Failed to create URL");
} finally {
  setLoading(false);
}


};

const showQR = async (id) => {
try {
const res = await urlApi.getQR(id);
setQrImage(res.data.qrCode);
} catch (err) {
console.error(err);
alert("Failed to load QR code");
}
};

const deleteUrl = async (id) => {
const confirmDelete = window.confirm(
"Are you sure you want to delete this URL?"
);


if (!confirmDelete) return;

try {
  await urlApi.remove(id);
  await loadUrls();
} catch (err) {
  console.error(err);
  alert("Failed to delete URL");
}


};

return ( <div className="min-h-screen bg-gray-950 text-white p-6"> <div className="max-w-6xl mx-auto">


    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold">
          🚀 URL Shortener
        </h1>
        <p className="text-gray-400 mt-2">
          Welcome back, {user?.name}
        </p>
      </div>

      <div className="flex gap-3">
        <Link to="/analytics">
          <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg">
            Analytics
          </button>
        </Link>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>

    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">
        Create Short URL
      </h2>

      <form
        onSubmit={handleCreate}
        className="flex flex-col md:flex-row gap-3"
      >
        <input
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3"
        />

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>

      {shortUrl && (
        <div className="mt-5 bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-medium">
            URL Created Successfully
          </p>

          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 break-all"
          >
            {shortUrl}
          </a>
        </div>
      )}
    </div>

    <div className="mt-8 bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <h2 className="text-2xl font-semibold mb-4">
        Your URLs
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-left">
              <th className="py-3">Short URL</th>
              <th>Clicks</th>
              <th>QR</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {urls.map((url) => (
              <tr
                key={url._id}
                className="border-b border-gray-800"
              >
                <td className="py-4">
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {url.shortUrl}
                  </a>
                </td>

                <td>{url.totalClicks || 0}</td>

                <td>
                  <button
                    onClick={() => showQR(url._id)}
                    className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg"
                  >
                    QR
                  </button>
                </td>

                <td>
                  <button
                    onClick={() => deleteUrl(url._id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {qrImage && (
      <div className="mt-8 bg-gray-900 rounded-2xl p-6 border border-gray-800 text-center">
        <h3 className="text-xl font-semibold mb-4">
          QR Code
        </h3>

        <img
          src={qrImage}
          alt="QR Code"
          className="mx-auto rounded-lg bg-white p-3"
        />
      </div>
    )}
  </div>
</div> 
);
}
