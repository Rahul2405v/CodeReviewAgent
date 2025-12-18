from typing import TypedDict, List

class ReviewState(TypedDict):
    code: str
    issues: List[str]
    improved_code: str
    quality_score: int
