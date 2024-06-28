class SceneOne extends Phaser.Scene {
    constructor() {
        super('SceneOne');
    }

    preload() {
        this.load.image('marcChagall', 'https://play.rosebud.ai/assets/marc-chagall.jpg?JZtJ');
        this.load.image('artOne', 'https://play.rosebud.ai/assets/the-blue-circus.png?UrgG');
        this.load.image('artTwo', 'https://play.rosebud.ai/assets/The-Dance-and-the-Circus.png?m2Id');
        this.load.image('artThree', 'https://play.rosebud.ai/assets/the-green-donkey.png?96RT');
    }

    create() {
        
        const textArtOne = this.add.text(300, 300, 'The Blue Circus 1950', { font: 'bold 15px Times New Roman', fill: '#34eb92', wordWrap: { width: 760, useAdvancedWrap: true } });
        const textArtTwo = this.add.text(535, 300, 'The Dance & The Circus 1950', { font: 'bold 15px Times New Roman', fill: '#34eb92', wordWrap: { width: 760, useAdvancedWrap: true } });
        const textArtThree = this.add.text(590, 490, 'The Green Donkey 1911', { font: 'bold 15px Times New Roman', fill: '#34eb92', wordWrap: { width: 760, useAdvancedWrap: true } });
        const textLabe2 = this.add.text(20, 300, 'Marc Chagall 1887-1985 ', { font: 'bold 18px Courier New', fill: '#ffffff', wordWrap: { width: 760, useAdvancedWrap: true } });
        const textLabel = this.add.text(20, 340, '1910 - 1913 Painted scenes of jewish life on the shtetl.\n\n 1922 Left Russia for France. \n\n 1922 - 1928 Achieved fame in France.  \n\n1938 - 1945 His art turned darker during the war. \n\n 1941 Fled France to escape the holocaust. \n\n 1977 Exhibited at the Louvre; awarded Legion d Honneur', { font: 'bold 15px Courier New', fill: '#ffffff', wordWrap: { width: 760, useAdvancedWrap: true } });
        
        const textGame = this.add.text(20, 540, ' Play the game: Find the hidden \nred paintbrushes in the Art Gallery!', { font: 'bold 20px Times New Roman', fill: '#34eb92', wordWrap: { width: 760, useAdvancedWrap: true } });

        this.add.image(130, 150, 'marcChagall').setScale(0.9);
        this.add.image(400, 150, 'artOne').setScale(0.5);
        this.add.image(650, 150, 'artTwo').setScale(0.5);
        this.add.image(670, 410, 'artThree').setScale(0.3);


        console.log(textLabel);

        const startButton = this.add.text(500, 540, 'Start Game', { font: 'bold 40px Arial', fill: '#ffffff' });
        startButton.setInteractive();

        startButton.on('pointerdown', () => {
            console.log('Proceed button clicked');
            this.scene.start('SceneTwo');
        });
    }
}

class SceneTwo extends Phaser.Scene
{
    constructor ()
    {
        super('SceneTwo');
    }
    
    preload ()
    {
        this.load.image('gallery', 'https://play.rosebud.ai/assets/art-gallery.jpg?jgjB');
        this.load.image('paintbrush', 'https://play.rosebud.ai/assets/paintbrush.png?zfoN');
        this.load.image('hidingSpots', 'https://play.rosebud.ai/assets/hiding-spot3.png?SIUW');
    }

