from typing import List, Dict, Set
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.models import CountryFactor, EventFactor

async def calculate_full_graph(
    session: AsyncSession,
    event_title: str,
    origin: str,
    active_factors
) -> dict:
    from collections import deque

    if not isinstance(active_factors, dict):
        active_factors = active_factors.dict()

    result = await session.execute(
        select(EventFactor).where(EventFactor.event_title == event_title)
    )
    event = result.scalar_one_or_none()
    if not event:
        raise ValueError(f"Event '{event_title}' not found.")

    edges = []
    nodes = set()
    visited = set()
    queue = deque([origin])

    while queue:
        current = queue.popleft()
        if current in visited:
            continue
        visited.add(current)
        nodes.add(current)

        # Fetch outgoing edges
        result = await session.execute(
            select(CountryFactor).where(CountryFactor.from_country == current)
        )
        countries = result.scalars().all()

        neighbor_scores = []

        for c in countries:
            total_score = 0
            num_active = 0
            for factor in ["social", "internet", "tourism", "trade", "historical"]:
                if active_factors.get(factor, True):
                    val_c = getattr(c, factor, 0) or 0
                    val_e = getattr(event, factor, 0) or 0
                    total_score += val_c * val_e
                    num_active += 1
            if num_active == 0:
                continue
            weighted_score = total_score / num_active
            neighbor_scores.append((c.to_country, weighted_score))

        scores_only = [score for _, score in neighbor_scores if score is not None]
        if not scores_only:
            continue
        dynamic_threshold = sum(scores_only) / len(scores_only)

        for to_country, score in neighbor_scores:
            if score >= dynamic_threshold:
                edges.append({
                    "from": current,
                    "to": to_country,
                    "weight": round(score, 3)
                })
                if to_country not in visited:
                    queue.append(to_country)
                    nodes.add(to_country)

    return {"nodes": list(nodes), "edges": edges, "threshold": dynamic_threshold}

def analyze_reciprocity(nodes: List[str], edges: List[Dict]) -> Dict:

    edge_set = {(e["from"], e["to"]): e["weight"] for e in edges}

    reciprocal_pairs = []
    one_way_edges = []
    visited_pairs = set()

    for (a, b), w1 in edge_set.items():
        if (b, a) in edge_set:
            if (b, a) not in visited_pairs:
                w2 = edge_set[(b, a)]
                reciprocal_pairs.append({
                    "pair": (a, b),
                    "a_to_b": w1,
                    "b_to_a": w2,
                    "average_weight": round((w1 + w2) / 2, 3)
                })
                visited_pairs.add((a, b))
                visited_pairs.add((b, a))
        else:
            one_way_edges.append({"from": a, "to": b, "weight": w1})

    total_edges = len(edges)
    reciprocal_edge_count = len(reciprocal_pairs) * 2
    reciprocity_percentage = round((reciprocal_edge_count / total_edges) * 100, 2)

    strongest_reciprocal = sorted(
        reciprocal_pairs, key=lambda x: x["average_weight"], reverse=True
    )

    return {
        "reciprocal_pairs": reciprocal_pairs,
        "one_way_edges": one_way_edges,
        "reciprocity_percentage": reciprocity_percentage,
        "strongest_reciprocal": strongest_reciprocal
    }

def degree_analysis(nodes: List[str], edges: List[Dict]) -> Dict:
    in_degree = {node: 0 for node in nodes}
    out_degree = {node: 0 for node in nodes}

    for edge in edges:
        from_node = edge["from"]
        to_node = edge["to"]
        if from_node in out_degree:
            out_degree[from_node] += 1
        if to_node in in_degree:
            in_degree[to_node] += 1

    total_degree = {node: in_degree[node] + out_degree[node] for node in nodes}

    sorted_degrees = sorted(total_degree.items(), key=lambda x: x[1], reverse=True)

    return {
        "in_degree": in_degree,
        "out_degree": out_degree,
        "total_degree": total_degree,
        "sorted_degrees": sorted_degrees
    }
