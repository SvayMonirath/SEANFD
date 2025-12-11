from typing import List, Dict, Set
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.models import CountryFactor, EventFactor
from collections import deque

async def calculate_full_graph(
    session: AsyncSession,
    event_title: str,
    origin: str,
    active_factors,  # can be dict or Pydantic model
    threshold: float = 0.55
) -> Dict[str, List[Dict]]:
    """
    Calculate a subgraph starting from origin, including all countries recursively,
    filtered by active factors and threshold.
    Returns a dict with nodes and edges.
    """

    # Convert Pydantic model to dict if needed
    if not isinstance(active_factors, dict):
        active_factors = active_factors.dict()

    # Fetch event factor
    result = await session.execute(
        select(EventFactor).where(EventFactor.event_title == event_title)
    )
    event = result.scalar_one_or_none()
    if not event:
        raise ValueError(f"Event '{event_title}' not found.")

    edges = []
    nodes: Set[str] = set()
    visited: Set[str] = set()
    queue = deque([origin])

    while queue:
        current = queue.popleft()
        if current in visited:
            continue
        visited.add(current)
        nodes.add(current)

        # Fetch outgoing edges from current country
        result = await session.execute(
            select(CountryFactor).where(CountryFactor.from_country == current)
        )
        countries = result.scalars().all()

        for c in countries:
            total_score = 0
            num_active = 0

            if active_factors.get("social", True):
                total_score += c.social * event.social
                num_active += 1
            if active_factors.get("internet", True):
                total_score += c.internet * event.internet
                num_active += 1
            if active_factors.get("tourism", True):
                total_score += c.tourism * event.tourism
                num_active += 1
            if active_factors.get("trade", True):
                total_score += c.trade * event.trade
                num_active += 1
            if active_factors.get("historical", True):
                total_score += c.historical * event.historical
                num_active += 1

            if num_active == 0:
                continue

            weighted_score = total_score / num_active

            if weighted_score >= threshold:
                edges.append({
                    "from": current,
                    "to": c.to_country,
                    "weight": round(weighted_score, 3)
                })
                if c.to_country not in visited:
                    queue.append(c.to_country)
                    nodes.add(c.to_country)

    return {"nodes": list(nodes), "edges": edges}
