import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { analyticsApi } from "../services/api";

export default function Analytics() {
const [data, setData] = useState(null);

useEffect(() => {
analyticsApi
.overview()
.then((res) => setData(res.data.overview))
.catch(console.error);
}, []);

if (!data) {
return ( <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center"> <h2 className="text-2xl font-semibold">
Loading Analytics... </h2> </div>
);
}

return ( <div className="min-h-screen bg-gray-950 text-white p-6"> <div className="max-w-5xl mx-auto">


    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold">
          📊 Analytics Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Monitor URL performance and engagement
        </p>
      </div>

      <Link to="/dashboard">
        <button className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg">
          Back to Dashboard
        </button>
      </Link>
    </div>

    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-gray-400 text-sm">
          Total URLs
        </h3>

        <p className="text-4xl font-bold mt-3">
          {data.totalUrls}
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-gray-400 text-sm">
          Total Clicks
        </h3>

        <p className="text-4xl font-bold mt-3">
          {data.totalClicks}
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-gray-400 text-sm">
          Last Click
        </h3>

        <p className="text-lg mt-3 break-words">
          {data.lastClickAt
            ? new Date(data.lastClickAt).toLocaleString()
            : "No clicks yet"}
        </p>
      </div>

    </div>

    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Insights
      </h2>

      <ul className="space-y-3 text-gray-300">
        <li>
          📌 Total URLs created: <strong>{data.totalUrls}</strong>
        </li>

        <li>
          👆 Total link visits: <strong>{data.totalClicks}</strong>
        </li>

        <li>
          ⏰ Most recent activity:{" "}
          <strong>
            {data.lastClickAt
              ? new Date(data.lastClickAt).toLocaleString()
              : "No activity"}
          </strong>
        </li>
      </ul>
    </div>

  </div>
</div>
);
}
