from flask import Blueprint, request, jsonify
from backend.models.database import db, User, Patient, Doctor, Hospital, Appointment, Payment, Specialization, Feedback
from backend.middleware.auth_middleware import token_required
import bcrypt

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/analytics', methods=['GET'])
@token_required(roles=['admin'])
def get_analytics(current_user):
    """
    Computes global statistics for the admin dashboard panel.
    """
    try:
        total_patients = Patient.query.count()
        total_doctors = Doctor.query.count()
        total_hospitals = Hospital.query.count()
        
        # Appointment breakdown
        total_appts = Appointment.query.count()
        pending_appts = Appointment.query.filter_by(status='Pending').count()
        approved_appts = Appointment.query.filter_by(status='Approved').count()
        completed_appts = Appointment.query.filter_by(status='Completed').count()
        cancelled_appts = Appointment.query.filter_by(status='Cancelled').count()
        
        # Earnings calculation
        successful_payments = Payment.query.filter_by(status='Success').all()
        total_earnings = sum(float(p.amount) for p in successful_payments)
        
        # Ratings average
        all_feedbacks = Feedback.query.all()
        avg_rating = sum(f.rating for f in all_feedbacks) / len(all_feedbacks) if all_feedbacks else 5.0

        # Recent activities (last 5 appointments registered)
        recent_appointments = Appointment.query.order_by(Appointment.created_at.desc()).limit(5).all()
        recent_list = [appt.to_dict() for appt in recent_appointments]

        return jsonify({
            'patients_count': total_patients,
            'doctors_count': total_doctors,
            'hospitals_count': total_hospitals,
            'appointments': {
                'total': total_appts,
                'pending': pending_appts,
                'approved': approved_appts,
                'completed': completed_appts,
                'cancelled': cancelled_appts
            },
            'total_earnings': round(total_earnings, 2),
            'average_rating': round(avg_rating, 2),
            'recent_appointments': recent_list
        }), 200

    except Exception as e:
        return jsonify({'message': f'Server error computing analytics metrics: {str(e)}'}), 500


# =====================================================================
# DOCTOR CRUD
# =====================================================================

