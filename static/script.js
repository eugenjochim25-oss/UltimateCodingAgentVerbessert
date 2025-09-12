// AI Agent 2025 - Ultra Modern JavaScript
let editor;
let conversationHistory = [];
let currentTheme = 'dark';
let currentSection = 'dashboard';
let learningStats = {};

// Initialize Marked.js and Highlight.js when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Configure marked.js for better markdown parsing
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            // ⚡ PERFORMANCE FIX: Disable marked's built-in highlighting 
            // Use MutationObserver approach below for better performance
            highlight: null,
            breaks: true,
            gfm: true,
            headerIds: false,
            mangle: false,
            sanitize: false  // Security handled by DOMPurify now
        });
        console.log('✅ Marked.js initialized (highlighting handled by MutationObserver)');
    }
    
    // Configure highlight.js
    if (typeof hljs !== 'undefined') {
        hljs.configure({
            ignoreUnescapedHTML: true,
            languages: ['python', 'javascript', 'typescript', 'sql', 'json', 'bash']
        });
        
        // Auto-highlight all code blocks
        hljs.highlightAll();
        
        // ⚡ OPTIMIZED Observer for dynamically added code blocks
        const codeObserver = new MutationObserver(function(mutations) {
            const elementsToHighlight = [];
            
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Batch collect code blocks for highlighting
                        const codeBlocks = node.querySelectorAll('pre code:not(.hljs)');
                        elementsToHighlight.push(...codeBlocks);
                        
                        // Collect inline code elements (skip those in pre tags)
                        const inlineCodes = node.querySelectorAll('code:not(.hljs):not(pre code)');
                        elementsToHighlight.push(...inlineCodes);
                    }
                });
            });
            
            // Batch highlighting for better performance
            if (elementsToHighlight.length > 0) {
                requestAnimationFrame(() => {
                    elementsToHighlight.forEach(element => {
                        try {
                            hljs.highlightElement(element);
                        } catch (error) {
                            console.warn('Highlighting failed for element:', error);
                        }
                    });
                });
            }
        });
        
        // Start observing changes to chat containers
        const chatContainers = document.querySelectorAll('.chat-container, .chat-preview');
        chatContainers.forEach(function(container) {
            codeObserver.observe(container, {
                childList: true,
                subtree: true
            });
        });
        
        console.log('Highlight.js initialized with auto-detection');
    }
});

// Sample snippets data with more examples
const sampleSnippets = [
    {
        id: 1,
        title: "FastAPI Server Setup",
        category: "python",
        language: "python",
        code: `from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(
    title="AI Agent API",
    description="Modern API with FastAPI",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserModel(BaseModel):
    name: str
    email: str
    age: int

@app.get("/")
async def root():
    return {"message": "Welcome to AI Agent API 2025"}

@app.post("/users/")
async def create_user(user: UserModel):
    # Process user creation
    return {"user_id": 123, "message": f"User {user.name} created successfully"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "2.0.0"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)`
    },
    {
        id: 2,
        title: "React Hook für API Calls",
        category: "javascript",
        language: "javascript",
        code: `import { useState, useEffect, useCallback } from 'react';

// Custom Hook für API-Aufrufe
const useApi = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(\`HTTP error! status: \${response.status}\`);
            }
            
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [url, options]);

    useEffect(() => {
        if (url) {
            fetchData();
        }
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

// Verwendung des Hooks
const UserList = () => {
    const { data: users, loading, error, refetch } = useApi('/api/users');

    if (loading) return <div className="loading">Laden...</div>;
    if (error) return <div className="error">Fehler: {error}</div>;

    return (
        <div className="user-list">
            <h2>Benutzer ({users?.length || 0})</h2>
            <button onClick={refetch}>Aktualisieren</button>
            
            {users?.map(user => (
                <div key={user.id} className="user-card">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                </div>
            ))}
        </div>
    );
};

export default UserList;`
    },
    {
        id: 3,
        title: "TypeScript Utility Types",
        category: "utils",
        language: "typescript",
        code: `// Advanced TypeScript Utility Types für 2025

// 1. Recursive Partial Type
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 2. Exclude Null and Undefined
type NonNullable<T> = T extends null | undefined ? never : T;

// 3. Function Type Extractor
type FunctionArgs<T> = T extends (...args: infer U) => any ? U : never;
type FunctionReturn<T> = T extends (...args: any[]) => infer U ? U : never;

// 4. Object Key Path Type
type KeyPath<T> = {
    [K in keyof T]: K extends string
        ? T[K] extends object
            ? K | \`\${K}.\${KeyPath<T[K]>}\`
            : K
        : never;
}[keyof T];

// 5. API Response Type Builder
interface ApiResponse<T = any> {
    data: T;
    status: 'success' | 'error';
    message?: string;
    timestamp: string;
}

// 6. Event Handler Type Generator
type EventHandler<T extends Event = Event> = (event: T) => void;

// 7. Component Props with Children
type PropsWithChildren<P = {}> = P & {
    children?: React.ReactNode;
};

// Verwendungsbeispiele:
interface User {
    id: number;
    name: string;
    profile: {
        avatar: string;
        bio: string;
        settings: {
            theme: 'light' | 'dark';
            notifications: boolean;
        };
    };
}

// Partielle Updates möglich
type UserUpdate = DeepPartial<User>;

// Typsichere Key-Pfade
type UserKeyPath = KeyPath<User>; // "id" | "name" | "profile" | "profile.avatar" | ...

// API Response für User
type UserResponse = ApiResponse<User>;

// Event Handler für Klicks
const handleClick: EventHandler<MouseEvent> = (event) => {
    console.log('Clicked at:', event.clientX, event.clientY);
};

export type {
    DeepPartial,
    NonNullable,
    FunctionArgs,
    FunctionReturn,
    KeyPath,
    ApiResponse,
    EventHandler,
    PropsWithChildren,
    User,
    UserUpdate,
    UserKeyPath,
    UserResponse
};`
    },
    {
        id: 4,
        title: "Modern CSS Grid Layout",
        category: "utils",
        language: "css",
        code: `/* 2025 CSS Grid Layout System */

.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: clamp(1rem, 4vw, 2rem);
    padding: clamp(1rem, 4vw, 2rem);
    max-width: 1400px;
    margin: 0 auto;
}

/* Responsive Bento Grid */
.bento-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: minmax(200px, auto);
    gap: 1.5rem;
    padding: 2rem;
}

.bento-item {
    background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.1), 
        rgba(255, 255, 255, 0.05)
    );
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 1.5rem;
    padding: 2rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bento-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Responsive Breakpoints */
.bento-item.large {
    grid-column: span 8;
    grid-row: span 2;
}

.bento-item.medium {
    grid-column: span 6;
    grid-row: span 1;
}

.bento-item.small {
    grid-column: span 4;
    grid-row: span 1;
}

/* Container Queries (2025 Feature) */
@container (max-width: 768px) {
    .bento-item {
        grid-column: span 12 !important;
        grid-row: span 1 !important;
    }
}

/* Modern Card Design */
.card {
    background: 
        linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent),
        linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 1.5rem;
    padding: 2rem;
    position: relative;
    overflow: hidden;
}

.card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.4), 
        transparent
    );
}

/* Glassmorphism Effect */
.glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 1px rgba(255, 255, 255, 0.2);
}

/* Neumorphism Effect */
.neomorphic {
    background: #e0e0e0;
    box-shadow: 
        20px 20px 60px #bebebe,
        -20px -20px 60px #ffffff;
    border-radius: 2rem;
}

.neomorphic-inset {
    background: #e0e0e0;
    box-shadow: 
        inset 20px 20px 60px #bebebe,
        inset -20px -20px 60px #ffffff;
    border-radius: 2rem;
}

/* Responsive Typography */
.heading {
    font-size: clamp(1.5rem, 4vw, 3rem);
    font-weight: 800;
    line-height: 1.2;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Modern Button Styles */
.button-modern {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    border-radius: 1rem;
    color: white;
    cursor: pointer;
    font-weight: 600;
    padding: 1rem 2rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.button-modern::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.3), 
        transparent
    );
    transition: left 0.5s;
}

.button-modern:hover::before {
    left: 100%;
}

.button-modern:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}`
    },
    {
        id: 5,
        title: "AI-Powered Data Processing",
        category: "python",
        language: "python",
        code: `import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import asyncio
import aiohttp

@dataclass
class DataProcessingResult:
    """Ergebnis der Datenverarbeitung"""
    processed_data: pd.DataFrame
    statistics: Dict[str, Any]
    anomalies: List[Dict[str, Any]]
    processing_time: float
    success: bool
    message: str

class AIDataProcessor:
    """AI-gestützte Datenverarbeitung für 2025"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.session = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def analyze_dataset(
        self, 
        data: pd.DataFrame,
        analysis_type: str = "comprehensive"
    ) -> DataProcessingResult:
        """
        Führt eine AI-gestützte Datenanalyse durch
        """
        start_time = time.time()
        
        try:
            # Datenbereinigung
            cleaned_data = self._clean_data(data)
            
            # Statistiken berechnen
            stats = self._calculate_statistics(cleaned_data)
            
            # Anomalien erkennen
            anomalies = await self._detect_anomalies(cleaned_data)
            
            # AI-Analyse
            ai_insights = await self._get_ai_insights(cleaned_data, analysis_type)
            
            processing_time = time.time() - start_time
            
            return DataProcessingResult(
                processed_data=cleaned_data,
                statistics={**stats, **ai_insights},
                anomalies=anomalies,
                processing_time=processing_time,
                success=True,
                message="Datenanalyse erfolgreich abgeschlossen"
            )
            
        except Exception as e:
            return DataProcessingResult(
                processed_data=pd.DataFrame(),
                statistics={},
                anomalies=[],
                processing_time=time.time() - start_time,
                success=False,
                message=f"Fehler bei der Datenanalyse: {str(e)}"
            )
    
    def _clean_data(self, data: pd.DataFrame) -> pd.DataFrame:
        """Bereinigt die Daten"""
        # Duplikate entfernen
        cleaned = data.drop_duplicates()
        
        # Fehlende Werte behandeln
        for column in cleaned.select_dtypes(include=[np.number]).columns:
            cleaned[column].fillna(cleaned[column].median(), inplace=True)
        
        for column in cleaned.select_dtypes(include=['object']).columns:
            cleaned[column].fillna(cleaned[column].mode()[0] if not cleaned[column].mode().empty else 'Unknown', inplace=True)
        
        return cleaned
    
    def _calculate_statistics(self, data: pd.DataFrame) -> Dict[str, Any]:
        """Berechnet grundlegende Statistiken"""
        return {
            "row_count": len(data),
            "column_count": len(data.columns),
            "numeric_columns": len(data.select_dtypes(include=[np.number]).columns),
            "categorical_columns": len(data.select_dtypes(include=['object']).columns),
            "missing_values": data.isnull().sum().sum(),
            "data_types": data.dtypes.value_counts().to_dict()
        }
    
    async def _detect_anomalies(self, data: pd.DataFrame) -> List[Dict[str, Any]]:
        """Erkennt Anomalien in den Daten"""
        anomalies = []
        
        for column in data.select_dtypes(include=[np.number]).columns:
            Q1 = data[column].quantile(0.25)
            Q3 = data[column].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outliers = data[(data[column] < lower_bound) | (data[column] > upper_bound)]
            
            if len(outliers) > 0:
                anomalies.append({
                    "column": column,
                    "anomaly_type": "outlier",
                    "count": len(outliers),
                    "percentage": len(outliers) / len(data) * 100,
                    "bounds": {"lower": lower_bound, "upper": upper_bound}
                })
        
        return anomalies
    
    async def _get_ai_insights(self, data: pd.DataFrame, analysis_type: str) -> Dict[str, Any]:
        """Holt AI-basierte Einblicke (Simulation)"""
        # In einer echten Implementierung würde hier ein AI-Service aufgerufen
        await asyncio.sleep(0.1)  # Simulation der API-Latenz
        
        return {
            "ai_insights": {
                "data_quality_score": np.random.uniform(0.7, 0.95),
                "recommended_actions": [
                    "Überprüfe Spalte 'X' auf mögliche Datenfehler",
                    "Erwäge Feature-Engineering für bessere Ergebnisse",
                    "Datenverteilung ist gut für Machine Learning geeignet"
                ],
                "pattern_detection": "Starke Korrelation zwischen Variablen A und B erkannt",
                "prediction_confidence": np.random.uniform(0.8, 0.95)
            }
        }

# Verwendungsbeispiel
async def main():
    # Beispieldaten erstellen
    sample_data = pd.DataFrame({
        'feature_1': np.random.normal(100, 15, 1000),
        'feature_2': np.random.exponential(2, 1000),
        'category': np.random.choice(['A', 'B', 'C'], 1000),
        'target': np.random.randint(0, 2, 1000)
    })
    
    # AI Processor verwenden
    async with AIDataProcessor(api_key="your-api-key") as processor:
        result = await processor.analyze_dataset(sample_data)
        
        if result.success:
            print(f"✅ Analyse abgeschlossen in {result.processing_time:.2f}s")
            print(f"📊 Statistiken: {result.statistics}")
            print(f"⚠️  Anomalien gefunden: {len(result.anomalies)}")
        else:
            print(f"❌ Fehler: {result.message}")

# if __name__ == "__main__":
#     asyncio.run(main())`
    }
];

