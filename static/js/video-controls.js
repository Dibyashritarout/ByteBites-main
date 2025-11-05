// Video Background Controls with 3D Parallax Effect
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('heroVideo');
    const videoControl = document.getElementById('videoControl');
    const heroSection = document.querySelector('.hero-section');
    const videoBackground = document.querySelector('.video-background');
    const heroContent = document.querySelector('.hero-content');
    
    // Video play/pause controls
    if (video && videoControl) {
        let isPlaying = true;
        
        videoControl.addEventListener('click', function() {
            if (isPlaying) {
                video.pause();
                videoControl.innerHTML = '<i class="fas fa-play"></i>';
                isPlaying = false;
            } else {
                video.play();
                videoControl.innerHTML = '<i class="fas fa-pause"></i>';
                isPlaying = true;
            }
        });
        
        // Handle video errors - fallback to background image
        video.addEventListener('error', function() {
            console.log('Video failed to load, using background image');
            if (videoBackground) {
                videoBackground.style.background = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/static/images/backgrounds/hero-background.jpg") no-repeat center center';
                videoBackground.style.backgroundSize = 'cover';
            }
        });
    }
    
    // 3D Parallax Effect on Mouse Move
    if (heroSection && videoBackground) {
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        
        // Mouse move for desktop
        heroSection.addEventListener('mousemove', function(e) {
            const rect = heroSection.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = (e.clientY - rect.top) / rect.height;
            
            // Center the coordinates (-0.5 to 0.5)
            targetX = (mouseX - 0.5) * 2;
            targetY = (mouseY - 0.5) * 2;
            
            // Update cursor glow position
            const glowX = e.clientX - rect.left - 150;
            const glowY = e.clientY - rect.top - 150;
            heroSection.style.setProperty('--glow-x', glowX + 'px');
            heroSection.style.setProperty('--glow-y', glowY + 'px');
            heroSection.classList.add('active');
            
            // Apply 3D transforms
            requestAnimationFrame(updateParallax);
        });
        
        // Touch support for mobile
        heroSection.addEventListener('touchmove', function(e) {
            const touch = e.touches[0];
            const rect = heroSection.getBoundingClientRect();
            mouseX = (touch.clientX - rect.left) / rect.width;
            mouseY = (touch.clientY - rect.top) / rect.height;
            
            targetX = (mouseX - 0.5) * 2;
            targetY = (mouseY - 0.5) * 2;
            
            requestAnimationFrame(updateParallax);
        });
        
        // Gyroscope effect for mobile devices
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function(e) {
                if (e.beta !== null && e.gamma !== null) {
                    // Beta is front-to-back tilt (-180 to 180)
                    // Gamma is left-to-right tilt (-90 to 90)
                    targetX = (e.gamma / 90) * 0.5;
                    targetY = (e.beta / 180) * 0.5;
                    
                    requestAnimationFrame(updateParallax);
                }
            });
        }
        
        // Reset on mouse leave
        heroSection.addEventListener('mouseleave', function() {
            targetX = 0;
            targetY = 0;
            heroSection.classList.remove('active');
            requestAnimationFrame(updateParallax);
        });
        
        // Reset on touch end
        heroSection.addEventListener('touchend', function() {
            targetX = 0;
            targetY = 0;
            requestAnimationFrame(updateParallax);
        });
        
        function updateParallax() {
            // Video background moves opposite to mouse (parallax effect)
            const moveX = targetX * 20;
            const moveY = targetY * 20;
            const rotateX = -targetY * 5;
            const rotateY = targetX * 5;
            
            if (video) {
                video.style.transform = `translate(-50%, -50%) translateX(${moveX}px) translateY(${moveY}px) scale(1.1)`;
            }
            
            if (videoBackground) {
                videoBackground.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
            
            // Animate depth layers with different speeds
            const depthLayers = document.querySelectorAll('.depth-layer');
            depthLayers.forEach((layer, index) => {
                const speed = (index + 1) * 0.5;
                const layerMoveX = targetX * 15 * speed;
                const layerMoveY = targetY * 15 * speed;
                const layerZ = 20 + (index * 20);
                layer.style.transform = `translateX(${layerMoveX}px) translateY(${layerMoveY}px) translateZ(${layerZ}px)`;
            });
            
            // Content moves with mouse (creates depth)
            if (heroContent) {
                const contentMoveX = targetX * 10;
                const contentMoveY = targetY * 10;
                heroContent.style.transform = `translateX(${contentMoveX}px) translateY(${contentMoveY}px) translateZ(50px)`;
            }
        }
    }
    
    // Smooth scroll animation on page load
    window.addEventListener('load', function() {
        if (heroContent) {
            heroContent.style.opacity = '1';
        }
    });
});
