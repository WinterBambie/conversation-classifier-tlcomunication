# Clasificador de Interacciones de Clientes de Telecomunicaciones

Proyecto de Machine Learning y Procesamiento de Lenguaje Natural (NLP) para clasificar automáticamente mensajes de clientes de telecomunicaciones según la intención de su solicitud.

## Objetivo

Desarrollar un modelo de clasificación de texto que identifique la categoría de una interacción y facilite la organización de solicitudes de atención al cliente.

El proyecto incluye exploración de datos, procesamiento de texto, entrenamiento y evaluación de modelos, implementación de predicciones y exposición del modelo mediante una API REST.

## Tecnologías utilizadas

- **Python:** lenguaje principal.
- **Pandas:** exploración y manipulación de datos.
- **Scikit-learn:** procesamiento de texto y Machine Learning.
- **TF-IDF:** representación numérica del texto.
- **Regresión Logística:** algoritmo de clasificación seleccionado.
- **FastAPI:** desarrollo de la API REST.
- **Joblib:** serialización y carga del modelo.
- **Pytest:** pruebas automatizadas.
- **Jupyter Notebook:** experimentación y documentación del proceso.

## Dataset

Se utilizó un conjunto de datos público de Kaggle con 103 registros de interacciones de clientes.

El conjunto contiene información sobre los mensajes y las categorías asignadas por los agentes.

**Variable de entrada:** `CustomerInteractionRawText`

**Variable objetivo:** `AgentAssignedTopic`

El modelo trabaja con 10 categorías:

- Port Out
- Poor Connectivity
- High Bill
- Roaming Plans
- Add New Line
- Deactivate
- Change Plans
- Cancel Service
- Data Usage
- Others

## Metodología

1. **Exploración de datos:** análisis de estructura, distribución de categorías, valores faltantes y características del texto.
2. **Procesamiento de texto:** transformación de los mensajes mediante TF-IDF.
3. **Entrenamiento:** comparación de modelos de clasificación, incluyendo Regresión Logística, SVM y Naive Bayes.
4. **Evaluación:** validación cruzada estratificada y análisis de Accuracy y Macro F1.
5. **Implementación:** reutilización del pipeline entrenado para clasificar nuevas interacciones.
6. **Exposición del modelo:** creación de una API REST con FastAPI.
7. **Pruebas:** validación de endpoints, entradas y respuestas mediante Pytest.

## Resultados

El modelo seleccionado fue Regresión Logística con TF-IDF utilizando unigramas y `C = 1.0`.

| Métrica | Resultado |
|---|---:|
| Accuracy en conjunto de prueba | 66.67 % |
| Macro F1 en conjunto de prueba | 0.6533 |
| Accuracy media en validación cruzada | 82.21 % |
| Macro F1 media en validación cruzada | 0.7905 |

Los resultados de validación cruzada son exploratorios y deben interpretarse con cautela debido al tamaño reducido del dataset y al proceso de selección de modelos.

## Estructura del proyecto

```text
clasificador-de-mensajes/
│
├── data/
│   └── CustomerInteractionData.csv
│
├── models/
│   ├── modelo_clasificacion.pkl
│   └── modelo_clasificacion_conversaciones.joblib
│
├── notebooks/
│   ├── 01_procesamiento_datos.ipynb
│   ├── 02_desarrollo_modelos_cv (1).ipynb
│   └── 03_implementacion_modelo.ipynb
│
├── src/
│   ├── __init__.py
│   ├── api.py
│   ├── app.py
│   └── predictor.py
│
├── tests/
│   └── test_api.py
│
└── .gitignore
```

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd clasificador-de-mensajes
```

### 2. Crear y activar un entorno virtual

En Windows:

```powershell
python -m venv .venv
.venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install pandas scikit-learn joblib fastapi uvicorn pytest httpx
```

### 4. Ejecutar la aplicación de consola

```bash
python -m src.app
```

### 5. Iniciar la API

```bash
uvicorn src.api:app --reload
```

La API estará disponible en:

- API: `http://127.0.0.1:8000`
- Documentación interactiva: `http://127.0.0.1:8000/docs`
- Estado del servicio: `http://127.0.0.1:8000/health`

### 6. Ejecutar las pruebas

```bash
python -m pytest -v
```

**Resultado actual:** 4 pruebas automatizadas aprobadas.

## Ejemplo de uso de la API

**Solicitud:**

```json
{
  "message": "My internet connection keeps dropping."
}
```

**Respuesta ilustrativa:**

```json
{
  "category": "Poor Connectivity",
  "confidence": 0.XX,
  "reviewStatus": "clasificacion_automatica"
}
```

La confianza de esta respuesta es ilustrativa; el valor real depende de la predicción.

## Limitaciones

- El dataset contiene únicamente 103 registros.
- El modelo puede confundir categorías con intenciones similares.
- Las probabilidades de clasificación no están calibradas.
- El modelo está diseñado para mensajes en inglés.
- Las predicciones deben revisarse en escenarios donde una clasificación incorrecta pueda afectar la atención al cliente.

## Próximas mejoras

- Ampliar el conjunto de datos con más interacciones.
- Evaluar técnicas adicionales de NLP.
- Incorporar calibración de probabilidades.
- Mejorar la detección de mensajes que requieren revisión humana.
- Ampliar las pruebas automatizadas.
- Explorar el despliegue de la API en un entorno de producción.

---

**Proyecto desarrollado como ejercicio de aplicación de Machine Learning, NLP y desarrollo de APIs con Python.**