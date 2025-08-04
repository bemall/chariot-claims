FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    python3-dev \
    musl-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
ENV POETRY_VERSION=2.1.3
ENV POETRY_HOME=/opt/poetry
ENV POETRY_VENV=/opt/poetry-venv
ENV POETRY_CACHE_DIR=/opt/.cache

RUN python3 -m venv $POETRY_VENV \
    && $POETRY_VENV/bin/pip install -U pip setuptools \
    && $POETRY_VENV/bin/pip install poetry==${POETRY_VERSION}

ENV PATH="${PATH}:${POETRY_VENV}/bin"

WORKDIR /app

# Copy poetry files
COPY pyproject.toml poetry.lock* ./

# Configure Poetry to not create virtualenv
RUN poetry config virtualenvs.create false

# Install dependencies without installing the project itself
RUN poetry install --no-interaction --no-ansi --no-root

# Copy application
COPY . .

# Install the project
RUN poetry install --no-interaction --no-ansi --only-root

CMD ["poetry", "run", "celery", "-A", "chariot_claims", "worker", "-l", "info"]
