from fastapi import FastAPI
from api.routers.v1.users import user_router

app = FastAPI()

app.include_router(user_router.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}
