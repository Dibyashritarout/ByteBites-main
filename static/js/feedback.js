// Review and Feedback Modal Functions

// Open Review Modal
function openReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Review Modal
function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('reviewForm').reset();
    resetStars();
}

// Open Feedback Modal
function openFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Feedback Modal
function closeFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('feedbackForm').reset();
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('feedback-modal')) {
        if (e.target.id === 'reviewModal') {
            closeReviewModal();
        } else if (e.target.id === 'feedbackModal') {
            closeFeedbackModal();
        }
    }
});

// Star Rating System
let selectedRating = 0;

function initStarRating() {
    const stars = document.querySelectorAll('.star-rating i');
    
    stars.forEach(star => {
        // Click event
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            document.getElementById('ratingValue').value = selectedRating;
            updateStars(selectedRating);
        });
        
        // Hover event
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            updateStars(rating);
        });
    });
    
    // Reset on mouse leave
    document.querySelector('.star-rating').addEventListener('mouseleave', function() {
        updateStars(selectedRating);
    });
}

function updateStars(rating) {
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

function resetStars() {
    selectedRating = 0;
    document.getElementById('ratingValue').value = '';
    updateStars(0);
}

// Review Form Submission
document.addEventListener('DOMContentLoaded', function() {
    // Initialize star rating
    initStarRating();
    
    // Review Form
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const rating = document.getElementById('ratingValue').value;
            const name = document.getElementById('reviewerName').value;
            const review = document.getElementById('reviewText').value;
            
            if (!rating) {
                showMessage('Please select a rating!', 'error');
                return;
            }
            
            // Here you would typically send the data to your server
            console.log('Review submitted:', { rating, name, review });
            
            // Show success message
            showMessage('Thank you for your review! 🌟', 'success');
            
            // Close modal and reset form
            setTimeout(() => {
                closeReviewModal();
            }, 1500);
        });
    }
    
    // Feedback Form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const type = document.getElementById('feedbackType').value;
            const email = document.getElementById('feedbackEmail').value;
            const feedback = document.getElementById('feedbackText').value;
            
            // Here you would typically send the data to your server
            console.log('Feedback submitted:', { type, email, feedback });
            
            // Show success message
            showMessage('Thank you for your feedback! 💬', 'success');
            
            // Close modal and reset form
            setTimeout(() => {
                closeFeedbackModal();
            }, 1500);
        });
    }
});

// Show success/error message
function showMessage(message, type = 'success') {
    // Remove existing message if any
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const bgColor = type === 'success' 
        ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
        : 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)';
    
    messageDiv.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    messageDiv.style.background = bgColor;
    
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const reviewModal = document.getElementById('reviewModal');
        const feedbackModal = document.getElementById('feedbackModal');
        
        if (reviewModal.classList.contains('active')) {
            closeReviewModal();
        }
        if (feedbackModal.classList.contains('active')) {
            closeFeedbackModal();
        }
    }
});
