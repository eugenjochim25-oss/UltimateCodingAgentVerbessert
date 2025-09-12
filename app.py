from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
import os
from dotenv import load_dotenv

# Import blueprints and utilities
from routes.main_routes import main_bp
from utils.logging_config import setup_logging

# Load environment variables
load_dotenv()

def create_app():
    """Application factory pattern for creating Flask app."""
    # Setup logging first
    setup_logging()
    
    # Create Flask app
    app = Flask(__name__)
    
    # Load and validate configuration
    from config import Config
    config = Config()
    config_status = config.validate()
    
    # Store config in app for services - Updated for Gemini  
    app.config['AI_CONFIG'] = config_status.get('ai_config', {
        'GEMINI_API_KEY': config.GEMINI_API_KEY,
        'GEMINI_MODEL': config.GEMINI_MODEL,
        'GEMINI_MAX_TOKENS': config.GEMINI_MAX_TOKENS,
        'GEMINI_TEMPERATURE': config.GEMINI_TEMPERATURE,
        'CODE_EXECUTION_TIMEOUT': config.CODE_EXECUTION_TIMEOUT,
        'MAX_OUTPUT_LENGTH': config.MAX_OUTPUT_LENGTH,
        'openai_available': config_status['openai_available'],
        'code_execution_enabled': config_status['code_execution_enabled'],
        'CACHING_ENABLED': True
    })
    
    # Configure CORS with restricted origins for production security
    CORS(app, resources={
        r"/api/*": {
            "origins": config.ALLOWED_ORIGINS,
            "methods": ["GET", "POST"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Configure app settings
    app.config['SECRET_KEY'] = config.SECRET_KEY
    app.config['MAX_CONTENT_LENGTH'] = config.MAX_CONTENT_LENGTH
    
    # Register blueprints
    app.register_blueprint(main_bp)
    
    # Register API blueprint with service initialization
    from routes.api_routes import create_api_blueprint
    api_bp = create_api_blueprint(app)
    app.register_blueprint(api_bp)
    
    # Register cache management routes
    from routes.cache_routes import cache_bp
    app.register_blueprint(cache_bp)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {"error": "Endpoint nicht gefunden"}, 404
    
    @app.errorhandler(413)
    def too_large(error):
        return {"error": "Anfrage zu groß"}, 413
    
    @app.errorhandler(500)
    def internal_error(error):
        return {"error": "Interner Serverfehler"}, 500
    
    return app

# Create app instance
app = create_app()

# Initialize SocketIO after app creation with proper security
from config import Config
config_obj = Config()
socketio = SocketIO(app, cors_allowed_origins=config_obj.ALLOWED_ORIGINS, 
                   logger=True, engineio_logger=False,
                   async_mode='threading')

# Register WebSocket events
from routes.websocket_routes import register_websocket_events
register_websocket_events(socketio, app)

if __name__ == "__main__":
    # Development server configuration
    # Always serve on 0.0.0.0:5000 for Replit compatibility
    # Remove debug=True for production security
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Use SocketIO for development server to support WebSockets
    socketio.run(app, host="0.0.0.0", port=5000, debug=debug_mode, 
                allow_unsafe_werkzeug=True, use_reloader=False, log_output=True)