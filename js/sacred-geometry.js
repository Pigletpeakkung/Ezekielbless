function createSacredPattern(tradition) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.className = 'sacred-canvas';
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    const center = size / 2;

    // Tradition-specific designs
    switch(tradition) {
        case 'christian':
            // Cross pattern
            ctx.strokeStyle = 'rgba(52, 152, 219, 0.7)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(center, center - 60);
            ctx.lineTo(center, center + 60);
            ctx.moveTo(center - 60, center);
            ctx.lineTo(center + 60, center);
            ctx.stroke();
            break;

        case 'buddhist':
            // Dharma wheel
            ctx.strokeStyle = 'rgba(241, 196, 15, 0.7)';
            ctx.beginPath();
            ctx.arc(center, center, 60, 0, Math.PI * 2);
            ctx.stroke();
            for(let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4;
                ctx.beginPath();
                ctx.moveTo(center, center);
                ctx.lineTo(center + Math.cos(angle) * 60, center + Math.sin(angle) * 60);
                ctx.stroke();
            }
            break;

        default:
            // Flower of Life (default)
            ctx.beginPath();
            for(let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                ctx.arc(center + Math.cos(angle) * 50, center + Math.sin(angle) * 50, 50, 0, 2 * Math.PI);
            }
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
    }

    return canvas;
}

function animateSacredGeometry(tradition) {
    const pattern = createSacredPattern(tradition);
    document.body.appendChild(pattern);

    gsap.fromTo(pattern, 
        {
            scale: 0,
            rotation: 0,
            opacity: 0
        },
        {
            scale: 1.5,
            rotation: 360,
            opacity: 1,
            duration: 2,
            ease: "elastic.out(1, 0.3)",
            onComplete: () => {
                gsap.to(pattern, {
                    opacity: 0,
                    scale: 2,
                    duration: 0.5,
                    onComplete: () => pattern.remove()
                });
            }
    });
}

function animateGlowOverlay() {
    gsap.to("#glowOverlay", {
        opacity: 0.5,
        duration: 0.5,
        yoyo: true,
        repeat: 1
    });
}
