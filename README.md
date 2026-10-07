# Clasificador de conversaciones de clientes

## Descripción

Proyecto de Machine Learning para clasificar conversaciones de clientes de telecomunicaciones según el tema de atención identificado.

El sistema utiliza procesamiento de texto y clasificación supervisada para asignar cada conversación a una de las categorías disponibles.

## Objetivo

Automatizar la identificación del tema principal de una conversación y utilizar un nivel de confianza para determinar cuándo una predicción debe ser revisada por una persona.

## Categorías

El modelo clasifica las conversaciones en 10 categorías:

- Add New Line
- Cancel Service
- Change Plans
- Data Usage
- Deactivate
- High Bill
- Others
- Poor Connectivity
- Port Out
- Roaming Plans

## Modelo

Se evaluaron diferentes algoritmos de clasificación y configuraciones de procesamiento de texto.

El modelo seleccionado utiliza:

- TF-IDF
- Regresión Logística
- N-gramas
- Validación cruzada estratificada

El modelo final se guarda en:

`models/modelo_clasificacion_conversaciones.joblib`

## Resultados

El modelo base obtuvo mediante validación cruzada:

- Accuracy: 81.54%
- Macro F1: 77.40%

En la evaluación sobre el conjunto de prueba:

- Accuracy: 66.67%
- Macro F1: 65.33%

## Supervisión

Se establecieron reglas para identificar situaciones que requieren atención:

- Accuracy inferior al 60%
- Más del 50% de predicciones con baja confianza
- Tasa de error superior al 40%

También se utiliza un umbral de confianza del 20% en la aplicación.

Las predicciones con confianza inferior al 20% se marcan para revisión humana.

## Reentrenamiento

Se realizó una simulación de reentrenamiento utilizando conversaciones revisadas y corregidas manualmente.

El modelo reentrenado obtuvo:

- Accuracy CV: 73.99%
- Macro F1 CV: 71.94%

El modelo reentrenado no superó al modelo base, por lo que se decidió mantener el modelo base y continuar recopilando datos revisados.

## Implementación

La aplicación permite ingresar una conversación y obtener:

- Categoría predicha
- Nivel de confianza
- Indicación de si requiere revisión humana

Para ejecutar la aplicación:

```bash
python src/app.py