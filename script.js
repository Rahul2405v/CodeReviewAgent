const API_URL = 'http://localhost:8000/review';

const codeInput = document.getElementById('codeInput');
const reviewBtn = document.getElementById('reviewBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const outputSection = document.getElementById('outputSection');
const errorSection = document.getElementById('errorSection');
const issuesList = document.getElementById('issuesList');
const improvedCode = document.getElementById('improvedCode');
const scoreCircle = document.getElementById('scoreCircle');
const scoreValue = document.getElementById('scoreValue');
const scoreText = document.getElementById('scoreText');
const errorMessage = document.getElementById('errorMessage');
const copyBtn = document.getElementById('copyBtn');

reviewBtn.addEventListener('click', handleReviewCode);
copyBtn.addEventListener('click', handleCopyCode);

async function handleReviewCode() {
    const code = codeInput.value.trim();
    
    if (!code) {
        showError('Please enter some code to review!');
        return;
    }
    
    hideError();
    hideOutput();
    setLoading(true);
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        displayResults(result);
        
    } catch (error) {
        console.error('Error:', error);
        showError(`Failed to connect to the API. Make sure the server is running on ${API_URL}`);
    } finally {
        setLoading(false);
    }
}

function displayResults(result) {
    issuesList.innerHTML = '';
    if (result.issues && result.issues.length > 0) {
        result.issues.forEach(issue => {
            const li = document.createElement('li');
            li.textContent = issue;
            issuesList.appendChild(li);
        });
    } else {
        issuesList.innerHTML = '<li style="border-left-color: #4caf50;">No issues found! 🎉</li>';
    }
    
    improvedCode.textContent = result.improved_code || 'No improvements suggested.';
    
    const score = result.quality_score || 0;
    scoreValue.textContent = score;
    updateScoreColor(score);
    scoreText.textContent = getScoreDescription(score);
    
    outputSection.classList.remove('hidden');
    
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateScoreColor(score) {
    if (score >= 85) {
        scoreCircle.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
    } else if (score >= 70) {
        scoreCircle.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
    } else {
        scoreCircle.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
    }
}

function getScoreDescription(score) {
    if (score >= 90) return 'Excellent code quality! 🌟';
    if (score >= 85) return 'Great job! Your code meets high standards.';
    if (score >= 70) return 'Good work, but there\'s room for improvement.';
    if (score >= 50) return 'Needs improvement. Review the suggestions.';
    return 'Major improvements needed. Please review carefully.';
}

function handleCopyCode() {
    const code = improvedCode.textContent;
    navigator.clipboard.writeText(code).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.style.background = '#4caf50';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy code to clipboard');
    });
}

function setLoading(isLoading) {
    if (isLoading) {
        reviewBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
    } else {
        reviewBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
}

function hideError() {
    errorSection.classList.add('hidden');
}

function hideOutput() {
    outputSection.classList.add('hidden');
}

const sampleCode = `def calculate_average(numbers):
    total = 0
    for i in range(len(numbers)):
        total = total + numbers[i]
    average = total / len(numbers)
    return average

nums = [10, 20, 30, 40, 50]
print("Average:", calculate_average(nums))`;

window.addEventListener('DOMContentLoaded', () => {
    const sampleBtn = document.createElement('button');
    sampleBtn.textContent = 'Load Sample Code';
    sampleBtn.className = 'btn-secondary';
    sampleBtn.style.marginLeft = '15px';
    sampleBtn.addEventListener('click', () => {
        codeInput.value = sampleCode;
    });
    reviewBtn.parentNode.insertBefore(sampleBtn, reviewBtn.nextSibling);
});
