# Part 2: Database Setup (PostgreSQL)

## Why PostgreSQL Was Chosen

PostgreSQL was selected for the pantry_manager backend because it provides:

- Strong reliability and data integrity with ACID-compliant transactions.
- Better support for concurrent users than file-based SQLite.
- Production-ready tooling for backups, monitoring, scaling, and performance tuning.
- Broad Django ecosystem support with stable drivers and migration workflows.

SQLite is great for quick local prototypes, but PostgreSQL is a better fit for multi-user web applications and deployment environments.

## Configure the .env File

The Django project reads database settings from environment variables using python-decouple.

Update Backend/.env with values for your PostgreSQL instance:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=pantry_manager
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
```

### Variable details

- DB_NAME: Database name used by Django.
- DB_USER: PostgreSQL user.
- DB_PASSWORD: Password for DB_USER.
- DB_HOST: Hostname or IP of PostgreSQL server.
- DB_PORT: PostgreSQL port (default 5432).
- ALLOWED_HOSTS: Comma-separated allowed hostnames/IPs.

Use Backend/.env.example as the template for new environments.

## Run Migrations

From the backend Django project directory:

```powershell
cd Backend/pantry_manager
python manage.py makemigrations
python manage.py migrate
```

Optional sanity check:

```powershell
python manage.py check
```

If migration succeeds, your schema is now applied to PostgreSQL.

## Security Note

Do not store database credentials directly in settings.py. Keep secrets in Backend/.env and do not commit that file to source control.
