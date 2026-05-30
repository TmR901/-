// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.maxHp = 10;
        this.hp = 10;
        this.maxMp = 5;
        this.mp = 5;
        this.atk = 4;
        this.def = 1;
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = 20;
        
        // Animation
        this.animationFrame = 0;
        this.direction = 0; // 0=down, 1=left, 2=right, 3=up
    }
    
    move(dx, dy, map) {
        const newX = this.x + dx;
        const newY = this.y + dy;
        
        // Check bounds
        if (newX < 0 || newX >= map.width || newY < 0 || newY >= map.height) {
            return;
        }
        
        // Check collision with walls
        if (map.isWalkable(newX, newY)) {
            this.x = newX;
            this.y = newY;
            
            // Update direction
            if (dy < 0) this.direction = 3; // up
            if (dy > 0) this.direction = 0; // down
            if (dx < 0) this.direction = 1; // left
            if (dx > 0) this.direction = 2; // right
        }
    }
    
    draw(ctx, tileSize) {
        const screenX = this.x * tileSize;
        const screenY = this.y * tileSize;
        
        // Simple player sprite (red square with face)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(screenX + 2, screenY + 2, tileSize - 4, tileSize - 4);
        
        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(screenX + 8, screenY + 8, 4, 4);
        ctx.fillRect(screenX + 20, screenY + 8, 4, 4);
        
        // Pupils
        ctx.fillStyle = '#000000';
        ctx.fillRect(screenX + 9, screenY + 9, 2, 2);
        ctx.fillRect(screenX + 21, screenY + 9, 2, 2);
    }
    
    attack() {
        const damage = this.atk + Math.floor(Math.random() * 4) - 1;
        return Math.max(1, damage);
    }
    
    takeDamage(damage) {
        const actualDamage = Math.max(1, damage - this.def);
        this.hp = Math.max(0, this.hp - actualDamage);
        return actualDamage;
    }
    
    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }
    
    gainExp(amount) {
        this.exp += amount;
        addLog(`${amount}の経験値を得た！`, 'success');
        
        if (this.exp >= this.expToNextLevel) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.exp = 0;
        this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5);
        
        // Stat increase
        this.maxHp += 5;
        this.hp = this.maxHp;
        this.maxMp += 2;
        this.mp = this.maxMp;
        this.atk += 2;
        this.def += 1;
        
        addLog(`レベルが${this.level}になった！`, 'success');
        addLog(`HP: +5 MP: +2 ATK: +2 DEF: +1`, 'success');
    }
}
