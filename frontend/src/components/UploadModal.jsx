import { useRef, useState } from "react";

export default function UploadModal({ open, uploading, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  if (!open) return null;

  const pickFile = (selected) => {
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Please choose a PDF file.");
      return;
    }

    setFile(selected);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    pickFile(event.dataTransfer.files?.[0]);
  };

  const handleClose = () => {
    if (uploading) return;
    setFile(null);
    onClose();
  };

  const handleConfirm = async () => {
    if (!file) return;
    await onUpload(file);
    setFile(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="upload-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="section-label">KNOWLEDGE BASE</div>
            <h2>Upload Document</h2>
            <p>Add a PDF to this project's research index.</p>
          </div>

          <button className="modal-close" onClick={handleClose} disabled={uploading}>
            ×
          </button>
        </div>

        <div
          className={`upload-dropzone ${dragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            hidden
            onChange={(event) => pickFile(event.target.files?.[0])}
          />

          {file ? (
            <div className="upload-file-chip">
              <span className="upload-file-icon">PDF</span>
              <div>
                <strong>{file.name}</strong>
                <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
              </div>
            </div>
          ) : (
            <>
              <div className="upload-dropzone-icon">▧</div>
              <strong>Drop a PDF here</strong>
              <span>or click to browse your files</span>
            </>
          )}
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={handleClose} disabled={uploading}>
            CANCEL
          </button>

          <button className="create-button" onClick={handleConfirm} disabled={!file || uploading}>
            {uploading ? (
              <>
                <span className="button-loader" />
                INDEXING...
              </>
            ) : (
              <>UPLOAD &amp; INDEX</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
