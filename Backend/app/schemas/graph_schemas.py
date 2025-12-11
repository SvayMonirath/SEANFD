from pydantic import BaseModel

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
    threshold: float = 0.55
