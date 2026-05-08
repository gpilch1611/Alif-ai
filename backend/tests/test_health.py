# Backend stub — only /api/health endpoint is in scope (Vite-based PWA)
import os
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://2f4babe0-0c48-46fd-9e6d-8cbb076ccbb1.preview.emergentagent.com").rstrip("/")


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def test_health_endpoint_status(session):
    """GET /api/health should return 200"""
    r = session.get(f"{BASE_URL}/api/health", timeout=10)
    assert r.status_code == 200, f"unexpected status: {r.status_code}, body: {r.text[:200]}"


def test_health_endpoint_payload(session):
    """GET /api/health should return JSON {status: ok}"""
    r = session.get(f"{BASE_URL}/api/health", timeout=10)
    body = r.json()
    assert body.get("status") == "ok", f"unexpected payload: {body}"


def test_frontend_html_loads(session):
    """Vite-served index should respond 200 with HTML referencing the SPA"""
    r = session.get(f"{BASE_URL}/", timeout=15)
    assert r.status_code == 200
    text = r.text.lower()
    assert "<html" in text
    assert "alif" in text or "id=\"app\"" in text or "type=\"module\"" in text