@admin_bp.route('/doctors', methods=['POST'])
@token_required(roles=['admin'])
def create_doctor(current_user):
    """
    Add a new doctor. Creates core User credentials + Doctor details profile.
    """
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided.'}), 400

    required_fields = ['email', 'password', 'first_name', 'last_name', 'specialization_id', 'hospital_id', 'phone', 'gender', 'experience_years', 'consultation_fee']
    for field in required_fields:
        if field not in data or str(data[field]).strip() == "":
            return jsonify({'message': f'Field "{field}" is required.'}), 400

    email = data['email'].strip().lower()
    password = data['password']
    
    # Check duplicate
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'An account with this email address already exists.'}), 400

    try:
        # Encrypt password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create core user
        new_user = User(
            email=email,
            password_hash=password_hash,
            role='doctor'
        )
        db.session.add(new_user)
        db.session.flush()

        # Create doctor profile
        new_doc = Doctor(
            user_id=new_user.id,
            first_name=data['first_name'].strip(),
            last_name=data['last_name'].strip(),
            specialization_id=int(data['specialization_id']),
            hospital_id=int(data['hospital_id']),
            phone=data['phone'].strip(),
            gender=data['gender'].strip(),
            experience_years=int(data['experience_years']),
            consultation_fee=float(data['consultation_fee']),
            bio=data.get('bio', '').strip()
        )
        db.session.add(new_doc)
        db.session.commit()

        return jsonify({'message': 'Doctor profile created successfully!', 'doctor': new_doc.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error adding doctor: {str(e)}'}), 500


@admin_bp.route('/doctors/<int:doctor_id>', methods=['PUT'])
@token_required(roles=['admin'])
def update_doctor(current_user, doctor_id):
    """
    Modify an existing doctor profile details.
    """
    doc = Doctor.query.filter_by(id=doctor_id).first()
    if not doc:
        return jsonify({'message': 'Doctor not found.'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided.'}), 400

    try:
        doc.first_name = data.get('first_name', doc.first_name).strip()
        doc.last_name = data.get('last_name', doc.last_name).strip()
        doc.phone = data.get('phone', doc.phone).strip()
        doc.gender = data.get('gender', doc.gender).strip()
        doc.experience_years = int(data.get('experience_years', doc.experience_years))
        doc.consultation_fee = float(data.get('consultation_fee', doc.consultation_fee))
        doc.specialization_id = int(data.get('specialization_id', doc.specialization_id))
        doc.hospital_id = int(data.get('hospital_id', doc.hospital_id))
        doc.bio = data.get('bio', doc.bio).strip()

        # Update email if requested and distinct
        if 'email' in data:
            new_email = data['email'].strip().lower()
            if new_email != doc.user.email:
                if User.query.filter_by(email=new_email).first():
                    return jsonify({'message': 'This email address is already in use by another user.'}), 400
                doc.user.email = new_email

        # Update password if requested
        if 'password' in data and data['password'].strip():
            password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            doc.user.password_hash = password_hash

        db.session.commit()
        return jsonify({'message': 'Doctor profile updated successfully!', 'doctor': doc.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error updating doctor: {str(e)}'}), 500


@admin_bp.route('/doctors/<int:doctor_id>', methods=['DELETE'])
@token_required(roles=['admin'])
def delete_doctor(current_user, doctor_id):
    """
    Remove a doctor and associated core User profile.
    """
    doc = Doctor.query.filter_by(id=doctor_id).first()
    if not doc:
        return jsonify({'message': 'Doctor not found.'}), 404

    try:
        user = doc.user
        db.session.delete(user)  # Cascades to Doctor and their schedules/appointments
        db.session.commit()
        return jsonify({'message': 'Doctor profile and account permanently deleted.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error: {str(e)}'}), 500


# =====================================================================
# HOSPITAL CRUD
# =====================================================================

@admin_bp.route('/hospitals', methods=['POST'])
@token_required(roles=['admin'])
def create_hospital(current_user):
    """
    Add a new hospital.
    """
    data = request.get_json()
    if not data or 'name' not in data or 'city' not in data or 'address' not in data or 'phone' not in data or 'email' not in data:
        return jsonify({'message': 'Missing required hospital fields.'}), 400

    try:
        new_hosp = Hospital(
            name=data['name'].strip(),
            city=data['city'].strip(),
            address=data['address'].strip(),
            phone=data['phone'].strip(),
            email=data['email'].strip(),
            rating=float(data.get('rating', 5.0))
        )
        db.session.add(new_hosp)
        db.session.commit()
        return jsonify({'message': 'Hospital added successfully!', 'hospital': new_hosp.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error adding hospital: {str(e)}'}), 500


@admin_bp.route('/hospitals/<int:hospital_id>', methods=['PUT'])
@token_required(roles=['admin'])
def update_hospital(current_user, hospital_id):
    """
    Modify hospital metadata.
    """
    hosp = Hospital.query.filter_by(id=hospital_id).first()
    if not hosp:
        return jsonify({'message': 'Hospital not found.'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'message': 'No parameters provided.'}), 400

    try:
        hosp.name = data.get('name', hosp.name).strip()
        hosp.city = data.get('city', hosp.city).strip()
        hosp.address = data.get('address', hosp.address).strip()
        hosp.phone = data.get('phone', hosp.phone).strip()
        hosp.email = data.get('email', hosp.email).strip()
        if 'rating' in data:
            hosp.rating = float(data['rating'])

        db.session.commit()
        return jsonify({'message': 'Hospital updated successfully!', 'hospital': hosp.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error: {str(e)}'}), 500


@admin_bp.route('/hospitals/<int:hospital_id>', methods=['DELETE'])
@token_required(roles=['admin'])
def delete_hospital(current_user, hospital_id):
    """
    Delete hospital (which cascades to doctors and appointments).
    """
    hosp = Hospital.query.filter_by(id=hospital_id).first()
    if not hosp:
        return jsonify({'message': 'Hospital not found.'}), 404

    try:
        db.session.delete(hosp)
        db.session.commit()
        return jsonify({'message': 'Hospital deleted successfully.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error: {str(e)}'}), 500


# =====================================================================
# PATIENT MANAGEMENT & REVIEWS
# =====================================================================

@admin_bp.route('/patients', methods=['GET'])
@token_required(roles=['admin'])
def get_all_patients(current_user):
    """
    Fetch all registered patients.
    """
    try:
        patients = Patient.query.all()
        return jsonify([pat.to_dict() for pat in patients]), 200
    except Exception as e:
        return jsonify({'message': f'Server error: {str(e)}'}), 500


@admin_bp.route('/patients/<int:patient_id>', methods=['DELETE'])
@token_required(roles=['admin'])
def delete_patient(current_user, patient_id):
    """
    Permanently delete patient and associated core account.
    """
    patient = Patient.query.filter_by(id=patient_id).first()
    if not patient:
        return jsonify({'message': 'Patient not found.'}), 404

    try:
        user = patient.user
        db.session.delete(user)  # Cascades deletion to Patient profile + appointments
        db.session.commit()
        return jsonify({'message': 'Patient account permanently deleted.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error: {str(e)}'}), 500


# =====================================================================
# GLOBAL MONITORING LEDGERS
# =====================================================================

@admin_bp.route('/appointments', methods=['GET'])
@token_required(roles=['admin'])
def get_global_appointments(current_user):
    """
    Retrieve all appointments in system database for global monitoring.
    """
    try:
        appts = Appointment.query.order_by(Appointment.appointment_date.desc()).all()
        return jsonify([appt.to_dict() for appt in appts]), 200
    except Exception as e:
        return jsonify({'message': f'Server error: {str(e)}'}), 500


@admin_bp.route('/payments', methods=['GET'])
@token_required(roles=['admin'])
def get_global_payments(current_user):
    """
    Retrieve financial ledger record transactions.
    """
    try:
        payments = Payment.query.order_by(Payment.payment_date.desc()).all()
        results = []
        for p in payments:
            p_dict = p.to_dict()
            p_dict.update({
                'patient_name': f"{p.appointment.patient.first_name} {p.appointment.patient.last_name}" if p.appointment and p.appointment.patient else 'Unknown',
                'doctor_name': f"Dr. {p.appointment.doctor.first_name} {p.appointment.doctor.last_name}" if p.appointment and p.appointment.doctor else 'Unknown',
                'appointment_date': p.appointment.appointment_date.strftime('%Y-%m-%d') if p.appointment else ''
            })
            results.append(p_dict)
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'message': f'Server error: {str(e)}'}), 500
