document.addEventListener('DOMContentLoaded', function() {
            const formSection = document.getElementById('formSection');
            const loadingSection = document.getElementById('loadingSection');
            const resultSection = document.getElementById('resultSection');
            const generateBtn = document.getElementById('generateBtn');
            const newResponseBtn = document.getElementById('newResponseBtn');
            const resetBtn = document.getElementById('resetBtn');
            const topicInput = document.getElementById('topic');
            const difficultySelect = document.getElementById('difficulty');
            const resultContent = document.getElementById('resultContent');
            const verifiedSaveBtn = document.getElementById('verifiedSaveBtn');
            const cancelBtn = document.getElementById('cancelBtn');
            
            // API endpoint configuration
            const API_BASE_URL = window.location.origin;
            const API_ENDPOINT = '/api/gen/question';
            
            // Function to format difficulty for API
            function formatDifficultyForAPI(difficulty) {
                const mapping = {
                    'beginner': 'Easy',
                    'intermediate': 'Medium',
                    'advanced': 'Hard'
                };
                return mapping[difficulty] || 'Medium';
            }
            
            // Function to format difficulty for display
            function formatDifficultyForDisplay(difficulty) {
                const mapping = {
                    'Easy': 'Easy',
                    'Medium': 'Medium',
                    'Hard': 'Hard'
                };
                return mapping[difficulty] || difficulty;
            }
            
            // Function to generate content via API
            async function generateContentViaAPI(topic, difficulty) {
                try {
                    const response = await fetch(`${API_BASE_URL}${API_ENDPOINT}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            topic: topic,
                            difficulty: formatDifficultyForAPI(difficulty)
                        })
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error('Error generating content:', error);
                    throw error;
                }
            }
            
            // Function to display question in formatted way
            function displayQuestion(question) {
                return `
                    <div class="question-container">
                        <h3 class="text-xl font-bold mb-2">${question.title}</h3>
                        <p><strong>Topic:</strong> ${question.topic}</p>
                        <p><strong>Difficulty:</strong> ${formatDifficultyForDisplay(question.difficulty)}</p>
                        
                        <div class="question-description mt-4">
                            <h4 class="font-semibold">Description:</h4>
                            <p class="whitespace-pre-wrap">${question.description}</p>
                        </div>
                        
                        <div class="question-format mt-4">
                            <h4 class="font-semibold">Input Format:</h4>
                            <pre class="bg-gray-100 p-2 rounded">${question.input_format}</pre>
                            
                            <h4 class="font-semibold mt-2">Output Format:</h4>
                            <pre class="bg-gray-100 p-2 rounded">${question.output_format}</pre>
                        </div>
                        
                        <div class="question-constraints mt-4">
                            <h4 class="font-semibold">Constraints:</h4>
                            <p>${question.constraint}</p>
                        </div>
                        
                        <div class="question-example mt-4">
                            <h4 class="font-semibold">Example:</h4>
                            <p><strong>Input:</strong> ${question.example.input}</p>
                            <p><strong>Output:</strong> ${question.example.output}</p>
                        </div>
                        
                        <div class="question-test-cases mt-4">
                            <h4 class="font-semibold">Test Cases:</h4>
                            ${question.test_cases.map((test, index) => `
                                <div class="test-case mt-2">
                                    <p><strong>Test ${index + 1}:</strong></p>
                                    <p><strong>Input:</strong> ${test.input}</p>
                                    <p><strong>Output:</strong> ${test.output}</p>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="question-tags mt-4">
                            <strong>Tags:</strong> ${question.tags.join(', ')}
                        </div>
                    </div>
                `;
            }
            
            // Handle form submission
            generateBtn.addEventListener('click', async function() {
                const topic = topicInput.value.trim();
                const difficulty = difficultySelect.value;
                
                if (!topic || !difficulty) {
                    alert('Please enter both a topic and select a difficulty level');
                    return;
                }
                
                // Show loading state
                formSection.style.display = 'none';
                loadingSection.style.display = 'block';
                
                try {
                    const question = await generateContentViaAPI(topic, difficulty);
                    
                    // Display results
                    loadingSection.style.display = 'none';
                    resultSection.style.display = 'flex';
                    resultContent.innerHTML = displayQuestion(question);
                    
                    // Show verified save and cancel buttons
                    verifiedSaveBtn.style.display = 'inline-block';
                    cancelBtn.style.display = 'inline-block';
                    newResponseBtn.style.display = 'none';
                    resetBtn.style.display = 'none';
                    
                    // Store the current topic and difficulty for the "Another Response" functionality
                    resultSection.dataset.topic = topic;
                    resultSection.dataset.difficulty = difficulty;
                    resultSection.dataset.question = JSON.stringify(question);
                } catch (error) {
                    loadingSection.style.display = 'none';
                    formSection.style.display = 'block';
                    alert('Error generating content. Please try again.');
                    console.error('Error:', error);
                }
            });
            
            // Handle "Get Another Response" button
            newResponseBtn.addEventListener('click', async function() {
                const topic = resultSection.dataset.topic;
                const difficulty = resultSection.dataset.difficulty;
                
                if (!topic || !difficulty) {
                    alert('Error: Missing topic or difficulty');
                    return;
                }
                
                // Show loading state
                resultSection.style.display = 'none';
                loadingSection.style.display = 'block';
                
                try {
                    const question = await generateContentViaAPI(topic, difficulty);
                    
                    // Display results
                    loadingSection.style.display = 'none';
                    resultSection.style.display = 'flex';
                    resultContent.innerHTML = displayQuestion(question);
                    
                    // Hide verified save and cancel buttons
                    verifiedSaveBtn.style.display = 'none';
                    cancelBtn.style.display = 'none';
                    newResponseBtn.style.display = 'inline-block';
                    resetBtn.style.display = 'inline-block';
                } catch (error) {
                    loadingSection.style.display = 'none';
                    resultSection.style.display = 'flex';
                    alert('Error generating new content. Please try again.');
                    console.error('Error:', error);
                }
            });
            
            // Handle "Start Over" button
            resetBtn.addEventListener('click', function() {
                // Reset form
                topicInput.value = '';
                difficultySelect.selectedIndex = 0;
                
                // Hide results, show form
                resultSection.style.display = 'none';
                formSection.style.display = 'block';
                
                // Hide verified save and cancel buttons
                verifiedSaveBtn.style.display = 'none';
                cancelBtn.style.display = 'none';
                newResponseBtn.style.display = 'inline-block';
                resetBtn.style.display = 'inline-block';
            });
            
            // Handle "Verified and Save" button
            verifiedSaveBtn.addEventListener('click', async function() {
                const topic = resultSection.dataset.topic;
                const difficulty = resultSection.dataset.difficulty;
                const question = JSON.parse(resultSection.dataset.question);
                
                if (!topic || !difficulty || !question) {
                    alert('Error: Missing data to save');
                    return;
                }
                
                try {
                    const response = await fetch(`${API_BASE_URL}/api/gen/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ topic, difficulty, question }),
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    alert('Question saved successfully!');
                    
                    // Reset form and UI
                    resetBtn.click();
                } catch (error) {
                    alert('Failed to save question. Please try again.');
                    console.error('Error saving question:', error);
                }
            });
            
            // Handle "Cancel" button
            cancelBtn.addEventListener('click', function() {
                // Reset form and UI without saving
                resetBtn.click();
            });
        });
