from __future__ import annotations

import json
import os
import secrets
import time
import uuid
from collections import defaultdict, deque
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

DATA_FILE = Path(__file__).resolve().parent / "data" / "store.json"
DATA_FILE.parent.mkdir(exist_ok=True)
PRIVATE_ACCESS_CODE = os.getenv("PRIVATE_ACCESS_CODE", "")
if len(PRIVATE_ACCESS_CODE) < 12:
    raise RuntimeError("Set PRIVATE_ACCESS_CODE (12+ characters) in backend/.env. See .env.example.")

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if origin.strip()
]
MAX_FAILED_ATTEMPTS = 5
FAILED_WINDOW_SECONDS = 60
_failed_attempts: dict[str, deque[float]] = defaultdict(deque)

app = FastAPI(title="Shrishailya Ops API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "X-Access-Code"],
)


class AccessRequest(BaseModel):
    code: str = Field(..., min_length=1)


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = ""
    category: str = ""
    status: str = ""
    completed: bool = False
    published: bool = False


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    status: str | None = None
    completed: bool | None = None
    published: bool | None = None


class MetadataItemRequest(BaseModel):
    name: str = Field(..., min_length=1)


def _empty_store() -> dict[str, Any]:
    return {"categories": [], "statuses": [], "tasks": []}


def _load_store() -> dict[str, Any]:
    if DATA_FILE.exists():
        try:
            with DATA_FILE.open("r", encoding="utf-8") as handle:
                data = json.load(handle)
                if isinstance(data, dict):
                    return {
                        "categories": data.get("categories", []),
                        "statuses": data.get("statuses", []),
                        "tasks": data.get("tasks", []),
                    }
        except json.JSONDecodeError:
            pass
    return _empty_store()


def _save_store(store: dict[str, Any]) -> None:
    DATA_FILE.write_text(json.dumps(store, indent=2), encoding="utf-8")


def _client_id(request: Request) -> str:
    return request.client.host if request.client else "unknown"


def _check_code(code: str | None, request: Request) -> None:
    """Constant-time compare, with a per-client limit on failed attempts."""
    client = _client_id(request)
    attempts = _failed_attempts[client]
    now = time.monotonic()
    while attempts and now - attempts[0] > FAILED_WINDOW_SECONDS:
        attempts.popleft()
    if len(attempts) >= MAX_FAILED_ATTEMPTS:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many attempts. Try again later.")
    if not code or not secrets.compare_digest(code.encode(), PRIVATE_ACCESS_CODE.encode()):
        attempts.append(now)
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid access code")


def require_access(request: Request, x_access_code: str | None = Header(default=None)) -> None:
    _check_code(x_access_code, request)


def _normalize(value: str | None) -> str:
    return (value or "").strip()


@app.get("/")
def root() -> dict[str, Any]:
    return {
        "service": "shrishailya-ops-api",
        "status": "running",
        "routes": [
            "/health",
            "/portfolio",
            "/access/verify",
            "/tasks",
            "/metadata",
        ],
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/access/verify")
def verify_access(payload: AccessRequest, request: Request) -> dict[str, bool]:
    _check_code(payload.code, request)
    return {"ok": True}


@app.get("/portfolio")
def get_portfolio() -> dict[str, list[dict[str, Any]]]:
    store = _load_store()
    published_tasks = [task for task in store.get("tasks", []) if task.get("published")]
    return {"tasks": published_tasks}


@app.get("/metadata", dependencies=[Depends(require_access)])
def get_metadata() -> dict[str, list[str]]:
    store = _load_store()
    return {"categories": store.get("categories", []), "statuses": store.get("statuses", [])}


@app.post("/metadata/categories", dependencies=[Depends(require_access)])
def add_category(payload: MetadataItemRequest) -> dict[str, list[str]]:
    store = _load_store()
    name = _normalize(payload.name)
    if not name:
        raise HTTPException(status_code=400, detail="Category name is required")
    if name not in store.setdefault("categories", []):
        store["categories"].append(name)
        _save_store(store)
    return {"categories": store.get("categories", []), "statuses": store.get("statuses", [])}


@app.delete("/metadata/categories/{name}", dependencies=[Depends(require_access)])
def remove_category(name: str) -> dict[str, list[str]]:
    store = _load_store()
    cleaned_name = _normalize(name)
    if cleaned_name in store.get("categories", []):
        store["categories"].remove(cleaned_name)
        _save_store(store)
    return {"categories": store.get("categories", []), "statuses": store.get("statuses", [])}


@app.post("/metadata/statuses", dependencies=[Depends(require_access)])
def add_status(payload: MetadataItemRequest) -> dict[str, list[str]]:
    store = _load_store()
    name = _normalize(payload.name)
    if not name:
        raise HTTPException(status_code=400, detail="Status name is required")
    if name not in store.setdefault("statuses", []):
        store["statuses"].append(name)
        _save_store(store)
    return {"categories": store.get("categories", []), "statuses": store.get("statuses", [])}


@app.delete("/metadata/statuses/{name}", dependencies=[Depends(require_access)])
def remove_status(name: str) -> dict[str, list[str]]:
    store = _load_store()
    cleaned_name = _normalize(name)
    if cleaned_name in store.get("statuses", []):
        store["statuses"].remove(cleaned_name)
        _save_store(store)
    return {"categories": store.get("categories", []), "statuses": store.get("statuses", [])}


@app.get("/tasks", dependencies=[Depends(require_access)])
def list_tasks() -> dict[str, list[dict[str, Any]]]:
    store = _load_store()
    return {"tasks": store.get("tasks", [])}


@app.post("/tasks", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_access)])
def create_task(payload: TaskCreate) -> dict[str, Any]:
    store = _load_store()
    task = {
        "id": str(uuid.uuid4()),
        "title": _normalize(payload.title),
        "description": _normalize(payload.description),
        "category": _normalize(payload.category),
        "status": _normalize(payload.status),
        "completed": payload.completed,
        "published": payload.published,
    }
    store.setdefault("tasks", []).append(task)
    _save_store(store)
    return task


@app.put("/tasks/{task_id}", dependencies=[Depends(require_access)])
def update_task(task_id: str, payload: TaskUpdate) -> dict[str, Any]:
    store = _load_store()
    tasks = store.setdefault("tasks", [])
    task = next((item for item in tasks if item.get("id") == task_id), None)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    if payload.title is not None:
        task["title"] = _normalize(payload.title)
    if payload.description is not None:
        task["description"] = _normalize(payload.description)
    if payload.category is not None:
        task["category"] = _normalize(payload.category)
    if payload.status is not None:
        task["status"] = _normalize(payload.status)
    if payload.completed is not None:
        task["completed"] = payload.completed
    if payload.published is not None:
        task["published"] = payload.published

    _save_store(store)
    return task


@app.delete("/tasks/{task_id}", dependencies=[Depends(require_access)])
def delete_task(task_id: str) -> dict[str, bool]:
    store = _load_store()
    tasks = store.setdefault("tasks", [])
    filtered = [task for task in tasks if task.get("id") != task_id]
    if len(filtered) == len(tasks):
        raise HTTPException(status_code=404, detail="Task not found")
    store["tasks"] = filtered
    _save_store(store)
    return {"deleted": True}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
