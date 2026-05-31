from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import get_config
from app.models import db
from app.routes import auth_bp, tasks_bp

def create_app(config_class=None):
    """Create and configure Flask application"""
    if config_class is None:
        config_class = get_config()
    
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)
    jwt = JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(tasks_bp)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Health check route
    @app.route('/health', methods=['GET'])
    def health():
        return {'status': 'ok'}, 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'Internal server error'}, 500
    
    return app
