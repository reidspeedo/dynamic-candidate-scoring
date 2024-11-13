from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapp.routers import scoring
import uvicorn

app = FastAPI(
    title="Resume Scoring API",
    description="API for scoring resumes against job descriptions",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(scoring.router)

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
