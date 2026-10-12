from flask import Flask, jsonify, request, send_from_directory
from pathlib import Path
from datetime import datetime, timezone
import json
import uuid

ROOT = Path(__file__).resolve().parent
DATA_FILE = ROOT / "data" / "reports.json"
app = Flask(__name__, static_folder="frontend", static_url_path="")

HAZARDS = {
    "flood": ["flood", "water rising", "inundat", "overflow", "submerged"],
    "fire": ["fire", "smoke", "blaze", "burning", "wildfire"],
    "earthquake": ["earthquake", "tremor", "shaking", "quake", "building crack"],
    "cyclone": ["cyclone", "hurricane", "storm surge", "high wind", "typhoon"],
    "landslide": ["landslide", "mudslide", "rockfall", "slope collapse"],
    "medical": ["injured", "injury", "bleeding", "trapped", "unconscious", "medical"]
}

def load_reports():
    DATA_FILE.parent.mkdir(exist_ok=True)
    if not DATA_FILE.exists():
        DATA_FILE.write_text("[]", encoding="utf-8")
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))

def classify(text):
    normalized = text.lower()
    scores = {kind: sum(1 for term in terms if term in normalized) for kind, terms in HAZARDS.items()}
    hazard = max(scores, key=scores.get)
    if scores[hazard] == 0:
        hazard = "other"
    urgent_words = ["urgent", "trapped", "injured", "bleeding", "immediate", "help now", "life-threatening"]
    urgency = "high" if any(word in normalized for word in urgent_words) or hazard in ("fire", "earthquake") else "medium"
    return {"hazard": hazard, "urgency": urgency, "confidence": round(min(0.96, 0.58 + max(scores.values(), default=0) * 0.12), 2)}

@app.get("/")
def home():
    return send_from_directory(ROOT / "frontend", "index.html")

@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "DisasterAssist API"})

@app.post("/api/analyze")
def analyze():
    payload = request.get_json(silent=True) or {}
    description = str(payload.get("description", "")).strip()
    if len(description) < 5:
        return jsonify({"error": "Please describe the situation in at least 5 characters."}), 400
    return jsonify(classify(description))

@app.get("/api/reports")
def reports():
    return jsonify(sorted(load_reports(), key=lambda r: r["created_at"], reverse=True))

@app.post("/api/reports")
def create_report():
    payload = request.get_json(silent=True) or {}
    description = str(payload.get("description", "")).strip()
    location = str(payload.get("location", "")).strip()
    if len(description) < 5 or len(location) < 2:
        return jsonify({"error": "Enter a situation description and location."}), 400
    result = classify(description)
    report = {
        "id": str(uuid.uuid4())[:8].upper(), "description": description,
        "location": location, "contact": str(payload.get("contact", "")).strip(),
        **result, "created_at": datetime.now(timezone.utc).isoformat()
    }
    items = load_reports()
    items.append(report)
    DATA_FILE.write_text(json.dumps(items, indent=2), encoding="utf-8")
    return jsonify(report), 201

@app.get("/api/stats")
def stats():
    items = load_reports()
    return jsonify({"total": len(items), "high": sum(1 for item in items if item["urgency"] == "high"), "types": len(set(item["hazard"] for item in items))})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
