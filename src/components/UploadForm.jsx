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
    <div className="max-w-lg mx-auto mt-10 p-4 space-y-4 bg-zinc-900 rounded-lg text-white shadow">
      <h1 className="text-2xl font-bold">WhatsApp CSV Sender</h1>

      <label className="block">
        Template:
        <select
          value={template}
          onChange={(e) => {
            setTemplate(e.target.value);
            console.log("Selected template:", e.target.value);
          }}
          className="w-full mt-1 p-2 rounded bg-zinc-800"
        >
          <option value="">-- Select a template --</option>
          {templates.map((tpl) => (
            <option key={tpl.name} value={tpl.name}>
              {tpl.name} ({tpl.status})
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        Upload CSV (columns: phone, name):
        <input
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
          className="mt-1 block text-white"
        />
      </label>

      {csvData.length > 0 && (
        <div className="text-sm text-green-400">
          <p>✅ Loaded {csvData.length} rows</p>
          <p>
            Preview: {csvData[0]?.name} - {csvData[0]?.phone}
          </p>
        </div>
      )}

      <button
        onClick={handleSend}
        disabled={sending || !csvData.length || !template}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-2 rounded"
      >
        {sending ? "Sending..." : "Send Messages"}
      </button>

      {result && (
        <div className="mt-4 text-sm bg-zinc-800 p-3 rounded">
          {result.success ? (
            <>
              ✅ Sent: {result.sent} <br />❌ Failed: {result.failed}
              {result.errors?.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-red-400">
                    View Errors
                  </summary>
                  <pre className="text-xs mt-1 text-red-300">
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
  );
}
