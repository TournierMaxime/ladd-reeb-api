# ladd-reeb-api

## Installation

Important: se positioner sur la branche refactoringAPI

1. Créer le .env grâce au .env.dist
2. Créer le docker-compose.yml grâce au docker-compose.yml.dist
4. Lancer la commande `docker compose build`
5. Lancer la commande `chmod +x ./scripts/init.sh` pour être sur d'avoir les droits d'exécution du script
6. Lancer la commande `./scripts/init.sh`

## Migration

1. Pour créer une migration: npx sequelize-cli migration:generate --name <nom_de_la_migration>
2. Renommer l'extension du fichier de migration en .cjs (compatibilité type module)
3. Pour exécuter les modifications effectuées par une migration: docker compose run --rm server npm run migrate