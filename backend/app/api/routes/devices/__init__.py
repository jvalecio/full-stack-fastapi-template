# app/api/routes/control/__init__.py
from fastapi import APIRouter

from . import valve

router = APIRouter(prefix="/devices", tags=["devices"])

router.include_router(valve.router)
