from flask import Flask, jsonify
from flask_cors import CORS
from backend.config import Config
from backend.models.database import db, User, Specialization, Hospital, Doctor, Admin, Schedule, Patient, Appointment, Payment
import os
import bcrypt

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Pre-flight MySQL connectivity check — switch to SQLite BEFORE db.init_app()
    # so SQLAlchemy never caches a broken MySQL engine.
    current_uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
    if 'mysql' in current_uri:
        try:
            import pymysql
            cfg = Config
            conn = pymysql.connect(
                host=cfg.MYSQL_HOST,
                user=cfg.MYSQL_USER,
                password=cfg.MYSQL_PASSWORD,
                connect_timeout=3
            )
            # Try to create the database if it doesn't exist
            with conn.cursor() as cursor:
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{cfg.MYSQL_DB}`")
            conn.close()
            print("MySQL connection verified successfully.")
        except Exception as mysql_err:
            print(f"MySQL not available ({mysql_err}). Switching to SQLite fallback.")
            sqlite_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), "book_my_doctor.db")
            app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{sqlite_path}"

    # Enable safe Cross-Origin Resource Sharing (CORS) for local React development
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Bind SQLAlchemy Database Context (engine is created here using the final URI)
    db.init_app(app)

    # Register blueprints (routes)
    from backend.routes.auth import auth_bp
    from backend.routes.hospitals import hospitals_bp
    from backend.routes.doctors import doctors_bp
    from backend.routes.appointments import appointments_bp
    from backend.routes.payments import payments_bp
    from backend.routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(hospitals_bp, url_prefix='/api/hospitals')
    app.register_blueprint(doctors_bp, url_prefix='/api/doctors')
    app.register_blueprint(appointments_bp, url_prefix='/api/appointments')
    app.register_blueprint(payments_bp, url_prefix='/api/payments')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # Central Error Handling
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'message': 'API endpoint not found.'}), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({'message': 'An internal server error occurred.'}), 500

    # Auto-generate tables & seed data on launch
    with app.app_context():
        try:
            db.create_all()
            print("Database tables synced successfully!")
            
            # Programmatic database seed fallback:
            # If the database is freshly initialized and has no specializations, seed them automatically.
            if Specialization.query.count() == 0:
                print("Fresh database detected! Seeding default mock data...")
                
                # 1. Seed Specializations
                specs = [
                    Specialization(name='Cardiology', description='Heart and cardiovascular system treatments.'),
                    Specialization(name='Dermatology', description='Skin, hair, nails, and related disorders.'),
                    Specialization(name='Pediatrics', description='Medical care for infants, children, and adolescents.'),
                    Specialization(name='Neurology', description='Disorders of the nervous system and brain.'),
                    Specialization(name='General Medicine', description='Primary care and everyday health conditions.')
                ]
                db.session.add_all(specs)
                db.session.commit()
                
                # 2. Seed Hospitals
                hosp1 = Hospital(name='Apollo Speciality Hospital', city='Chennai', address='21, Greams Lane, Off Greams Road, Chennai - 600006', phone='+91 44 2829 0200', email='info.chennai@apollo.com', rating=4.8)
                hosp2 = Hospital(name='Max Super Speciality Hospital', city='Delhi', address='1, Press Enclave Road, Saket, New Delhi - 110017', phone='+91 11 2651 5050', email='contact@maxhealthcare.com', rating=4.7)
                hosp3 = Hospital(name='Fortis Memorial Research Institute', city='Gurgaon', address='Sector 44, Opposite HUDA City Centre, Gurgaon - 122002', phone='+91 124 496 2200', email='contact@fortishealth.com', rating=4.6)
                hosp4 = Hospital(name='Kokilaben Dhirubhai Ambani Hospital', city='Mumbai', address='Rao Saheb Marg, Four Bungalows, Andheri West, Mumbai - 400053', phone='+91 22 4269 6969', email='feedback@kokilabenhospitals.com', rating=4.9)
                db.session.add_all([hosp1, hosp2, hosp3, hosp4])
                db.session.commit()

                # 3. Seed Users
                # Hashed passwords for 'admin123' and 'password123'
                admin_hash = bcrypt.hashpw(b'admin123', bcrypt.gensalt()).decode('utf-8')
                doc_hash = bcrypt.hashpw(b'password123', bcrypt.gensalt()).decode('utf-8')
                pat_hash = bcrypt.hashpw(b'password123', bcrypt.gensalt()).decode('utf-8')

                user_admin = User(email='admin@bookmydoctor.com', password_hash=admin_hash, role='admin')
                user_doc1 = User(email='dr.smith@bookmydoctor.com', password_hash=doc_hash, role='doctor')
                user_doc2 = User(email='dr.jane@bookmydoctor.com', password_hash=doc_hash, role='doctor')
                user_pat1 = User(email='pat.jones@gmail.com', password_hash=pat_hash, role='patient')
                user_pat2 = User(email='pat.doe@gmail.com', password_hash=pat_hash, role='patient')

                db.session.add_all([user_admin, user_doc1, user_doc2, user_pat1, user_pat2])
                db.session.commit()

                # 4. Seed Admin
                admin = Admin(user_id=user_admin.id, name='Chief Admin Director', phone='+91 99999 88888')
                db.session.add(admin)

                # 5. Seed Doctors
                doc1 = Doctor(user_id=user_doc1.id, first_name='Robert', last_name='Smith', specialization_id=1, hospital_id=1, phone='+91 98765 43210', gender='Male', experience_years=15, consultation_fee=800.00, bio='Dr. Robert Smith is a renowned Cardiologist with over 15 years of experience in cardiac stress checkups.')
                doc2 = Doctor(user_id=user_doc2.id, first_name='Jane', last_name='Foster', specialization_id=2, hospital_id=2, phone='+91 98765 12345', gender='Female', experience_years=8, consultation_fee=600.00, bio='Dr. Jane Foster specializes in clinical and cosmetic dermatology.')
                db.session.add_all([doc1, doc2])
                db.session.commit()

                # 6. Seed Schedules
                days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                from datetime import time
                for day in days:
                    sched1 = Schedule(doctor_id=doc1.id, day_of_week=day, start_time=time(9, 0), end_time=time(13, 0), is_available=True)
                    sched2 = Schedule(doctor_id=doc2.id, day_of_week=day, start_time=time(14, 0), end_time=time(17, 0), is_available=True)
                    db.session.add_all([sched1, sched2])

                # 7. Seed Patients
                from datetime import date
                pat1 = Patient(user_id=user_pat1.id, first_name='Patrick', last_name='Jones', phone='+91 98888 77777', gender='Male', dob=date(1995, 8, 12), address='12, MGR Road, Chennai')
                pat2 = Patient(user_id=user_pat2.id, first_name='Sarah', last_name='Doe', phone='+91 97777 66666', gender='Female', dob=date(1998, 4, 25), address='Sector-15, Rohini, New Delhi')
                db.session.add_all([pat1, pat2])
                db.session.commit()

                # 8. Seed Appointments & Payments
                appt1 = Appointment(patient_id=pat1.id, doctor_id=doc1.id, appointment_date=date(2026, 5, 25), appointment_time=time(10, 30), status='Approved', reason='Routine cardiac checkup')
                appt2 = Appointment(patient_id=pat2.id, doctor_id=doc2.id, appointment_date=date(2026, 5, 26), appointment_time=time(15, 0), status='Pending', reason='Skin rash consultation')
                db.session.add_all([appt1, appt2])
                db.session.commit()

                pay1 = Payment(appointment_id=appt1.id, amount=800.00, transaction_id='TXN_PAY_SIM_987654321', status='Success', payment_method='Simulated Card')
                db.session.add(pay1)
                db.session.commit()

                print("Default seed data inserted successfully!")

        except Exception as e:
            print(f"Warning during Database Initialization: {str(e)}")

    return app

app = create_app()

if __name__ == '__main__':
    # Start the Flask development server on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
