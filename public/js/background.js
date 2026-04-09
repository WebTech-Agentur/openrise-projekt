/**
 * Animated Background Script for OpenRise
 * Provides a subtle, professional floating particle effect.
 */

class AnimatedBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 40;
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    getParticleColor() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        // Use primary color blue, more visible in light mode as requested
        return isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.35)';
    }

    init() {
        this.particles = [];
        const color = this.getParticleColor();
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.4,
                color: color
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update color based on theme
        const color = this.getParticleColor();
        
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            
            // Move
            p.x += p.dx;
            p.y += p.dy;
            
            // Wrap around
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
        });
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add canvas if missing
    if (!document.getElementById('bg-canvas')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'bg-canvas';
        document.body.prepend(canvas);
    }
    new AnimatedBackground();
});
