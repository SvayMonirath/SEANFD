from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import networkx as nx

from app.schemas.graph_schemas import GraphRequest, ShortestPathRequest
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
        )

        print("Generated graph threshold:\n", graph.get("threshold"))
        return {"graph": graph, "message": "Graph generated successfully.", "status": "success"}

    except ValueError as e:
        print("Error during graph calculation:", str(e))
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/shortest_path")
async def shortest_path(
    request: ShortestPathRequest,
):
    G = nx.DiGraph()  # directed graph
    G.add_nodes_from(request.nodes)  # add all nodes

    for edge in request.edges:
        G.add_edge(edge['from'], edge['to'], weight=edge.get('weight', 1))

    # Check if origin and target exist
    if request.target not in request.nodes or request.origin not in request.nodes:
        raise HTTPException(status_code=400, detail="Origin or target node not in graph nodes.")

    try:
        node_path = nx.shortest_path(G, source=request.origin, target=request.target, weight='weight')

        # generate edge list along the path
        edge_path = []
        for i in range(len(node_path) - 1):
            u = node_path[i]
            v = node_path[i + 1]
            if G.has_edge(u, v):
                edge_path.append({"from": u, "to": v, "weight": G[u][v]['weight']})
            else:
                # fallback if somehow edge missing
                edge_path.append({"from": u, "to": v, "weight": 1})

        return {
            "path": node_path,
            "edges": edge_path,
            "message": "Shortest path calculated successfully.",
            "status": "success"
        }
    except nx.NetworkXNoPath:
        raise HTTPException(status_code=404, detail=f"No path found from {request.origin} to {request.target}.")

