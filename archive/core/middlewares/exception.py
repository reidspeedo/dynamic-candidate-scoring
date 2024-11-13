import logging
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.exc import SQLAlchemyError

logger = logging.getLogger(__name__)


class ExceptionHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except HTTPException as http_exception:
            # Log detailed error information for internal diagnostics
            logger.error(
                f"HTTPException ({type(http_exception).__name__}): {http_exception.detail}, Status: {http_exception.status_code}")
            # Return a generic error message appropriate for the status code
            return JSONResponse(
                status_code=http_exception.status_code,
                content={"error": "Request Error", "message": "There was an error processing your request."}
            )
        except SQLAlchemyError as db_error:
            # Log detailed database error
            logger.error(
                f"Database error ({type(db_error).__name__}): {str(db_error)}")
            # Return a generic database error message
            return JSONResponse(
                status_code=500,
                content={"error": "Database Error", "message": "A database error occurred."}
            )
        except Exception as e:
            # Log any unexpected exceptions
            logger.error(
                f"Unexpected error ({type(e).__name__}): {str(e)}")
            # Provide a generic error message for unexpected issues
            return JSONResponse(
                status_code=500,
                content={"error": "Server Error", "message": "An unexpected error occurred."}
            )
