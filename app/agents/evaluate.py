from ..state import ReviewState
from ..llm import llm

def evaluate_quality(state: ReviewState) -> ReviewState:
    prompt = f"""
Rate the quality of this code from 0 to 100.
Return only a number.

{state["improved_code"]}
"""
    score = llm.invoke(prompt).content.strip()
    state["quality_score"] = int("".join(filter(str.isdigit, score)) or 0)
    return state
