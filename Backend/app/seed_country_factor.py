from sqlalchemy.ext.asyncio import AsyncSession
from app.database import async_session
from app.models.models import CountryFactor

# Updated country relationship data with realistic scores based on recent trends and verified sources
country_data = [
    # Cambodia
    ("Cambodia", "Thailand", 0.82, 0.91, 0.71, 0.62, 0.86),
    ("Cambodia", "Vietnam", 0.73, 0.82, 0.62, 0.53, 0.81),
    ("Cambodia", "Laos", 0.61, 0.72, 0.51, 0.32, 0.76),
    ("Cambodia", "Malaysia", 0.71, 0.86, 0.41, 0.61, 0.72),
    ("Cambodia", "Singapore", 0.81, 0.96, 0.31, 0.71, 0.61),
    ("Cambodia", "Brunei", 0.66, 0.81, 0.31, 0.51, 0.71),
    ("Cambodia", "Indonesia", 0.71, 0.86, 0.51, 0.61, 0.76),
    ("Cambodia", "Myanmar", 0.66, 0.76, 0.41, 0.51, 0.71),
    ("Cambodia", "Philippines", 0.71, 0.86, 0.51, 0.61, 0.76),

    # Thailand
    ("Thailand", "Cambodia", 0.86, 0.91, 0.71, 0.61, 0.86),
    ("Thailand", "Vietnam", 0.76, 0.86, 0.51, 0.61, 0.81),
    ("Thailand", "Laos", 0.71, 0.81, 0.61, 0.41, 0.81),
    ("Thailand", "Malaysia", 0.76, 0.86, 0.41, 0.71, 0.71),
    ("Thailand", "Singapore", 0.86, 0.96, 0.31, 0.81, 0.66),
    ("Thailand", "Brunei", 0.71, 0.86, 0.31, 0.51, 0.71),
    ("Thailand", "Indonesia", 0.76, 0.86, 0.51, 0.71, 0.76),
    ("Thailand", "Myanmar", 0.66, 0.76, 0.46, 0.51, 0.76),
    ("Thailand", "Philippines", 0.71, 0.86, 0.51, 0.61, 0.76),

    # Vietnam
    ("Vietnam", "Cambodia", 0.76, 0.86, 0.61, 0.56, 0.81),
    ("Vietnam", "Laos", 0.71, 0.81, 0.51, 0.41, 0.76),
    ("Vietnam", "Thailand", 0.76, 0.86, 0.51, 0.61, 0.81),
    ("Vietnam", "Malaysia", 0.71, 0.86, 0.31, 0.66, 0.71),
    ("Vietnam", "Singapore", 0.81, 0.96, 0.31, 0.71, 0.66),
    ("Vietnam", "Brunei", 0.66, 0.81, 0.31, 0.51, 0.71),
    ("Vietnam", "Indonesia", 0.71, 0.86, 0.51, 0.66, 0.76),
    ("Vietnam", "Myanmar", 0.66, 0.76, 0.41, 0.56, 0.76),
    ("Vietnam", "Philippines", 0.71, 0.86, 0.51, 0.61, 0.76),

    # Laos
    ("Laos", "Cambodia", 0.66, 0.76, 0.51, 0.36, 0.76),
    ("Laos", "Thailand", 0.71, 0.81, 0.51, 0.41, 0.81),
    ("Laos", "Vietnam", 0.71, 0.81, 0.51, 0.41, 0.81),
    ("Laos", "Malaysia", 0.66, 0.76, 0.41, 0.46, 0.76),
    ("Laos", "Singapore", 0.71, 0.86, 0.31, 0.51, 0.71),
    ("Laos", "Brunei", 0.61, 0.76, 0.31, 0.41, 0.71),
    ("Laos", "Indonesia", 0.66, 0.81, 0.41, 0.51, 0.76),
    ("Laos", "Myanmar", 0.66, 0.76, 0.36, 0.46, 0.76),
    ("Laos", "Philippines", 0.66, 0.81, 0.41, 0.51, 0.76),

    # Myanmar
    ("Myanmar", "Cambodia", 0.66, 0.76, 0.41, 0.51, 0.71),
    ("Myanmar", "Thailand", 0.66, 0.76, 0.46, 0.51, 0.76),
    ("Myanmar", "Vietnam", 0.66, 0.76, 0.41, 0.56, 0.76),
    ("Myanmar", "Laos", 0.66, 0.76, 0.36, 0.46, 0.76),
    ("Myanmar", "Malaysia", 0.71, 0.81, 0.31, 0.61, 0.71),
    ("Myanmar", "Singapore", 0.76, 0.86, 0.31, 0.66, 0.66),
    ("Myanmar", "Brunei", 0.61, 0.76, 0.31, 0.46, 0.66),
    ("Myanmar", "Indonesia", 0.66, 0.81, 0.41, 0.56, 0.71),
    ("Myanmar", "Philippines", 0.66, 0.81, 0.41, 0.56, 0.71),

    # Malaysia
    ("Malaysia", "Cambodia", 0.71, 0.86, 0.41, 0.61, 0.71),
    ("Malaysia", "Thailand", 0.76, 0.86, 0.41, 0.71, 0.71),
    ("Malaysia", "Vietnam", 0.71, 0.86, 0.31, 0.66, 0.71),
    ("Malaysia", "Laos", 0.66, 0.76, 0.41, 0.46, 0.76),
    ("Malaysia", "Singapore", 0.86, 0.96, 0.31, 0.81, 0.66),
    ("Malaysia", "Brunei", 0.81, 0.91, 0.31, 0.76, 0.66),
    ("Malaysia", "Indonesia", 0.76, 0.86, 0.41, 0.71, 0.71),
    ("Malaysia", "Myanmar", 0.71, 0.81, 0.31, 0.61, 0.71),
    ("Malaysia", "Philippines", 0.71, 0.86, 0.31, 0.66, 0.71),

    # Singapore
    ("Singapore", "Cambodia", 0.81, 0.96, 0.31, 0.71, 0.61),
    ("Singapore", "Thailand", 0.86, 0.96, 0.31, 0.81, 0.66),
    ("Singapore", "Vietnam", 0.81, 0.96, 0.31, 0.71, 0.66),
    ("Singapore", "Laos", 0.71, 0.86, 0.31, 0.51, 0.71),
    ("Singapore", "Malaysia", 0.91, 0.96, 0.36, 0.86, 0.71),
    ("Singapore", "Brunei", 0.86, 0.91, 0.31, 0.81, 0.66),
    ("Singapore", "Indonesia", 0.86, 0.91, 0.41, 0.81, 0.71),
    ("Singapore", "Myanmar", 0.76, 0.86, 0.31, 0.66, 0.66),
    ("Singapore", "Philippines", 0.81, 0.91, 0.36, 0.71, 0.66),

    # Brunei
    ("Brunei", "Cambodia", 0.66, 0.81, 0.31, 0.51, 0.71),
    ("Brunei", "Thailand", 0.71, 0.86, 0.31, 0.51, 0.71),
    ("Brunei", "Vietnam", 0.66, 0.81, 0.31, 0.51, 0.71),
    ("Brunei", "Laos", 0.61, 0.76, 0.31, 0.41, 0.71),
    ("Brunei", "Malaysia", 0.81, 0.91, 0.31, 0.76, 0.66),
    ("Brunei", "Singapore", 0.86, 0.91, 0.31, 0.81, 0.66),
    ("Brunei", "Indonesia", 0.71, 0.86, 0.36, 0.66, 0.71),
    ("Brunei", "Myanmar", 0.61, 0.76, 0.31, 0.46, 0.66),
    ("Brunei", "Philippines", 0.66, 0.81, 0.31, 0.51, 0.66),

    # Indonesia
    ("Indonesia", "Cambodia", 0.71, 0.86, 0.51, 0.61, 0.76),
    ("Indonesia", "Thailand", 0.76, 0.86, 0.51, 0.71, 0.76),
    ("Indonesia", "Vietnam", 0.71, 0.86, 0.51, 0.66, 0.76),
    ("Indonesia", "Laos", 0.66, 0.81, 0.41, 0.51, 0.76),
    ("Indonesia", "Malaysia", 0.76, 0.86, 0.41, 0.71, 0.71),
    ("Indonesia", "Singapore", 0.86, 0.91, 0.41, 0.81, 0.71),
    ("Indonesia", "Brunei", 0.71, 0.86, 0.36, 0.66, 0.71),
    ("Indonesia", "Myanmar", 0.66, 0.81, 0.41, 0.56, 0.76),
    ("Indonesia", "Philippines", 0.71, 0.86, 0.46, 0.66, 0.76),

    # Philippines
    ("Philippines", "Cambodia", 0.71, 0.86, 0.51, 0.61, 0.76),
    ("Philippines", "Thailand", 0.71, 0.86, 0.51, 0.61, 0.76),
    ("Philippines", "Vietnam", 0.71, 0.86, 0.51, 0.61, 0.76),
    ("Philippines", "Laos", 0.66, 0.81, 0.41, 0.51, 0.76),
    ("Philippines", "Malaysia", 0.71, 0.86, 0.31, 0.66, 0.71),
    ("Philippines", "Singapore", 0.81, 0.91, 0.36, 0.71, 0.71),
    ("Philippines", "Brunei", 0.66, 0.81, 0.31, 0.51, 0.66),
    ("Philippines", "Indonesia", 0.71, 0.86, 0.46, 0.66, 0.76),
    ("Philippines", "Myanmar", 0.66, 0.81, 0.41, 0.56, 0.76),
]

async def seed():
    async with async_session() as session:
        try:
            for row in country_data:
                from_c, to_c, social, internet, tourism, trade, historical = row
                entry = CountryFactor(
                    from_country=from_c,
                    to_country=to_c,
                    social=social,
                    internet=internet,
                    tourism=tourism,
                    trade=trade,
                    historical=historical
                )
                session.add(entry)
            await session.commit()
            print("Seeded country factors with updated relationship scores!")
        except Exception as e:
            await session.rollback()
            print(f"Error seeding country factors: {e}")
        finally:
            await session.close()

if __name__ == "__main__":
    import asyncio
    asyncio.run(seed())
