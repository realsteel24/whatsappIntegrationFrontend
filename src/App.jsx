import ChatViewer from "./components/ChatViewer";
import UploadForm from "./components/UploadForm";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <UploadForm />
      <ChatViewer />
    </div>
  );
}
