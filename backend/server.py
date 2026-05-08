"""Minimal stub backend for Alif-AI (frontend-only static PWA).
Kept alive so supervisor's backend program does not flap."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Alif AI Backend Stub")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "alif-ai-stub"}


@app.get("/api/")
async def root():
    return {
        "service": "alif-ai-stub",
        "note": "Alif AI is a static PWA. Backend is intentionally minimal."
    }