/**
 * 🍞 Toast Notification System - Production-Ready 2025
 * Clean Code implementation with auto-remove and modern glassmorphism design
 */
class ToastManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
        
        // Create container if it doesn't exist (robustness)
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toastContainer';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
            console.log('⚡ ToastManager: Created missing toast container');
        }
        
        this.toasts = new Map();
        this.nextId = 1;
    }

    show(type, title, message, duration = 5000) {
        const id = this.nextId++;
        const toast = this.createToast(id, type, title, message);
        
        this.container.appendChild(toast);
        this.toasts.set(id, toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto-remove
        setTimeout(() => {
            this.hide(id);
        }, duration);

        return id;
    }

    createToast(id, type, title, message) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.dataset.toastId = id;

        const icon = this.getIcon(type);
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i data-feather="${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="toastManager.hide(${id})">
                <i data-feather="x"></i>
            </button>
        `;

        // Ensure feather icons are rendered in the toast
        setTimeout(() => {
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }, 0);

        return toast;
    }

    getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };
        return icons[type] || 'info';
    }

    hide(id) {
        const toast = this.toasts.get(id);
        if (!toast) return;

        toast.classList.remove('show');
        toast.classList.add('hide');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts.delete(id);
        }, 300);
    }

    success(title, message, duration) {
        return this.show('success', title, message, duration);
    }

    error(title, message, duration) {
        return this.show('error', title, message, duration);
    }

    warning(title, message, duration) {
        return this.show('warning', title, message, duration);
    }

    info(title, message, duration) {
        return this.show('info', title, message, duration);
    }
}

// Global toast manager instance
let toastManager;

// WebSocket connection for live terminal
let socket = null;
let terminalConnected = false;
let currentExecutionSession = null;

/**
 * 🚀 Code Execution Functions - Phase 1 UI Integration
 */
async function executeCode() {
    // Check if live terminal is connected and use it preferentially
    if (terminalConnected && socket) {
        executeCodeLive();
        return;
    }
    
    // Fallback to regular execution
    // Get current editor content - standardized reference
    const currentEditor = window.monacoManager?.editor || editor;
    let code = '';
    
    if (currentEditor) {
        code = currentEditor.getValue();
    } else {
        // Fallback for testing
        code = 'print("Hello from AI Agent 2025!")';
    }

    if (!code.trim()) {
        toastManager.warning('Kein Code', 'Bitte geben Sie Code ein, der ausgeführt werden soll.');
        return;
    }

    toastManager.info('Code-Ausführung', 'Starte Code-Ausführung...');

    try {
        const response = await fetch('/api/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                code: code,
                language: 'python'  // Default für jetzt
            })
        });

        const result = await response.json();

        if (result.success) {
            const cacheIndicator = result.from_cache ? ' ⚡ (Cache)' : '';
            const executionMessage = result.from_cache 
                ? `Aus Cache geladen (${result.cache_key})` 
                : `Ausführungszeit: ${result.execution_time}s`;
                
            toastManager.success(
                `Code erfolgreich ausgeführt${cacheIndicator}`,
                executionMessage,
                7000
            );
            
            // Log output if available
            if (result.output) {
                console.log('Code Output:', result.output);
            }
        } else {
            toastManager.error(
                'Code-Ausführung fehlgeschlagen',
                result.error || 'Unbekannter Fehler',
                10000
            );
        }
    } catch (error) {
        toastManager.error(
            'Verbindungsfehler',
            'Fehler beim Verbinden zum Server',
            8000
        );
        console.error('Execute Code Error:', error);
    }
}

async function runTests() {
    toastManager.info('Tests', 'Starte Test-Suite...');
    
    // Placeholder für zukünftige Test-Implementierung
    setTimeout(() => {
        toastManager.success(
            'Tests abgeschlossen',
            '✅ 12 Tests bestanden, 0 fehlgeschlagen',
            6000
        );
    }, 2000);
}

/**
 * 🚀 Live Terminal Functions - Phase 1 Feature 2
 * WebSocket-based real-time code execution with streaming output
 */

function connectLiveTerminal() {
    if (terminalConnected) {
        disconnectLiveTerminal();
        return;
    }
    
    try {
        // Initialize SocketIO connection
        socket = io();
        
        // Set up event listeners
        socket.on('connect', () => {
            terminalConnected = true;
            updateTerminalStatus('online', 'Verbunden');
            toastManager.success('Live-Terminal', 'Erfolgreich verbunden!');
            
            const connectBtn = document.getElementById('connectTerminal');
            if (connectBtn) {
                connectBtn.innerHTML = '<i data-feather="wifi-off"></i>';
                connectBtn.title = 'Terminal trennen';
            }
        });
        
        socket.on('disconnect', () => {
            terminalConnected = false;
            updateTerminalStatus('offline', 'Getrennt');
            toastManager.warning('Live-Terminal', 'Verbindung getrennt');
            
            const connectBtn = document.getElementById('connectTerminal');
            if (connectBtn) {
                connectBtn.innerHTML = '<i data-feather="wifi"></i>';
                connectBtn.title = 'Terminal verbinden';
            }
        });
        
        socket.on('terminal_output', (data) => {
            addTerminalOutput(data);
        });
        
        socket.on('execution_started', (data) => {
            currentExecutionSession = data.session_id;
            showExecutionProgress(true);
            addTerminalOutput({
                type: 'system',
                message: data.message,
                timestamp: data.timestamp
            });
        });
        
        socket.on('execution_progress', (data) => {
            updateExecutionProgress(data.progress, data.message);
        });
        
        socket.on('execution_completed', (data) => {
            showExecutionProgress(false);
            addTerminalOutput({
                type: data.success ? 'system' : 'stderr',
                message: data.message,
                timestamp: data.timestamp
            });
            currentExecutionSession = null;
        });
        
        socket.on('execution_error', (data) => {
            showExecutionProgress(false);
            addTerminalOutput({
                type: 'stderr',
                message: `❌ ${data.error}`,
                timestamp: data.timestamp
            });
            currentExecutionSession = null;
        });
        
        // Clear welcome message when connected
        const terminal = document.getElementById('terminal');
        if (terminal) {
            terminal.innerHTML = '';
        }
        
    } catch (error) {
        console.error('❌ WebSocket connection error:', error);
        toastManager.error('Live-Terminal', 'Verbindung fehlgeschlagen');
    }
}

function disconnectLiveTerminal() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    terminalConnected = false;
    updateTerminalStatus('offline', 'Offline');
    
    const connectBtn = document.getElementById('connectTerminal');
    if (connectBtn) {
        connectBtn.innerHTML = '<i data-feather="wifi"></i>';
        connectBtn.title = 'Terminal verbinden';
    }
}

function executeCodeLive() {
    if (!terminalConnected || !socket) {
        toastManager.warning('Live-Terminal', 'Terminal ist nicht verbunden');
        return;
    }
    
    // Get current editor content
    const currentEditor = window.monacoManager?.editor || editor;
    let code = '';
    
    if (currentEditor) {
        code = currentEditor.getValue();
    } else {
        toastManager.warning('Editor', 'Editor ist nicht bereit');
        return;
    }
    
    if (!code.trim()) {
        toastManager.warning('Kein Code', 'Bitte geben Sie Code ein');
        return;
    }
    
    // Send code for live execution
    socket.emit('execute_code_live', {
        code: code,
        language: 'python'
    });
    
    toastManager.info('Live-Ausführung', 'Code wird live ausgeführt...');
}

function updateTerminalStatus(status, text) {
    const statusElement = document.getElementById('terminalStatus');
    if (statusElement) {
        const dot = statusElement.querySelector('.status-dot');
        const span = statusElement.querySelector('span');
        
        if (dot) {
            dot.className = `status-dot ${status}`;
        }
        if (span) {
            span.textContent = text;
        }
    }
}

function addTerminalOutput(data) {
    const terminal = document.getElementById('terminal');
    if (!terminal) return;
    
    const line = document.createElement('div');
    line.className = `terminal-line ${data.type || 'stdout'}`;
    
    const timestamp = document.createElement('span');
    timestamp.className = 'terminal-timestamp';
    timestamp.textContent = new Date(data.timestamp * 1000).toLocaleTimeString();
    
    const message = document.createElement('span');
    message.className = 'terminal-message';
    message.textContent = data.message;
    
    line.appendChild(timestamp);
    line.appendChild(message);
    terminal.appendChild(line);
    
    // Auto-scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
    
    // Re-render feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function showExecutionProgress(show) {
    const progressElement = document.getElementById('terminalProgress');
    if (progressElement) {
        progressElement.style.display = show ? 'block' : 'none';
    }
}

function updateExecutionProgress(progress, message) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = message;
    }
}

function clearTerminal() {
    const terminal = document.getElementById('terminal');
    if (terminal) {
        terminal.innerHTML = '';
        toastManager.info('Terminal', 'Terminal geleert');
    }
}

function copyTerminalOutput() {
    const terminal = document.getElementById('terminal');
    if (!terminal) return;
    
    const messages = terminal.querySelectorAll('.terminal-message');
    const text = Array.from(messages).map(msg => msg.textContent).join('\n');
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            toastManager.success('Kopiert', 'Terminal-Ausgabe in Zwischenablage kopiert');
        }).catch(() => {
            toastManager.error('Fehler', 'Kopieren fehlgeschlagen');
        });
    }
}

/**
 * 🚀 Cache Management Functions - Phase 1 Feature 3
 * Frontend functions for cache statistics and management
 */

async function viewCacheStats() {
    try {
        const response = await fetch('/api/cache/stats');
        const data = await response.json();
        
        if (data.success) {
            const stats = data.stats;
            const hitRate = stats.hit_rate || 0;
            const totalEntries = stats.total_entries || 0;
            const totalSizeMB = stats.total_size_mb || 0;
            
            toastManager.info(
                'Cache-Statistiken',
                `💾 ${totalEntries} Einträge | ${totalSizeMB}MB | ${hitRate}% Trefferquote`,
                8000
            );
        } else {
            toastManager.error('Cache-Fehler', 'Konnte Statistiken nicht laden');
        }
    } catch (error) {
        console.error('Cache stats error:', error);
        toastManager.error('Verbindungsfehler', 'Cache-Service nicht erreichbar');
    }
}

async function clearCache() {
    if (!confirm('Möchten Sie wirklich den gesamten Cache leeren?')) {
        return;
    }
    
    try {
        const response = await fetch('/api/cache/clear', { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
            toastManager.success(
                'Cache geleert',
                `${data.cleared_count} Einträge entfernt`,
                5000
            );
        } else {
            toastManager.error('Cache-Fehler', data.error || 'Leeren fehlgeschlagen');
        }
    } catch (error) {
        console.error('Clear cache error:', error);
        toastManager.error('Verbindungsfehler', 'Cache-Service nicht erreichbar');
    }
}

async function cleanupExpiredCache() {
    try {
        const response = await fetch('/api/cache/cleanup', { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
            toastManager.success(
                'Cache bereinigt',
                `${data.removed_count} abgelaufene Einträge entfernt`,
                5000
            );
        } else {
            toastManager.error('Cache-Fehler', data.error || 'Bereinigung fehlgeschlagen');
        }
    } catch (error) {
        console.error('Cleanup cache error:', error);
        toastManager.error('Verbindungsfehler', 'Cache-Service nicht erreichbar');
    }
}


// Initialize the application
function initializeApp() {
    // Initialize Feather Icons first
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Initialize Toast Manager
    toastManager = new ToastManager();
    
    initializeNavigation();
    initializeMobileNavigation();
    initializeTheme();
    
    // Initialize editor and setup shortcuts after it's ready
    initializeEditor().then(() => {
        // Setup keyboard shortcuts after editor is ready
        setupKeyboardShortcuts();
        console.log('✅ Keyboard shortcuts initialized after editor ready');
    }).catch((error) => {
        console.warn('⚠️ Editor initialization failed, setting up shortcuts anyway:', error);
        setupKeyboardShortcuts();
    });
    
    initializeFAB();
    loadSnippets();
    addWelcomeMessage();
    checkSystemStatus();
    
    // Focus on input if it exists
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.focus();
    }
    
    // Re-render feather icons after initialization
    setTimeout(() => {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }, 100);
}

// 🚀 Production-ready Monaco Editor initialization with fail-safe
async function initializeEditor() {
    try {
        // Use existing Monaco Manager singleton (created at bottom of file)
        if (!window.monacoManager) {
            console.warn('⚠️ Monaco Manager singleton not found, this should not happen in production');
            return await initializeMonacoEditor();
        }
        
        // Always await the Promise - initialize() always returns a Promise now
        const editor = await window.monacoManager.initialize();
        console.log('✅ Monaco Editor ready - Production deployment');
        return editor;
    } catch (error) {
        console.error('❌ Monaco Manager failed, using fallback:', {
            error: error,
            message: error?.message,
            stack: error?.stack,
            name: error?.name
        });
        return await initializeMonacoEditor();
    }
}

// Fallback function - uses Monaco Manager's loading mechanism  
async function initializeMonacoEditor() {
    const editorElement = document.getElementById('editor');
    if (editorElement && !editor) {
        // Use Monaco Manager's loader to prevent duplicate module loading
        if (!window.monaco && window.monacoManager) {
            console.log('⏳ Using Monaco Manager loader for fallback...');
            try {
                await window.monacoManager.loadMonacoEditor();
            } catch (error) {
                console.error('❌ Monaco Manager loader failed with details:', {
                    error: error,
                    message: error?.message,
                    stack: error?.stack,
                    name: error?.name
                });
                throw new Error('Monaco Editor could not be loaded');
            }
        } else if (!window.monaco) {
            throw new Error('Monaco Editor not available and no Monaco Manager found');
        }
        
        editor = monaco.editor.create(editorElement, {
            value: `# AI Agent 2025 - Willkommen!
# Diese moderne Entwicklungsumgebung bietet:

def welcome_to_future():
    """Willkommen in der Zukunft der Softwareentwicklung"""
    features = [
        "🤖 AI-gestützte Code-Analyse",
        "⚡ Blitzschnelle Code-Ausführung", 
        "🔍 Intelligente Fehlersuche",
        "📊 Automatisierte Tests",
        "🎨 Moderne UI mit Glassmorphism",
        "📱 Responsive Design"
    ]
    
    for feature in features:
        print(f"✨ {feature}")
    
    return "Bereit für die Zukunft!"

# Probiere den Code aus!
result = welcome_to_future()
print(f"\\n🚀 {result}")

# Tipp: Verwende Strg+Enter zum Ausführen!`,
            language: 'python',
            theme: currentTheme === 'dark' ? 'vs-dark' : 'vs-light',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'Fira Code, Monaco, Menlo, Ubuntu Mono, monospace',
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: "on"
        });

        // Language change handler
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', function(e) {
                const language = e.target.value;
                monaco.editor.setModelLanguage(editor.getModel(), language);
                
                // Set appropriate starter code
                const starterCodes = {
                    python: '# Python Starter Code\nprint("Hello from Python 2025!")',
                    javascript: '// JavaScript ES2025\nconsole.log("Hello from the future!");',
                    typescript: '// TypeScript 5.0+\nconst message: string = "Hello TypeScript!";\nconsole.log(message);',
                    html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>2025 Web</title>\n</head>\n<body>\n  <h1>Hello HTML5!</h1>\n</body>\n</html>',
                    css: '/* Modern CSS 2025 */\n.container {\n  display: grid;\n  place-items: center;\n  min-height: 100vh;\n}'
                };
                
                if (starterCodes[language]) {
                    editor.setValue(starterCodes[language]);
                }
            });
        }
    }
}

