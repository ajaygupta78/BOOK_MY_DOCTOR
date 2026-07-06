from flask import Blueprint, request, jsonify
from backend.models.database import db, Hospital, Doctor

hospitals_bp = Blueprint('hospitals', __name__)

@hospitals_bp.route('', methods=['GET'])
def get_hospitals():
    """
    Search and fetch hospitals. Can filter by city.
    """
    city_query = request.args.get('city')
    
    try:
        query = Hospital.query
        if city_query:
            query = query.filter(Hospital.city.like(f"%{city_query.strip()}%"))
            
        hospitals = query.all()
        return jsonify([hospital.to_dict() for hospital in hospitals]), 200
    except Exception as e:
        return jsonify({'message': f'Server error retrieving hospitals: {str(e)}'}), 500


@hospitals_bp.route('/cities', methods=['GET'])
def get_cities():
    """
    Fetch all unique cities where hospitals are registered.
    """
    try:
        # Fetch distinct cities ordered alphabetically
        cities_records = db.session.query(Hospital.city).distinct().order_by(Hospital.city).all()
        cities = [city[0] for city in cities_records if city[0]]
        return jsonify(cities), 200
    except Exception as e:
        return jsonify({'message': f'Server error retrieving cities: {str(e)}'}), 500


@hospitals_bp.route('/<int:hospital_id>', methods=['GET'])
def get_hospital_by_id(hospital_id):
    """
    Get detailed information for a single hospital.
    """
    hospital = Hospital.query.filter_by(id=hospital_id).first()
    if not hospital:
        return jsonify({'message': 'Hospital not found.'}), 404
        
    return jsonify(hospital.to_dict()), 200


@hospitals_bp.route('/<int:hospital_id>/doctors', methods=['GET'])
def get_hospital_doctors(hospital_id):
    """
    List all doctors registered under a specific hospital.
    """
    hospital = Hospital.query.filter_by(id=hospital_id).first()
    if not hospital:
        return jsonify({'message': 'Hospital not found.'}), 404
        
    try:
        doctors = Doctor.query.filter_by(hospital_id=hospital_id).all()
        return jsonify([doctor.to_dict() for doctor in doctors]), 200
    except Exception as e:
        return jsonify({'message': f'Server error retrieving hospital doctors: {str(e)}'}), 500
