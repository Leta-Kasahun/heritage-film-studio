from fastapi import HTTPException, status


class StudioException(HTTPException):
    def __init__(self, status_code: int, detail: str) -> None:
        super().__init__(status_code=status_code, detail=detail)


class NotFoundException(StudioException):
    def __init__(self, resource: str, identifier: str | int) -> None:
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} {identifier} was not found",
        )


class ConflictException(StudioException):
    def __init__(self, detail: str) -> None:
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
        )


class FileSizeExceededException(StudioException):
    def __init__(self, limit_mb: int) -> None:
        super().__init__(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Uploaded file exceeds {limit_mb}MB limit",
        )


class InvalidFileFormatException(StudioException):
    def __init__(self, extension: str) -> None:
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unsupported format '{extension}'",
        )
