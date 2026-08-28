from app.rag.embeddings import embed_query
from app.rag.store import vector_store


def retrieve_documents(
    project_id: int,
    query: str,
    k: int = 3,
):
    print("=" * 50)
    print("Project:", project_id)
    print("Query:", query)
    print("Vector Store ID:", id(vector_store))
    print("Documents:", vector_store.total_documents())

    if vector_store.total_documents() == 0:
        return []

    embedding = embed_query(query)

    results = vector_store.search(
        embedding=embedding,
        project_id=project_id,
        k=k,
    )

    print("Retrieved:", len(results))
    print("=" * 50)

    return results