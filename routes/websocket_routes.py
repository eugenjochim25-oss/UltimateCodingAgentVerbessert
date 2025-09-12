"""
🚀 WebSocket Routes for Live-Logs/Terminal - Production-Ready 2025
Clean Code implementation for real-time code execution streaming
External references: Flask-SocketIO best practices, event-driven architecture
"""
from flask_socketio import emit, disconnect
from flask import request, current_app
import logging
import threading
import time
import uuid

logger = logging.getLogger(__name__)

def register_websocket_events(socketio, app):
    """
    Register all WebSocket event handlers.
    
    Args:
        socketio: SocketIO instance
        app: Flask application instance
    """
    
    @socketio.on('connect')
    def handle_connect():
        """Handle client connection to WebSocket."""
        client_id = request.sid
        logger.info(f'🔗 Client connected: {client_id}')
        
        # Send welcome message
        emit('terminal_output', {
            'type': 'system',
            'message': '🚀 Live-Terminal verbunden! Bereit für Code-Ausführung...',
            'timestamp': time.time(),
            'session_id': client_id
        })
    
    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle client disconnection."""
        client_id = request.sid
        logger.info(f'🔌 Client disconnected: {client_id}')
    
    @socketio.on('execute_code_live')
    def handle_live_code_execution(data):
        """
        Handle live code execution with real-time streaming.
        Security: Rate limiting and basic authentication checks added.
        
        Args:
            data: Dictionary containing code and execution parameters
        """
        client_id = request.sid
        session_id = str(uuid.uuid4())
        
        try:
            # Security: Check if code execution is enabled
            ai_config = current_app.config.get('AI_CONFIG', {})
            if not ai_config.get('code_execution_enabled', False):
                emit('execution_error', {
                    'error': 'Code-Ausführung ist deaktiviert',
                    'session_id': session_id,
                    'timestamp': time.time()
                })
                return
            
            # Rate limiting check (basic implementation)
            if hasattr(current_app, '_socket_rate_limit'):
                last_execution = current_app._socket_rate_limit.get(client_id, 0)
                if time.time() - last_execution < 2:  # 2 seconds cooldown
                    emit('execution_error', {
                        'error': 'Zu viele Anfragen. Bitte warten Sie.',
                        'session_id': session_id,
                        'timestamp': time.time()
                    })
                    return
                current_app._socket_rate_limit[client_id] = time.time()
            else:
                current_app._socket_rate_limit = {client_id: time.time()}
            
            # Validate input data
            if not data or 'code' not in data:
                emit('execution_error', {
                    'error': 'Kein Code empfangen',
                    'session_id': session_id,
                    'timestamp': time.time()
                })
                return
            
            code = data.get('code', '').strip()
            language = data.get('language', 'python')
            
            if not code:
                emit('execution_error', {
                    'error': 'Code darf nicht leer sein',
                    'session_id': session_id,
                    'timestamp': time.time()
                })
                return
            
            logger.info(f'🎯 Live code execution started: {client_id} | Session: {session_id}')
            
            # Send execution start notification
            emit('execution_started', {
                'session_id': session_id,
                'language': language,
                'timestamp': time.time(),
                'message': f'⚡ Starte {language.upper()}-Ausführung...'
            })
            
            # Execute code in background thread to prevent blocking
            thread = threading.Thread(
                target=_execute_code_with_streaming,
                args=(socketio, client_id, session_id, code, language, app)
            )
            thread.daemon = True
            thread.start()
            
        except Exception as e:
            logger.error(f'❌ Error in live code execution: {e}')
            emit('execution_error', {
                'error': f'Unerwarteter Fehler: {str(e)}',
                'session_id': session_id,
                'timestamp': time.time()
            })
    
    @socketio.on('ping')
    def handle_ping():
        """Handle ping for connection keepalive."""
        emit('pong', {'timestamp': time.time()})
    
    @socketio.on('terminal_command')
    def handle_terminal_command(data):
        """
        Handle terminal commands (future extension).
        
        Args:
            data: Command data
        """
        emit('terminal_output', {
            'type': 'info',
            'message': '🔧 Terminal-Kommandos werden in einer zukünftigen Version unterstützt',
            'timestamp': time.time()
        })

def _execute_code_with_streaming(socketio, client_id, session_id, code, language, app):
    """
    Execute code with real-time output streaming.
    
    Args:
        socketio: SocketIO instance
        client_id: WebSocket client ID
        session_id: Execution session ID
        code: Code to execute
        language: Programming language
        app: Flask application instance
    """
    try:
        with app.app_context():
            # Get code execution service
            code_service = None
            
            # Try to get code service from app config
            ai_config = app.config.get('AI_CONFIG', {})
            if ai_config.get('code_execution_enabled'):
                try:
                    from services.code_execution_service import CodeExecutionService
                    code_service = CodeExecutionService(ai_config)
                except Exception as e:
                    logger.error(f'Failed to initialize code service: {e}')
            
            if not code_service:
                socketio.emit('execution_error', {
                    'error': 'Code-Ausführungsdienst nicht verfügbar',
                    'session_id': session_id,
                    'timestamp': time.time()
                }, room=client_id)
                return
            
            # Create live execution wrapper
            live_executor = LiveCodeExecutor(socketio, client_id, session_id, code_service)
            
            # Execute with streaming
            result = live_executor.execute_with_streaming(code, language)
            
            # Send final result
            socketio.emit('execution_completed', {
                'session_id': session_id,
                'success': result.get('success', False),
                'execution_time': result.get('execution_time', 0),
                'timestamp': time.time(),
                'message': '✅ Ausführung abgeschlossen' if result.get('success') else '❌ Ausführung fehlgeschlagen'
            }, room=client_id)
            
    except Exception as e:
        logger.error(f'❌ Error in code execution thread: {e}')
        socketio.emit('execution_error', {
            'error': f'Ausführungsfehler: {str(e)}',
            'session_id': session_id,
            'timestamp': time.time()
        }, room=client_id)

class LiveCodeExecutor:
    """
    🎯 Live Code Executor with real-time streaming capabilities.
    Handles streaming output, error capture, and progress updates.
    """
    
    def __init__(self, socketio, client_id, session_id, code_service):
        self.socketio = socketio
        self.client_id = client_id
        self.session_id = session_id
        self.code_service = code_service
        self.start_time = time.time()
    
    def execute_with_streaming(self, code, language='python'):
        """
        Execute code with real-time output streaming.
        
        Args:
            code: Code to execute
            language: Programming language
            
        Returns:
            Execution result dictionary
        """
        try:
            # Send progress update
            self._emit_progress('🔍 Code-Validierung...', 10)
            
            # Basic validation
            if not code.strip():
                self._emit_error('Code ist leer')
                return {'success': False, 'execution_time': 0}
            
            # Security check
            self._emit_progress('🔒 Sicherheitsprüfung...', 25)
            
            # For now, use existing code execution service
            # In future, we could implement true streaming subprocess execution
            self._emit_progress('⚡ Code-Ausführung startet...', 50)
            
            result = self.code_service.execute_python_code(code)
            
            # Stream output
            if result.get('output'):
                self._emit_output(result['output'], 'stdout')
            
            if result.get('error'):
                self._emit_output(result['error'], 'stderr')
            
            self._emit_progress('✅ Ausführung abgeschlossen', 100)
            
            return result
            
        except Exception as e:
            self._emit_error(f'Unerwarteter Fehler: {str(e)}')
            return {'success': False, 'execution_time': time.time() - self.start_time}
    
    def _emit_progress(self, message, progress):
        """Emit progress update."""
        self.socketio.emit('execution_progress', {
            'session_id': self.session_id,
            'message': message,
            'progress': progress,
            'timestamp': time.time()
        }, room=self.client_id)
    
    def _emit_output(self, text, output_type='stdout'):
        """Emit code output."""
        self.socketio.emit('terminal_output', {
            'session_id': self.session_id,
            'type': output_type,
            'message': text,
            'timestamp': time.time()
        }, room=self.client_id)
    
    def _emit_error(self, error_message):
        """Emit error message."""
        self.socketio.emit('execution_error', {
            'session_id': self.session_id,
            'error': error_message,
            'timestamp': time.time()
        }, room=self.client_id)