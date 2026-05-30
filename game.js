// Main game class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = 32;
        
        // Game state
        this.gameState = 'map'; // 'map' or 'battle'
        this.player = new Player(5, 5);
        this.currentMap = new Map(this.tileSize);
        this.currentBattle = null;
        
        // Input
        this.keys = {};
        this.setupInput();
        
        // Game loop
        this.frameCount = 0;
        this.encounterChance = 0.02; // 2% chance per frame
        
        this.run();
    }
    
    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    update() {
        if (this.gameState === 'map') {
            this.updateMap();
        } else if (this.gameState === 'battle') {
            this.updateBattle();
        }
    }
    
    updateMap() {
        // Player movement
        if (this.keys['ArrowUp']) {
            this.player.move(0, -1, this.currentMap);
        }
        if (this.keys['ArrowDown']) {
            this.player.move(0, 1, this.currentMap);
        }
        if (this.keys['ArrowLeft']) {
            this.player.move(-1, 0, this.currentMap);
        }
        if (this.keys['ArrowRight']) {
            this.player.move(1, 0, this.currentMap);
        }
        
        // Random encounter
        if (Math.random() < this.encounterChance && this.player.x > 5) {
            const enemy = this.createRandomEnemy();
            this.startBattle(enemy);
        }
    }
    
    updateBattle() {
        if (this.currentBattle) {
            if (this.keys[' ']) {
                this.currentBattle.playerAttack();
                this.keys[' '] = false;
                
                if (this.currentBattle.enemy.hp <= 0) {
                    this.endBattle(true);
                } else {
                    setTimeout(() => {
                        this.currentBattle.enemyAttack();
                        
                        if (this.player.hp <= 0) {
                            this.endBattle(false);
                        }
                    }, 500);
                }
            }
        }
    }
    
    createRandomEnemy() {
        const enemyTypes = [
            { name: 'スライム', hp: 3, atk: 2, exp: 5 },
            { name: 'ゴブリン', hp: 5, atk: 3, exp: 10 },
            { name: 'ドラゴン', hp: 15, atk: 6, exp: 30 }
        ];
        
        const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        return new Enemy(type.name, type.hp, type.atk, type.exp);
    }
    
    startBattle(enemy) {
        this.gameState = 'battle';
        this.currentBattle = new Battle(this.player, enemy);
        addLog(`${enemy.name} が現れた！`, 'battle');
    }
    
    endBattle(victory) {
        if (victory) {
            const exp = this.currentBattle.enemy.exp;
            this.player.gainExp(exp);
            addLog(`戦闘に勝利した！ ${exp}の経験値を得た！`, 'success');
        } else {
            addLog('全滅してしまった...', 'battle');
            this.player.hp = this.player.maxHp;
        }
        
        this.gameState = 'map';
        this.currentBattle = null;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameState === 'map') {
            this.drawMap();
        } else if (this.gameState === 'battle') {
            this.drawBattle();
        }
    }
    
    drawMap() {
        // Draw map
        this.currentMap.draw(this.ctx, this.tileSize);
        
        // Draw player
        this.player.draw(this.ctx, this.tileSize);
    }
    
    drawBattle() {
        if (this.currentBattle) {
            this.currentBattle.draw(this.ctx, this.canvas.width, this.canvas.height);
        }
    }
    
    run() {
        const gameLoop = () => {
            this.update();
            this.draw();
            this.frameCount++;
            requestAnimationFrame(gameLoop);
        };
        
        gameLoop();
    }
}

// Utility function for logging
function addLog(message, type = 'info') {
    const logDiv = document.getElementById('log');
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    logDiv.appendChild(messageEl);
    logDiv.scrollTop = logDiv.scrollHeight;
    
    // Keep only last 20 messages
    while (logDiv.children.length > 20) {
        logDiv.removeChild(logDiv.firstChild);
    }
}

// Update UI display
function updateUI() {
    document.getElementById('hp').textContent = game.player.hp;
    document.getElementById('mp').textContent = game.player.mp;
    document.getElementById('level').textContent = game.player.level;
    document.getElementById('exp').textContent = game.player.exp;
}

// Start the game
let game;
window.addEventListener('load', () => {
    game = new Game();
    // Update UI every frame
    setInterval(updateUI, 100);
    addLog('ゲーム開始！矢印キーで移動', 'info');
    addLog('敵に遭遇したらスペースキーで攻撃', 'info');
});