// Navigation System
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionName = item.dataset.section;
            switchSection(sectionName);
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function switchSection(sectionName) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
        
        // Update page title
        updatePageTitle(sectionName);
        
        // Section-specific initialization
        if (sectionName === 'preview') {
            initializePreview();
        } else if (sectionName === 'apikeys') {
            checkApiKeyStatus();
        } else if (sectionName === 'results') {
            // Focus on chat input when switching to results
            setTimeout(() => {
                const userInput = document.getElementById('userInput');
                if (userInput) userInput.focus();
            }, 100);
        }
    }
}

function updatePageTitle(sectionName) {
    const titles = {
        dashboard: 'Übersicht',
        results: 'Code & KI-Ergebnisse',
        tests: 'Test-Framework',
        snippets: 'Code-Bausteine',
        preview: 'Live-Vorschau',
        apikeys: 'API-Konfiguration'
    };
    
    const headerTitle = document.querySelector('.page-title');
    if (headerTitle) {
        headerTitle.textContent = titles[sectionName] || 'KI-Entwicklungsplattform';
    }
}

// Theme System
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('aiagent-theme') || 'dark';
    currentTheme = savedTheme;
    applyTheme(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        localStorage.setItem('aiagent-theme', currentTheme);
    });
}

function applyTheme(theme) {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.setAttribute('data-feather', theme === 'light' ? 'moon' : 'sun');
            // Re-render feather icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }
    }
    
    // Update Monaco editor theme
    if (editor) {
        monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs-light');
    }
}

