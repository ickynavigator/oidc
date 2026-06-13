up:
    docker compose up -d --remove-orphans

down:
    docker compose down

update:
    git pull origin main
    docker compose pull
    docker compose up -d --remove-orphans

status:
    docker compose ps -a

reset:
    docker compose down -v --remove-orphans
    docker compose up -d --remove-orphans