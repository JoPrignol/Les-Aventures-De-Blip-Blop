document.addEventListener("DOMContentLoaded", function () {
    const hautDivs = document.querySelectorAll('.haut div');
    const basDivs = document.querySelectorAll('.bas div');
    const scoreDisplay = document.querySelector('.affichage-score');
    const startButton = document.querySelector('.start');
    const finishButton = document.querySelector('.finish');
    const cursor = document.querySelector('.cursor');
    const cursorImg = document.querySelector('.cursor img');
    const lifeOne = document.getElementById('lifeOne');
    const lifeTwo = document.getElementById('lifeTwo');
    const lifeThree = document.getElementById('lifeThree');
    const spaceship = document.getElementById('spaceship-game-over');
    const victorySpaceship = document.getElementById('spaceship-game-won');
    let collisionCooldown = false; // Variable pour suivre si le cooldown est actif
    let score = 0;
    let lives = 3;
    let gameOver = false;
    let gameWon = false;
    let lastClickedButton = null;

    function isGameWon() {
        if (score >= 15){
            gameWon = true;
            console.log('Game Won!!!!');
            showSpaceshipGameWon()
            updateDivHeights()
            scoreDisplay.style.fontSize = "2vw";
            scoreDisplay.textContent = "Bravo ! Tu as réussi à activer les 15 portails! Clique sur le vaisseau pour conduire Blip-Blop chez lui!";
        }
        else{

        }
    }

    function getRandomHeight() {
        return Math.floor(Math.random() * (44 - 29 + 1) + 30); // Entre 30 et 44
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = 'Portails activés: ' + score;
        updateDivHeights();
    }

    function updateDivHeights() {
        console.log('Updating div heights. Game over:', gameOver);
        if (gameOver || gameWon) {
            // Si le jeu est terminé, fixez la hauteur à 20%
            hautDivs.forEach(function (div) {
                div.style.height = '20vh';
            });
    
            basDivs.forEach(function (div) {
                div.style.height = '20vh';
            });
        } else {
            // Sinon, mettez à jour les hauteurs de manière aléatoire
            hautDivs.forEach(function (div, index) {
                if (index === 0 || index === hautDivs.length - 1) {
                    div.style.height = '42%';
                } else {
                    div.style.height = getRandomHeight() + 'vh';
                }
            });
    
            basDivs.forEach(function (div, index) {
                if (index === 0 || index === basDivs.length - 1) {
                    div.style.height = '42%';
                } else {
                    div.style.height = getRandomHeight() + 'vh';
                }
            });
        }
    }
    

    function updateLifeImages() {
        if (lives === 2) {
            lifeThree.src = 'lives-2a.png'; // Affichage de la vie perdue
        }
    
        if (lives === 1) {
            lifeTwo.src = 'lives-2a.png';
        }
    
        if (gameOver === true) {
            lifeOne.src = 'lives-2a.png';
        }
    }

    function updateCursorPosition(event) {
        if (gameOver) {
            //document.body.style.cursor = 'auto'; // Rétablir le pointeur de la souris
            cursorImg.src = 'perso_2.png';
            //return; 
        }

        const cursorWidth = cursor.offsetWidth;
        const cursorHeight = cursor.offsetHeight;
        let cursorX = event.clientX - cursorWidth / 2;
        let cursorY = event.clientY - cursorHeight / 2;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

        // Vérifier la collision avec les divs de .haut
        hautDivs.forEach(function (div) {
            if (!collisionCooldown && isCollision(cursor, div)) {
                handleCollision();
            }
        });
        
        basDivs.forEach(function (div) {
            if (!collisionCooldown && isCollision(cursor, div)) {
                handleCollision();
            }
        });
        
        function handleCollision() {
            if (lives === 1 && !gameWon) {
                gameOver = true;
                console.log('Game over set to true');
                updateDivHeights();
                showSpaceshipGameOver()
                scoreDisplay.textContent = "Perdu...! Tu as activé " + score + " portails. Pour rejouer, clique sur le vaisseau !";
                //document.body.style.cursor = 'auto'; // Rétablir le pointeur de la souris
                updateLifeImages();
            } else if (lives >= 2 && !gameWon) {
                if (score > 0) {

                    score--; 
                }
                updateScoreDisplay();
                lives--;
                updateLifeImages();
            }
        
            collisionCooldown = true; // Activer le cooldown
            setTimeout(function () {
                collisionCooldown = false; // Désactiver le cooldown après 2 secondes
            }, 1000);
        }
    }

    document.addEventListener('mousemove', updateCursorPosition);
    document.body.style.cursor = 'none';

    // Fonction pour vérifier la collision entre deux éléments
    function isCollision(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        return (
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top &&
            rect1.left < rect2.right &&
            rect1.right > rect2.left
        );
    }

    // Désactiver les clics sur start et finish lorsque le jeu est terminé
    startButton.addEventListener('click', function () {
        if (!gameOver && lastClickedButton !== startButton) {
            score++;
            lastClickedButton = startButton;
            updateScoreDisplay();
            isGameWon()
            // Mettre en surbrillance en rose
            startButton.style.backgroundColor = '#ff8fbf';
            startButton.style.width = '4.3%';
            finishButton.style.backgroundColor = '#57f281'; // Rétablir la couleur verte pour l'autre bouton
            finishButton.style.width = '5.2%';
        }
    });

    finishButton.addEventListener('click', function () {
        if (!gameOver && lastClickedButton !== finishButton) {
            score++;
            lastClickedButton = finishButton;
            updateScoreDisplay();
            isGameWon()
            // Mettre en surbrillance en rose
            finishButton.style.backgroundColor = '#ff8fbf';
            finishButton.style.width = '4.3%';
            startButton.style.backgroundColor = '#57f281'; // Rétablir la couleur verte pour l'autre bouton
            startButton.style.width = '5.2%';
        }
    });

    function showSpaceshipGameOver() {
        if (gameOver) {
            spaceship.style.display = 'block';
            spaceship.classList.add('spaceship-transition'); // Ajoutez la classe de transition
            spaceship.style.pointerEvents = 'auto'; // Activer les événements de la souris pour l'élément spaceship
    
            // Ajouter un gestionnaire d'événement de clic pour recharger la page
            spaceship.addEventListener('click', handleSpaceshipClick);
    
            // Déclencher la transition en modifiant l'opacité
            setTimeout(() => {
                spaceship.style.opacity = 1;
            }, 300); // Utilisation de setTimeout pour forcer une nouvelle frame
        }
    }

    function handleSpaceshipClick(){
        location.reload();
        console.log('spaceship clicked')
    }

    spaceship.addEventListener('click', function () {
        handleSpaceshipClick()
    });

    function showSpaceshipGameWon() {
        if (gameWon) {
            victorySpaceship.style.display = 'block';
            victorySpaceship.classList.add('spaceship-game-won-transition'); // Ajoutez la classe de transition
            victorySpaceship.style.pointerEvents = 'auto'; // Activer les événements de la souris pour l'élément spaceship
    
            // Ajouter un gestionnaire d'événement de clic pour recharger la page
            victorySpaceship.addEventListener('click', handleVictorySpaceshipClick);
    
            // Déclencher la transition en modifiant l'opacité
            setTimeout(() => {
                victorySpaceship.style.opacity = 1;
            }, 300); // Utilisation de setTimeout pour forcer une nouvelle frame
        }
    }

    function handleVictorySpaceshipClick(){
        location.href = "end.html";
        console.log('victorySpaceship clicked')
    }

    spaceship.addEventListener('click', function () {
        handleVictorySpaceshipClick()
    });


});