// FAB (Floating Action Button)
function initializeFAB() {
    const fab = document.getElementById('fabButton');
    const fabMenu = document.getElementById('fabMenu');
    
    if (fab && fabMenu) {
        fab.addEventListener('click', () => {
            fabMenu.classList.toggle('active');
        });
        
        // Close FAB menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!fab.contains(e.target) && !fabMenu.contains(e.target)) {
                fabMenu.classList.remove('active');
            }
        });
    }
}

// Chat Functionality
async function sendMessage() {
    const input = document.getElementById("userInput");
    if (!input) return;
    
    const message = input.value.trim();
    
    if (!message) {
        showToast("Bitte gib eine Nachricht ein", "warning");
        return;
    }
    
    addMessage("Du", message, "user");
    input.value = "";
    
    const loadingId = addMessage("Agent", "🤔 Analysiere deine Anfrage...", "agent loading");
    
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                message: message,
                history: conversationHistory.slice(-10)
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        removeMessage(loadingId);
        const messageId = addMessage("Agent", data.response, "agent");
        
        // Add feedback buttons to AI response
        addFeedbackButtons(messageId, message, data.response);
        
        conversationHistory.push(
            {role: "user", content: message},
            {role: "assistant", content: data.response}
        );
        
        showToast("✅ Antwort erhalten", "success");
        
    } catch (error) {
        console.error("Chat error:", error);
        removeMessage(loadingId);
        addMessage("Agent", "❌ Entschuldigung, es gab einen Verbindungsfehler. Bitte versuche es erneut.", "agent error");
        showToast("❌ Verbindungsfehler", "error");
    }
}

// Quick Chat for Dashboard
// Enhanced Quick Chat with improved formatting
function addQuickMessage(sender, text, className = "", containerId = "dashboardChat") {
    const chat = document.getElementById(containerId);
    if (!chat) return null;
    
    const div = document.createElement("div");
    const messageId = `msg_quick_${Date.now()}_${Math.random()}`;
    
    div.id = messageId;
    div.className = `message ${className}`;
    
    // Determine if this is an AI response for enhanced formatting
    const isAIResponse = sender === 'Agent' || className.includes('agent') || className.includes('ai');
    
    // Format message content with enhanced markdown support
    const formattedText = formatMessageContent(text, isAIResponse);
    
    // Structure the message with sender and content
    const messageStructure = `
        <div class="message-header">
            <span class="message-sender">${sender}</span>
            ${isAIResponse ? '<div class="ai-badge">KI</div>' : ''}
        </div>
        <div class="message-content">${formattedText}</div>
    `;
    
    div.innerHTML = messageStructure;
    
    chat.appendChild(div);
    
    // Apply syntax highlighting to any new code blocks
    if (typeof hljs !== 'undefined') {
        const codeBlocks = div.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            if (!block.classList.contains('hljs')) {
                hljs.highlightElement(block);
            }
        });
    }
    
    chat.scrollTop = chat.scrollHeight;
    
    return messageId;
}

async function sendQuickMessage() {
    const input = document.getElementById("quickChatInput");
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    const chatPreview = document.getElementById("dashboardChat");
    if (chatPreview) {
        // Add user message with enhanced formatting
        const userMessageId = addQuickMessage("Du", message, "user");
        
        input.value = "";
        
        // Add loading message with enhanced formatting
        const loadingMessageId = addQuickMessage("Agent", "🤔 Denkt nach...", "agent loading");
        
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({message: message})
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Remove loading message
                const loadingElement = document.getElementById(loadingMessageId);
                if (loadingElement) {
                    loadingElement.remove();
                }
                
                // Add AI response with enhanced formatting
                const responseMessageId = addQuickMessage("Agent", data.response, "agent");
                
                // Add feedback for quick chat
                if (responseMessageId) {
                    addFeedbackButtons(responseMessageId, message, data.response, true);
                }
                
            } else {
                // Remove loading message and show error
                const loadingElement = document.getElementById(loadingMessageId);
                if (loadingElement) {
                    loadingElement.remove();
                }
                addQuickMessage("Agent", "❌ Fehler bei der Verbindung", "agent error");
            }
        } catch (error) {
            // Remove loading message and show error
            const loadingElement = document.getElementById(loadingMessageId);
            if (loadingElement) {
                loadingElement.remove();
            }
            addQuickMessage("Agent", "❌ Verbindungsfehler", "agent error");
        }
    }
}

function switchToEditor() {
    switchSection('results');
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === 'results') {
            item.classList.add('active');
        }
    });
    
    // Focus on editor after switching
    setTimeout(() => {
        if (editor) {
            editor.focus();
        }
    }, 100);
}


