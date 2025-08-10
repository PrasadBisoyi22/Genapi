# GenAI Python Version

This is the Python version of the GenAI project, converted from JavaScript to Python using Flask.

## Features
- Generate coding questions using Google Gemini AI
- Save verified questions to JSON storage
- RESTful API endpoints
- Web-based frontend
- Support for different difficulty levels (Easy, Medium, Hard)

## Setup Instructions

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Google Gemini API key to `.env`

3. **Run the application:**
   ```bash
   python app.py
   ```

4. **Access the application:**
   - Frontend: http://localhost:5000
   - API endpoints:
     - POST /api/gen/question - Generate new question
     - POST /api/gen/verify - Save verified question
     - GET /api/gen/questions - Get all questions

## API Endpoints

- **Generate Question**: POST `/api/gen/question`
  - Body: `{"topic": "string", "difficulty": "string"}`
  - Returns: Generated question JSON

- **Save Question**: POST `/api/gen/verify`
  - Body: `{"topic": "string", "difficulty": "string", "question": {...}}`
  - Returns: Success response

- **Get All Questions**: GET `/api/gen/questions`
  - Returns: All questions in storage

## Project Structure
```
GenAi_with_py/
├── app.py                 # Main Flask application
├── config.py             # Configuration management
├── requirements.txt      # Python dependencies
├── questions.json        # Question storage
├── .env.example         # Environment variables template
├── routes/
│   └── gen_routes.py    # API routes
├── services/
│   └── gen_service.py   # Business logic and AI integration
├── models/
│   └── question_model.py # Data models and storage
├── index.html           # Frontend HTML
└── script.js            # Frontend JavaScript
```

## Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key
- `PORT`: Server port (default: 5000)
- `DEBUG`: Debug mode (default: True)
- `SECRET_KEY`: Flask secret key
