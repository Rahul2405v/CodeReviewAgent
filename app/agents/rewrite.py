from ..state import ReviewState
from ..llm import llm

def rewrite_code(state: ReviewState) -> ReviewState:
    prompt = f"""
Rewrite the code applying these fixes:
{state["issues"]}

Code:
{state["code"]}

Return only the improved code.
"""
    state["improved_code"] = llm.invoke(prompt).content
    return state
