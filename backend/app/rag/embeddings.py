from sentence_transformers import SentenceTransformer

_model = None


def get_model():
    global _model

    if _model is None:
        _model = SentenceTransformer(
            "all-MiniLM-L6-v2",
            device="cpu"
        )

    return _model


def create_embeddings(chunks):
    """
    Generate embeddings for document chunks.
    """
    model = get_model()

    return model.encode(
        chunks,
        convert_to_numpy=True,
        show_progress_bar=False
    )


def embed_query(query):
    """
    Generate embedding for a user query.
    """
    model = get_model()

    return model.encode(
        query,
        convert_to_numpy=True,
        show_progress_bar=False
    )