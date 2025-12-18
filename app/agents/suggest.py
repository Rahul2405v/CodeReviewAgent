from ..state import ReviewState
from ..llm import llm

def suggest_fixes(state: ReviewState) -> ReviewState:
    prompt = f"""
Given these issues:
{state["issues"]}

Provide concrete fixes as bullet points.
"""
    response = llm.invoke(prompt).content
    state["issues"] = [line.strip("-• ").strip() for line in response.splitlines() if line.strip()]
    return state
