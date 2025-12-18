from langgraph.graph import StateGraph, END
from .state import ReviewState
from .agents.analyze import analyze_code
from .agents.suggest import suggest_fixes
from .agents.rewrite import rewrite_code
from .agents.evaluate import evaluate_quality

def build_graph():
    graph = StateGraph(ReviewState)

    graph.add_node("analyze", analyze_code)
    graph.add_node("suggest", suggest_fixes)
    graph.add_node("rewrite", rewrite_code)
    graph.add_node("evaluate", evaluate_quality)

    graph.set_entry_point("analyze")

    graph.add_edge("analyze", "suggest")
    graph.add_edge("suggest", "rewrite")
    graph.add_edge("rewrite", "evaluate")

    graph.add_conditional_edges(
        "evaluate",
        lambda s: "loop" if s["quality_score"] < 85 else "end",
        {
            "loop": "analyze",
            "end": END
        }
    )

    return graph.compile()
