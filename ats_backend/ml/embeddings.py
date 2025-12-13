# ats_backend/ml/embeddings.py
from sentence_transformers import SentenceTransformer
import numpy as np

# model will be downloaded first time and cached locally
_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
_model = None

def _get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(_MODEL_NAME)
    return _model

def get_embeddings(text: str):
    """
    Return a numpy vector for the given text.
    Accepts single string or list of strings.
    """
    model = _get_model()
    if isinstance(text, list):
        return model.encode(text, convert_to_numpy=True)
    return model.encode([text], convert_to_numpy=True)[0]

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """
    Compute cosine similarity between two vectors.
    """
    a = np.asarray(a, dtype=float)
    b = np.asarray(b, dtype=float)
    if a.ndim == 1 and b.ndim == 1:
        denom = (np.linalg.norm(a) * np.linalg.norm(b))
        return 0.0 if denom == 0 else float(np.dot(a, b) / denom)
    # handle batch
    a_norm = np.linalg.norm(a, axis=1, keepdims=True)
    b_norm = np.linalg.norm(b, axis=1, keepdims=True)
    with np.errstate(invalid="ignore", divide="ignore"):
        sim = (a @ b.T) / (a_norm * b_norm.T)
    return sim
