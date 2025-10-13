-- Initialize databases for each service
CREATE DATABASE user_db;
CREATE DATABASE vehicle_db;
CREATE DATABASE booking_db;
CREATE DATABASE notification_db;

-- Create users for each service
CREATE USER user_user WITH ENCRYPTED PASSWORD 'user_pass';
CREATE USER vehicle_user WITH ENCRYPTED PASSWORD 'vehicle_pass';
CREATE USER booking_user WITH ENCRYPTED PASSWORD 'booking_pass';
CREATE USER notification_user WITH ENCRYPTED PASSWORD 'notification_pass';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE user_db TO user_user;
GRANT ALL PRIVILEGES ON DATABASE vehicle_db TO vehicle_user;
GRANT ALL PRIVILEGES ON DATABASE booking_db TO booking_user;
GRANT ALL PRIVILEGES ON DATABASE notification_db TO notification_user;

-- Grant schema permissions
\c user_db;
GRANT ALL ON SCHEMA public TO user_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO user_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO user_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO user_user;

\c vehicle_db;
GRANT ALL ON SCHEMA public TO vehicle_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO vehicle_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO vehicle_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO vehicle_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO vehicle_user;

\c booking_db;
GRANT ALL ON SCHEMA public TO booking_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO booking_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO booking_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO booking_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO booking_user;

\c notification_db;
GRANT ALL ON SCHEMA public TO notification_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO notification_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO notification_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO notification_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO notification_user;

-- Create extension for UUID generation
\c user_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c vehicle_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c booking_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c notification_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
