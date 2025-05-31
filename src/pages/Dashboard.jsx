export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">📊 Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-zinc-900 p-6 rounded-lg shadow border border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-400 mb-1">Total Campaigns</h2>
          <p className="text-3xl font-bold text-green-400">4</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg shadow border border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-400 mb-1">Messages Sent</h2>
          <p className="text-3xl font-bold text-green-400">205</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg shadow border border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-400 mb-1">Delivery Rate</h2>
          <p className="text-3xl font-bold text-green-400">71%</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg shadow border border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-400 mb-1">Total Replies</h2>
          <p className="text-3xl font-bold text-green-400">3</p>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-lg shadow border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">🧾 Recent Campaigns</h2>
        <ul className="divide-y divide-zinc-800">
          <li className="py-3 flex justify-between">
            <span className="text-zinc-300">Campaign Name Placeholder</span>
            <span className="text-sm text-green-400">Sent on --</span>
          </li>
          <li className="py-3 flex justify-between">
            <span className="text-zinc-300">Campaign Name Placeholder</span>
            <span className="text-sm text-green-400">Sent on --</span>
          </li>
          <li className="py-3 flex justify-between">
            <span className="text-zinc-300">Campaign Name Placeholder</span>
            <span className="text-sm text-green-400">Sent on --</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
