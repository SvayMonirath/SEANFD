from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def create_app() -> FastAPI:
    app = FastAPI(title="SEANFD Backend")

    # Allow frontend requests
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    from app.routers.graph import router as graph_router
    from app.routers.data import router as data_router
    app.include_router(graph_router)
    app.include_router(data_router)

    return app

app = create_app()
