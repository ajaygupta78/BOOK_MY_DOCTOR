from flask import Blueprint, request, jsonify
from backend.models.database import db, Appointment, Payment
from backend.middleware.auth_middleware import token_required
import random
import string
from datetime import datetime

payments_bp = Blueprint('payments', __name__)

def generate_transaction_id():
    """
    Simulate generating a secure transaction ID.
    Format: TXN_PAY_SIM_<12 alphanumeric characters>
    """
    characters = string.ascii_uppercase + string.digits
    rand_part = ''.join(random.choice(characters) for _ in range(12))
    return f"TXN_PAY_SIM_{rand_part}"


@payments_bp.route('/charge', methods=['POST'])
@token_required(roles=['patient'])
def charge_payment(current_user):
    """
    Process a simulated payment charge.
    Transitions payment status to 'Success' and updates appointment to 'Approved'.
    """
    patient = current_user.patient
    if not patient:
        return jsonify({'message': 'Patient profile not found.'}), 400

    data = request.get_json()
    if not data or 'appointment_id' not in data or 'amount' not in data:
        return jsonify({'message': 'Missing transaction details.'}), 400

    appt_id = int(data['appointment_id'])
    amount = float(data['amount'])
    card_number = data.get('card_number', '').strip()
    payment_method = data.get('payment_method', 'Simulated Card').strip()

    # Validate appointment belongs to this patient
    appt = Appointment.query.filter_by(id=appt_id, patient_id=patient.id).first()
    if not appt:
        return jsonify({'message': 'Appointment record not found or does not belong to you.'}), 404

    # Card simple validation simulator if card method is selected
    if payment_method == 'Simulated Card' and card_number:
        # Strip spaces and verify length (simulate check)
        clean_card = card_number.replace(" ", "")
        if not clean_card.isdigit() or len(clean_card) < 16:
            return jsonify({'message': 'Invalid card details. Please enter a valid 16-digit card number.'}), 400

    try:
        # Check if payment already exists for this appointment
        existing_payment = Payment.query.filter_by(appointment_id=appt_id).first()
        if existing_payment and existing_payment.status == 'Success':
            return jsonify({'message': 'This appointment consultation fee has already been paid.', 'payment': existing_payment.to_dict()}), 400

        # Create transactional payment log
        txn_id = generate_transaction_id()
        
        if existing_payment:
            # Update failed or pending payment
            existing_payment.amount = amount
            existing_payment.transaction_id = txn_id
            existing_payment.status = 'Success'
            existing_payment.payment_method = payment_method
            existing_payment.payment_date = datetime.utcnow()
            payment_record = existing_payment
        else:
            payment_record = Payment(
                appointment_id=appt_id,
                amount=amount,
                transaction_id=txn_id,
                status='Success',
                payment_method=payment_method
            )
            db.session.add(payment_record)

        # Transition appointment status automatically to 'Approved' upon payment
        appt.status = 'Approved'
        db.session.commit()

        # Simulate digital invoice receipt response
        return jsonify({
            'message': 'Payment transaction approved! Invoice generated.',
            'receipt': {
                'transaction_id': txn_id,
                'amount': amount,
                'status': 'Success',
                'payment_method': payment_method,
                'payment_date': payment_record.payment_date.isoformat(),
                'appointment': appt.to_dict(),
                'patient_email': current_user.email
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Server error processing transaction: {str(e)}'}), 500


@payments_bp.route('/receipt/<int:appointment_id>', methods=['GET'])
@token_required()
def get_receipt(current_user, appointment_id):
    """
    Retrieve payment receipts/invoices.
    Allows patients to view their own, or doctors/admins to review credentials.
    """
    appt = Appointment.query.filter_by(id=appointment_id).first()
    if not appt:
        return jsonify({'message': 'Appointment record not found.'}), 404

    # Enforce access permissions
    if current_user.role == 'patient' and appt.patient_id != current_user.patient.id:
        return jsonify({'message': 'Access denied.'}), 403
    elif current_user.role == 'doctor' and appt.doctor_id != current_user.doctor.id:
        return jsonify({'message': 'Access denied.'}), 403

    pay = Payment.query.filter_by(appointment_id=appointment_id).first()
    if not pay:
        return jsonify({'message': 'No payment transaction record found for this appointment.'}), 404

    return jsonify({
        'payment': pay.to_dict(),
        'appointment': appt.to_dict(),
        'patient_details': appt.patient.to_dict(),
        'doctor_details': appt.doctor.to_dict()
    }), 200
