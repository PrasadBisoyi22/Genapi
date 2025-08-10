import google.generativeai as genai
import json
from uuid import uuid4
from models.question_model import QuestionModel

class GenService:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        self.question_model = QuestionModel()
    
    def _format_prompt(self, topic, difficulty):
        """Format prompt for Gemini AI"""
        return f"""
You are an intelligent coding question generator.

Your job is to create an **entirely new, original, high-quality coding problem**. You MUST NOT copy, rephrase, or base the problem on any previously known or commonly available problems.

⛔ STRICT RULES you must follow:
1. The question must be **100% unique** and never generated before, even for the same topic/difficulty.
2. The logic, use-case, data structure, and real-world context must be different from any prior problem.
3. If you repeat or slightly modify a previous problem, it is considered INVALID.
4. Do NOT hallucinate or leave placeholder values — all fields must be real and meaningful.
5. Never include filler content, markdown (like ```), explanations, or instructions — ONLY return pure JSON.

Return only raw JSON in the following format:

{{
  "id": "",  
  "difficulty": "{difficulty}",
  "topic": "{topic}",
  "title": "",
  "description": "",
  "input_format": "",
  "output_format": "",
  "constraint": "",
  "example": {{
    "input": "",
    "output": ""
  }},
  "test_cases": [
    {{
      "input": "",
      "output": ""
    }},
    {{
      "input": "",
      "output": ""
    }}
  ],
  "tags": ["{topic}", "{difficulty}"]
}}

Respond ONLY with JSON (no markdown, no explanation).
"""
    
    async def generate_coding_question(self, topic, difficulty):
        """Generate a new coding question using Gemini AI"""
        prompt = self._format_prompt(topic, difficulty)
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            
            # Clean unwanted formatting
            text = text.replace("```json", "").replace("```", "").strip()
            
            try:
                question = json.loads(text)
            except json.JSONDecodeError:
                print("❌ Invalid JSON from Gemini:", text)
                return None
            
            if not question.get('id'):
                question['id'] = str(uuid4())
            
            return question
        except Exception as e:
            print(f"❌ Error during Gemini generation: {e}")
            return None
    
    async def save_verified_question(self, topic, difficulty, question):
        """Save a verified question to storage"""
        return self.question_model.add_question(topic, difficulty, question)
    
    def get_all_questions(self):
        """Get all questions from storage"""
        return self.question_model.load_questions()
