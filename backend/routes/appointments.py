from flask import Blueprint, request, jsonify
from backend.models.database import db, Appointment, Patient, Doctor, Feedback, Payment
from backend.middleware.auth_middleware import token_required
from datetime import datetime

appointments_bp = Blueprint('appointments', __name__)

@appointments_bp.route('/book', methods=['POST'])
@token_required(roles=['patient'])
def book_appointment(current_user):
    """
    Allows patient to register an appointment.
    """
    patient = current_user.patient
    if not patient:
        return jsonify({'message': 'Patient details profile not found.'}), 400

    data = request.get_json()
    if not data or 'doctor_id' not in data or 'appointment_date' not in data or 'appointment_time' not in data:
        return jsonify({'message': 'Missing booking details.'}), 400

    doctor_id = int(data['doctor_id'])
    date_str = data['appointment_date']
    time_str = data['appointment_time']
    reason = data.get('reason', '')

    # Verify doctor exists
    doctor = Doctor.query.filter_by(id=doctor_id).first()
    if not doctor:
        return jsonify({'message': 'Doctor not found.'}), 404

    try:
        appt_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        appt_time = datetime.strptime(time_str, '%H:%M').time()

        # Simple validation: Check if slot is already booked for this doctor
        existing = Appointment.query.filter_by(
            doctor_id=doctor_id, 
            appointment_date=appt_date, 
            appointment_time=appt_time
        ).filter(Appointment.status.notin_(['Cancelled', 'Rejected'])).first()

        if existing:
            return jsonify({'message': 'This doctor slot is already booked. Please choose a different time slot.'}), 400

        # Create Pending appointment
        new_appt = Appointment(
            patient_id=patient.id,
            doctor_id=doctor_id,
            appointment_date=appt_date,
            appointment_time=appt_time,
            status='Pending',
            reason=reason
        )
        db.session.add(new_appt)
        db.session.commit()

        return jsonify({
            'message': 'Appointment request submitted successfully!',
            'appointment': new_appt.to_dict()
        }), 201

    except ValueError:
        return jsonify({'message': 'Invalid date or time formats. Use YYYY-MM-DD and HH:MM.'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error booking appointment: {str(e)}'}), 500


@appointments_bp.route('/patient', methods=['GET'])
@token_required(roles=['patient'])
def get_patient_appointments(current_user):
    """
    Retrieve booking timeline for logged-in patient.
    """
    patient = current_user.patient
    if not patient:
        return jsonify({'message': 'Patient profile not found.'}), 400

    try:
        appts = Appointment.query.filter_by(patient_id=patient.id).order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc()).all()
        return jsonify([appt.to_dict() for appt in appts]), 200
    except Exception as e:
        return jsonify({'message': f'Server error retrieving appointments: {str(e)}'}), 500


@appointments_bp.route('/doctor', methods=['GET'])
@token_required(roles=['doctor'])
def get_doctor_appointments(current_user):
    """
    Retrieve assigned appointments list for logged-in doctor.
    """
    doctor = current_user.doctor
    if not doctor:
        return jsonify({'message': 'Doctor profile not found.'}), 400

    try:
        appts = Appointment.query.filter_by(doctor_id=doctor.id).order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc()).all()
        return jsonify([appt.to_dict() for appt in appts]), 200
    except Exception as e:
        return jsonify({'message': f'Server error retrieving appointments: {str(e)}'}), 500


@appointments_bp.route('/<int:appointment_id>', methods=['GET'])
@token_required()
def get_appointment_by_id(current_user, appointment_id):
    """
    Fetch details for single appointment (verifying permissions).
    """
    appt = Appointment.query.filter_by(id=appointment_id).first()
    if not appt:
        return jsonify({'message': 'Appointment not found.'}), 404

    # Enforce role-based viewing permissions
    if current_user.role == 'patient' and appt.patient_id != current_user.patient.id:
        return jsonify({'message': 'Unauthorized access to appointment details.'}), 403
    elif current_user.role == 'doctor' and appt.doctor_id != current_user.doctor.id:
        return jsonify({'message': 'Unauthorized access to appointment details.'}), 403

    return jsonify(appt.to_dict()), 200


