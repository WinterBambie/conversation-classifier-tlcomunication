
from pathlib import Path

import joblib

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "modelo_clasificacion_conversaciones.joblib"

UMBRAL_REVISION = 0.20

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"No se encontró el modelo en: {MODEL_PATH}"
    )

modelo = joblib.load(MODEL_PATH)


def clasificar_mensaje(mensaje: str) -> dict:
    """
    Clasifica un mensaje y determina si requiere revisión humana.
    """

    if not isinstance(mensaje, str):
        raise TypeError("El mensaje debe ser una cadena de texto.")

    mensaje = mensaje.strip()

    if not mensaje:
        raise ValueError("El mensaje no puede estar vacío.")

    prediccion = modelo.predict([mensaje])[0]
    probabilidades = modelo.predict_proba([mensaje])[0]

    confianza = float(probabilidades.max())
    requiere_revision = confianza < UMBRAL_REVISION

    return {
        "categoria": str(prediccion),
        "confianza": confianza,
        "requiere_revision": requiere_revision,
        "estado": (
            "revision_manual"
            if requiere_revision
            else "clasificacion_automatica"
        )
    }
