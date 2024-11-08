FROM dunglas/frankenphp:php8.3-bookworm

ENV SERVER_NAME=":8080"

RUN install-php-extensions @composer pdo_pgsql

WORKDIR /app

COPY . .

RUN composer install \
  --ignore-platform-reqs \
  --optimize-autoloader \
  --prefer-dist \
  --no-interaction \
  --no-progress \
  --no-scripts