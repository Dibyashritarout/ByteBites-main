// --- Toast Notification System ---
const toastContainer = document.getElementById('toast-container');

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.textContent = message;

    if (toastContainer) {
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('hide');
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);
    }
}

// Add CSS for toast notifications to style.css (or include it here if preferred)
// .toast-container {
//     position: fixed;
//     bottom: 20px;
//     right: 20px;
//     z-index: 2000;
//     display: flex;
//     flex-direction: column-reverse;
//     gap: 10px;
// }
// .toast {
//     background: #333;
//     color: white;
//     padding: 10px 20px;
//     border-radius: 8px;
//     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
//     opacity: 1;
//     transform: translateX(0);
//     transition: opacity 0.3s ease, transform 0.3s ease;
//     font-size: 0.9rem;
//     min-width: 250px;
//     display: flex;
//     align-items: center;
// }
// .toast.hide {
//     opacity: 0;
//     transform: translateX(100%);
// }
// .toast.success { background: var(--success); }
// .toast.error { background: var(--danger); }
// .toast.warning { background: var(--warning); color: var(--text); }
// .toast.info { background: #2196F3; }


// --- Modal Handling ---
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        // Optional: Add an event listener to close modal on background click
        // modal.addEventListener('click', (e) => {
        //     if (e.target === modal) hideModal(modalId);
        // });
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}


// --- DOM Manipulation Helpers ---
function createHTMLElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    for (const key in attributes) {
        if (key.startsWith('on') && typeof attributes[key] === 'function') {
            element.addEventListener(key.substring(2).toLowerCase(), attributes[key]);
        } else {
            element.setAttribute(key, attributes[key]);
        }
    }
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
            element.appendChild(child);
        }
    });
    return element;
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}