# Telecom Message Classifier

A full-stack application for classifying customer interactions in the telecommunications domain using Machine Learning and Natural Language Processing (NLP).

The system combines a React and TypeScript frontend, a Java Spring Boot REST API, and a Python FastAPI machine learning service to process customer messages and predict their corresponding categories.

## Architecture

The application follows a modular architecture that separates the user interface, API orchestration, and machine learning inference.

**Classification flow:**

1. The user submits a customer message through the React frontend.
2. The frontend sends the request to the Java Spring Boot API.
3. Spring Boot forwards the message to the Python FastAPI service.
4. The Python service loads the trained model and generates a prediction.
5. The classification result is returned through Spring Boot to the frontend.

```text
React + TypeScript
       |
       v
Java Spring Boot REST API
       |
       v
Python FastAPI
       |
       v
TF-IDF + Logistic Regression
       |
       v
Classification Result
```

## Technologies

| Component | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Shared package | TypeScript, React Query |
| Backend API | Java 17, Spring Boot 4 |
| Machine Learning API | Python, FastAPI, Pydantic |
| Machine Learning | Scikit-learn, TF-IDF, Logistic Regression |
| Data processing | Pandas, NumPy |
| Model serialization | Joblib |
| Testing | Pytest, JUnit, Spring Boot Test |
| Package management | pnpm workspaces |
| Build tools | Maven, Vite |

## Machine Learning Model

The classification model was developed using a public Kaggle dataset containing 103 customer interaction records.

**Input variable:** `CustomerInteractionRawText`

**Target variable:** `AgentAssignedTopic`

The model classifies messages into ten categories:

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

### Methodology

1. Exploratory data analysis and category distribution analysis.
2. Text preprocessing and TF-IDF vectorization.
3. Comparison of Logistic Regression, Support Vector Machines (SVM), and Naive Bayes.
4. Stratified cross-validation.
5. Model evaluation using Accuracy and Macro F1.
6. Model serialization and API integration.

### Model performance

The selected model uses TF-IDF with unigrams and Logistic Regression (`C = 1.0`).

| Metric | Result |
|---|---:|
| Test Accuracy | 66.67% |
| Test Macro F1 | 0.6533 |
| Cross-validation Accuracy | 82.21% |
| Cross-validation Macro F1 | 0.7905 |

Cross-validation results are exploratory and should be interpreted cautiously due to the small dataset and model selection process.

## Project Structure

```text
telecom-message-classifier/
â”‚
â”œâ”€â”€ frontend/                 # React + TypeScript application
â”‚   â”œâ”€â”€ public/
â”‚   â””â”€â”€ src/
â”‚
â”œâ”€â”€ backend-java/             # Spring Boot REST API
â”‚   â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ .mvn/
â”‚   â””â”€â”€ pom.xml
â”‚
â”œâ”€â”€ ml-service/               # Python machine learning service
â”‚   â”œâ”€â”€ data/
â”‚   â”œâ”€â”€ models/
â”‚   â”œâ”€â”€ notebooks/
â”‚   â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ tests/
â”‚   â””â”€â”€ requirements.txt
â”‚
â”œâ”€â”€ packages/
â”‚   â””â”€â”€ api-client-react/     # Shared frontend API client
â”‚
â”œâ”€â”€ docs/
â”‚
â”œâ”€â”€ pnpm-workspace.yaml
â”œâ”€â”€ pnpm-lock.yaml
â””â”€â”€ README.md
```

## Prerequisites

- Node.js 22 or compatible version.
- pnpm 10.
- Java 17.
- Python 3.12.
- Git.

## Local Installation and Execution

Clone the repository:

```bash
git clone <REPOSITORY_URL>
cd telecom-message-classifier
```

### 1. Python Machine Learning Service

Open a terminal:

```powershell
cd ml-service
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn src.api:app --reload --host 127.0.0.1 --port 8000
```

The service will be available at:

- API documentation: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/health`

### 2. Java Backend

Open another terminal from the repository root:

```powershell
cd backend-java
$env:CLASSIFIER_PROVIDER = "python-api"
$env:PYTHON_CLASSIFIER_URL = "http://localhost:8000"
.\mvnw.cmd spring-boot:run
```

The backend will run at `http://localhost:8080`.

### 3. React Frontend

Open another terminal from the repository root:

```powershell
npx pnpm@10 install
npx pnpm@10 --filter @workspace/telecom-message-classifier dev
```

The frontend will be available at:

`http://localhost:5173`

Vite proxies `/api` requests to the Spring Boot backend.

## API Endpoints

### Java Spring Boot API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Backend health check |
| POST | `/api/conversations/classify` | Classify a customer message |

Example request:

```json
{
  "message": "My internet connection keeps dropping."
}
```

The classification response includes:

- `category`: predicted message category.
- `confidence`: model confidence score.
- `reviewStatus`: classification review status.
- `classifierMode`: classifier execution mode.
- `modelNotice`: information about the prediction source.

### Python FastAPI Service

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Machine learning service health check |
| POST | `/predict` | Generate a model prediction |

Interactive documentation is available at `/docs`.

## Testing

### Frontend

Run type checking and production build from the repository root:

```powershell
npx pnpm@10 --filter @workspace/telecom-message-classifier typecheck
npx pnpm@10 --filter @workspace/telecom-message-classifier build
```

### Java Backend

```powershell
cd backend-java
.\mvnw.cmd test
```

### Python Service

```powershell
cd ml-service
python -m pytest -v
```

The current Python test suite contains four automated tests. The Java backend test suite contains two tests.

## Limitations

- The dataset contains only 103 records.
- Similar customer intents may be misclassified.
- Model probabilities are not calibrated.
- The model was trained for English-language messages.
- The current confidence threshold for manual review is provisional.
- Classification results should be evaluated before use in production customer support workflows.

## Future Improvements

- Expand the training dataset with more customer interactions.
- Evaluate additional NLP techniques and classification algorithms.
- Calibrate model probabilities and improve confidence thresholds.
- Improve the detection of messages requiring manual review.
- Expand automated integration and end-to-end testing.
- Implement production deployment and monitoring.

## Project Background

This project combines Machine Learning, NLP, REST API development, and full-stack software engineering in a modular application architecture.
