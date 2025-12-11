# app/seed_event_factor.py
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import async_session, engine
from app.models.models import EventFactor

# List of events to seed
events = [
    {"event_title": "COVID-19 Pandemic (2020–2023)", "social": 1.0, "internet": 0.9, "tourism": 0.9, "trade": 0.9, "historical": 0.8},
    {"event_title": "SARS Outbreak (2003)", "social": 0.7, "internet": 0.3, "tourism": 0.6, "trade": 0.4, "historical": 0.6},
    {"event_title": "Asian Financial Crisis (1997–1998)", "social": 0.6, "internet": 0.2, "tourism": 0.5, "trade": 1.0, "historical": 0.9},
    {"event_title": "Global Oil Price Shock (2014–2015)", "social": 0.3, "internet": 0.2, "tourism": 0.2, "trade": 0.8, "historical": 0.5},
    {"event_title": "COVID-19 Economic Recession (2020)", "social": 0.9, "internet": 0.7, "tourism": 0.8, "trade": 1.0, "historical": 0.7},
    {"event_title": "Myanmar Military Coup (2021)", "social": 0.8, "internet": 0.5, "tourism": 0.7, "trade": 0.6, "historical": 0.6},
    {"event_title": "ASEAN Charter Ratification (2008)", "social": 0.2, "internet": 0.1, "tourism": 0.1, "trade": 0.2, "historical": 1.0},
    {"event_title": "Rohingya Refugee Crisis (2017–ongoing)", "social": 0.9, "internet": 0.3, "tourism": 0.3, "trade": 0.4, "historical": 0.8},
    {"event_title": "Typhoon Haiyan (2013, Philippines)", "social": 0.9, "internet": 0.1, "tourism": 0.8, "trade": 0.5, "historical": 0.7},
    {"event_title": "Indian Ocean Tsunami (2004)", "social": 1.0, "internet": 0.0, "tourism": 0.9, "trade": 0.6, "historical": 1.0},
    {"event_title": "Mount Pinatubo Eruption (1991, Philippines)", "social": 0.7, "internet": 0.0, "tourism": 0.5, "trade": 0.4, "historical": 0.9},
    {"event_title": "Rise of Mobile Payments in ASEAN (2015–2022)", "social": 0.5, "internet": 1.0, "tourism": 0.3, "trade": 0.8, "historical": 0.4},
    {"event_title": "Cybersecurity Attacks on ASEAN Governments (2021–2022)", "social": 0.4, "internet": 1.0, "tourism": 0.1, "trade": 0.5, "historical": 0.3},
]

async def seed_events():
    async with async_session() as session:
        async with session.begin():
            for event_data in events:
                event = EventFactor(**event_data)
                session.add(event)
        await session.commit()
    print("✅ Event factors seeded successfully.")

if __name__ == "__main__":
    asyncio.run(seed_events())
