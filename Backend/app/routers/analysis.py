from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.utils.calculation import analyze_reciprocity, degree_analysis
from app.schemas.graph_schemas import AnalysisRequest
from app.database import get_db

router = APIRouter(prefix="/analysis", tags=["analysis"])

@router.post("/reciprocity")
async def analyze_graph_reciprocity(
    request: AnalysisRequest,
    session: AsyncSession = Depends(get_db)
):
    print("Received analysis request:")

    try:
        reciprocity_result = analyze_reciprocity(
            request.nodes,
            request.edges
        )

        return {
            "reciprocity": reciprocity_result,
            "message": "Reciprocity analysis completed successfully.",
            "status": "success"
        }

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/degree")
async def analyze_graph_degree(
    request: AnalysisRequest,
    session: AsyncSession = Depends(get_db)
):
    print("Received degree analysis request:")

    try:
        degree_result = degree_analysis(
            request.nodes,
            request.edges
        )

        return {
            "degree_analysis": degree_result,
            "message": "Degree analysis completed successfully.",
            "status": "success"
        }

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
