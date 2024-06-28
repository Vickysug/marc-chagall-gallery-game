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
        
        const textGame = this.add.text(20, 510, ' Play the game: Find the hidden \nred paintbrushes in the Art Gallery\nthen paint a picture!', { font: 'bold 20px Times New Roman', fill: '#34eb92', wordWrap: { width: 760, useAdvancedWrap: true } });

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
        this.paintbrush.setScale(0.4);
        this.paintbrush.setOrigin(0.5, 1);
        this.paintbrush.setInteractive();
        this.paintbrush.alpha = 1;

        let hidingSpots = this.add.image(0, 0, 'hidingSpots');
        hidingSpots.setOrigin(0, 0);
        hidingSpots.displayWidth = this.sys.game.config.width;
        hidingSpots.displayHeight = this.sys.game.config.height;

        this.coordinatesText = this.add.text(10, 10, '', { fontSize: '16px', fill: '#fff' });

        this.input.on('pointermove', function (pointer) {
            this.coordinatesText.setText('');
        }, this);

        this.paintbrushDuration = 7500;
        this.paintbrushInterval = null;

        this.levelScore = 0;
        this.levelScoreText = this.add.text(this.sys.game.config.width - 10, 10, `SCORE: ${this.levelScore}`, { fontSize: '24px', fill: '#fff' });
        this.levelScoreText.setOrigin(1, 0);

        this.energy = 100;
        this.energyText = this.add.text(this.sys.game.config.width - 10, this.levelScoreText.y + this.levelScoreText.height + 10, `Timer: ${this.energy}`, { fontSize: '24px', fill: '#fff' });
        this.energyText.setOrigin(1, 0);

        const boxWidth = Math.max(this.levelScoreText.width, this.energyText.width) + 20;
        const boxHeight = (this.levelScoreText.height + this.energyText.height) + 30;
        this.infoBox = this.add.graphics();
        this.infoBox.fillStyle(0x000000, 0.5);
        this.infoBox.fillRect(this.levelScoreText.x - boxWidth, this.levelScoreText.y - 5, boxWidth, boxHeight);
        this.infoBox.setDepth(0);
        this.levelScoreText.setDepth(1);
        this.energyText.setDepth(1);

        this.energyDecrement = 1;
        this.energyTimer = 0;

        this.gameStartTime = 0;

        const screenHeight = this.sys.game.config.height;
        const paintbrushY = screenHeight * 0.9;
        this.paintbrush.setPosition(this.sys.game.config.width / 2, paintbrushY);

        this.input.mouse.disableContextMenu();
        

        // Add text in the center of the screen
        this.instructionText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Click the hiding paintbrush.', { fontSize: '32px', fill: '#fff' });
        this.instructionText.setOrigin(0.5, 0.5);

        const instructionBoxWidth = this.instructionText.width + 20;
        const instructionBoxHeight = this.instructionText.height + 20;
        this.instructionBox = this.add.graphics();
        this.instructionBox.fillStyle(0x000000, 0.5);
        this.instructionBox.fillRect(this.instructionText.x - instructionBoxWidth / 2, this.instructionText.y - instructionBoxHeight / 2, instructionBoxWidth, instructionBoxHeight);
        this.instructionBox.setDepth(0);
        this.instructionText.setDepth(1);

        // Add continue button
        this.continueButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 50, 'Continue', { fontSize: '24px', fill: '#fff', backgroundColor: '#000' });
        this.continueButton.setOrigin(0.5);
        this.continueButton.setInteractive();
        this.continueButton.on('pointerdown', this.startGame, this);

        this.gameStarted = false;

        this.paintbrush.on('pointerdown', () => {
            if (this.energy > 0) {
                const canTeleport = this.setpaintbrushToRandomPositionOutsideRects();
                if (canTeleport) {
                    clearInterval(this.paintbrushInterval);
                    this.levelScore++;
                    this.levelScoreText.setText(`SCORE: ${this.levelScore}`);
                    this.levelScoreText.setFill('#ffff00');
                    this.levelScoreYellowTimer = 1000;
                    this.paintbrush.alpha *= 0.92;
                    this.paintbrushInterval = setInterval(() => {
                        this.setpaintbrushToRandomPositionOutsideRects();
                    }, this.paintbrushDuration);
                }
            }
        });

        this.input.on('pointerdown', (pointer) => {
            if (this.paintbrush.getBounds().contains(pointer.x, pointer.y) && this.energy > 0) {
                const canTeleport = this.setpaintbrushToRandomPositionOutsideRects();
                if (canTeleport) {
                    clearInterval(this.paintbrushInterval);
                    this.levelScore++;
                    this.levelScoreText.setText(`Score: ${this.levelScore}`);
                    this.levelScoreText.setFill('#ffff00');
                    this.levelScoreYellowTimer = 1000;
                    this.paintbrush.alpha *= 0.92;
                    this.paintbrushInterval = setInterval(() => {
                        this.setpaintbrushToRandomPositionOutsideRects();
                    }, this.paintbrushDuration);
                }
            } else if (this.energy > 0) {
                this.energy -= this.energyDecrement;
                this.energyText.setText(`Timer: ${this.energy}`);
            }
        });
    }

    startGame() {
        if (!this.gameStarted) {
            this.input.mouse.enabled = true;
            this.paintbrush.setScale(0.2);
            this.instructionText.destroy();
            this.instructionBox.destroy();
            this.continueButton.destroy();
            this.setpaintbrushToRandomPositionOutsideRects();
            this.paintbrushInterval = setInterval(() => {
                this.setpaintbrushToRandomPositionOutsideRects();
            }, this.paintbrushDuration);
            this.gameStarted = true;
            this.gameStartTime = new Date().getTime();
        }
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
            { x1: 0, y1: 0, x2: 0, y2: this.sys.game.config.height },
            { x1: this.sys.game.config.width, y1: 0, x2: this.sys.game.config.width, y2: this.sys.game.config.height },
            { x1: 0, y1: 0, x2: this.sys.game.config.width, y2: 0 },
            { x1: 0, y1: this.sys.game.config.height, x2: this.sys.game.config.width, y2: this.sys.game.config.height }
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
        if (this.energyTimer >= 1000) {
            if (this.energy > 0 && this.paintbrushInterval !== null) {
                this.energy -= this.energyDecrement;
                this.energyText.setText(`Timer: ${this.energy}`);
            }
            if (this.energy <= 0) {
                clearInterval(this.paintbrushInterval);
                this.input.mouse.enabled = false;
                this.paintbrush.setScale(0.4);
                this.paintbrush.alpha = 1;
                const screenHeight = this.sys.game.config.height;
                const paintbrushY = screenHeight * 0.9;
                this.paintbrush.setPosition(this.sys.game.config.width / 2, paintbrushY);
                
                this.gameOverText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Times up! Now you have paintbrushes, \n go to the studio and paint a picture!.', { fontSize: '32px', fill: '#fff' });
                this.gameOverText.setOrigin(0.5, 0.5);

                const gameOverBoxWidth = this.gameOverText.width + 20;
                const gameOverBoxHeight = this.gameOverText.height + 20;
                this.gameOverBox = this.add.graphics();
                this.gameOverBox.fillStyle(0x000000, 0.5);
                this.gameOverBox.fillRect(this.gameOverText.x - gameOverBoxWidth / 2, this.gameOverText.y - gameOverBoxHeight / 2, gameOverBoxWidth, gameOverBoxHeight);
                this.gameOverBox.setDepth(0);
                this.gameOverText.setDepth(1);

                this.energyText.destroy();

                this.levelScoreText.setText(`SCORE: ${this.levelScore}`);
                this.levelScoreText.setFontSize('32px');

                this.input.mouse.disableContextMenu();
                this.input.mouse.enabled = false;
                this.input.keyboard.enabled = false;

                this.time.delayedCall(3000, () => {
                    this.scene.start('SceneThree', { score: this.levelScore });
                });
            }
            this.energyTimer = 0;
        }

        if (this.levelScoreYellowTimer > 0) {
            this.levelScoreYellowTimer -= delta;
            if (this.levelScoreYellowTimer <= 0) {
                this.levelScoreText.setFill('#ffffff');
            }
        }
    }
}

