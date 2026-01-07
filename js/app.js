class PythagoreanLesson {
    constructor() {
        this.canvas = document.getElementById('triangleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.sideA = 3;
        this.sideB = 4;
        this.currentTheme = 'default';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.drawTriangle();
        this.updateCalculation();
        this.loadThemePreference();
    }

    setupEventListeners() {
        // Theme switcher
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTheme(e.target.dataset.theme);
            });
        });

        // Slider controls
        const sideASlider = document.getElementById('sideA');
        const sideBSlider = document.getElementById('sideB');
        
        sideASlider.addEventListener('input', (e) => {
            this.sideA = parseFloat(e.target.value);
            document.getElementById('sideAValue').textContent = this.sideA;
            this.drawTriangle();
            this.updateCalculation();
            this.addInteractiveState(e.target);
        });

        sideBSlider.addEventListener('input', (e) => {
            this.sideB = parseFloat(e.target.value);
            document.getElementById('sideBValue').textContent = this.sideB;
            this.drawTriangle();
            this.updateCalculation();
            this.addInteractiveState(e.target);
        });

        // Calculator
        document.getElementById('calculateBtn').addEventListener('click', (e) => {
            this.calculateHypotenuse();
            this.addInteractiveState(e.target);
        });

        // Practice problems
        document.querySelectorAll('.check-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const problemNum = e.target.dataset.problem;
                this.checkAnswer(problemNum);
                this.addInteractiveState(e.target);
            });
        });

        // Add interactive states to all interactive elements
        document.querySelectorAll('.interactive-element').forEach(element => {
            element.addEventListener('focus', (e) => this.addInteractiveState(e.target));
            element.addEventListener('blur', (e) => this.removeInteractiveState(e.target));
            element.addEventListener('mouseenter', (e) => this.addInteractiveState(e.target));
            element.addEventListener('mouseleave', (e) => this.removeInteractiveState(e.target));
        });

        // Allow Enter key for calculator
        ['calcA', 'calcB'].forEach(id => {
            document.getElementById(id).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.calculateHypotenuse();
                    this.addInteractiveState(e.target);
                }
            });
        });
    }

    switchTheme(themeName) {
        // Remove all theme classes
        document.body.classList.remove('theme-warm', 'theme-classical', 'theme-royal');
        
        // Add new theme class if not default
        if (themeName !== 'default') {
            document.body.classList.add(`theme-${themeName}`);
        }
        
        // Update active button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme="${themeName}"]`).classList.add('active');
        
        // Save preference
        this.currentTheme = themeName;
        localStorage.setItem('pythagorean-theme', themeName);
        
        // Redraw canvas with new theme colors
        this.drawTriangle();
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('pythagorean-theme');
        if (savedTheme && savedTheme !== 'default') {
            this.switchTheme(savedTheme);
        }
    }

    addInteractiveState(element) {
        element.classList.add('active');
        setTimeout(() => {
            if (element.matches(':focus') || element.matches(':hover')) {
                element.classList.add('active');
            }
        }, 10);
    }

    removeInteractiveState(element) {
        if (!element.matches(':focus') && !element.matches(':hover')) {
            element.classList.remove('active');
        }
    }

    drawTriangle() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate scale to fit triangle in canvas
        const padding = 30;
        const maxSide = Math.max(this.sideA, this.sideB);
        const scale = (Math.min(canvas.width, canvas.height) - 2 * padding) / maxSide;
        
        // Calculate triangle points
        const x1 = padding;
        const y1 = canvas.height - padding;
        const x2 = x1 + this.sideA * scale;
        const y2 = y1;
        const x3 = x1;
        const y3 = y1 - this.sideB * scale;
        
        // Get current theme colors
        const styles = getComputedStyle(document.body);
        const primaryColor = styles.getPropertyValue('--theme-primary').trim();
        const secondaryColor = styles.getPropertyValue('--theme-secondary').trim();
        const accentColor = styles.getPropertyValue('--theme-accent').trim();
        
        // Draw triangle
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        
        // Fill triangle with subtle color
        ctx.fillStyle = secondaryColor + '20'; // Add transparency
        ctx.fill();
        
        // Draw triangle outline
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw right angle indicator
        const squareSize = 15;
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1 + squareSize, y1);
        ctx.lineTo(x1 + squareSize, y1 - squareSize);
        ctx.lineTo(x1, y1 - squareSize);
        ctx.stroke();
        
        // Label sides
        ctx.fillStyle = primaryColor;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        
        // Side A label
        ctx.fillText(`a = ${this.sideA}`, (x1 + x2) / 2, y1 + 20);
        
        // Side B label
        ctx.save();
        ctx.translate(x1 - 20, (y1 + y3) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`b = ${this.sideB}`, 0, 0);
        ctx.restore();
        
        // Hypotenuse label
        const hypotenuse = Math.sqrt(this.sideA * this.sideA + this.sideB * this.sideB);
        ctx.save();
        const midX = (x2 + x3) / 2;
        const midY = (y2 + y3) / 2;
        const angle = Math.atan2(y3 - y2, x3 - x2);
        ctx.translate(midX, midY);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(`c = ${hypotenuse.toFixed(2)}`, 0, -8);
        ctx.restore();
    }

    updateCalculation() {
        const hypotenuse = Math.sqrt(this.sideA * this.sideA + this.sideB * this.sideB);
        document.getElementById('sideCValue').textContent = hypotenuse.toFixed(2);
        
        // Show verification
        const verification = document.getElementById('verification');
        const leftSide = (this.sideA * this.sideA + this.sideB * this.sideB).toFixed(2);
        const rightSide = (hypotenuse * hypotenuse).toFixed(2);
        
        verification.innerHTML = `Verification: ${this.sideA}² + ${this.sideB}² = ${leftSide} ≈ ${rightSide} = ${hypotenuse.toFixed(2)}²`;
        verification.style.color = '#48bb78';
    }

    calculateHypotenuse() {
        const sideA = parseFloat(document.getElementById('calcA').value);
        const sideB = parseFloat(document.getElementById('calcB').value);
        const resultDiv = document.getElementById('calcResult');
        
        if (isNaN(sideA) || isNaN(sideB) || sideA <= 0 || sideB <= 0) {
            resultDiv.innerHTML = 'Please enter valid positive numbers for both sides.';
            resultDiv.style.display = 'block';
            resultDiv.style.background = '#fed7d7';
            resultDiv.style.color = '#742a2a';
            return;
        }
        
        const hypotenuse = Math.sqrt(sideA * sideA + sideB * sideB);
        resultDiv.innerHTML = `
            <strong>Result:</strong><br>
            For a right triangle with sides ${sideA} and ${sideB}:<br>
            ${sideA}² + ${sideB}² = ${(sideA * sideA).toFixed(2)} + ${(sideB * sideB).toFixed(2)} = ${(sideA * sideA + sideB * sideB).toFixed(2)}<br>
            √${(sideA * sideA + sideB * sideB).toFixed(2)} = <strong>${hypotenuse.toFixed(2)}</strong><br>
            The hypotenuse is ${hypotenuse.toFixed(2)} units.
        `;
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#c6f6d5';
        resultDiv.style.color = '#22543d';
    }

    checkAnswer(problemNum) {
        const userAnswer = parseFloat(document.getElementById(`answer${problemNum}`).value);
        const feedbackDiv = document.getElementById(`feedback${problemNum}`);
        
        if (isNaN(userAnswer) || userAnswer <= 0) {
            feedbackDiv.innerHTML = 'Please enter a valid positive number.';
            feedbackDiv.className = 'feedback incorrect';
            feedbackDiv.style.display = 'block';
            return;
        }
        
        let correctAnswer;
        let explanation;
        
        if (problemNum === '1') {
            correctAnswer = 10; // √(6² + 8²) = √(36 + 64) = √100 = 10
            explanation = `6² + 8² = 36 + 64 = 100, so √100 = 10`;
        } else if (problemNum === '2') {
            correctAnswer = 13; // √(5² + 12²) = √(25 + 144) = √169 = 13
            explanation = `5² + 12² = 25 + 144 = 169, so √169 = 13`;
        }
        
        const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.1;
        
        if (isCorrect) {
            feedbackDiv.innerHTML = `✓ Correct! ${explanation}`;
            feedbackDiv.className = 'feedback correct';
        } else {
            feedbackDiv.innerHTML = `✗ Not quite. The correct answer is ${correctAnswer}. ${explanation}`;
            feedbackDiv.className = 'feedback incorrect';
        }
        
        feedbackDiv.style.display = 'block';
    }
}

// Initialize the lesson when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PythagoreanLesson();
});
