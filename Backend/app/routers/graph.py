from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.graph_schemas import GraphRequest
from app.database import get_db
from app.utils.calculation import calculate_full_graph

router = APIRouter(prefix="/graph", tags=["graph"])

@router.post("/generate")
async def generate_graph(
    request: GraphRequest,
    session: AsyncSession = Depends(get_db)
):
    print("Received request:", request.dict())
    try:
        graph = await calculate_full_graph(
            session,
            request.eventTitle,
            request.origin,
            request.activeFactors,
            request.threshold
        )

        print("Generated graph" )
        return {"graph": graph, "message": "Graph generated successfully.", "status": "success"}

    except ValueError as e:
        print("Error during graph calculation:", str(e))
        raise HTTPException(status_code=404, detail=str(e))
