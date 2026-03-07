#!/bin/sh

# Esperar a que la base de datos esté lista (opcional, pero recomendado)
# Esto asume que tienes `pg_isready` disponible (instalado vía apk add postgresql-client)
# until pg_isready -h db -U skilltransfer_user; do
#   echo "Waiting for database..."
#   sleep 2
# done

# Ejecutar migraciones de Prisma
echo "Running migrations..."
npx prisma migrate deploy

# Listar contenido de dist para depuración
echo "Listing dist directory:"
ls -R dist

# Iniciar la aplicación
exec "$@"