    create ()
    {
        let bg = this.add.image(0, 0, 'gallery');
        bg.setOrigin(0, 0);
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;

        this.paintbrush = this.add.image(0, 0, 'paintbrush');
        this.paintbrush.setScale(0.4); // Twice the original size (0.2)
        this.paintbrush.setOrigin(0.5, 1); // Center the rotation and position the image at the bottom
        this.paintbrush.setInteractive();
        this.paintbrush.alpha = 1; // Set initial transparency to fully opaque

        let hidingSpots = this.add.image(0, 0, 'hidingSpots');
        hidingSpots.setOrigin(0, 0);
        hidingSpots.displayWidth = this.sys.game.config.width;
        hidingSpots.displayHeight = this.sys.game.config.height;

        this.coordinatesText = this.add.text(10, 10, '', { fontSize: '16px', fill: '#fff' });

        this.input.on('pointermove', function (pointer) {
            this.coordinatesText.setText('');
        }, this);

        this.paintbrushDuration = 7500; // paintbrush swaps position every 7.5 seconds
        this.paintbrushInterval = null; // Initialize paintbrushInterval as null

        this.levelScore = 0;
        this.levelScoreText = this.add.text(this.sys.game.config.width - 10, 10, `SCORE: ${this.levelScore}`, { fontSize: '24px', fill: '#fff' });
        this.levelScoreText.setOrigin(1, 0); // Align text to the top right

        this.energy = 100;
        this.energyText = this.add.text(this.sys.game.config.width - 10, this.levelScoreText.y + this.levelScoreText.height + 10, `Timer: ${this.energy}`, { fontSize: '24px', fill: '#fff' });
        this.energyText.setOrigin(1, 0); // Align text to the top right

        const boxWidth = Math.max(this.levelScoreText.width, this.energyText.width) + 20; // Add some padding
        const boxHeight = (this.levelScoreText.height + this.energyText.height) + 30; // Add some padding
        this.infoBox = this.add.graphics();
        this.infoBox.fillStyle(0x000000, 0.5); // Semi-transparent black box
        this.infoBox.fillRect(this.levelScoreText.x - boxWidth, this.levelScoreText.y - 5, boxWidth, boxHeight);
        this.infoBox.setDepth(0); // Set the depth of the box behind the text
        this.levelScoreText.setDepth(1); // Set the depth of the text in front of the box
        this.energyText.setDepth(1); // Set the depth of the text in front of the box

        this.energyDecrement = 1; // Decrement energy by 1 every second
        this.energyTimer = 0; // Track the time elapsed since the last energy decrement

        this.gameStartTime = 0; // Track the time when the game started

        // Position the paintbrush at 10% from the bottom of the screen
        const screenHeight = this.sys.game.config.height;
        const paintbrushY = screenHeight * 0.9; // 10% from the bottom
        this.paintbrush.setPosition(this.sys.game.config.width / 2, paintbrushY);

        // Disable mouse buttons
        this.input.mouse.disableContextMenu();
        this.input.mouse.enabled = false;

        // Start the game immediately upon pressing ENTER
        this.input.keyboard.on('keydown-ENTER', () => {
            if (!this.gameStarted) {
                this.input.mouse.enabled = true; // Enable mouse buttons
                this.paintbrush.setScale(0.2); // Revert to original size
                this.instructionText.destroy();
                this.instructionBox.destroy();
                this.setpaintbrushToRandomPositionOutsideRects();
                this.paintbrushInterval = setInterval(() => {
                    this.setpaintbrushToRandomPositionOutsideRects();
                }, this.paintbrushDuration);
                this.gameStarted = true;
                this.gameStartTime = new Date().getTime(); // Record the game start time
            }
        });

        // Add text in the center of the screen
        this.instructionText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Click the hiding paintbrush.\nPress ENTER to start.', { fontSize: '32px', fill: '#fff' });
        this.instructionText.setOrigin(0.5, 0.5); // Center the text

        const instructionBoxWidth = this.instructionText.width + 20; // Add some padding
        const instructionBoxHeight = this.instructionText.height + 20; // Add some padding
        this.instructionBox = this.add.graphics();
        this.instructionBox.fillStyle(0x000000, 0.5); // Semi-transparent black box
        this.instructionBox.fillRect(this.instructionText.x - instructionBoxWidth / 2, this.instructionText.y - instructionBoxHeight / 2, instructionBoxWidth, instructionBoxHeight);
        this.instructionBox.setDepth(0); // Set the depth of the box behind the text
        this.instructionText.setDepth(1); // Set the depth of the text in front of the box

        this.gameStarted = false; // Flag to track if the game has started

        this.paintbrush.on('pointerdown', () => {
            if (this.energy > 0) { // Only allow clicks if energy is above 0
                const canTeleport = this.setpaintbrushToRandomPositionOutsideRects();
                if (canTeleport) {
                    clearInterval(this.paintbrushInterval);
                    this.levelScore++;
                    this.levelScoreText.setText(`SCORE: ${this.levelScore}`);
                    this.levelScoreText.setFill('#ffff00'); // Set text color to yellow
                    this.levelScoreYellowTimer = 1000; // Set the timer for 1 second
                    this.paintbrush.alpha *= 0.92; // Decrease transparency by 8%
                    this.paintbrushInterval = setInterval(() => {
                        this.setpaintbrushToRandomPositionOutsideRects();
                    }, this.paintbrushDuration);
                }
            }
        });

        this.input.on('pointerdown', (pointer) => {
            if (this.paintbrush.getBounds().contains(pointer.x, pointer.y) && this.energy > 0) { // Only allow clicks if energy is above 0
                const canTeleport = this.setpaintbrushToRandomPositionOutsideRects();
                if (canTeleport) {
                    clearInterval(this.paintbrushInterval);
                    this.levelScore++;
                    this.levelScoreText.setText(`Score: ${this.levelScore}`);
                    this.levelScoreText.setFill('#ffff00'); // Set text color to yellow
                    this.levelScoreYellowTimer = 1000; // Set the timer for 1 second
                    this.paintbrush.alpha *= 0.92; // Decrease transparency by 8%
                    this.paintbrushInterval = setInterval(() => {
                        this.setpaintbrushToRandomPositionOutsideRects();
                    }, this.paintbrushDuration);
                }
            } else if (this.energy > 0) { // Only decrement energy if it's above 0
                this.energy -= this.energyDecrement;
                this.energyText.setText(`Timer: ${this.energy}`);
            }
        });
    }

