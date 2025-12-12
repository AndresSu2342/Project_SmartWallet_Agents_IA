"""Tools to query and manipulate user goals.

Note: This module expects that goals are available either from the incoming JSON or from a separate goals DB.
For portability we accept goals passed in the orchestrator input; if not present, this tool returns an empty list.
"""
from typing import List, Dict, Any
from ..utils.logging import get_logger

logger = get_logger("goals_tools")


def load_goals_from_input(input_json: Dict[str, Any]) -> List[Dict[str, Any]]:
    goals = input_json.get("goals")
    if not goals:
        logger.info("No goals in input JSON; returning empty list")
        return []
    return goals


def get_goal_by_id(goals: List[Dict[str, Any]], goal_id: int) -> Dict[str, Any]:
    for g in goals:
        try:
            if int(g.get("id")) == int(goal_id):
                return g
        except Exception:
            continue
    return {}
