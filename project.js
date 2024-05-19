// Selecting elements from the DOM
const btnCart = document.querySelector('#cart-icon');
const cart = document.querySelector('.cart');
const btnClose = document.querySelector('#cart-close');

// Adding event listeners to the cart icon and close button
btnCart.addEventListener('click', () => {
    cart.classList.add('cart-active');
});

btnClose.addEventListener('click', () => {
    cart.classList.remove('cart-active');
});

// Load food items and cart items from storage when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadFood();
    loadCartFromStorage();
});

// Load food items
function loadFood() {
    loadContant();
}

// Load content of the page
function loadContant() {
    // Remove event listeners from previous elements and add them to new ones
    let btnRemove = document.querySelectorAll('.cart-remove');
    btnRemove.forEach((btn) => {
        btn.addEventListener('click', removeItem);
    });

    let qtyElements = document.querySelectorAll('.cart-quantity');
    qtyElements.forEach((input) => {
        input.addEventListener('change', changeQty);
    });

    let cartBtns = document.querySelectorAll('.add-cart');
    cartBtns.forEach((btn) => {
        btn.addEventListener('click', addCart);
    });

    // Update total price
    updateTotal();
}

// Remove an item from the cart
function removeItem() {
    if (confirm('Are You Sure to Remove')) {
        let title = this.parentElement.querySelector('.cart-food-title').innerHTML;
        itemList = itemList.filter((el) => el.title !== title);
        this.parentElement.remove();
        updateLocalStorage();
        updateTotal(); // Update total after removing items
    }
}

// Change quantity of an item in the cart
function changeQty() {
    if (isNaN(this.value) || this.value < 1) {
        this.value = 1;
    }
    updateTotal();
    updateLocalStorage();
}

// Array to store cart items
let itemList = [];

// Add item to the cart
function addCart() {
    let food = this.parentElement;
    let title = food.querySelector('.food-title').innerHTML;
    let price = food.querySelector('.food-price').innerHTML;
    let imgSrc = food.querySelector('.food-img').src;

    let newProduct = { title, price, imgSrc, quantity: 1 };

    // Check if the product already exists in the cart
    if (itemList.find((el) => el.title === newProduct.title)) {
        alert("Product Already added to the cart");
        return;
    } else {
        itemList.push(newProduct);
        updateLocalStorage();
    }

    // Create HTML element for the new product and append it to the cart
    let newProductElement = createCartProduct(title, price, imgSrc);
    let element = document.createElement('div');
    element.innerHTML = newProductElement;
    let cartBasket = document.querySelector('.cart-content');
    cartBasket.appendChild(element);

    // Load content of the page
    loadContant();
    updateTotal();
}

// Create HTML element for a product in the cart
function createCartProduct(title, price, imgSrc) {
    return `
        <div class="cart-box">
            <img src="${imgSrc}" class="cart-img" alt="">
            <div class="detail-box">
                <div class="cart-food-title">${title}</div>
                <div class="price-box">
                    <div class="cart-price">${price}</div>
                    <div class="cart-amt">${price}</div>
                </div>
                <input type="number" value="1" class="cart-quantity">
            </div>
            <ion-icon name="trash-outline" class="cart-remove"></ion-icon>
        </div>
    `;
}

// Update total price of items in the cart
function updateTotal() {
    const cartItems = document.querySelectorAll('.cart-box');
    let total = 0;

    // Calculate total price by multiplying price and quantity of each item
    cartItems.forEach(product => {
        let priceElement = product.querySelector('.cart-price');
        let price = parseFloat(priceElement.innerHTML.replace("RS.", ""));
        let qty = product.querySelector('.cart-quantity').value;
        total += price * qty;
        product.querySelector('.cart-amt').innerText = "Quantity RS." + (price * qty);
    });

    // Update total price displayed on the page
    const totalValue = document.querySelector('.total-price');
    totalValue.innerHTML = 'RS.' + total;

    // Update product count displayed on the cart icon
    const cartCount = document.querySelector('.cart-count');
    let count = itemList.length;
    cartCount.innerHTML = count;

    // Show or hide cart count based on the number of items in the cart
    if (count == 0) {
        cartCount.style.display = 'none';
    } else {
        cartCount.style.display = 'block';
    }
}

