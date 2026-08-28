from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")


def create_embeddings(chunks):
    """
    Generate embeddings for document chunks.
    """
    return model.encode(chunks)


def embed_query(query):
    """
    Generate embedding for a user query.
    """
    return model.encode(query)