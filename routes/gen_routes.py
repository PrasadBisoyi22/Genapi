from flask import Blueprint, request, jsonify
from services.gen_service import GenService
from config import Config

gen_bp = Blueprint('gen', __name__)
config = Config()
gen_service = GenService(config.GEMINI_API_KEY)

# Difficulty mapping for API
difficulty_mapping = {
    'beginner': 'Easy',
    'intermediate': 'Medium',
    'advanced': 'Hard'
}

@gen_bp.route("/question", methods=["POST"])
async def generate_question():
    """Generate a new coding question"""
    try:
        data = request.get_json()
        topic = data.get('topic')
        difficulty = data.get('difficulty')
        
        if not topic or not difficulty:
            return jsonify({"error": "Missing topic or difficulty"}), 400
        
        server_difficulty = difficulty_mapping.get(difficulty, difficulty)
        question = await gen_service.generate_coding_question(topic, server_difficulty)
        
        if question:
            return jsonify(question), 201
        else:
            return jsonify({"error": "Failed to generate question"}), 500
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@gen_bp.route("/verify", methods=["POST"])
async def verify_and_save():
    """Save a verified question"""
    try:
        data = request.get_json()
        topic = data.get('topic')
        difficulty = data.get('difficulty')
        question = data.get('question')
        
        if not topic or not difficulty or not question:
            return jsonify({"error": "Missing required fields"}), 400
        
        server_difficulty = difficulty_mapping.get(difficulty, difficulty)
        saved_question = await gen_service.save_verified_question(topic, server_difficulty, question)
        
        if saved_question:
            return jsonify({
                "success": True,
                "message": "Question saved successfully",
                "question": saved_question
            }), 201
        else:
            return jsonify({"error": "Failed to save question"}), 500
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@gen_bp.route("/questions", methods=["GET"])
def get_all_questions():
    """Get all questions"""
    try:
        questions = gen_service.get_all_questions()
        return jsonify(questions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
