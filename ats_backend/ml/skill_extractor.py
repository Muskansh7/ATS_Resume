# ats_backend/ml/skill_extractor.py
import re

KNOWN_SKILLS = {
    "python","java","c++","c#","javascript","react","reactjs","node","nodejs",
    "fastapi","django","flask","sql","postgres","mysql","mongodb",
    "aws","gcp","azure","docker","kubernetes","git","html","css",
    "machine learning","ml","deep learning","nlp","pytorch","tensorflow",
    "numpy","pandas","scikit-learn","sklearn","data analysis","rest api",
    "graphql","typescript","bash","linux","spark","hadoop","ci/cd"
}

# normalize tokenization
def _tokens(text: str):
    txt = text.lower()
    # split on non-word but keep words like c++ as cplusplus? normalize special chars
    txt = txt.replace("c++", "cplusplus").replace("c#", "csharp")
    tokens = re.findall(r"[a-z0-9\+\#\-\_]+", txt)
    return tokens

def extract_skills(text: str):
    if not text:
        return []
    txt = text.lower()
    # direct multi-word search for phrases in KNOWN_SKILLS
    found = set()
    for skill in KNOWN_SKILLS:
        if skill in txt:
            found.add(skill.replace("cplusplus","c++").replace("csharp","c#"))
    # also fallback to token matches (for e.g., React, Node)
    toks = set(_tokens(text))
    for skill in KNOWN_SKILLS:
        parts = skill.split()
        if len(parts) == 1 and parts[0] in toks:
            found.add(skill)
    # normalize some names
    normalized = []
    for s in found:
        s = s.replace("cplusplus","c++").replace("csharp","c#")
        normalized.append(s.capitalize() if len(s) > 1 and s.isalpha() else s)
    return sorted(normalized)
