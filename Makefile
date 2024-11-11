FRONTEND_DIR=frontend
BACKEND_DIR=backend
PYTHON=python3
PIP=pip3
VENV_DIR=$(BACKEND_DIR)/venv
VENV_ACTIVATE=$(VENV_DIR)/bin/activate
FLASK_APP=$(BACKEND_DIR)/src:create_app 
DOCKER_COMPOSE_FILE=docker-compose.dev.yml

.PHONY: frontend-install backend-install start frontend-start tailwind-watch backend-start clean docker-up docker-down venv create-venv

create-venv:
	$(PYTHON) -m venv $(VENV_DIR)

install: backend-install frontend-install

backend-install: create-venv
	. $(VENV_DIR)/bin/activate && $(PIP) install -r $(BACKEND_DIR)/requirements.txt

frontend-install:
	cd $(FRONTEND_DIR) && npm install

start: docker-build docker-up tailwind-watch

frontend-start:
	cd $(FRONTEND_DIR) && npm start

backend-start:
	. $(VENV_DIR)/bin/activate && FLASK_APP=$(FLASK_APP) $(PYTHON) -m flask run --reload --port=5001

tailwind-watch:
	cd $(FRONTEND_DIR) && npx tailwindcss -i ./src/index.css -o ./src/output.css --watch

docker-build:
	docker compose -f $(DOCKER_COMPOSE_FILE) build

docker-up:
	docker compose -f $(DOCKER_COMPOSE_FILE) up