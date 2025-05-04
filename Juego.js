document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const attemptsDisplay = document.getElementById('attempts');
    const matchesDisplay = document.getElementById('matches');
    const resetBtn = document.getElementById('reset-btn');
    const winMessage = document.getElementById('win-message');
    const finalAttempts = document.getElementById('final-attempts');
    const playAgainBtn = document.getElementById('play-again-btn');

    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let attempts = 0;
    let matches = 0;
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

    // Inicializar juego
    function initGame() {
        const gameCards = [...emojis, ...emojis];
        gameCards.sort(() => 0.5 - Math.random());
        
        board.innerHTML = '';
        gameCards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            
            card.innerHTML = `
                <div class="card-face card-front">${emoji}</div>
                <div class="card-face card-back">?</div>
            `;
            
            card.addEventListener('click', flipCard);
            board.appendChild(card);
        });
        
        cards = Array.from(document.querySelectorAll('.card'));
        resetGameState();
    }

    // Voltear carta
    function flipCard() {
        if (lockBoard || this === firstCard || this.classList.contains('matched')) return;
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        secondCard = this;
        lockBoard = true;
        attempts++;
        updateScore();
        checkForMatch();
    }

    // Comprobar pareja
    function checkForMatch() {
        const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        isMatch ? disableCards() : unflipCards();
    }

    // Deshabilitar cartas emparejadas (MODIFICADO)
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        // Mostrar directamente sin animación
        firstCard.querySelector('.card-back').style.display = 'none';
        secondCard.querySelector('.card-back').style.display = 'none';
        firstCard.querySelector('.card-front').style.transform = 'rotateY(0deg)';
        secondCard.querySelector('.card-front').style.transform = 'rotateY(0deg)';
        
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        matches++;
        updateScore();
        checkWin();
        resetBoard();
    }

    // Voltear cartas no emparejadas
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    // Reiniciar estado del tablero
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // Reiniciar estado del juego
    function resetGameState() {
        attempts = 0;
        matches = 0;
        updateScore();
        winMessage.classList.remove('active');
    }

    // Actualizar marcador
    function updateScore() {
        attemptsDisplay.textContent = attempts;
        matchesDisplay.textContent = `${matches}/${emojis.length}`;
    }

    // Comprobar victoria
    function checkWin() {
        if (matches === emojis.length) {
            finalAttempts.textContent = attempts;
            setTimeout(() => winMessage.classList.add('active'), 500);
        }
    }

    // Event listeners
    resetBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', initGame);

    // Iniciar juego
    initGame();
});