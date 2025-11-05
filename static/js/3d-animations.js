// 3D Animation JavaScript

// Create Particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random starting position
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        
        // Random movement
        const moveX = (Math.random() - 0.5) * 200;
        const moveY = (Math.random() - 0.5) * 200;
        
        particle.style.left = startX + '%';
        particle.style.top = startY + '%';
        particle.style.setProperty('--tx', moveX + 'px');
        particle.style.setProperty('--ty', moveY + 'px');
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (5 + Math.random() * 10) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Mouse Parallax Effect
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    const floatingIcons = document.querySelectorAll('.food-icon');
    const rings = document.querySelectorAll('.ring');
    const depthLayers = document.querySelectorAll('.depth-layer');
    
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    function updateParallax() {
        // Smooth interpolation
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        
        const percentX = (targetX / window.innerWidth - 0.5) * 2;
        const percentY = (targetY / window.innerHeight - 0.5) * 2;
        
        // Move floating icons
        floatingIcons.forEach((icon, index) => {
            const speed = parseFloat(icon.getAttribute('data-speed')) || 2;
            const x = percentX * 30 * speed;
            const y = percentY * 30 * speed;
            const rotateX = percentY * 20;
            const rotateY = percentX * 20;
            
            icon.style.transform = `
                translate(${x}px, ${y}px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        });
        
        // Move rings
        rings.forEach((ring, index) => {
            const multiplier = (index + 1) * 10;
            const x = percentX * multiplier;
            const y = percentY * multiplier;
            
            ring.style.transform = `
                translate(${x}px, ${y}px)
                rotateX(${60 + percentY * 10}deg)
            `;
        });
        
        // Update depth layers
        depthLayers.forEach((layer, index) => {
            const depth = (index + 1) * 5;
            const x = percentX * depth;
            const y = percentY * depth;
            
            layer.style.transform = `translate(${x}px, ${y}px)`;
            layer.style.setProperty('--mouse-x', (mouseX / window.innerWidth * 100) + '%');
            layer.style.setProperty('--mouse-y', (mouseY / window.innerHeight * 100) + '%');
        });
        
        requestAnimationFrame(updateParallax);
    }
    
    // Mouse move event
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Touch move event for mobile
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    });
    
    updateParallax();
}

// Gyroscope Support for Mobile
function initGyroscope() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (event) => {
            const beta = event.beta; // -180 to 180 (front to back tilt)
            const gamma = event.gamma; // -90 to 90 (left to right tilt)
            
            const floatingIcons = document.querySelectorAll('.food-icon');
            
            floatingIcons.forEach((icon) => {
                const speed = parseFloat(icon.getAttribute('data-speed')) || 2;
                const x = (gamma / 90) * 30 * speed;
                const y = ((beta - 90) / 90) * 30 * speed;
                
                icon.style.transform = `
                    translate(${x}px, ${y}px)
                    rotateX(${beta}deg)
                    rotateY(${gamma}deg)
                `;
            });
        });
    }
}

// Typing Animation for Subtitle
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize Subtitle Animation
function initSubtitle() {
    const subtitle = document.getElementById('animatedSubtitle');
    if (subtitle) {
        const messages = [
            'Delicious meals delivered to your door 🚀',
            'Experience culinary excellence 🍽️',
            'Your favorite food, just a click away 💫'
        ];
        
        let currentIndex = 0;
        
        function showNextMessage() {
            const message = messages[currentIndex];
            typeWriter(subtitle, message, 80);
            currentIndex = (currentIndex + 1) % messages.length;
        }
        
        showNextMessage();
        setInterval(showNextMessage, 5000);
    }
}

// Food Icon Interaction
function initFoodIconInteraction() {
    const foodIcons = document.querySelectorAll('.food-icon');
    
    foodIcons.forEach((icon) => {
        icon.addEventListener('click', () => {
            icon.style.animation = 'none';
            setTimeout(() => {
                icon.style.animation = '';
            }, 10);
            
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 2px solid rgba(255, 255, 255, 0.5);
                transform: translate(-50%, -50%);
                animation: ripple 1s ease-out;
                pointer-events: none;
            `;
            
            const rect = icon.getBoundingClientRect();
            ripple.style.left = rect.left + rect.width / 2 + 'px';
            ripple.style.top = rect.top + rect.height / 2 + 'px';
            
            document.body.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    });
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        0% {
            width: 20px;
            height: 20px;
            opacity: 1;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize all 3D animations
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing 3D animations...');
    
    // Create particles
    createParticles();
    
    // Initialize parallax effect
    initParallax();
    
    // Initialize gyroscope for mobile
    initGyroscope();
    
    // Initialize subtitle animation
    initSubtitle();
    
    // Initialize food icon interactions
    initFoodIconInteraction();
    
    console.log('✨ 3D animations ready!');
});

// Smooth scroll reveal for food icons
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0.7';
            entry.target.style.animation = 'float3D 6s ease-in-out infinite';
        }
    });
}, observerOptions);

// Observe food icons
document.addEventListener('DOMContentLoaded', () => {
    const foodIcons = document.querySelectorAll('.food-icon');
    foodIcons.forEach((icon) => observer.observe(icon));
});
