FRONTEND_DIR=frontend
BACKEND_DIR=backend
PYTHON=python3
PIP=pip3
VENV_DIR=$(BACKEND_DIR)/venv
VENV_ACTIVATE=$(VENV_DIR)/bin/activate
FLASK_APP=$(BACKEND_DIR)/app:create_app 
DOCKER_COMPOSE_FILE=docker-compose.yml

.PHONY: frontend-install backend-install start frontend-start backend-start clean docker-up docker-down venv create-venv

create-venv:
	$(PYTHON) -m venv $(VENV_DIR)

install: backend-install frontend-install

backend-install: create-venv
	. $(VENV_DIR)/bin/activate && $(PIP) install -r $(BACKEND_DIR)/requirements.txt

frontend-install:
	cd $(FRONTEND_DIR) && npm install

start: frontend-start backend-start

frontend-start:
	cd $(FRONTEND_DIR) && npm start

backend-start:
	. $(VENV_DIR)/bin/activate && FLASK_APP=$(FLASK_APP) $(PYTHON) -m flask run --reload

docker-up:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up --build -d

docker-down:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down