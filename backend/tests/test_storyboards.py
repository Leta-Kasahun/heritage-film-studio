from pathlib import Path
import json
from pipeline.context import StoryboardContract


def test_root_storyboard_contract_is_valid():
    root_sb = Path(__file__).resolve().parents[2] / "storyboard.json"
    data = json.loads(root_sb.read_text(encoding="utf-8"))
    contract = StoryboardContract.model_validate(data)
    assert 6 <= len(contract.shots) <= 14
    total_duration = sum(s.duration_s for s in contract.shots)
    assert 60 <= total_duration <= 90