    setpaintbrushToRandomPositionOutsideRects() {
        let randomX, randomY;
        
        const rectangles = [
            { x1: 232, y1: 557, x2: 0, y2: 599 },
            { x1: 319, y1: 320, x2: 510, y2: 255 },
            { x1: 328, y1: 354, x2: 604, y2: 596 },
            { x1: 798, y1: 240, x2: 520, y2: 0 },
            { x1: 530, y1: 0, x2: 798, y2: 240 },
            { x1: 106, y1: 323, x2: 0, y2: 599 },
            { x1: 472, y1: 281, x2: 799, y2: 0 },
            { x1: 80, y1: 324, x2: 0, y2: 220 },
            { x1: 263, y1: 335, x2: 536, y2: 253 },
            { x1: 225, y1: 506, x2: 0, y2: 599 },
            { x1: 428, y1: 313, x2: 799, y2: 0 },
            { x1: 233, y1: 378, x2: 466, y2: 241 },
            { x1: 244, y1: 599, x2: 498, y2: 436 },
            { x1: 591, y1: 308, x2: 257, y2: 337 },
            { x1: 613, y1: 304, x2: 453, y2: 144 },
            { x1: 586, y1: 319, x2: 799, y2: 0 },
            { x1: 347, y1: 203, x2: 799, y2: 138 },
            { x1: 286, y1: 238, x2: 457, y2: 198 },
            { x1: 0, y1: 0, x2: 0, y2: this.sys.game.config.height }, // Left edge
            { x1: this.sys.game.config.width, y1: 0, x2: this.sys.game.config.width, y2: this.sys.game.config.height }, // Right edge
            { x1: 0, y1: 0, x2: this.sys.game.config.width, y2: 0 }, // Top edge
            { x1: 0, y1: this.sys.game.config.height, x2: this.sys.game.config.width, y2: this.sys.game.config.height } // Bottom edge
        ];

        const isInside = (x, y, rectangle) =>
            x >= Math.min(rectangle.x1, rectangle.x2) && x <= Math.max(rectangle.x1, rectangle.x2) &&
            y >= Math.min(rectangle.y1, rectangle.y2) && y <= Math.max(rectangle.y1, rectangle.y2);

        const ispaintbrushInsideRect = (x, y, width, height, rectangle) => {
            const paintbrushRect = {
                x1: x - width / 2,
                y1: y - height,
                x2: x + width / 2,
                y2: y
            };
            return (isInside(paintbrushRect.x1, paintbrushRect.y1, rectangle) ||
                    isInside(paintbrushRect.x1, paintbrushRect.y2, rectangle) ||
                    isInside(paintbrushRect.x2, paintbrushRect.y1, rectangle) ||
                    isInside(paintbrushRect.x2, paintbrushRect.y2, rectangle) ||
                    paintbrushRect.x1 < 0 || paintbrushRect.x2 >= this.sys.game.config.width ||
                    paintbrushRect.y1 < 0 || paintbrushRect.y2 >= this.sys.game.config.height);
        }

        const isWithinpaintbrushDistance = (x, y, prevX, prevY, paintbrushWidth, paintbrushHeight) => {
            const dx = Math.abs(x - prevX);
            const dy = Math.abs(y - prevY);
            const paintbrushDiagonalDistance = Math.sqrt(paintbrushWidth * paintbrushWidth + paintbrushHeight * paintbrushHeight);
            return dx < paintbrushWidth && dy < paintbrushHeight || Math.sqrt(dx * dx + dy * dy) < paintbrushDiagonalDistance;
        }
        
        let canTeleport = false;
        const prevpaintbrushX = this.paintbrush.x;
        const prevpaintbrushY = this.paintbrush.y;
        do {
            randomX = Math.random() * this.sys.game.config.width;
            randomY = Math.random() * this.sys.game.config.height;
            canTeleport = !rectangles.some(rectangle => ispaintbrushInsideRect(randomX, randomY, this.paintbrush.displayWidth, this.paintbrush.displayHeight, rectangle)) &&
                          !isWithinpaintbrushDistance(randomX, randomY, prevpaintbrushX, prevpaintbrushY, this.paintbrush.displayWidth, this.paintbrush.displayHeight);
        } while (!canTeleport);

        this.paintbrush.setPosition(randomX, randomY);
        return canTeleport;
    }

