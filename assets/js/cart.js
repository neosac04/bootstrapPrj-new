// JavaScript for cart functionality
let cart = [];

function addToCart(item) {
    cart.push(item);
    // Update user's cart if logged in
    if (profileManager.currentUser) {
        profileManager.currentUser.currentCart = cart;
        profileManager.saveToLocalStorage();
    }
    console.log(cart);
}