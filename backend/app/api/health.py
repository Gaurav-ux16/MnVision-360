from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.database import get_db, check_db_connection, check_postgis
from app.core.config import settings
from app.schemas.schemas import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    db_ok = check_db_connection()
    postgis_ok = check_postgis() if db_ok else False
    
    return {
        "status": "ok" if db_ok else "degraded",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": settings.app_version,
        "environment": settings.app_env,
        "services": {
            "database": "ok" if db_ok else "unavailable",
            "postgis": "ok" if postgis_ok else "unavailable"
        }
    }
