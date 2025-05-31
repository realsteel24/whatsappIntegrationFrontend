import Papa from "papaparse";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../config";

export default function UploadForm() {
  const [template, setTemplate] = useState("");
  const [templates, setTemplates] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/templates`)
      .then((res) => res.json())
      .then(setTemplates);
  }, []);

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setCsvData(results.data);
      },
    });
  };

  const handleSend = async () => {
    console.log("Sending with template:", template);
    setSending(true);

    try {
      const contactPayload = csvData.map((row) => ({
        name: row.name?.trim(),
        phone: row.phone?.trim(),
      }));

      // Step 1: Create campaign and get ID
      const campaignRes = await fetch(`${BACKEND_URL}/api/campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: template,
          contacts: contactPayload,
        }),
      });

      const campaignData = await campaignRes.json();
      const campaignId = campaignData.campaignId;
      const contactMap = campaignData.contacts || [];
      const phoneToContactId = Object.fromEntries(
        contactMap.map((c) => [c.phone, c.id])
      );

      // Step 2: Upload contacts
      await fetch(`${BACKEND_URL}/api/contacts/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactPayload),
      });

      // Step 3: Prepare messages
      const messagePayload = csvData.map((row) => {
        const phone = row.phone?.trim();
        const contactId = phoneToContactId[phone];

        const message = {
          to: phone,
          templateName: template,
          languageCode: "en",
          campaignId,
          contactId,
        };

        if (template) {
          message.components = [
            {
              type: "header",
              parameters: [
                {
                  type: "image",
                  image: {
                    link: row.link,
                  },
                },
              ],
            },
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: row.name || "Customer",
                },
              ],
            },
          ];
        } else {
          message.messageText = `Hello ${row.name || "Customer"}`;
        }

        return message;
      });

      // Step 4: Send messages
      const res = await fetch(`${BACKEND_URL}/api/send-messages-bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagePayload, campaignId }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Send error:", error);
      setResult({ success: false, error: error.message });
    }

    setSending(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 px-6">
      <div className="bg-zinc-950 rounded-lg shadow-lg p-8 border border-zinc-800">
        <h1 className="text-3xl font-bold text-white mb-6">📤 WhatsApp Bulk Messaging</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Select Template</label>
            <select
              value={template}
              onChange={(e) => {
                setTemplate(e.target.value);
                console.log("Selected template:", e.target.value);
              }}
              className="w-full p-3 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Choose Template --</option>
              {templates.map((tpl) => (
                <option key={tpl.name} value={tpl.name}>
                  {tpl.name} ({tpl.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Upload CSV (columns: phone, name)</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="w-full bg-zinc-800 text-white p-3 rounded border border-zinc-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-green-600 file:text-white hover:file:bg-green-700"
            />
          </div>

          {csvData.length > 0 && (
            <div className="text-sm text-green-400 bg-zinc-900 p-3 rounded">
              <p>✅ Loaded {csvData.length} rows</p>
              <p className="mt-1">
                Preview: <span className="text-white">{csvData[0]?.name} - {csvData[0]?.phone}</span>
              </p>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={sending || !csvData.length || !template}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 rounded font-semibold transition"
          >
            {sending ? "Sending..." : "Send Messages"}
          </button>

          {result && (
            <div className="mt-6 text-sm bg-zinc-900 p-4 rounded border border-zinc-700 text-white">
              {result.success ? (
                <>
                  ✅ Sent: <span className="text-green-400">{result.sent}</span> <br />
                  ❌ Failed: <span className="text-red-400">{result.failed}</span>
                  {result.errors?.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-red-400 underline">
                        View Errors
                      </summary>
                      <pre className="text-xs mt-1 text-red-300 whitespace-pre-wrap">
                        {JSON.stringify(result.errors, null, 2)}
                      </pre>
                    </details>
                  )}
                </>
              ) : (
                <span className="text-red-400">❌ Error: {result.error}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