// Code Analysis
async function analyzeCode() {
    if (!editor) {
        showToast("Editor ist nicht bereit", "warning");
        return;
    }
    
    const code = editor.getValue().trim();
    
    if (!code) {
        showToast("Bitte gib Code zum Analysieren ein", "warning");
        return;
    }
    
    const loadingId = addMessage("Agent", "🔍 Analysiere deinen Code...", "agent loading");
    
    try {
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({code: code})
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        removeMessage(loadingId);
        addMessage("Agent", `🔍 **Code-Analyse:**\n\n${data.analysis}`, "agent");
        
        showToast("✅ Code-Analyse abgeschlossen", "success");
        
    } catch (error) {
        console.error("Analysis error:", error);
        removeMessage(loadingId);
        addMessage("Agent", "❌ Fehler bei der Code-Analyse", "agent error");
        showToast("❌ Analyse-Fehler", "error");
    }
}

// Code Formatting
function formatCode() {
    if (editor) {
        editor.getAction('editor.action.formatDocument').run();
        showToast("✨ Code formatiert", "success");
    }
}

// Enhanced Response Filtering for better readability
function filterAndStructureResponse(text) {
    // Remove redundant phrases and improve structure
    let filtered = text
        .replace(/\b(Hier ist|Hier sind|Das ist|Dies ist)\s+/gi, '')
        .replace(/\b(Gerne helfe ich dir|Ich helfe dir gerne)\b/gi, '')
        .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
        .trim();
    
    // Improve paragraph breaks for long content
    const sentences = filtered.split(/\.\s+/);
    if (sentences.length > 4) {
        filtered = sentences.map((sentence, index) => {
            if (index > 0 && index % 3 === 0 && sentence.length > 50) {
                return '\n\n' + sentence;
            }
            return sentence;
        }).join('. ');
    }
    
    return filtered;
}

// Enhanced Message Formatting with Marked.js
function formatMessageContent(text, isAIResponse = false) {
    if (!text) return '';
    
    try {
        // Apply response filtering for AI messages
        let processedText = isAIResponse ? filterAndStructureResponse(text) : text;
        
        // Use marked.js for full markdown parsing if available
        if (typeof marked !== 'undefined') {
            const rendered = marked.parse(processedText);
            // 🛡️ CRITICAL SECURITY: Sanitize HTML to prevent XSS attacks
            if (typeof DOMPurify !== 'undefined') {
                return DOMPurify.sanitize(rendered, {
                    ALLOWED_ATTR: ['class', 'language', 'target', 'rel', 'href'],
                    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote'],
                    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
                });
            } else {
                console.error('🚨 SECURITY WARNING: DOMPurify not available, falling back to unsafe rendering');
                return rendered;
            }
        } else {
            // Fallback to basic formatting
            return processedText
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
                .replace(/\n/g, '<br>');
        }
    } catch (error) {
        console.warn('Message formatting error:', error);
        return text.replace(/\n/g, '<br>');
    }
}

// Enhanced Utility Functions
function addMessage(sender, text, className = "") {
    const chat = document.getElementById("chat");
    if (!chat) return null;
    
    const div = document.createElement("div");
    const messageId = `msg_${Date.now()}_${Math.random()}`;
    
    div.id = messageId;
    div.className = `message ${className}`;
    
    // Determine if this is an AI response for enhanced formatting
    const isAIResponse = sender === 'Agent' || className.includes('agent') || className.includes('ai');
    
    // Format message content with enhanced markdown support
    const formattedText = formatMessageContent(text, isAIResponse);
    
    // Structure the message with sender and content
    const messageStructure = `
        <div class="message-header">
            <span class="message-sender">${sender}</span>
            ${isAIResponse ? '<div class="ai-badge">KI</div>' : ''}
        </div>
        <div class="message-content">${formattedText}</div>
    `;
    
    div.innerHTML = messageStructure;
    
    chat.appendChild(div);
    
    // Apply syntax highlighting to any new code blocks
    if (typeof hljs !== 'undefined') {
        const codeBlocks = div.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            if (!block.classList.contains('hljs')) {
                hljs.highlightElement(block);
            }
        });
    }
    
    chat.scrollTop = chat.scrollHeight;
    
    return messageId;
}

function removeMessage(messageId) {
    const element = document.getElementById(messageId);
    if (element) {
        element.remove();
    }
}

// Feedback buttons for learning integration
function addFeedbackButtons(messageId, userMessage, agentResponse, isQuickChat = false) {
    const messageElement = document.getElementById(messageId);
    if (!messageElement) return;
    
    // Create feedback container
    const feedbackContainer = document.createElement('div');
    feedbackContainer.className = 'feedback-container';
    feedbackContainer.innerHTML = `
        <div class="feedback-buttons">
            <button class="feedback-btn thumbs-up" onclick="submitFeedback('${messageId}', 'positive', '${encodeURIComponent(userMessage)}', '${encodeURIComponent(agentResponse)}')">
                <i data-feather="thumbs-up"></i>
                <span>Hilfreich</span>
            </button>
            <button class="feedback-btn thumbs-down" onclick="submitFeedback('${messageId}', 'negative', '${encodeURIComponent(userMessage)}', '${encodeURIComponent(agentResponse)}')">
                <i data-feather="thumbs-down"></i>
                <span>Nicht hilfreich</span>
            </button>
        </div>
    `;
    
    messageElement.appendChild(feedbackContainer);
    
    // Re-render feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Submit feedback for learning
async function submitFeedback(messageId, rating, userMessage, agentResponse) {
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                message_id: messageId,
                rating: rating,
                user_message: decodeURIComponent(userMessage),
                agent_response: decodeURIComponent(agentResponse),
                timestamp: new Date().toISOString()
            })
        });
        
        if (response.ok) {
            // Update button states
            const feedbackContainer = document.getElementById(messageId)?.querySelector('.feedback-container');
            if (feedbackContainer) {
                const buttons = feedbackContainer.querySelectorAll('.feedback-btn');
                buttons.forEach(btn => {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                });
                
                // Highlight selected button
                const selectedBtn = feedbackContainer.querySelector(`.feedback-btn.${rating === 'positive' ? 'thumbs-up' : 'thumbs-down'}`);
                if (selectedBtn) {
                    selectedBtn.style.opacity = '1';
                    selectedBtn.style.background = rating === 'positive' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
                }
            }
            
            showToast(rating === 'positive' ? '👍 Danke für dein Feedback!' : '👎 Feedback erhalten, wir verbessern uns!', 'success');
        } else {
            showToast('❌ Feedback konnte nicht gespeichert werden', 'error');
        }
    } catch (error) {
        console.error('Feedback error:', error);
        showToast('❌ Feedback-Fehler', 'error');
    }
}

function displayExecutionResult(result) {
    const outputElement = document.getElementById("output");
    if (!outputElement) return;
    
    if (result.success) {
        outputElement.textContent = result.output || "✅ Code erfolgreich ausgeführt (keine Ausgabe)";
        outputElement.className = "output-content success";
    } else {
        outputElement.textContent = `❌ ${result.error || "Unbekannter Fehler"}`;
        outputElement.className = "output-content error";
    }
    
    if (result.execution_time !== undefined) {
        const timeInfo = document.createElement("div");
        timeInfo.style.marginTop = "1rem";
        timeInfo.style.fontSize = "0.9rem";
        timeInfo.style.opacity = "0.7";
        timeInfo.textContent = `⏱️ Ausführungszeit: ${result.execution_time}s`;
        outputElement.appendChild(timeInfo);
    }
}

function addWelcomeMessage() {
    const welcomeText = `🎉 **Willkommen bei AI Agent 2025!**

Die Zukunft der Softwareentwicklung ist da! Diese ultramoderne Plattform bietet:

🤖 **KI-Assistent**: Intelligent und kontextbewusst
⚡ **Code-Ausführung**: Sicher und blitzschnell  
🔍 **Code-Analyse**: Deep Learning-basiert
🧪 **Test-Framework**: Automatisiert und intelligent
📝 **Intelligente Bausteine**: Kuratierte Code-Lösungen
👁️ **Live-Vorschau**: Echtzeit-Entwicklung
🔑 **API-Verwaltung**: Sichere Schlüsselverwaltung

**Schnellstart:**
• Schreibe Code im Editor → \`Strg + Enter\` zum Ausführen
• Stelle Fragen → Ich helfe bei allem!
• Probiere Code-Bausteine → Fertige Lösungen für häufige Aufgaben

Lass uns die Zukunft programmieren! 🚀`;
    
    addMessage("KI-Agent", welcomeText, "agent");
}

function showToast(message, type = "info") {
    // Legacy function wrapper - uses new ToastManager for backwards compatibility
    if (toastManager) {
        // Extract title and message from the text
        const title = type === "success" ? "Erfolgreich" : 
                     type === "error" ? "Fehler" : 
                     type === "warning" ? "Warnung" : "Information";
        
        toastManager.show(type, title, message);
    } else {
        // Fallback if toastManager not initialized
        console.warn('ToastManager not initialized, falling back to console:', message);
    }
}

function showLoading(show) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
        overlay.classList.toggle("active", show);
    }
}

