let questions = [];
let currentQuiz = [];
let currentIndex = 0;

const setupSection = document.getElementById('setup-section');
const quizSection = document.getElementById('quiz-section');
const topicSelect = document.getElementById('topic-select');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedback = document.getElementById('feedback');

// Load questions using fetch
fetch('data/questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        populateTopics();
    });

function populateTopics() {
    const topics = [...new Set(questions.map(q => q.topic))];
    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic;
        topicSelect.appendChild(option);
    });
}

document.getElementById('start-btn').addEventListener('click', () => {
    const selected = topicSelect.value;
    currentQuiz = selected === 'all' ? questions : questions.filter(q => q.topic === selected);
    currentIndex = 0;
    setupSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    showQuestion();
});

function showQuestion() {
    feedback.classList.add('hidden');
    optionsContainer.innerHTML = '';
    const q = currentQuiz[currentIndex];
    questionText.textContent = q.question;

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex) {
    const q = currentQuiz[currentIndex];
    const resultText = document.getElementById('result-text');
    const isCorrect = selectedIndex === q.answerIndex;

    resultText.textContent = isCorrect ? "✅ Correct!" : "❌ Incorrect.";
    resultText.className = isCorrect ? "correct" : "wrong";
    document.getElementById('explanation-text').textContent = q.explanation;
    feedback.classList.remove('hidden');
    
    // Disable all option buttons after answer
    Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);
}

document.getElementById('next-btn').onclick = () => {
    currentIndex++;
    if (currentIndex < currentQuiz.length) {
        showQuestion();
    } else {
        alert("Quiz complete!");
        location.reload();
    }
};