// Update cart items in local storage
function updateLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(itemList));
}

// Load cart items from local storage
function loadCartFromStorage() {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
        itemList = JSON.parse(storedCartItems);
        displayCartItems();
        updateTotal(); // Update total when loading items from storage
    }
}

// Display cart items on the page
function displayCartItems() {
    let cartBasket = document.querySelector('.cart-content');
    cartBasket.innerHTML = ''; // Clear existing items to avoid duplication

    itemList.forEach((item) => {
        let newProductElement = createCartProduct(item.title, item.price, item.imgSrc);
        let element = document.createElement('div');
        element.innerHTML = newProductElement;
        cartBasket.appendChild(element);

        // Attach event listeners to the newly created elements
        let removeBtn = element.querySelector('.cart-remove');
        removeBtn.addEventListener('click', removeItem);

        let qtyInput = element.querySelector('.cart-quantity');
        qtyInput.addEventListener('change', changeQty);
    });

    updateTotal();
}










// Selecting elements for the wishlist
const wishlistIcon = document.querySelector('#wishlist-icon');
const wishlist = document.querySelector('.wishlist');
const wishlistClose = document.querySelector('#wishlist-close');
const wishlistBtns = document.querySelectorAll('.wish-cart');
const wishlistCount = document.querySelector('.wishlist-count');

// Initialize wishlist items array
let wishlistItems = [];

// Update the count of wishlist items displayed on the wishlist icon
function updateWishlistCount() {
    const count = wishlistItems.length;
    wishlistCount.textContent = count;
    // Show or hide the count based on whether there are items in the wishlist
    wishlistCount.style.display = count > 0 ? 'block' : 'none';
}

// Add event listeners for wishlist icon and close button
wishlistIcon.addEventListener('click', () => {
    wishlist.classList.add('wishlist-active');
});

wishlistClose.addEventListener('click', () => {
    wishlist.classList.remove('wishlist-active');
});

// Add event listeners to "Add to Wishlist" buttons
wishlistBtns.forEach(btn => {
    btn.addEventListener('click', addToWishlist);
});

// Add item to the wishlist
function addToWishlist() {
    const food = this.parentElement;
    const title = food.querySelector('.food-title').innerHTML;
    const price = food.querySelector('.food-price').innerHTML;
    const imgSrc = food.querySelector('.food-img').src;

    const newItem = { title, price, imgSrc };

    // Check if the item already exists in the wishlist
    if (wishlistItems.find(item => item.title === newItem.title)) {
        alert("Product already added to the wishlist");
        return;
    }

    wishlistItems.push(newItem);
    updateWishlistLocalStorage();
    displayWishlistItems();
    updateWishlistCount(); // Update wishlist count
}

// Remove an item from the wishlist
function removeFromWishlist() {
    if (confirm('Are you sure you want to remove this item from the wishlist?')) {
        const title = this.parentElement.querySelector('.wishlist-food-title').innerHTML;
        wishlistItems = wishlistItems.filter((el) => el.title !== title);
        this.parentElement.remove();
        updateWishlistLocalStorage();
        updateWishlistCount(); // Update wishlist count
    }
}

// Update wishlist items in local storage
function updateWishlistLocalStorage() {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
}

// Load wishlist items from local storage
function loadWishlistFromStorage() {
    const storedWishlistItems = localStorage.getItem('wishlistItems');
    if (storedWishlistItems) {
        wishlistItems = JSON.parse(storedWishlistItems);
        displayWishlistItems();
        updateWishlistCount(); // Update wishlist count when loading items from storage
    }
}