@appointments_bp.route('/<int:appointment_id>/status', methods=['PUT'])
@token_required(roles=['doctor', 'admin'])
def update_appointment_status(current_user, appointment_id):
    """
    Allows doctor or admin to approve, reject, complete, or cancel appointments.
    """
    appt = Appointment.query.filter_by(id=appointment_id).first()
    if not appt:
        return jsonify({'message': 'Appointment not found.'}), 404

    # Doctor scope validation: Make sure doctor is updating their own appointment
    if current_user.role == 'doctor' and appt.doctor_id != current_user.doctor.id:
        return jsonify({'message': 'Unauthorized. This appointment belongs to another doctor.'}), 403

    data = request.get_json()
    if not data or 'status' not in data:
        return jsonify({'message': 'Status parameter is required.'}), 400

    status = data['status'].strip()
    valid_statuses = ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled']
    if status not in valid_statuses:
        return jsonify({'message': 'Invalid status parameter.'}), 400

    try:
        appt.status = status
        db.session.commit()
        return jsonify({
            'message': f'Appointment status updated to {status} successfully!',
            'appointment': appt.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error updating status: {str(e)}'}), 500


@appointments_bp.route('/<int:appointment_id>/feedback', methods=['POST'])
@token_required(roles=['patient'])
def submit_feedback(current_user, appointment_id):
    """
    Enables patient to review and rate completed appointments.
    """
    patient = current_user.patient
    if not patient:
        return jsonify({'message': 'Patient profile not found.'}), 400

    appt = Appointment.query.filter_by(id=appointment_id, patient_id=patient.id).first()
    if not appt:
        return jsonify({'message': 'Appointment not found or does not belong to you.'}), 404

    # Require completion to submit rating
    if appt.status != 'Completed':
        return jsonify({'message': 'Feedback can only be submitted for completed consultations.'}), 400

    data = request.get_json()
    if not data or 'rating' not in data or not data['rating']:
        return jsonify({'message': 'Rating score is required.'}), 400

    try:
        rating = int(data['rating'])
        if rating < 1 or rating > 5:
            return jsonify({'message': 'Rating must be a score between 1 and 5.'}), 400

        comments = data.get('comments', '').strip()

        # Check if feedback already exists
        existing = Feedback.query.filter_by(appointment_id=appointment_id).first()
        if existing:
            existing.rating = rating
            existing.comments = comments
            db.session.commit()
            return jsonify({'message': 'Feedback successfully updated!', 'feedback': existing.to_dict()}), 200

        new_feedback = Feedback(
            appointment_id=appointment_id,
            patient_id=patient.id,
            rating=rating,
            comments=comments
        )
        db.session.add(new_feedback)
        db.session.commit()

        # Recalculate doctor rating on the fly
        doctor = Doctor.query.filter_by(id=appt.doctor_id).first()
        if doctor:
            # Simple hospital/doctor ranking simulation: increase rating by decimals or trigger recalculation
            # In production, average all feedback for doctors. Let's do that:
            all_doc_feedbacks = Feedback.query.join(Appointment).filter(Appointment.doctor_id == doctor.id).all()
            if all_doc_feedbacks:
                avg = sum(f.rating for f in all_doc_feedbacks) / len(all_doc_feedbacks)
                # also update affiliated hospital rating average
                hosp = doctor.hospital
                if hosp:
                    hosp.rating = round((float(hosp.rating) + avg) / 2.0, 2)
            db.session.commit()

        return jsonify({
            'message': 'Feedback submitted successfully! Thank you.',
            'feedback': new_feedback.to_dict()
        }), 201

    except ValueError:
        return jsonify({'message': 'Rating must be an integer between 1 and 5.'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error: {str(e)}'}), 500
