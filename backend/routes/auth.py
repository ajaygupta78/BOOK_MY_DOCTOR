from flask import Blueprint, request, jsonify, current_app
import bcrypt
import jwt
from datetime import datetime, timedelta
from backend.models.database import db, User, Patient, Doctor, Admin
from backend.middleware.auth_middleware import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validation
    if not data:
        return jsonify({'message': 'Required registration details are missing.'}), 400
        
    required_fields = ['email', 'password', 'first_name', 'last_name', 'phone', 'gender', 'dob']
    for field in required_fields:
        if field not in data or not str(data[field]).strip():
            return jsonify({'message': f'Field "{field}" is required.'}), 400
            
    email = data['email'].strip().lower()
    password = data['password']
    first_name = data['first_name'].strip()
    last_name = data['last_name'].strip()
    phone = data['phone'].strip()
    gender = data['gender'].strip()
    dob_str = data['dob'].strip()
    address = data.get('address', '').strip()

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'An account with this email address already exists.'}), 400

    try:
        # Parse Date of Birth
        dob = datetime.strptime(dob_str, '%Y-%m-%d').date()
        
        # Hash Password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Create Core User
        new_user = User(
            email=email,
            password_hash=password_hash,
            role='patient'
        )
        db.session.add(new_user)
        db.session.flush()  # Generate user ID

        # Create Patient Record
        new_patient = Patient(
            user_id=new_user.id,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            gender=gender,
            dob=dob,
            address=address
        )
        db.session.add(new_patient)
        db.session.commit()

        return jsonify({
            'message': 'Registration successful! You can now log in.',
            'user': new_user.to_dict()
        }), 201

    except ValueError:
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD for Date of Birth.'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error during registration: {str(e)}'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'message': 'Please provide email and password.'}), 400
        
    email = data['email'].strip().lower()
    password = data['password']

    # Fetch User
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Invalid email address or password.'}), 401

    # Verify Password
    if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return jsonify({'message': 'Invalid email address or password.'}), 401

    # Fetch Name based on role
    name = "User"
    role_id = None
    if user.role == 'patient' and user.patient:
        name = f"{user.patient.first_name} {user.patient.last_name}"
        role_id = user.patient.id
    elif user.role == 'doctor' and user.doctor:
        name = f"Dr. {user.doctor.first_name} {user.doctor.last_name}"
        role_id = user.doctor.id
    elif user.role == 'admin' and user.admin:
        name = user.admin.name
        role_id = user.admin.id

    # Generate JWT access token
    expiration = datetime.utcnow() + timedelta(seconds=current_app.config['JWT_ACCESS_TOKEN_EXPIRES'])
    token = jwt.encode({
        'user_id': user.id,
        'email': user.email,
        'role': user.role,
        'exp': expiration
    }, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')

    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'role': user.role,
            'name': name,
            'role_id': role_id
        }
    }), 200


@auth_bp.route('/profile', methods=['GET'])
@token_required()
def get_profile(current_user):
    profile_data = {
        'id': current_user.id,
        'email': current_user.email,
        'role': current_user.role
    }

    if current_user.role == 'patient' and current_user.patient:
        patient = current_user.patient
        profile_data.update({
            'patient_id': patient.id,
            'first_name': patient.first_name,
            'last_name': patient.last_name,
            'phone': patient.phone,
            'gender': patient.gender,
            'dob': patient.dob.strftime('%Y-%m-%d'),
            'address': patient.address
        })
    elif current_user.role == 'doctor' and current_user.doctor:
        doctor = current_user.doctor
        profile_data.update({
            'doctor_id': doctor.id,
            'first_name': doctor.first_name,
            'last_name': doctor.last_name,
            'specialization_id': doctor.specialization_id,
            'specialization_name': doctor.specialization.name,
            'hospital_id': doctor.hospital_id,
            'hospital_name': doctor.hospital.name,
            'phone': doctor.phone,
            'gender': doctor.gender,
            'experience_years': doctor.experience_years,
            'consultation_fee': float(doctor.consultation_fee),
            'bio': doctor.bio
        })
    elif current_user.role == 'admin' and current_user.admin:
        admin = current_user.admin
        profile_data.update({
            'admin_id': admin.id,
            'name': admin.name,
            'phone': admin.phone
        })

    return jsonify(profile_data), 200


@auth_bp.route('/profile', methods=['PUT'])
@token_required()
def update_profile(current_user):
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No profile data provided.'}), 400

    try:
        # Handle password update if provided
        if 'password' in data and data['password'].strip():
            password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            current_user.password_hash = password_hash

        # Update specific fields based on role
        if current_user.role == 'patient' and current_user.patient:
            patient = current_user.patient
            patient.first_name = data.get('first_name', patient.first_name).strip()
            patient.last_name = data.get('last_name', patient.last_name).strip()
            patient.phone = data.get('phone', patient.phone).strip()
            patient.gender = data.get('gender', patient.gender).strip()
            if 'dob' in data:
                patient.dob = datetime.strptime(data['dob'], '%Y-%m-%d').date()
            patient.address = data.get('address', patient.address).strip()

        elif current_user.role == 'doctor' and current_user.doctor:
            doctor = current_user.doctor
            doctor.first_name = data.get('first_name', doctor.first_name).strip()
            doctor.last_name = data.get('last_name', doctor.last_name).strip()
            doctor.phone = data.get('phone', doctor.phone).strip()
            doctor.experience_years = int(data.get('experience_years', doctor.experience_years))
            doctor.consultation_fee = float(data.get('consultation_fee', doctor.consultation_fee))
            doctor.bio = data.get('bio', doctor.bio).strip()

        elif current_user.role == 'admin' and current_user.admin:
            admin = current_user.admin
            admin.name = data.get('name', admin.name).strip()
            admin.phone = data.get('phone', admin.phone).strip()

        db.session.commit()
        return jsonify({'message': 'Profile updated successfully!'}), 200

    except ValueError:
        return jsonify({'message': 'Invalid value formats. Please check input parameters.'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error during profile update: {str(e)}'}), 500


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """
    Simulated forgot password endpoint.
    For this project, we return a successful response with simulated token details.
    """
    data = request.get_json()
    if not data or 'email' not in data:
        return jsonify({'message': 'Email address is required.'}), 400
        
    email = data['email'].strip().lower()
    user = User.query.filter_by(email=email).first()
    
    if not user:
        # For security, do not explicitly state user not found, return general success message
        return jsonify({'message': 'If your email is registered, we have sent a simulated password reset link.'}), 200
        
    # Return simulated success
    return jsonify({
        'message': f'A simulated password reset instructions link has been sent to {email}.',
        'simulation': 'In a production environment, an email would be dispatched with a signed reset link.'
    }), 200
