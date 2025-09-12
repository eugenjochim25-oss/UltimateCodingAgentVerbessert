import os
from typing import Dict, Any

class Config:
    """Application configuration class."""
    
    def __init__(self):
        self.SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
        self.MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
        
        # AI Configuration - Updated for Gemini
        self.GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
        self.GEMINI_MODEL = os.environ.get('GEMINI_MODEL', 'gemini-2.5-flash')
        self.GEMINI_MAX_TOKENS = int(os.environ.get('GEMINI_MAX_TOKENS', '500'))
        self.GEMINI_TEMPERATURE = float(os.environ.get('GEMINI_TEMPERATURE', '0.7'))
        
        # Code Execution Configuration
        self.CODE_EXECUTION_TIMEOUT = int(os.environ.get('CODE_EXECUTION_TIMEOUT', '10'))
        self.MAX_OUTPUT_LENGTH = int(os.environ.get('MAX_OUTPUT_LENGTH', '10000'))
        self.CODE_EXECUTION_ENABLED = os.environ.get('CODE_EXECUTION_ENABLED', 'true').lower() == 'true'
        
        # Security Configuration
        self.ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:5000').split(',')
        self.FLASK_DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
        
        # Validation Configuration
        self.MAX_MESSAGE_LENGTH = int(os.environ.get('MAX_MESSAGE_LENGTH', '5000'))
        self.MAX_CODE_LENGTH = int(os.environ.get('MAX_CODE_LENGTH', '50000'))
    
    def validate(self) -> Dict[str, Any]:
        """
        Validate configuration and return status.
        
        Returns:
            Dict with validation status and any issues
        """
        issues = []
        
        if not self.GEMINI_API_KEY:
            issues.append("GEMINI_API_KEY is required for AI functionality")
        
        if self.GEMINI_MAX_TOKENS < 100 or self.GEMINI_MAX_TOKENS > 4000:
            issues.append("GEMINI_MAX_TOKENS should be between 100 and 4000")
        
        if self.GEMINI_TEMPERATURE < 0 or self.GEMINI_TEMPERATURE > 2:
            issues.append("GEMINI_TEMPERATURE should be between 0 and 2")
        
        if self.CODE_EXECUTION_TIMEOUT < 1 or self.CODE_EXECUTION_TIMEOUT > 60:
            issues.append("CODE_EXECUTION_TIMEOUT should be between 1 and 60 seconds")
        
        # AI Configuration
        self.AI_CONFIG = {
            'openai_available': bool(self.GEMINI_API_KEY),  # Keep legacy name for compatibility
            'code_execution_enabled': self.CODE_EXECUTION_ENABLED,
            'GEMINI_API_KEY': self.GEMINI_API_KEY,
            'GEMINI_MODEL': self.GEMINI_MODEL,
            'GEMINI_MAX_TOKENS': self.GEMINI_MAX_TOKENS,
            'GEMINI_TEMPERATURE': self.GEMINI_TEMPERATURE,
            'CODE_EXECUTION_TIMEOUT': self.CODE_EXECUTION_TIMEOUT,
            'MAX_OUTPUT_LENGTH': self.MAX_OUTPUT_LENGTH,
            'CACHING_ENABLED': True  # Enable caching by default
        }
        
        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "openai_available": bool(self.GEMINI_API_KEY),  # Keep legacy name for compatibility
            "code_execution_enabled": self.CODE_EXECUTION_ENABLED,
            "ai_config": self.AI_CONFIG
        }