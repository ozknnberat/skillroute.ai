FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install fastapi uvicorn chromadb google-genai python-dotenv
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
