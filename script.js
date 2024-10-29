function animate() {
    // Use a transparent fill to ensure the background image is visible
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach(firework => {
        firework.update();
        firework.draw();
    });

    requestAnimationFrame(animate);
}

// Handle name input and greeting
function showGreeting() {
    const userName = document.getElementById('userName').value.trim();
    if (userName) {
        document.getElementById('name-input').style.display = 'none';
        document.getElementById('greeting').style.display = 'block';
        document.getElementById('userGreeting').textContent = userName;
    }
}

// Handle Enter key press
document.getElementById('userName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        showGreeting();
    }
});

// Ensure these classes are defined in your script.js
class Firework {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height * 0.5);
        this.speed = 2 + Math.random() * 2;
        this.particles = [];
        this.exploded = false;
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        if (this.exploded && this.particles.length === 0) {
            this.reset();
        }
    }

    explode() {
        this.exploded = true;
        for (let i = 0; i < 50; i++) {
            this.particles.push(new Particle(this.x, this.y));
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
        }

        this.particles.forEach(particle => particle.draw());
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 5;
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.alpha = 1;
        this.decay = 0.015 + Math.random() * 0.015;
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    }

    update() {
        this.velocity.y += 0.05;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// Initialize canvas and context
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize fireworks
const fireworks = Array(5).fill().map(() => new Firework());

// Ensure the animate function is called
animate();
