from ..state import ReviewState
from ..llm import llm

def analyze_code(state: ReviewState) -> ReviewState:
    prompt = f"""
Analyze the following Python code and list issues concisely.

{state["code"]}
"""
    response = llm.invoke(prompt).content
    state["issues"] = [line.strip("-• ").strip() for line in response.splitlines() if line.strip()]
    return state