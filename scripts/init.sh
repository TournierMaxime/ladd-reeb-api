#!/bin/bash

docker-compose up -d db
sleep 10  # Attendre un peu que la base de données soit prête

docker-compose run --rm server npm run migrate
docker-compose up -d server
docker-compose run --rm server npm run createPaymentType
docker-compose run --rm server npm run createRoot
docker-compose run --rm server npm run createAccessGroupRules
docker-compose run --rm server npm run createProducts
