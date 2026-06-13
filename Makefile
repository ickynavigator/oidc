APP_NAME=oidc

.PHONY: up down update status

up:
	docker compose up -d --remove-orphans

down:
	docker compose down

update:
	set -e; \
	echo "Pulling latest code..." && git pull origin main; \
	echo "Pulling latest images..." && docker compose pull; \
	echo "Recreating stack..." && docker compose up -d --remove-orphans

status:
	docker compose ps