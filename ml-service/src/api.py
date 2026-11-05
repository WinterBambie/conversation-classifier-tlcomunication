
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, field_validator

from src.predictor import clasificar_mensaje

app = FastAPI(
    title="Telecom Message Classifier API",
    description=(
        "API para clasificar conversaciones de telecomunicaciones "
        "mediante Machine Learning."
    ),
    version="1.1.0"
)


class ClassificationRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Mensaje o conversación que se desea clasificar."
    )

    @field_validator("message")
    @classmethod
    def validate_message(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("El mensaje no puede estar vacío.")

        return value


class ClassificationResponse(BaseModel):
    category: str
    confidence: float
    reviewStatus: str


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "python-classifier"
    }


@app.post("/predict", response_model=ClassificationResponse)
def predict(request: ClassificationRequest):
    try:
        resultado = clasificar_mensaje(request.message)

        return ClassificationResponse(
            category=resultado["categoria"],
            confidence=resultado["confianza"],
            reviewStatus=resultado["estado"]
        )

    except (ValueError, TypeError) as error:
        raise HTTPException(
            status_code=422,
            detail=str(error)
        ) from error

    except Exception as error:
        # No exponer detalles internos al consumidor de la API.
        raise HTTPException(
            status_code=500,
            detail="No fue posible procesar la clasificación."
        ) from error
