export default function Sidebar({ project, documents, uploading, onUploadClick }) {
  return (
    <aside className="chat-sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">RESEARCH ENVIRONMENT</div>

        <div className="sidebar-project">
          <div className="sidebar-project-icon">◇</div>
          <h2>{project?.title || "Untitled Project"}</h2>
          <p>{project?.description || "No project description available."}</p>
        </div>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section documents-section">
        <div className="documents-heading">
          <div>
            <div className="sidebar-label">KNOWLEDGE BASE</div>
            <h3>Documents</h3>
          </div>

          <span className="document-count">{documents.length}</span>
        </div>

        <div className="document-list">
          {documents.length === 0 ? (
            <div className="no-documents">
              <div className="no-document-icon">▧</div>
              <p>No documents indexed</p>
              <small>Upload a PDF to begin your research.</small>
            </div>
          ) : (
            documents.map((doc) => (
              <div className="document-item" key={doc.id}>
                <div className="document-icon">PDF</div>

                <div className="document-info">
                  <strong>{doc.filename}</strong>
                  <span>INDEXED</span>
                </div>

                <span className="document-status">●</span>
              </div>
            ))
          )}
        </div>

        <button className="upload-button" onClick={onUploadClick} disabled={uploading}>
          {uploading ? (
            <>
              <span className="button-loader" />
              INDEXING...
            </>
          ) : (
            <>
              <span>＋</span>
              UPLOAD PDF
            </>
          )}
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className="online-dot" />
          AI CORE ONLINE
        </div>

        <span>RAG ENGINE</span>
      </div>
    </aside>
  );
}
