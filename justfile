envrun := "infisical run --"

# Pick a command to run from the list of available commands
default:
    @just --choose

# Run the docker compose up command with infisical environment variables
up:
    {{ envrun }} docker compose up -d

# Stop the docker compose environment by bringing down all containers
down:
    {{ envrun }} docker compose down

# Update the docker compose environment by pulling the latest changes from the main branch and restarting the containers
update:
    git pull origin main
    {{ envrun }} docker compose pull
    {{ envrun }} docker compose up -d

# View the status of all containers in the docker compose environment
status:
    {{ envrun }} docker compose ps -a

# Reset the docker compose environment by removing all containers, volumes, and orphans, then start fresh
reset:
    {{ envrun }} docker compose down -v --remove-orphans
    {{ envrun }} docker compose up -d

# View Logs for a specific service
logs SERVICE="":
    {{ envrun }} docker compose logs {{ SERVICE }} -f
