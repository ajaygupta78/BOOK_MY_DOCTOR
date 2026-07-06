from flask import Blueprint, request, jsonify
from backend.models.database import db, Doctor, Specialization, Schedule
from backend.middleware.auth_middleware import token_required
from datetime import datetime

doctors_bp = Blueprint('doctors', __name__)

@doctors_bp.route('/all', methods=['GET'])
def get_all_doctors():
    """
    Fetch all doctors.
    """
    try:
        doctors = Doctor.query.all()
        return jsonify([doctor.to_dict() for doctor in doctors]), 200
    except Exception as e:
        return jsonify({'message': f'Server error retrieving doctors: {str(e)}'}), 500


@doctors_bp.route('/specializations', methods=['GET'])
def get_specializations():
    """
    Fetch all unique specializations.
    """
    try:
        specializations = Specialization.query.all()
        return jsonify([spec.to_dict() for spec in specializations]), 200
    except Exception as e:
        return jsonify({'message': f'Server error retrieving specializations: {str(e)}'}), 500


@doctors_bp.route('/search', methods=['GET'])
def search_doctors():
    """
    Search doctors by specialization_id, hospital_id, and name.
    """
    spec_id = request.args.get('specialization_id')
    hosp_id = request.args.get('hospital_id')
    query_name = request.args.get('name')

    try:
        query = Doctor.query
        
        if spec_id:
            query = query.filter_by(specialization_id=int(spec_id))
        if hosp_id:
            query = query.filter_by(hospital_id=int(hosp_id))
        if query_name:
            search_str = f"%{query_name.strip()}%"
            query = query.filter(
                (Doctor.first_name.like(search_str)) | 
                (Doctor.last_name.like(search_str))
            )
            
        doctors = query.all()
        return jsonify([doctor.to_dict() for doctor in doctors]), 200
    except Exception as e:
        return jsonify({'message': f'Server error searching doctors: {str(e)}'}), 500


@doctors_bp.route('/<int:doctor_id>', methods=['GET'])
def get_doctor_by_id(doctor_id):
    """
    Get specific doctor profile details.
    """
    doctor = Doctor.query.filter_by(id=doctor_id).first()
    if not doctor:
        return jsonify({'message': 'Doctor profile not found.'}), 404
        
    return jsonify(doctor.to_dict()), 200


@doctors_bp.route('/<int:doctor_id>/schedules', methods=['GET'])
def get_doctor_schedules(doctor_id):
    """
    Retrieve active schedules/availability for a given doctor.
    """
    doctor = Doctor.query.filter_by(id=doctor_id).first()
    if not doctor:
        return jsonify({'message': 'Doctor not found.'}), 404
        
    try:
        schedules = Schedule.query.filter_by(doctor_id=doctor_id, is_available=True).all()
        return jsonify([sched.to_dict() for sched in schedules]), 200
    except Exception as e:
        return jsonify({'message': f'Server error retrieving schedules: {str(e)}'}), 500


@doctors_bp.route('/schedule', methods=['POST'])
@token_required(roles=['doctor'])
def add_schedule(current_user):
    """
    Allows logged-in doctor to append an availability slot.
    """
    doctor = current_user.doctor
    if not doctor:
        return jsonify({'message': 'Doctor profile associated with this account was not found.'}), 400
        
    data = request.get_json()
    if not data or 'day_of_week' not in data or 'start_time' not in data or 'end_time' not in data:
        return jsonify({'message': 'Missing schedule parameters.'}), 400

    day = data['day_of_week']
    start_str = data['start_time']
    end_str = data['end_time']
    is_avail = data.get('is_available', True)

    # Validate inputs
    valid_days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    if day not in valid_days:
        return jsonify({'message': 'Invalid day of week.'}), 400

    try:
        start_time = datetime.strptime(start_str, '%H:%M').time()
        end_time = datetime.strptime(end_str, '%H:%M').time()
        
        if start_time >= end_time:
            return jsonify({'message': 'Start time must be before End time.'}), 400

        # Check unique constraint (one schedule entry per doctor per day)
        existing = Schedule.query.filter_by(doctor_id=doctor.id, day_of_week=day).first()
        if existing:
            # Update existing instead of double inserting
            existing.start_time = start_time
            existing.end_time = end_time
            existing.is_available = is_avail
            db.session.commit()
            return jsonify({'message': 'Schedule updated successfully!', 'schedule': existing.to_dict()}), 200

        new_sched = Schedule(
            doctor_id=doctor.id,
            day_of_week=day,
            start_time=start_time,
            end_time=end_time,
            is_available=is_avail
        )
        db.session.add(new_sched)
        db.session.commit()

        return jsonify({'message': 'Schedule slot added successfully!', 'schedule': new_sched.to_dict()}), 201

    except ValueError:
        return jsonify({'message': 'Invalid time format. Please use HH:MM format.'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error: {str(e)}'}), 500


@doctors_bp.route('/schedule/<int:schedule_id>', methods=['DELETE'])
@token_required(roles=['doctor'])
def delete_schedule(current_user, schedule_id):
    """
    Remove an availability slot.
    """
    doctor = current_user.doctor
    if not doctor:
        return jsonify({'message': 'Unauthorized action.'}), 403

    sched = Schedule.query.filter_by(id=schedule_id, doctor_id=doctor.id).first()
    if not sched:
        return jsonify({'message': 'Schedule not found or does not belong to you.'}), 404

    try:
        db.session.delete(sched)
        db.session.commit()
        return jsonify({'message': 'Availability slot successfully deleted.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error: {str(e)}'}), 500
