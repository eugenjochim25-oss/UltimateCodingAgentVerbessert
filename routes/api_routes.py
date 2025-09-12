from flask import Blueprint, request, jsonify
import logging
from utils.validators import validate_chat_input, validate_code_input

logger = logging.getLogger(__name__)

def create_api_blueprint(app):
    """
    Create API blueprint with dependency injection.
    
    Args:
        app: Flask application instance
        
    Returns:
        Blueprint instance
    """
    # Create blueprint
    api_bp = Blueprint('api', __name__, url_prefix='/api')
    
    # Get configuration
    config = app.config.get('AI_CONFIG')
    
    # Initialize services with configuration
    ai_service = None
    code_service = None
    learning_service = None
    
    if config and config.get('openai_available'):
        try:
            from services.ai_service import AIService
            ai_service = AIService(config)
        except Exception as e:
            logger.error(f"Failed to initialize AI service: {e}")
    
    if config and config.get('code_execution_enabled'):
        try:
            from services.code_execution_service import CodeExecutionService
            code_service = CodeExecutionService(config)
        except Exception as e:
            logger.error(f"Failed to initialize code execution service: {e}")
    
    # Always try to initialize learning service
    try:
        from services.learning_service import LearningService
        learning_service = LearningService()
    except Exception as e:
        logger.error(f"Failed to initialize learning service: {e}")

    @api_bp.route("/chat", methods=["POST"])
    def chat():
        """Handle chat requests with AI integration."""
        try:
            # Check if AI service is available
            if not ai_service:
                return jsonify({
                    "error": "AI-Service ist nicht verfügbar. Bitte prüfen Sie die Konfiguration."
                }), 503
            
            # Validate content type
            if not request.is_json:
                return jsonify({
                    "error": "Content-Type muss 'application/json' sein"
                }), 400
            
            # Validate input
            data = request.get_json(silent=True)
            if not data:
                return jsonify({"error": "Keine gültigen JSON-Daten empfangen"}), 400
            
            validation_result = validate_chat_input(data)
            if not validation_result["valid"]:
                return jsonify({"error": validation_result["error"]}), 400
            
            user_message = data.get("message", "")
            conversation_history = data.get("history", [])
            
            # Generate AI response
            response = ai_service.generate_response(user_message, conversation_history)
            
            # Learn from chat interaction (default rating = 3)
            if learning_service:
                try:
                    learning_service.learn_from_chat(user_message, response, 3)
                except Exception as e:
                    logger.warning(f"Failed to record chat learning: {e}")
            
            return jsonify({
                "response": response,
                "timestamp": validation_result["timestamp"]
            })
            
        except Exception as e:
            logger.error(f"Error in chat endpoint: {e}")
            return jsonify({"error": "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."}), 500

    @api_bp.route("/execute", methods=["POST"])
    def execute_code():
        """Handle code execution requests."""
        try:
            # Check if code execution is enabled
            if not code_service:
                return jsonify({
                    "success": False,
                    "output": "",
                    "error": "Code-Ausführung ist nicht verfügbar oder deaktiviert.",
                    "execution_time": 0
                }), 503
            
            # Validate content type
            if not request.is_json:
                return jsonify({
                    "success": False,
                    "output": "",
                    "error": "Content-Type muss 'application/json' sein",
                    "execution_time": 0
                }), 400
            
            # Validate input
            data = request.get_json(silent=True)
            if not data:
                return jsonify({
                    "success": False,
                    "output": "",
                    "error": "Keine gültigen JSON-Daten empfangen",
                    "execution_time": 0
                }), 400
            
            validation_result = validate_code_input(data)
            if not validation_result["valid"]:
                return jsonify({
                    "success": False,
                    "output": "",
                    "error": validation_result["error"],
                    "execution_time": 0
                }), 400
            
            code = data.get("code", "")
            use_cache = data.get("use_cache", True)
            cache_ttl_hours = data.get("cache_ttl_hours")
            
            # Execute code with caching support
            result = code_service.execute_python_code(
                code=code,
                use_cache=use_cache,
                cache_ttl_hours=cache_ttl_hours
            )
            
            # Learn from code execution (skip cached results)
            if learning_service and not result.get("from_cache", False):
                try:
                    language = data.get("language", "python")  # Default to python
                    success = result.get("success", False)
                    execution_time = result.get("execution_time", 0.0)
                    error_msg = result.get("error", "") if not success else ""
                    
                    learning_service.analyze_code_execution(
                        code, language, success, execution_time, error_msg
                    )
                except Exception as e:
                    logger.warning(f"Failed to record code execution learning: {e}")
            
            return jsonify(result)
            
        except Exception as e:
            logger.error(f"Error in execute endpoint: {e}")
            return jsonify({
                "success": False,
                "output": "",
                "error": "Ein Fehler ist bei der Code-Ausführung aufgetreten.",
                "execution_time": 0
            }), 500

    @api_bp.route("/analyze", methods=["POST"])
    def analyze_code():
        """Handle code analysis requests."""
        try:
            # Check if AI service is available
            if not ai_service:
                return jsonify({
                    "error": "AI-Service ist nicht verfügbar. Bitte prüfen Sie die Konfiguration."
                }), 503
            
            # Validate content type
            if not request.is_json:
                return jsonify({
                    "error": "Content-Type muss 'application/json' sein"
                }), 400
            
            # Validate input
            data = request.get_json(silent=True)
            if not data:
                return jsonify({"error": "Keine gültigen JSON-Daten empfangen"}), 400
            
            validation_result = validate_code_input(data)
            if not validation_result["valid"]:
                return jsonify({"error": validation_result["error"]}), 400
            
            code = data.get("code", "")
            
            # Analyze code
            analysis = ai_service.analyze_code(code)
            
            return jsonify({
                "analysis": analysis,
                "timestamp": validation_result["timestamp"]
            })
            
        except Exception as e:
            logger.error(f"Error in analyze endpoint: {e}")
            return jsonify({"error": "Ein Fehler ist bei der Code-Analyse aufgetreten."}), 500
    
    @api_bp.route("/learning/stats", methods=["GET"])
    def get_learning_stats():
        """Get learning statistics and progress."""
        try:
            if not learning_service:
                return jsonify({"error": "Lerndienst ist nicht verfügbar."}), 503
            
            stats = learning_service.get_learning_stats()
            return jsonify(stats)
        
        except Exception as e:
            logger.error(f"Error in learning stats endpoint: {e}")
            return jsonify({"error": "Fehler beim Abrufen der Lernstatistiken."}), 500
    
    @api_bp.route("/learning/suggestions", methods=["POST"])
    def get_code_suggestions():
        """Get code suggestions based on learning."""
        try:
            if not learning_service:
                return jsonify({"suggestions": [], "error": "Lerndienst ist nicht verfügbar."})
            
            if not request.is_json:
                return jsonify({"suggestions": [], "error": "Content-Type muss 'application/json' sein"})
            
            data = request.get_json(silent=True)
            if not data:
                return jsonify({"suggestions": [], "error": "Keine gültigen JSON-Daten empfangen"})
            
            code = data.get("code", "")
            language = data.get("language", "python")
            
            suggestions = learning_service.get_code_suggestions(code, language)
            
            return jsonify({
                "suggestions": suggestions,
                "language": language
            })
        
        except Exception as e:
            logger.error(f"Error in suggestions endpoint: {e}")
            return jsonify({"suggestions": [], "error": "Fehler beim Generieren von Vorschlägen."})
    
    @api_bp.route("/learning/feedback", methods=["POST"])
    def submit_feedback():
        """Submit feedback for chat messages to improve learning."""
        try:
            if not learning_service:
                return jsonify({"success": False, "error": "Lerndienst ist nicht verfügbar."})
            
            if not request.is_json:
                return jsonify({"success": False, "error": "Content-Type muss 'application/json' sein"})
            
            data = request.get_json(silent=True)
            if not data:
                return jsonify({"success": False, "error": "Keine gültigen JSON-Daten empfangen"})
            
            user_question = data.get("user_question", "")
            ai_response = data.get("ai_response", "")
            rating = data.get("rating", 3)
            
            # Validate rating
            if not isinstance(rating, int) or rating < 1 or rating > 5:
                return jsonify({"success": False, "error": "Bewertung muss zwischen 1 und 5 liegen."})
            
            learning_service.learn_from_chat(user_question, ai_response, rating)
            
            return jsonify({
                "success": True,
                "message": "Feedback erfolgreich gespeichert."
            })
        
        except Exception as e:
            logger.error(f"Error in feedback endpoint: {e}")
            return jsonify({"success": False, "error": "Fehler beim Speichern des Feedbacks."})
    
    @api_bp.route("/learning/languages", methods=["GET"])
    def get_language_recommendations():
        """Get language usage recommendations."""
        try:
            if not learning_service:
                return jsonify({"recommendations": [], "error": "Lerndienst ist nicht verfügbar."})
            
            recommendations = learning_service.get_language_recommendations()
            
            return jsonify({
                "recommendations": recommendations
            })
        
        except Exception as e:
            logger.error(f"Error in language recommendations endpoint: {e}")
            return jsonify({"recommendations": [], "error": "Fehler beim Abrufen der Sprachempfehlungen."})
    
    @api_bp.route("/health", methods=["GET"])
    def health_check():
        """API health check endpoint."""
        health_status = {
            "status": "healthy",
            "services": {
                "ai_service": "available" if ai_service else "unavailable",
                "code_service": "available" if code_service else "unavailable",
                "learning_service": "available" if learning_service else "unavailable"
            }
        }
        
        # Determine overall status
        if not ai_service and not code_service:
            health_status["status"] = "degraded"
            return jsonify(health_status), 503
        
        return jsonify(health_status)
    
    return api_bp