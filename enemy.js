// Enemy class
class Enemy {
    constructor(name, hp, atk, exp) {
        this.name = name;
        this.maxHp = hp;
        this.hp = hp;
        this.atk = atk;
        this.def = 0;
        this.exp = exp;
    }
    
    attack() {
        const damage = this.atk + Math.floor(Math.random() * 3) - 1;
        return Math.max(1, damage);
    }
    
    takeDamage(damage) {
        const actualDamage = Math.max(1, damage - this.def);
        this.hp = Math.max(0, this.hp - actualDamage);
        return actualDamage;
    }
    
    draw(ctx, x, y, width, height) {
        // Draw enemy sprite (green square)
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(x, y, width * 0.4, height * 0.4);
        
        // Draw HP bar
        ctx.fillStyle = '#333333';
        ctx.fillRect(x, y + height * 0.5, width * 0.4, 5);
        
        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = hpPercent > 0.3 ? '#00FF00' : '#FF0000';
        ctx.fillRect(x, y + height * 0.5, width * 0.4 * hpPercent, 5);
        
        // Draw name
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, x + width * 0.2, y + height - 10);
    }
}