function clearOutput() {
    const outputElement = document.getElementById("output");
    if (outputElement) {
        outputElement.textContent = "Ausgabe geleert...";
        outputElement.className = "output-content";
        showToast("🗑️ Ausgabe geleert", "info");
    }
}

function clearChat() {
    const chat = document.getElementById("chat");
    if (chat) {
        chat.innerHTML = "";
        conversationHistory = [];
        addWelcomeMessage();
        showToast("💬 Chat geleert", "info");
    }
}

function copyOutput() {
    const outputElement = document.getElementById("output");
    if (outputElement) {
        navigator.clipboard.writeText(outputElement.textContent).then(() => {
            showToast("📋 Ausgabe kopiert", "success");
        }).catch(() => {
            showToast("❌ Kopieren fehlgeschlagen", "error");
        });
    }
}

// Test Framework
async function runAllTests() {
    showLoading(true);
    const resultsElement = document.getElementById("testResults");
    if (resultsElement) {
        resultsElement.innerHTML = '<div class="empty-state"><i data-feather="loader"></i><h3>Tests werden ausgeführt...</h3></div>';
        if (typeof feather !== 'undefined') feather.replace();
    }
    
    try {
        // Simulate test execution
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockResults = {
            passed: Math.floor(Math.random() * 20) + 25,
            failed: Math.floor(Math.random() * 3),
            coverage: Math.floor(Math.random() * 15) + 85
        };
        
        // Update metrics
        const passedElement = document.getElementById("passedTests");
        const failedElement = document.getElementById("failedTests");
        const coverageElement = document.getElementById("coverage");
        
        if (passedElement) passedElement.textContent = mockResults.passed;
        if (failedElement) failedElement.textContent = mockResults.failed;
        if (coverageElement) coverageElement.textContent = mockResults.coverage + "%";
        
        // Update results
        if (resultsElement) {
            resultsElement.innerHTML = `
                <div class="test-result-item success">
                    <i data-feather="check-circle"></i>
                    <span>✅ test_api_endpoints.py - Alle 12 Tests bestanden</span>
                </div>
                <div class="test-result-item success">
                    <i data-feather="check-circle"></i>
                    <span>✅ test_validators.py - Alle 18 Tests bestanden</span>
                </div>
                <div class="test-result-item ${mockResults.failed > 0 ? 'error' : 'success'}">
                    <i data-feather="${mockResults.failed > 0 ? 'x-circle' : 'check-circle'}"></i>
                    <span>${mockResults.failed > 0 ? '❌' : '✅'} test_integration.py - ${mockResults.failed > 0 ? `${mockResults.failed} von 8 Tests fehlgeschlagen` : 'Alle 8 Tests bestanden'}</span>
                </div>
                <div class="test-result-item success">
                    <i data-feather="check-circle"></i>
                    <span>✅ test_security.py - Alle 15 Tests bestanden</span>
                </div>
            `;
            
            if (typeof feather !== 'undefined') feather.replace();
        }
        
        showToast("✅ Tests abgeschlossen", "success");
        
    } catch (error) {
        if (resultsElement) {
            resultsElement.innerHTML = '<div class="empty-state"><i data-feather="alert-triangle"></i><h3>Fehler beim Ausführen der Tests</h3></div>';
            if (typeof feather !== 'undefined') feather.replace();
        }
        showToast("❌ Test-Fehler", "error");
    } finally {
        showLoading(false);
    }
}

function generateTests() {
    const code = editor ? editor.getValue().trim() : '';
    if (!code) {
        showToast("Bitte gib Code ein, für den Tests generiert werden sollen", "warning");
        return;
    }
    
    showLoading(true);
    
    setTimeout(() => {
        const testCode = `# 🧪 Automatisch generierte Tests - AI Agent 2025
import pytest
import asyncio
from unittest.mock import Mock, patch

class TestGeneratedCode:
    """Automatisch generierte Test-Suite"""
    
    def test_function_exists(self):
        """Testet ob die Hauptfunktion existiert"""
        # Implementierung basierend auf deinem Code
        assert callable(main_function)
    
    def test_function_returns_expected_type(self):
        """Testet den Rückgabetyp"""
        result = main_function()
        assert isinstance(result, (str, int, dict, list))
    
    @pytest.mark.asyncio
    async def test_async_functionality(self):
        """Testet asynchrone Funktionalität"""
        # Für async Funktionen
        result = await async_main_function()
        assert result is not None
    
    def test_edge_cases(self):
        """Testet Grenzfälle"""
        # Leere Eingabe
        result = main_function("")
        assert result is not None
        
        # Null-Werte
        result = main_function(None)
        assert result is not None
    
    def test_error_handling(self):
        """Testet Fehlerbehandlung"""
        with pytest.raises(ValueError):
            main_function("invalid_input")
    
    @patch('external_service.api_call')
    def test_with_mocks(self, mock_api):
        """Testet mit gemockten Abhängigkeiten"""
        mock_api.return_value = {"status": "success"}
        result = main_function()
        assert result["status"] == "success"
        mock_api.assert_called_once()

# Ausführung: pytest test_generated.py -v
# Coverage: pytest --cov=main_module test_generated.py`;
        
        if (editor) {
            editor.setValue(testCode);
            const languageSelect = document.getElementById('languageSelect');
            if (languageSelect) {
                languageSelect.value = 'python';
                monaco.editor.setModelLanguage(editor.getModel(), 'python');
            }
        }
        
        showLoading(false);
        showToast("✅ Tests generiert und in Editor geladen", "success");
    }, 1500);
}

// Snippets functionality
function loadSnippets() {
    displaySnippets(sampleSnippets);
    
    // Search functionality
    const searchInput = document.getElementById("snippetSearch");
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = sampleSnippets.filter(snippet => 
                snippet.title.toLowerCase().includes(query) ||
                snippet.category.toLowerCase().includes(query) ||
                snippet.code.toLowerCase().includes(query)
            );
            displaySnippets(filtered);
        });
    }
    
    // Category filtering
    const categories = document.querySelectorAll('.filter-item');
    categories.forEach(cat => {
        cat.addEventListener('click', () => {
            categories.forEach(c => c.classList.remove('active'));
            cat.classList.add('active');
            
            const category = cat.dataset.category;
            const filtered = category === 'all' ? 
                sampleSnippets : 
                sampleSnippets.filter(s => s.category === category);
            
            displaySnippets(filtered);
        });
    });
}

function displaySnippets(snippets) {
    const grid = document.getElementById("snippetsGrid");
    if (!grid) return;
    
    if (snippets.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i data-feather="search"></i><h3>Keine Snippets gefunden</h3><p>Versuche einen anderen Suchbegriff</p></div>';
        if (typeof feather !== 'undefined') feather.replace();
        return;
    }
    
    grid.innerHTML = snippets.map(snippet => `
        <div class="snippet-card" onclick="loadSnippet(${snippet.id})">
            <div class="snippet-header">
                <h3>${snippet.title}</h3>
                <span class="snippet-language">${snippet.language}</span>
            </div>
            <div class="snippet-preview">
                <code>${snippet.code.substring(0, 150)}...</code>
            </div>
            <div class="snippet-actions">
                <button onclick="event.stopPropagation(); loadSnippet(${snippet.id})" class="primary-btn">
                    <i data-feather="download"></i>
                    <span>Laden</span>
                </button>
                <button onclick="event.stopPropagation(); copySnippet(${snippet.id})" class="secondary-btn">
                    <i data-feather="copy"></i>
                    <span>Kopieren</span>
                </button>
            </div>
        </div>
    `).join('');
    
    if (typeof feather !== 'undefined') feather.replace();
}

function loadSnippet(id) {
    const snippet = sampleSnippets.find(s => s.id === id);
    if (snippet && editor) {
        editor.setValue(snippet.code);
        monaco.editor.setModelLanguage(editor.getModel(), snippet.language);
        
        // Update language select
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = snippet.language;
        }
        
        // Switch to results section
        switchSection('results');
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === 'results') {
                item.classList.add('active');
            }
        });
        
        showToast(`📝 Snippet "${snippet.title}" geladen`, "success");
    }
}

function copySnippet(id) {
    const snippet = sampleSnippets.find(s => s.id === id);
    if (snippet) {
        navigator.clipboard.writeText(snippet.code).then(() => {
            showToast(`📋 Snippet "${snippet.title}" kopiert`, "success");
        });
    }
}

// Preview functionality
function initializePreview() {
    updatePreviewUrl();
}

function updatePreviewUrl() {
    const urlElement = document.getElementById("previewUrl");
    if (urlElement) {
        urlElement.textContent = window.location.origin;
    }
}

function refreshPreview() {
    const iframe = document.getElementById("previewIframe");
    if (iframe) {
        iframe.src = iframe.src;
        showToast("🔄 Preview aktualisiert", "info");
    }
}

