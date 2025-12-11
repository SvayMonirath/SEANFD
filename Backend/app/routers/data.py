from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, union

from app.models.models import CountryFactor, EventFactor
from app.database import get_db

router = APIRouter(prefix="/data", tags=["data"])

@router.get("/get_countries")
async def get_countries(db: AsyncSession = Depends(get_db)):
    stmt_from = select(CountryFactor.from_country)
    stmt_to = select(CountryFactor.to_country)

    union_stmt = union(stmt_from, stmt_to)

    result = await db.execute(union_stmt)
    countries = [row[0] for row in result.fetchall()]

    return {"countries": countries}

@router.get("/get_events")
async def get_events(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EventFactor.event_title))
    events = [row[0] for row in result.fetchall()]

    return {"events": events}
