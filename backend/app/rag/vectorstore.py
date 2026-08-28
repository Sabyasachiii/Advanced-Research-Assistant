import os
import pickle

import faiss
import numpy as np


class VectorStore:
    def __init__(self):
        self.dimension = 384

        os.makedirs("vector_db", exist_ok=True)

        self.index_path = "vector_db/faiss.index"
        self.metadata_path = "vector_db/metadata.pkl"

        # -----------------------------
        # Load FAISS index
        # -----------------------------
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
        else:
            self.index = faiss.IndexFlatL2(self.dimension)

        # -----------------------------
        # Load metadata
        # -----------------------------
        if os.path.exists(self.metadata_path):
            try:
                with open(self.metadata_path, "rb") as f:
                    self.documents = pickle.load(f)
            except Exception:
                print("⚠️ Could not load metadata. Starting fresh.")
                self.documents = []
        else:
            self.documents = []

        # -----------------------------
        # Safety check
        # -----------------------------
        if self.index.ntotal != len(self.documents):
            print("⚠️ FAISS/metadata mismatch detected.")

    # =================================
    # Save vector store
    # =================================

    def save(self):
        faiss.write_index(
            self.index,
            self.index_path,
        )

        with open(self.metadata_path, "wb") as f:
            pickle.dump(
                self.documents,
                f,
            )

    # =================================
    # Add document chunks
    # =================================

    def add(
        self,
        project_id: int,
        chunks: list[str],
        embeddings,
    ):
        if not chunks:
            return

        vectors = np.asarray(
            embeddings,
            dtype=np.float32,
        )

        # Ensure correct shape
        if vectors.ndim == 1:
            vectors = np.expand_dims(vectors, axis=0)

        if len(vectors) != len(chunks):
            raise ValueError(
                "Number of embeddings does not match number of chunks."
            )

        if vectors.shape[1] != self.dimension:
            raise ValueError(
                f"Invalid embedding dimension. "
                f"Expected {self.dimension}, "
                f"got {vectors.shape[1]}."
            )

        # Add vectors to FAISS
        self.index.add(vectors)

        # Add metadata
        for chunk in chunks:
            self.documents.append(
                {
                    "project_id": int(project_id),
                    "text": chunk,
                }
            )

        self.save()

        print("=" * 60)
        print("VECTOR STORE UPDATED")
        print("Project:", project_id)
        print("Chunks added:", len(chunks))
        print("Total vectors:", self.index.ntotal)
        print("Total metadata:", len(self.documents))
        print("=" * 60)

    # =================================
    # Search
    # =================================

    def search(
        self,
        embedding,
        project_id: int,
        k: int = 3,
    ):
        if not self.documents:
            return []

        if self.index.ntotal == 0:
            return []

        vector = np.asarray(
            [embedding],
            dtype=np.float32,
        )

        if vector.shape[1] != self.dimension:
            raise ValueError(
                f"Invalid query embedding dimension. "
                f"Expected {self.dimension}, "
                f"got {vector.shape[1]}."
            )

        # Search more candidates because
        # we filter by project afterward.
        search_k = min(
            max(k * 5, 10),
            self.index.ntotal,
        )

        distances, indices = self.index.search(
            vector,
            search_k,
        )

        results = []

        for idx in indices[0]:

            if idx == -1:
                continue

            if idx >= len(self.documents):
                continue

            document = self.documents[idx]

            # Only return chunks from this project
            if document["project_id"] != int(project_id):
                continue

            results.append(
                document["text"]
            )

            if len(results) >= k:
                break

        return results

    # =================================
    # Count documents
    # =================================

    def total_documents(self):
        return len(self.documents)

    # =================================
    # Count project documents
    # =================================

    def project_documents(self, project_id: int):
        return sum(
            1
            for document in self.documents
            if document["project_id"] == int(project_id)
        )