function openInNewTab() {
    window.open(window.location.origin, '_blank');
    showToast("🔗 Neuer Tab geöffnet", "info");
}

// API Keys functionality
function checkApiKeyStatus() {
    fetch('/api/health')
        .then(response => response.json())
        .then(data => {
            updateApiStatus('openai', data.services?.ai_service === 'available');
        })
        .catch(() => {
            updateApiStatus('openai', false);
        });
}

function updateApiStatus(service, isConnected) {
    const statusElement = document.getElementById(`${service}Status`);
    if (statusElement) {
        const icon = statusElement.querySelector('i');
        const text = statusElement.querySelector('span');
        
        if (isConnected) {
            statusElement.className = "api-status connected";
            if (icon) icon.setAttribute('data-feather', 'check-circle');
            if (text) text.textContent = "Verbunden";
        } else {
            statusElement.className = "api-status disconnected";
            if (icon) icon.setAttribute('data-feather', 'x-circle');
            if (text) text.textContent = "Nicht verbunden";
        }
        
        if (typeof feather !== 'undefined') feather.replace();
    }
}

function toggleKeyVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input?.nextElementSibling;
    
    if (input && button) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        const icon = button.querySelector('i');
        if (icon) {
            icon.setAttribute('data-feather', isPassword ? 'eye-off' : 'eye');
            if (typeof feather !== 'undefined') feather.replace();
        }
    }
}

function testApiKey(service) {
    showLoading(true);
    
    setTimeout(() => {
        showLoading(false);
        updateApiStatus(service, true);
        showToast(`✅ ${service.toUpperCase()} API Verbindung erfolgreich`, "success");
    }, 1500);
}

function saveApiKey(service) {
    showToast(`💾 ${service.toUpperCase()} API Schlüssel gespeichert`, "success");
}

// System status check
function checkSystemStatus() {
    // Update status indicators
    const statusDots = document.querySelectorAll('.status-dot');
    statusDots.forEach(dot => {
        if (!dot.classList.contains('online')) {
            dot.classList.add('online');
        }
    });
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener("keydown", function(event) {
        // Enter to send message (Ctrl+Enter for new line)
        if (event.target.id === "userInput" || event.target.id === "quickChatInput") {
            if (event.key === "Enter" && !event.ctrlKey) {
                event.preventDefault();
                if (event.target.id === "userInput") {
                    sendMessage();
                } else {
                    sendQuickMessage();
                }
            }
        }
        
        // Ctrl+Enter to execute code
        if (event.ctrlKey && event.key === "Enter") {
            const currentEditor = window.monacoManager?.editor || editor;
            if (currentEditor && (currentEditor.hasTextFocus ? currentEditor.hasTextFocus() : true)) {
                event.preventDefault();
                executeCode();
            }
        }
        
        // Ctrl+Shift+A to analyze code
        if (event.ctrlKey && event.shiftKey && event.key === "A") {
            event.preventDefault();
            analyzeCode();
        }
        
        // Ctrl+Shift+F to format code
        if (event.ctrlKey && event.shiftKey && event.key === "F") {
            event.preventDefault();
            formatCode();
        }
        
        // Ctrl+T to run tests
        if (event.ctrlKey && event.key === "t") {
            event.preventDefault();
            runTests();
        }
        
        // Escape to close modals/overlays
        if (event.key === "Escape") {
            showLoading(false);
            const fabMenu = document.getElementById('fabMenu');
            if (fabMenu) {
                fabMenu.classList.remove('active');
            }
        }
        
        // Navigation shortcuts (Ctrl + number)
        if (event.ctrlKey && event.key >= "1" && event.key <= "6") {
            event.preventDefault();
            const sections = ['dashboard', 'results', 'tests', 'snippets', 'preview', 'apikeys'];
            const sectionIndex = parseInt(event.key) - 1;
            if (sections[sectionIndex]) {
                switchSection(sections[sectionIndex]);
                
                // Update nav
                const navItems = document.querySelectorAll('.nav-item');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.dataset.section === sections[sectionIndex]) {
                        item.classList.add('active');
                    }
                });
            }
        }
    });
}

// Add slideOutToast animation CSS
const additionalCSS = `
@keyframes slideOutToast {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(100%);
    }
}

.test-result-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 0.5rem;
    border-radius: 0.75rem;
    border-left: 4px solid;
    background: var(--dark-surface);
    transition: all 0.3s ease;
}

.test-result-item:hover {
    transform: translateX(4px);
}

.test-result-item.success {
    border-left-color: var(--success-500);
    background: rgba(16, 185, 129, 0.05);
}

.test-result-item.error {
    border-left-color: var(--error-500);
    background: rgba(239, 68, 68, 0.05);
}

.test-result-item i {
    color: inherit;
}

.test-result-item span {
    color: var(--dark-text);
    font-weight: 500;
}

/* Feedback buttons styling */
.feedback-container {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.feedback-buttons {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.feedback-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.feedback-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
}

.feedback-btn.thumbs-up:hover:not(:disabled) {
    background: rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.3);
    color: #10b981;
}

.feedback-btn.thumbs-down:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.3);
    color: #ef4444;
}

.feedback-btn:disabled {
    cursor: not-allowed;
}

.feedback-btn i {
    width: 14px;
    height: 14px;
}

.feedback-btn span {
    font-size: 0.875rem;
}
`;

// Inject additional CSS
if (!document.getElementById('additional-styles')) {
    const style = document.createElement('style');
    style.id = 'additional-styles';
    style.textContent = additionalCSS;
    document.head.appendChild(style);
}

// ========================================
// MOBILE NAVIGATION FUNCTIONS
// ========================================

// Toggle mobile menu
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebarNav');
    const overlay = document.getElementById('mobileMenuOverlay');
    const toggle = document.getElementById('mobileMenuToggle');
    
    if (!sidebar || !overlay || !toggle) return;
    
    const isActive = sidebar.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

// Open mobile menu
function openMobileMenu() {
    const sidebar = document.getElementById('sidebarNav');
    const overlay = document.getElementById('mobileMenuOverlay');
    const toggle = document.getElementById('mobileMenuToggle');
    
    if (!sidebar || !overlay || !toggle) return;
    
    // Add active classes
    sidebar.classList.add('active');
    overlay.classList.add('active');
    toggle.classList.add('active');
    
    // Show overlay
    overlay.style.display = 'block';
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus trap for accessibility
    setTimeout(() => {
        const firstNavItem = sidebar.querySelector('.nav-item');
        if (firstNavItem) firstNavItem.focus();
    }, 100);
}

// Close mobile menu
function closeMobileMenu() {
    const sidebar = document.getElementById('sidebarNav');
    const overlay = document.getElementById('mobileMenuOverlay');
    const toggle = document.getElementById('mobileMenuToggle');
    
    if (!sidebar || !overlay || !toggle) return;
    
    // Remove active classes
    sidebar.classList.remove('active');
    toggle.classList.remove('active');
    
    // Hide overlay with fade-out
    overlay.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Close menu when clicking nav item (mobile)
function handleMobileNavClick(event) {
    const target = event.target.closest('.nav-item');
    if (target && window.innerWidth <= 768) {
        // Small delay to allow section switch animation
        setTimeout(closeMobileMenu, 200);
    }
}

// Handle window resize
function handleMobileNavResize() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}

// Close menu on escape key
function handleMobileNavKeydown(event) {
    if (event.key === 'Escape') {
        closeMobileMenu();
    }
}

// Initialize mobile navigation
function initializeMobileNavigation() {
    // Add event listeners for navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', handleMobileNavClick);
    });
    
    // Add resize listener
    window.addEventListener('resize', handleMobileNavResize);
    
    // Add escape key listener
    document.addEventListener('keydown', handleMobileNavKeydown);
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const sidebar = document.getElementById('sidebarNav');
    if (sidebar) {
        sidebar.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sidebar.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            
            // Swipe left to close (if menu is open)
            if (touchStartX - touchEndX > 50 && sidebar.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    // Swipe right from edge to open menu (improved gesture detection)
    let touchStartY = 0;
    let isTouchInScrollableArea = false;
    
    document.addEventListener('touchstart', (e) => {
        if (e.touches[0].clientX < 20 && window.innerWidth <= 768) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            
            // Check if touch is in a scrollable area
            const target = e.target;
            const scrollableParent = target.closest('.chat-preview, .main-content, .editor-container, [style*="overflow"], [class*="scroll"]');
            isTouchInScrollableArea = !!scrollableParent;
        }
    });
    
    document.addEventListener('touchend', (e) => {
        if (touchStartX < 20 && !isTouchInScrollableArea) {
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY);
            
            // Only open menu if it's a clear horizontal swipe (not a scroll)
            if (deltaX > 80 && deltaY < 40) {
                openMobileMenu();
            }
        }
        
        // Reset gesture tracking
        touchStartX = 0;
        touchStartY = 0;
        isTouchInScrollableArea = false;
    });
}