class SceneThree extends Phaser.Scene
{
    constructor ()
    {
        super('SceneThree');
    }

    init(data)
    {
        this.score = data.score;
    }

    create ()
    {
        this.add.text(400, 300, 'Painting App', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        
        const paintingApp = `
        <div id="paintingApp" style="width: 100%; height: 100%; background-color: #F5F5F5; font-family: sans-serif;">
            <h4 style="text-align: center; margin: 20px; font-family: 'Open Sans', sans-serif;">Paint a picture! Choose a colour and begin! <img src="https://play.rosebud.ai/assets/paintbrush.tiny.png?d2OD" alt="" class="paint" style="padding-top: 2px;"></h4>
            <canvas id="mainCanvas" style="background: #FFF; display: block; margin: 40px auto 10px; border-radius: 5px; border: 1px solid #E0E0E0; box-shadow: 0 4px 0 0 #E0E0E0; cursor: crosshair;"></canvas>

            <div class="controls" style="min-height: 60px; margin: 0 auto; width: 100%; border-radius: 5px; overflow: hidden;">
                <ul style="list-style:none; margin: 0; float: left; padding: 10px 0 20px; width: 100%; text-align: center;">
                    <li class="red selected" style="display: inline-block; height: 54px; width: 54px; border-radius: 60px; cursor: pointer; border: 0; box-shadow: 0 3px 0 0 #E0E0E0; background: #E74C3C; margin: 0 5px 10px;"></li>
                    <li class="blue" style="display: inline-block; height: 54px; width: 54px; border-radius: 60px; cursor: pointer; border: 0; box-shadow: 0 3px 0 0 #E0E0E0; background: #3498DB; margin: 0 5px 10px;"></li>
                    <li class="yellow" style="display: inline-block; height: 54px; width: 54px; border-radius: 60px; cursor: pointer; border: 0; box-shadow: 0 3px 0 0 #E0E0E0; background: #F1C40F; margin: 0 5px 10px;"></li>
                </ul>
                <button id="clear" onclick='clearCanvas()' style="background: #818380; box-shadow: 0 3px 0 0 #818380; color: #050505; outline: none; cursor: pointer; text-shadow: 0 1px #6A845F; display: block; font-size: 16px; line-height: 40px; border: none; border-radius: 5px; margin: 10px auto; padding: 0 20px; width: 160px; height: 40px;">Clear Canvas</button>
                <button id="revealColorSelect" style="background: #818380; box-shadow: 0 3px 0 0 #818380; color: #050505; outline: none; cursor: pointer; text-shadow: 0 1px #6A845F; display: block; font-size: 16px; line-height: 40px; border: none; border-radius: 5px; margin: 10px auto; padding: 5px 20px; width: 160px;">New Colour</button>
                <div id="colorSelect" style="display: none; background: #fff; border-radius: 5px; clear: both; margin: 20px auto 0; padding: 10px; width: 305px; position: relative; border: 1px solid #E0E0E0;">
                    <span id="newColor" style="width: 80px; height: 80px; border-radius: 3px; float: left; margin: 10px 20px 20px 10px;"></span>
                    <div class="sliders">
                        <p>
                            <label for="red" style="display: inline-block; margin: 0 10px 0 0; width: 35px; font-size: 14px; color: #6D574E;">Red</label>
                            <input id="red" name="red" type="range" min=0 max=255 value=0 style="position: relative; top: 2px;">
                        </p>
                        <p>
                            <label for="green" style="display: inline-block; margin: 0 10px 0 0; width: 35px; font-size: 14px; color: #6D574E;">Green</label>
                            <input id="green" name="green" type="range" min=0 max=255 value=0 style="position: relative; top: 2px;">
                        </p>
                        <p>
                            <label for="blue" style="display: inline-block; margin: 0 10px 0 0; width: 35px; font-size: 14px; color: #6D574E;">Blue</label>
                            <input id="blue" name="blue" type="range" min=0 max=255 value=0 style="position: relative; top: 2px;">
                        </p>
                    </div>
                    <div>
                        <button id="addNewColor" style="background: #818380; box-shadow: 0 3px 0 0 #818380; color: #050505; outline: none; cursor: pointer; text-shadow: 0 1px #6A845F; display: block; font-size: 16px; line-height: 40px; border: none; border-radius: 0 0 5px 5px; clear: both; margin: 10px -10px -7px; padding: 5px 10px; width: 325px;">Add Colour</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        const element = this.add.dom(400, 300).createFromHTML(paintingApp);
        element.addListener('click');

        element.on('click', function (event) {
            if (event.target.id === 'clear') {
                const canvas = document.getElementById('mainCanvas');
                const context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        });

        this.add.text(400, 580, `Your score: ${this.score}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        const scriptElement = document.createElement('script');
        scriptElement.textContent = `
            var colour = "rgb(231, 76, 60)";
            var canvas = document.getElementById("mainCanvas");
            var context = canvas.getContext("2d");
            var lastEvent;
            var mouseDown = false;

            function resizeCanvas() {
                var containerWidth = document.getElementById('paintingApp').offsetWidth;
                var containerHeight = document.getElementById('paintingApp').offsetHeight;
                canvas.width = containerWidth * 0.9;
                canvas.height = containerHeight * 0.6;
            }

            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            document.querySelector(".controls").addEventListener("click", function(e) {
                if (e.target.tagName === "LI") {
                    document.querySelector(".selected").classList.remove("selected");
                    e.target.classList.add("selected");
                    colour = window.getComputedStyle(e.target).getPropertyValue("background-color");
                }
            });

            document.getElementById("revealColorSelect").addEventListener("click", function() {
                changeColor();
                document.getElementById("colorSelect").style.display = document.getElementById("colorSelect").style.display === "none" ? "block" : "none";
            });

            function changeColor() {
                var r = document.getElementById("red").value;
                var g = document.getElementById("green").value;
                var b = document.getElementById("blue").value;
                document.getElementById("newColor").style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
            }

            document.querySelectorAll("input[type=range]").forEach(function(slider) {
                slider.addEventListener("change", changeColor);
            });

            document.getElementById("addNewColor").addEventListener("click", function() {
                var newColor = document.createElement("li");
                newColor.style.backgroundColor = document.getElementById("newColor").style.backgroundColor;
                document.querySelector(".controls ul").appendChild(newColor);
                newColor.click();
            });

            function getMousePos(canvas, evt) {
                var rect = canvas.getBoundingClientRect();
                return {
                    x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
                    y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
                };
            }

            function getTouchPos(canvas, evt) {
                var rect = canvas.getBoundingClientRect();
                return {
                    x: (evt.touches[0].clientX - rect.left) / (rect.right - rect.left) * canvas.width,
                    y: (evt.touches[0].clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
                };
            }

            canvas.addEventListener("mousedown", function(e) {
                lastEvent = getMousePos(canvas, e);
                mouseDown = true;
            });

            canvas.addEventListener("mousemove", function(e) {
                if (mouseDown) {
                    var mousePos = getMousePos(canvas, e);
                    draw(mousePos.x, mousePos.y);
                }
            });

            canvas.addEventListener("mouseup", function() {
                mouseDown = false;
            });

            canvas.addEventListener("mouseleave", function() {
                mouseDown = false;
            });

            canvas.addEventListener("touchstart", function(e) {
                e.preventDefault();
                lastEvent = getTouchPos(canvas, e);
                mouseDown = true;
            });

            canvas.addEventListener("touchmove", function(e) {
                e.preventDefault();
                if (mouseDown) {
                    var touchPos = getTouchPos(canvas, e);
                    draw(touchPos.x, touchPos.y);
                }
            });

            canvas.addEventListener("touchend", function(e) {
                e.preventDefault();
                mouseDown = false;
            });

            function draw(x, y) {
                context.beginPath();
                context.moveTo(lastEvent.x, lastEvent.y);
                context.lineTo(x, y);
                context.strokeStyle = colour;
                context.lineWidth = 5;
                context.lineCap = 'round';
                context.stroke();
                lastEvent = { x: x, y: y };
            }

            function clearCanvas() {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        `;
        document.body.appendChild(scriptElement);
    }
}

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
    dom: {
        createContainer: true
    },
    scene: [SceneOne, SceneTwo, SceneThree]
};

window.phaserGame = new Phaser.Game(config);