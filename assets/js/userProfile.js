// User profile management system for single user
class UserProfile {
    constructor() {
        this.currentUser = null;
        // Predefined user credentials and details
        this.validUser = {
            email: "user@example.com",
            password: "password123",
            name: "John Doe",
            phone: "123-456-7890",
            orders: [
                {
                    id: "001",
                    date: new Date('2024-01-15'),
                    items: ["Fried Calamari", "Spaghetti Bolognese"],
                    total: 29.00,
                    status: "delivered"
                },
                {
                    id: "002",
                    date: new Date('2024-01-20'),
                    items: ["Falafel Plate"],
                    total: 10.00,
                    status: "delivered"
                }
            ],
            preferences: {
                dietary: "None",
                favorites: ["Spaghetti Bolognese", "Fried Calamari"]
            },
            joinDate: new Date('2023-12-01'),
            lastLogin: null
        };
    }

    // Login user
    login(email, password) {
        if (email === this.validUser.email && password === this.validUser.password) {
            this.currentUser = {...this.validUser};
            this.currentUser.lastLogin = new Date();
            this.saveToLocalStorage();
            return {
                success: true,
                message: "Login successful"
            };
        }
        return {
            success: false,
            message: "Invalid email or password. Please try again."
        };
    }

    // Add order to user history
    addOrder(orderDetails) {
        if (this.currentUser) {
            const order = {
                id: Date.now().toString(),
                ...orderDetails,
                date: new Date(),
                status: 'pending'
            };
            this.currentUser.orders.push(order);
            this.saveToLocalStorage();
            return order.id;
        }
        throw new Error('No user logged in');
    }

    // Get user's order history
    getOrderHistory() {
        return this.currentUser ? this.currentUser.orders : [];
    }

    // Save to localStorage
    saveToLocalStorage() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    // Load from localStorage
    loadFromLocalStorage() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    // Logout current user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // Get user details
    getUserDetails() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Initialize profile management
const profileManager = new UserProfile();
profileManager.loadFromLocalStorage();

// Event listeners for DOM elements
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const profileSection = document.getElementById('profile-section');
    const userDetailsSection = document.getElementById('user-details');
    const orderHistorySection = document.getElementById('order-history');
    const logoutBtn = document.getElementById('logout-btn');
    const loginError = document.getElementById('login-error');

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const result = profileManager.login(email, password);
            
            if (result.success) {
                displayUserProfile();
                loginError.style.display = 'none';
            } else {
                loginError.textContent = result.message;
                loginError.style.display = 'block';
            }
        });
    }

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            profileManager.logout();
            loginForm.style.display = 'block';
            profileSection.style.display = 'none';
            loginError.style.display = 'none';
        });
    }

    // Check if user is already logged in
    if (profileManager.isLoggedIn()) {
        displayUserProfile();
    }

    // Function to display user profile
    function displayUserProfile() {
        const user = profileManager.getUserDetails();
        
        // Hide login form and show profile
        if (loginForm) loginForm.style.display = 'none';
        if (profileSection) profileSection.style.display = 'block';

        // Update user details
        if (userDetailsSection) {
            userDetailsSection.innerHTML = `
                <div class="user-info mb-4">
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                    <p><strong>Member since:</strong> ${new Date(user.joinDate).toLocaleDateString()}</p>
                    <p><strong>Last login:</strong> ${new Date(user.lastLogin).toLocaleString()}</p>
                </div>
            `;
        }

        // Update order history
        if (orderHistorySection) {
            orderHistorySection.innerHTML = `
                <h3>Order History</h3>
                ${user.orders.map(order => `
                    <div class="order-card mb-3 p-3 border rounded">
                        <p><strong>Order ID:</strong> ${order.id}</p>
                        <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                        <p><strong>Items:</strong> ${order.items.join(', ')}</p>
                        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                        <p><strong>Status:</strong> ${order.status}</p>
                    </div>
                `).join('')}
            `;
        }
    }
});