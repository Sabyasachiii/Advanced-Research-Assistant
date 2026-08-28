import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import UploadModal from "../components/UploadModal";
import Loader from "../components/Loader";

export default function Chat() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // ---------------------------------
  // Load project data
  // ---------------------------------

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);

    await Promise.all([loadProject(), loadDocuments(), loadChatHistory()]);

    setLoading(false);
  };

  const loadProject = async () => {
    try {
      const response = await API.get(`/projects/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.error("Project loading error:", error);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await API.get(`/documents/project/${projectId}`);
      setDocuments(response.data);
    } catch (error) {
      console.error("Document loading error:", error);
      setDocuments([]);
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await API.get(`/chat/${projectId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Chat history error:", error);
      setMessages([]);
    }
  };

  // ---------------------------------
  // Upload PDF
  // ---------------------------------

  const uploadPDF = async (file) => {
    const formData = new FormData();
    formData.append("project_id", Number(projectId));
    formData.append("file", file);

    setUploading(true);

    try {
      await API.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await loadDocuments();
      setShowUploadModal(false);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.detail || "Unable to upload document.");
    } finally {
      setUploading(false);
    }
  };

  // ---------------------------------
  // Ask question
  // ---------------------------------

  const askQuestion = async (overrideQuestion) => {
    const currentQuestion = (overrideQuestion ?? question).trim();

    if (!currentQuestion || sending) {
      return;
    }

    setQuestion("");

    setMessages((previous) => [...previous, { role: "user", content: currentQuestion }]);

    setSending(true);

    try {
      const response = await API.post("/chat/", {
        project_id: Number(projectId),
        question: currentQuestion,
      });

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: response.data.answer,
          sources: response.data.sources || [],
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error.response?.data?.detail || "Unable to generate a response. Please try again.",
          sources: [],
          error: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  // ---------------------------------
  // Initial loading
  // ---------------------------------

  if (loading) {
    return (
      <div className="neural-chat-page">
        <div className="chat-grid" />
        <Loader />
      </div>
    );
  }

  return (
    <div className="neural-chat-page">
      <div className="chat-grid" />
      <div className="chat-glow chat-glow-one" />
      <div className="chat-glow chat-glow-two" />

      <Header project={project} onBack={() => navigate("/dashboard")} />

      <main className="chat-layout">
        <Sidebar
          project={project}
          documents={documents}
          uploading={uploading}
          onUploadClick={() => setShowUploadModal(true)}
        />

        <section className="chat-main">
          <div className="chat-topbar">
            <div>
              <div className="chat-top-label">AI RESEARCH TERMINAL</div>
              <h2>Research Assistant</h2>
            </div>

            <div className="chat-mode">
              <span className="mode-icon">⌬</span>
              <div>
                <small>MODE</small>
                <strong>DOCUMENT RAG</strong>
              </div>
            </div>
          </div>

          <ChatWindow
            messages={messages}
            sending={sending}
            user={user}
            onSuggestion={(text) => askQuestion(text)}
          />

          <ChatInput
            question={question}
            setQuestion={setQuestion}
            onSend={() => askQuestion()}
            sending={sending}
            documentsCount={documents.length}
          />
        </section>
      </main>

      <UploadModal
        open={showUploadModal}
        uploading={uploading}
        onClose={() => setShowUploadModal(false)}
        onUpload={uploadPDF}
      />
    </div>
  );
}
