import json
import os
from uuid import uuid4

class QuestionModel:
    def __init__(self, file_path=None):
        # Use absolute path relative to the project directory
        if file_path is None:
            project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            file_path = os.path.join(project_dir, 'questions.json')
        self.file_path = file_path
        self.ensure_file_exists()
    
    def ensure_file_exists(self):
        """Ensure the questions.json file exists with empty structure"""
        if not os.path.exists(self.file_path):
            with open(self.file_path, 'w') as f:
                json.dump({}, f, indent=2)
    
    def load_questions(self):
        """Load questions from JSON file"""
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}
    
    def save_questions(self, data):
        """Save questions to JSON file"""
        with open(self.file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def is_duplicate(self, question, questions_by_topic):
        """Check if question already exists"""
        difficulties = ["Easy", "Medium", "Hard"]
        for difficulty in difficulties:
            questions = questions_by_topic.get(difficulty, [])
            for q in questions:
                if q.get('title') == question.get('title') or q.get('id') == question.get('id'):
                    return True
        return False
    
    def add_question(self, topic, difficulty, question):
        """Add a new question to storage"""
        questions = self.load_questions()
        
        if topic not in questions:
            questions[topic] = {
                "Easy": [],
                "Medium": [],
                "Hard": []
            }
        
        # Ensure question has ID
        if 'id' not in question or not question['id']:
            question['id'] = str(uuid4())
        
        # Check for duplicates
        if self.is_duplicate(question, questions[topic]):
            return question
        
        questions[topic][difficulty].append(question)
        self.save_questions(questions)
        return question
