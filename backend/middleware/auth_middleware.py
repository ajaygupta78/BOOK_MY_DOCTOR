import jwt
from flask import request, jsonify, current_app
from functools import wraps
from backend.models.database import User

def token_required(roles=None):
    """
    Decorator to protect API routes with JWT.
    Optionally accepts a list of allowed roles (e.g. ['admin', 'doctor']).
    """
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            
            # Check for Authorization header
            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                try:
                    # Expecting format: "Bearer <token>"
                    token = auth_header.split(" ")[1]
                except IndexError:
                    return jsonify({'message': 'Invalid token format. Use Bearer <token>'}), 401

            if not token:
                return jsonify({'message': 'Authentication token is missing!'}), 401

            try:
                # Decode JWT using Flask's secret key config
                data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
                
                # Fetch user details
                current_user = User.query.filter_by(id=data['user_id']).first()
                if not current_user:
                    return jsonify({'message': 'User associated with this token does not exist!'}), 401
                
                # Check role constraints
                if roles and current_user.role not in roles:
                    return jsonify({'message': 'Unauthorized access: Insufficient privileges!'}), 403

            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Session expired. Please log in again.'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Invalid authentication token.'}), 401
            except Exception as e:
                return jsonify({'message': f'Authentication error: {str(e)}'}), 500

            # Attach current user to request context
            return f(current_user, *args, **kwargs)
            
        return decorated
    return decorator