    update (time, delta)
    {
        this.energyTimer += delta;
        if (this.energyTimer >= 1000) { // 1 second has elapsed
            if (this.energy > 0 && this.paintbrushInterval !== null) { // Only decrement energy when the paintbrush is on his hiding routine and energy is above 0
                this.energy -= this.energyDecrement;
                this.energyText.setText(`Timer: ${this.energy}`);
            }
            if (this.energy <= 0) { // If energy falls below or equal to 0
                clearInterval(this.paintbrushInterval); // Stop the paintbrush from moving
                this.input.mouse.enabled = false; // Disable all mouse clicks
                this.paintbrush.setScale(0.4); // Return the paintbrush to its default spot and size
                this.paintbrush.alpha = 1; // Restore the paintbrush's transparency to fully opaque
                // Position the paintbrush at 10% from the bottom of the screen
                const screenHeight = this.sys.game.config.height;
                const paintbrushY = screenHeight * 0.9; // 10% from the bottom
                this.paintbrush.setPosition(this.sys.game.config.width / 2, paintbrushY);
                
                // Add text in the center of the screen
                this.gameOverText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Time is up! Now you have paintbrushes, \n go to the studio and paint a picture!.', { fontSize: '32px', fill: '#fff' });
                this.gameOverText.setOrigin(0.5, 0.5); // Center the text

                const gameOverBoxWidth = this.gameOverText.width + 20; // Add some padding
                const gameOverBoxHeight = this.gameOverText.height + 20; // Add some padding
                this.gameOverBox = this.add.graphics();
                this.gameOverBox.fillStyle(0x000000, 0.5); // Semi-transparent black box
                this.gameOverBox.fillRect(this.gameOverText.x - gameOverBoxWidth / 2, this.gameOverText.y - gameOverBoxHeight / 2, gameOverBoxWidth, gameOverBoxHeight);
                this.gameOverBox.setDepth(0); // Set the depth of the box behind the text
                this.gameOverText.setDepth(1); // Set the depth of the text in front of the box

                // Remove "Clicker Energy" text
                this.energyText.destroy();

                // Replace "LEVEL / SCORE" with "SCORE" and double the size
                this.levelScoreText.setText(`SCORE: ${this.levelScore}`);
                this.levelScoreText.setFontSize('32px');

                // Prevent the game state from changing after the game ends
                this.input.mouse.disableContextMenu();
                this.input.mouse.enabled = false;
                this.input.keyboard.enabled = false;
            }
            this.energyTimer = 0; // Reset the timer
        }

        // Reset the LEVEL / SCORE text color to white after 1 second
        if (this.levelScoreYellowTimer > 0) {
            this.levelScoreYellowTimer -= delta;
            if (this.levelScoreYellowTimer <= 0) {
                this.levelScoreText.setFill('#ffffff'); // Set text color back to white
            }
        }
    }
}

class SceneThree extends Phaser.Scene
{
    constructor ()
    {
        super('SceneThree');
    }}

const container = document.getElementById('renderDiv');
const config = {
    type: Phaser.AUTO,
    parent: 'renderDiv',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0.5 },
            debug: false
        }
    },
    scene: [SceneOne, SceneTwo, SceneThree ]
};

window.phaserGame = new Phaser.Game(config);