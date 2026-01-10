from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity as cs

vectorizer = TfidfVectorizer(stop_words="english")

def get_embeddings(texts):
    if isinstance(texts, str):
        texts = [texts]
    return vectorizer.fit_transform(texts)

def cosine_similarity(a, b):
    return cs(a, b)[0][0]