// Display wishlist items on the page
function displayWishlistItems() {
    const wishlistBasket = document.querySelector('.wishlist-content');
    wishlistBasket.innerHTML = ''; // Clear existing items to avoid duplication

    wishlistItems.forEach((item) => {
        const newProductElement = createWishlistProduct(item.title, item.price, item.imgSrc);
        const element = document.createElement('div');
        element.innerHTML = newProductElement;
        wishlistBasket.appendChild(element);

        // Attach event listeners to the newly created elements
        const removeBtn = element.querySelector('.wishlist-remove');
        removeBtn.addEventListener('click', removeFromWishlist);
    });
}

// Function to create HTML element for a product in the wishlist
function createWishlistProduct(title, price, imgSrc) {
    return `
        <div class="wishlist-box">
            <img src="${imgSrc}" class="wishlist-img" alt="">
            <div class="detail-box">
                <div class="wishlist-food-title">${title}</div>
                <div class="price-box">
                    <div class="wishlist-price">${price}</div>
                </div>
            </div>
            <ion-icon name="trash-outline" class="wishlist-remove"></ion-icon>
        </div>
    `;
}

// Load wishlist items from local storage when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadWishlistFromStorage();
});









// IMAGE SLIDES & CIRCLES ARRAYS, & COUNTER
var imageSlides = document.getElementsByClassName('imageSlides');
var circles = document.getElementsByClassName('circle');
var leftArrow = document.getElementById('leftArrow');
var rightArrow = document.getElementById('rightArrow');
var counter = 0;

// HIDE ALL IMAGES FUNCTION
function hideImages() {
  for (var i = 0; i < imageSlides.length; i++) {
    imageSlides[i].classList.remove('visible');
  }
}

// REMOVE ALL DOTS FUNCTION
function removeDots() {
  for (var i = 0; i < imageSlides.length; i++) {
    circles[i].classList.remove('dot');
  }
}

// SINGLE IMAGE LOOP/CIRCLES FUNCTION
function imageLoop() {
  var currentImage = imageSlides[counter];
  var currentDot = circles[counter];
  currentImage.classList.add('visible');
  removeDots();
  currentDot.classList.add('dot');
  counter++;
}

// LEFT & RIGHT ARROW FUNCTION & CLICK EVENT LISTENERS
function arrowClick(e) {
  var target = e.target;
  if (target == leftArrow) {
    clearInterval(imageSlideshowInterval);
    hideImages();
    removeDots();
    if (counter == 1) {
      counter = (imageSlides.length - 1);
      imageLoop();
      imageSlideshowInterval = setInterval(slideshow, 10000);
    } else {
      counter--;
      counter--;
      imageLoop();
      imageSlideshowInterval = setInterval(slideshow, 10000);
    }
  } 
  else if (target == rightArrow) {
    clearInterval(imageSlideshowInterval);
    hideImages();
    removeDots();
    if (counter == imageSlides.length) {
      counter = 0;
      imageLoop();
      imageSlideshowInterval = setInterval(slideshow, 10000);
    } else {
      imageLoop();
      imageSlideshowInterval = setInterval(slideshow, 10000);
    }
  }
}

leftArrow.addEventListener('click', arrowClick);
rightArrow.addEventListener('click', arrowClick);


// IMAGE SLIDE FUNCTION
function slideshow() {
  if (counter < imageSlides.length) {
    imageLoop();
  } else {
    counter = 0;
    hideImages();
    imageLoop();
  }
}

// SHOW FIRST IMAGE, & THEN SET & CALL SLIDE INTERVAL
setTimeout(slideshow, 1000);
var imageSlideshowInterval = setInterval(slideshow, 3000);



// JavaScript for slideshow functionality
let slideIndex = 0;
showSlides();

function showSlides() {
  let slides = document.querySelectorAll('.imageSlides2');
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.opacity = "0";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  slides[slideIndex-1].style.opacity = "1";  
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}
