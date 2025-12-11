from sqlalchemy import Column, Integer, String, Float, UniqueConstraint
from app.database import Base

class EventFactor(Base):
    __tablename__ = "event_factors"

    id = Column(Integer, primary_key=True, index=True)
    event_title = Column(String, unique=True, nullable=False)

    social = Column(Float, nullable=False)
    internet = Column(Float, nullable=False)
    tourism = Column(Float, nullable=False)
    trade = Column(Float, nullable=False)
    historical = Column(Float, nullable=False)


class CountryFactor(Base):
    __tablename__ = "country_factor"

    id = Column(Integer, primary_key=True, index=True)
    from_country = Column(String, nullable=False)
    to_country = Column(String, nullable=False)

    social = Column(Float, nullable=False)
    internet = Column(Float, nullable=False)
    tourism = Column(Float, nullable=False)
    trade = Column(Float, nullable=False)
    historical = Column(Float, nullable=False)

    __table_args__ = (
        UniqueConstraint("from_country", "to_country", name="uq_country_pair"),
    )
