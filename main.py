from fastapi import FastAPI
import uvicorn
from api.routers.users import user_router

from middlewares.exception import ExceptionHandlerMiddleware

app = FastAPI()
app.add_middleware(ExceptionHandlerMiddleware)
app.include_router(user_router.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
