
from fastapi.testclient import TestClient

from src.api import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_predict_valid_message():
    response = client.post(
        "/predict",
        json={"message": "I want to cancel my service"}
    )

    assert response.status_code == 200

    data = response.json()

    assert "category" in data
    assert "confidence" in data
    assert "reviewStatus" in data
    assert 0 <= data["confidence"] <= 1


def test_predict_empty_message():
    response = client.post(
        "/predict",
        json={"message": "   "}
    )

    assert response.status_code == 422


def test_predict_message_too_long():
    response = client.post(
        "/predict",
        json={"message": "a" * 5001}
    )

    assert response.status_code == 422
