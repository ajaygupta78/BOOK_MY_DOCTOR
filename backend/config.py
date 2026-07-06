import os

class Config:
    # Key used for general Flask session and security
    SECRET_KEY = os.environ.get('SECRET_KEY', 'bca_final_year_project_book_my_doctor_secret_998877')
    
    # Key used specifically for JWT Token Authentication signing
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt_secure_key_for_doctor_appointment_system_112233')
    
    # Token duration (in seconds) - e.g., 24 hours
    JWT_ACCESS_TOKEN_EXPIRES = 86400

    # Dual Database Compatibility Selector:
    # First priority: Environment variable DATABASE_URL
    # Second priority: Standard MySQL connection (localhost, user root, empty password, database book_my_doctor)
    # Fallback priority: Local SQLite file for zero-setup running
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '')
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_DB = os.environ.get('MYSQL_DB', 'book_my_doctor')
    
    mysql_uri = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"
    sqlite_uri = "sqlite:///" + os.path.join(os.path.abspath(os.path.dirname(__file__)), "book_my_doctor.db")
    
    # We attempt to check if MySQL connection parameters are explicitly overridden or check standard environment
    # For robust out-of-the-box operation, if SQLite is specifically requested or if pymysql is missing, we fallback
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    
    if not SQLALCHEMY_DATABASE_URI:
        # Check if user has requested MySQL explicitly via environment variables, otherwise try MySQL and fallback to SQLite
        try:
            import pymysql
            # Default fallback behaviour: check if we should attempt MySQL. If localhost is down or database not created,
            # we will handle it gracefully in app.py during database initialization and fallback to SQLite file.
            SQLALCHEMY_DATABASE_URI = mysql_uri
        except ImportError:
            SQLALCHEMY_DATABASE_URI = sqlite_uri

    SQLALCHEMY_TRACK_MODIFICATIONS = False
