import joblib

# Cargar el modelo
modelo = joblib.load("../models/modelo_clasificacion_conversaciones.joblib")


def clasificar_mensaje(mensaje):
    prediccion = modelo.predict([mensaje])[0]
    probabilidades = modelo.predict_proba([mensaje])[0]

    confianza = max(probabilidades)

    return prediccion, confianza