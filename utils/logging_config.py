import logging
import os
from datetime import datetime

def setup_logging():
    """Configure logging for the application."""
    
    # Create logs directory if it doesn't exist
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    # Configure logging format
    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # Configure root logger
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        handlers=[
            logging.FileHandler(
                os.path.join(log_dir, f'ai_agent_{datetime.now().strftime("%Y%m%d")}.log')
            ),
            logging.StreamHandler()  # Console output
        ]
    )
    
    # Set specific log levels for different modules
    logging.getLogger('werkzeug').setLevel(logging.WARNING)  # Reduce Flask request logs
    logging.getLogger('openai').setLevel(logging.WARNING)   # Reduce OpenAI API logs
    
    # Create logger for our application
    logger = logging.getLogger('ai_agent')
    logger.info("Logging configured successfully")