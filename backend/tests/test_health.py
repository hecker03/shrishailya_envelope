import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.parametrize(
    ("method", "path"),
    [
        ("get", "/tasks"),
        ("get", "/portfolio"),
        ("get", "/metadata"),
        ("post", "/access/verify"),
    ],
)
def test_legacy_task_board_routes_are_gone(method: str, path: str) -> None:
    response = getattr(client, method)(path)
    assert response.status_code == 404
