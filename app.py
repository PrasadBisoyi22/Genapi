from flask import Flask, send_from_directory
from flask_cors import CORS
from routes.gen_routes import gen_bp
from config import Config
import os

def create_app():
    app = Flask(__name__)
    config = Config()
    
    # Configure Flask app
    app.config['SECRET_KEY'] = config.SECRET_KEY
    
    # Enable CORS for all origins (adjust in production)
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
        }
    })
    
    # Register blueprints
    app.register_blueprint(gen_bp, url_prefix='/api/gen')
    
    # Serve static files from the root directory
    @app.route('/')
    def serve_index():
        return send_from_directory('.', 'index.html')
    
    # Serve static files
    @app.route('/<path:filename>')
    def serve_static(filename):
        return send_from_directory('.', filename)
    
    return app

if __name__ == '__main__':
    config = Config()
    app = create_app()
    app.run(host='0.0.0.0', port=config.PORT, debug=config.DEBUG)
