from fastapi import FastAPI
import uvicorn
from layer.routers import user_router

from core.middlewares.exception import ExceptionHandlerMiddleware

app = FastAPI()
app.add_middleware(ExceptionHandlerMiddleware)
app.include_router(user_router.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}