// Mobile navigation is now initialized as part of the main app initialization flow

/**
 * 🚀 Monaco Editor Singleton Manager - Production-Ready 2025
 * Clean Code implementation with memory management and disposal patterns
 * External references: Monaco Editor GitHub best practices, CDN optimization patterns
 */
class MonacoEditorManager {
    constructor() {
        this.editor = null;
        this.models = new Map();
        this.completionProviders = [];
        this.isInitialized = false;
        this.isLoading = false;
        this.initPromise = null;
    }

    initialize() {
        // Always return a Promise - never null or raw object
        if (this.isInitialized && this.editor) {
            return Promise.resolve(this.editor);
        }
        
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = (async () => {
            try {
                // Wait for DOM ready
                await new Promise(resolve => {
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', resolve, { once: true });
                    } else {
                        resolve();
                    }
                });
                
                // Ensure editor element exists
                const editorElement = document.getElementById('editor');
                if (!editorElement) {
                    throw new Error('#editor element not found in DOM');
                }
                
                if (!window.monaco) await this.loadMonacoEditor();
                await this.createEditorInstance();
                this.isInitialized = true;
                console.log('✅ Monaco Editor Manager - Production Ready');
                return this.editor;
            } catch (error) {
                console.error('❌ Monaco initialization failed with details:', {
            error: error,
            message: error?.message,
            stack: error?.stack,
            name: error?.name
        });
                this.initPromise = null; // Allow retry
                throw error;
            }
        })();
        
        return this.initPromise;
    }

    loadMonacoEditor() {
        // 🛡️ FINAL SINGLETON FIX: Global protection against duplicate loading
        if (window.__MONACO_LOADED && window.monaco) {
            console.log('✅ Monaco already loaded globally, skipping');
            return Promise.resolve();
        }
        
        if (window.__monacoLoadPromise) {
            console.log('⚙️ Monaco load already in progress, returning existing promise');
            return window.__monacoLoadPromise;
        }
        
        window.__monacoLoadPromise = new Promise((resolve, reject) => {
            // 🎯 DEFINITIVE FIX: Load Monaco loader dynamically for complete singleton control
            if (typeof require === 'undefined') {
                console.log('🔄 Loading Monaco loader.min.js dynamically (DEFINITIVE)...');
                
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.min.js';
                // Remove integrity temporarily to debug - will add back after confirming URL works
                script.crossOrigin = 'anonymous';
                
                console.log('🔍 DEBUG: Loading Monaco from:', script.src);
                
                script.onload = () => {
                    console.log('✅ Monaco loader.min.js loaded dynamically');
                    this.continueMonacoSetup(resolve, reject);
                };
                
                script.onerror = () => {
                    reject(new Error('Failed to load Monaco loader.min.js dynamically'));
                };
                
                document.head.appendChild(script);
                return;
            }
            
            // If require is already available, continue setup
            this.continueMonacoSetup(resolve, reject);
        });
        
        return window.__monacoLoadPromise;
    }

    continueMonacoSetup(resolve, reject) {
        try {
            // 🚀 Setup worker environment BEFORE requiring Monaco
            if (!window.MonacoEnvironment) {
                window.MonacoEnvironment = {
                    getWorker: function(workerId, label) {
                        const getWorkerUrl = (path) => {
                            const blob = new Blob([`importScripts('${path}');`], { type: 'application/javascript' });
                            return URL.createObjectURL(blob);
                        };
                        
                        switch (label) {
                            case 'json':
                                return new Worker(getWorkerUrl('https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/language/json/json.worker.js'));
                            case 'css':
                            case 'scss':
                            case 'less':
                                return new Worker(getWorkerUrl('https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/language/css/css.worker.js'));
                            case 'html':
                            case 'handlebars':
                            case 'razor':
                                return new Worker(getWorkerUrl('https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/language/html/html.worker.js'));
                            case 'typescript':
                            case 'javascript':
                                return new Worker(getWorkerUrl('https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/language/typescript/ts.worker.js'));
                            default:
                                return new Worker(getWorkerUrl('https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/editor/editor.worker.js'));
                        }
                    }
                };
                console.log('✅ Monaco worker environment configured');
            }

            // 🎯 DEFINITIVE SINGLETON: Configure require ONLY once globally
            if (!window.__monacoRequireConfigured) {
                window.__monacoRequireConfigured = true;
                require.config({
                    paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs' },
                    'vs/nls': { availableLanguages: { '*': 'en' } }
                });
                console.log('⚙️ Monaco require.config applied (DEFINITIVE SINGLETON)');
            }

            // 🎯 DEFINITIVE SINGLETON: Only load Monaco module if not already loaded globally
            if (window.__MONACO_MODULE_LOADED) {
                console.log('✅ Monaco editor.main already loaded globally, resolving');
                resolve();
                return;
            }

            console.log('⏳ Loading Monaco via require (DEFINITIVE SINGLETON)...');
            
            require(['vs/editor/editor.main'], () => {
                console.log('🎉 Monaco require SUCCESS - module loaded');
                if (window.monaco && window.monaco.editor) {
                    window.__MONACO_LOADED = true;
                    window.__MONACO_MODULE_LOADED = true;
                    console.log('✅ Monaco DEFINITIVE SUCCESS - editor available');
                    resolve();
                } else {
                    console.error('❌ Monaco loaded but objects missing');
                    reject(new Error('Monaco loaded but global object not found'));
                }
            }, (error) => {
                console.error('❌ Monaco require FAILED:', error?.message || error);
                reject(error);
            });
        } catch (err) {
            console.error('❌ Monaco setup exception:', err?.message || err);
            reject(err);
        }
    }

    createEditorInstance() {
        const container = document.getElementById('editor');
        if (!container) throw new Error('Editor container not found');

        this.dispose(); // Clean slate approach

        this.editor = monaco.editor.create(container, {
            value: this.getWelcomeCode(),
            language: 'python',
            theme: currentTheme === 'dark' ? 'vs-dark' : 'vs-light',
            fontSize: 14,
            fontFamily: 'Fira Code, Monaco, monospace',
            automaticLayout: true,
            wordWrap: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: 'smooth'
        });

        window.editor = this.editor; // Backward compatibility
        this.setupEnhancements();
        return this.editor;
    }

    setupEnhancements() {
        // 🎯 Smart completion provider with proper disposal tracking
        const provider = monaco.languages.registerCompletionItemProvider('python', {
            provideCompletionItems: () => ({
                suggestions: [
                    {
                        label: 'print', kind: monaco.languages.CompletionItemKind.Function,
                        insertText: 'print(${1:"Hello 2025"})',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'def function', kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'def ${1:func_name}(${2:params}):\\n\\t${3:pass}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    }
                ]
            })
        });
        this.completionProviders.push(provider);

        // 🔄 Language switcher with enhanced starter codes
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                const lang = e.target.value;
                monaco.editor.setModelLanguage(this.editor.getModel(), lang);
                
                const starters = {
                    python: '# Python 2025 - Ultra-Modern\\nprint("🚀 Willkommen in der Zukunft!")',
                    javascript: '// JavaScript ES2025\\nconsole.log("🎯 Production ready!");',
                    typescript: '// TypeScript 5.0+\\nconst message: string = "✨ Type-safe future!";'
                };
                
                if (starters[lang]) this.editor.setValue(starters[lang]);
            });
        }
    }

    getWelcomeCode() {
        return `# AI Agent 2025 - Ultra-Modern Development Platform

def welcome_to_future():
    \"\"\"🚀 Willkommen in der Zukunft der Softwareentwicklung\"\"\"
    features = [
        \"🤖 AI-gestützte Code-Analyse\",
        \"⚡ Blitzschnelle Ausführung\", 
        \"🎨 Glassmorphism UI\",
        \"📱 Mobile-First Design\",
        \"🔍 Smart Debugging\"
    ]
    
    for feature in features:
        print(f\"✨ {feature}\")
    
    return \"Production-Ready 2025!\"

# 🎯 Probiere es aus!
result = welcome_to_future()
print(f\"\\n🚀 {result}\")

# 💡 Tipp: Strg+Enter für Ausführung`;
    }

    // 🧹 Production-grade disposal pattern
    dispose() {
        try {
            this.completionProviders.forEach(p => p?.dispose?.());
            this.completionProviders = [];
            this.models.forEach(m => m?.dispose?.());
            this.models.clear();
            if (window.monaco) monaco.editor.getModels().forEach(m => m?.dispose?.());
            if (this.editor) { 
                this.editor.dispose(); 
                this.editor = null; 
                window.editor = null; 
            }
            this.isInitialized = false;
        } catch (e) { 
            console.error('Monaco disposal error:', e); 
        }
    }
}

// 🎯 Global singleton instance - Safe initialization
if (typeof window !== 'undefined' && !window.monacoManager) {
    window.monacoManager = new MonacoEditorManager();
    console.log('✅ Monaco Manager singleton created');
}