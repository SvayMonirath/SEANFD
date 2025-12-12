from pydantic import BaseModel
from typing import Optional

class FactorWeights(BaseModel):
    social: bool
    internet: bool
    tourism: bool
    trade: bool
    historical: bool

class GraphRequest(BaseModel):
    eventTitle: str
    origin: str
    activeFactors: FactorWeights

class AnalysisRequest(BaseModel):
    nodes: list[str]
    edges: list[dict]

class ShortestPathRequest(BaseModel):
    nodes: list[str]
    edges: list[dict]
    target: str
    origin: str
