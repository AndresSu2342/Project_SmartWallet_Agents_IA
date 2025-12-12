
import argparse
import json
from .crew import create_agent
from .utils.logging import get_logger

logger = get_logger("agent_runner")


EXAMPLES = {
  "discover_goals": {
    "action": "DISCOVER_GOALS",
    "user_id": "123",
    "semantic_memory": {
      "financial_summary": {"preferred_tone": "encouragement_challenge"},
      "spending_patterns": {"habit_patterns": ["daily small expenses", "weekend spending higher"]}
    },
    "financial_context": {"monthly_income": 2500000, "excedente_mensual": 300000, "fixed_expenses_monthly": 1800000},
    "transactions": [
      {"id": "6009", "date": "2025-11-20T16:47:18.211Z", "type": "expense", "amount": 90000, "description": "Cine + Crispetas"}
    ],
    "existing_goals": [
      {"id": "8000", "name": "Viaje Cartagena", "saved_amount": 420000, "target_amount": 1200000, "due_date": "2025-06-20T05:00:00.000Z"},
      {"id": "8001", "name": "Fondo de Emergencia", "saved_amount": 350000, "target_amount": 2000000, "due_date": "2025-12-30T05:00:00.000Z"}
    ]
  },
  "evaluate_goal": {
    "action": "EVALUATE_GOAL",
    "user_id": "123",
    "new_goal_proposal": {"name": "Comprar Laptop", "target_amount": 1500000, "due_date": "2026-06-01", "description": "Laptop para trabajo y estudio"},
    "financial_context": {"monthly_income": 2500000, "excedente_mensual": 200000, "fixed_expenses_monthly": 1800000},
    "semantic_memory": {"motivation_profile": {"preferred_tone": "encouragement_challenge"}},
    "existing_goals": [{"id": "8001", "name": "Fondo de Emergencia", "saved_amount": 350000, "target_amount": 2000000}]
  },
  "adjust_goals": {
    "action": "ADJUST_GOALS",
    "user_id": "123",
    "financial_context": {"monthly_surplus": 300000},
    "goals": [
      {"id": 8000, "name": "Viaje Cartagena", "saved_amount": 420000, "target_amount": 1200000, "created_at": "2025-11-28T16:48:03.691Z", "due_date": "2025-06-20T05:00:00.000Z"},
      {"id": 8001, "name": "Fondo de Emergencia", "saved_amount": 350000, "target_amount": 2000000, "created_at": "2025-11-28T16:48:03.691Z", "due_date": "2025-12-30T05:00:00.000Z"}
    ],
    "semantic_memory": {"motivation_profile": {"preferred_tone": "encouragement_challenge"}}
  },
  "adjust_100k": {
    "action": "ADJUST_GOALS",
    "user_id": "123",
    "financial_context": {"monthly_surplus": 100000},
    "goals": [
      {"id": 8000, "name": "Viaje Cartagena", "saved_amount": 420000, "target_amount": 1200000, "created_at": "2025-11-01T00:00:00Z", "due_date": "2026-06-20T05:00:00.000Z"},
      {"id": 8001, "name": "Fondo de Emergencia", "saved_amount": 350000, "target_amount": 2000000, "created_at": "2025-01-01T00:00:00Z", "due_date": "2025-12-30T05:00:00.000Z"}
    ],
    "semantic_memory": {"motivation_profile": {"preferred_tone": "encouragement_challenge"}}
  },
  "track_goal": {
    "action": "TRACK_GOAL",
    "user_id": "123",
    "goal_id": "8000",
    "goals": [
      {"id": "8000", "name": "Viaje Cartagena", "saved_amount": "420000", "target_amount": "1200000", "due_date": "2025-06-20T05:00:00.000Z"},
      {"id": "8001", "name": "Fondo de Emergencia", "saved_amount": "350000", "target_amount": "2000000", "due_date": "2025-12-30T05:00:00.000Z"}
    ],
    "financial_context": {"monthly_income": 2500000, "monthly_surplus": 300000},
    "semantic_memory": {"financial_summary": {"preferred_tone": "encouragement_challenge"}},
    "recent_transactions": [{"id": "6009", "date": "2025-11-20T16:47:18.211Z", "type": "expense", "amount": 90000, "description": "Cine + Crispetas"}]
  }
}


def run_examples(selected: list[str] | None = None) -> None:
  handler = create_agent()
  keys = list(EXAMPLES.keys()) if not selected else selected
  for k in keys:
    sample = EXAMPLES.get(k)
    if sample is None:
      print(f"No example named {k}")
      continue
    print("\n=== Running example:", k, "===")
    try:
      out = handler(sample)
      print(json.dumps(out, indent=2, ensure_ascii=False))
    except Exception as e:
      logger.exception("Example %s failed", k)
      print(f"Example {k} failed: {e}")


def main():
  parser = argparse.ArgumentParser()
  parser.add_argument("--examples", "-e", action="store_true", help="Run builtin example inputs for each action")
  parser.add_argument("--which", "-w", nargs="*", help="Run only selected examples by key (discover_goals evaluate_goal adjust_goals track_goal)")
  args = parser.parse_args()

  if args.examples:
    run_examples(args.which)
  else:
    print("Run with --examples to execute builtin example inputs, or edit the file to add more tests.")


if __name__ == "__main__":
  main()
