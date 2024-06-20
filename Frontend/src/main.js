document.addEventListener('DOMContentLoaded', function() {
    fetch('../src/Pizza_List.json')
        .then(response => response.json())
        .then(pizza_info => {
            const menu = document.querySelector('.menu');
            const cartContent = document.querySelector('.cart-content');
            const cartAmount = document.querySelector('.cart .amount');
            const totalPriceElement = document.querySelector('.cart .total-price-container .total-price:last-child');
            const totalPrice = document.querySelector('.total-price');
            const clearCartButton = document.querySelector('.cart-description');
            const filterButtons = document.querySelectorAll('.category-name');

            const saveCartToLocalStorage = () => {
                const cartItems = Array.from(cartContent.children).map(cartItem => {
                    const orderName = cartItem.querySelector('.order-name').textContent;
                    const orderPrice = cartItem.querySelector('.order-price').textContent;
                    const orderAmount = cartItem.querySelector('.order-amount').textContent;
                    return { orderName, orderPrice, orderAmount };
                });
                const cartInfo = {
                    items: cartItems,
                    totalAmount: cartAmount.textContent,
                    totalPrice: totalPrice.textContent
                };
                localStorage.setItem('cart', JSON.stringify(cartInfo));
            };

            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filter = button.textContent;

                    filterButtons.forEach(button => {
                        button.classList.remove('selected-category');
                    });

                    button.classList.add('selected-category');

                    let filteredPizzas;
                    if (filter === 'Усі') {
                        filteredPizzas = pizza_info;
                    } else {
                        filteredPizzas = pizza_info.filter(pizza => pizza.type === filter);
                    }

                    menu.innerHTML = '';
                    filteredPizzas.forEach(pizza => {
                        const pizzaElement = document.createElement('div');
                        pizzaElement.classList.add('pizza');

                        pizzaElement.innerHTML = `
                        <img src="${pizza.icon}" alt="pizza" class="pizza-image">
                        <p class="pizza-name">${pizza.title}</p>
                        <p class="pizza-style">${pizza.type}</p>
                        <p class="pizza-description">${Object.values(pizza.content).flat().join(', ')}</p>
                        <div class="sizes-container">
                            ${pizza.small_size ? `
                            <div class="size">
                                <div class="radius flex">
                                    <img src="assets/images/size-icon.svg" alt="">
                                    <p class="icon-text">${pizza.small_size.size}</p>
                                </div>
                                <div class="weight flex">
                                    <img src="assets/images/weight.svg" alt="">
                                    <p class="icon-text">${pizza.small_size.weight}</p>
                                </div>
                                <div class="price-container">
                                    <p class="price-tag">${pizza.small_size.price}</p>
                                    <p class="currency">грн.</p>
                                </div>
                                <button class="orange-button" data-size="small">Купити</button>
                            </div>` : ''}
                            ${pizza.big_size ? `
                            <div class="size">
                                <div class="radius flex">
                                    <img src="assets/images/size-icon.svg" alt="">
                                    <p class="icon-text">${pizza.big_size.size}</p>
                                </div>
                                <div class="weight flex">
                                    <img src="assets/images/weight.svg" alt="">
                                    <p class="icon-text">${pizza.big_size.weight}</p>
                                </div>
                                <div class="price-container">
                                    <p class="price-tag">${pizza.big_size.price}</p>
                                    <p class="currency">грн.</p>
                                </div>
                                <button class="orange-button" data-size="big">Купити</button>
                            </div>` : ''}
                        </div>
                    `;

                        menu.appendChild(pizzaElement);
                    });
                });
            });

            clearCartButton.addEventListener('click', function() {
                cartContent.innerHTML = '';

                totalPriceElement.textContent = '0 грн';
                totalPrice.textContent = '0 грн';
                updateCartAmount();

                const cartInfo = {
                    items: [],
                    totalAmount: '0',
                    totalPrice: '0 грн'
                };
                localStorage.setItem('cart', JSON.stringify(cartInfo));
            });

            const updateCartAmount = () => {
                cartAmount.textContent = cartContent.children.length;
            };

            const updateTotalPrice = () => {
                let totalPrice = 0;
                Array.from(cartContent.children).forEach(cartItem => {
                    const price = Number(cartItem.querySelector('.order-price').textContent.replace('грн', ''));
                    const quantity = Number(cartItem.querySelector('.order-amount').textContent);
                    totalPrice += price * quantity;
                });
                totalPriceElement.textContent = `${totalPrice} грн`;
            };

            const savedCartInfo = JSON.parse(localStorage.getItem('cart')) || { items: [], totalAmount: '0', totalPrice: '0 грн' };
            const savedCartItems = savedCartInfo.items;
            savedCartItems.forEach(savedCartItem => {
                const pizza = pizza_info.find(pizza => `${pizza.title} (${pizza.small_size.size})` === savedCartItem.orderName || `${pizza.title} (${pizza.big_size.size})` === savedCartItem.orderName);
                const size = savedCartItem.orderName.includes(pizza.small_size.size) ? 'small' : 'big';
                const pizzaSize = pizza[size + '_size'];

                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.classList.add('flex');
                cartItem.innerHTML = `
                    <div class="cart-item-description">
                        <p class="order-name">${pizza.title} (${pizzaSize.size})</p>
                        <div class="order-params flex">
                            <div class="radius flex">
                                <img src="assets/images/size-icon.svg" alt="">
                                <p class="icon-text">${pizzaSize.size}</p>
                            </div>
                            <div class="weight flex">
                                <img src="assets/images/weight.svg" alt="">
                                <p class="icon-text">${pizzaSize.weight}</p>
                            </div>
                        </div>
                        <div class="order-controls flex">
                            <p class="order-price">${pizzaSize.price}грн</p>
                            <div class="order-amount-container">
                                <button class="round-button minus-button">-</button>
                                <p class="order-amount">${savedCartItem.orderAmount}</p>
                                <button class="round-button plus-button">+</button>
                            </div>
                            <button class="round-button cross-button">x</button>
                        </div>
                    </div>
                    <div class="cart-item-image-container">
                        <img src="${pizza.icon}" alt="pizza" class="cart-item-image">
                    </div>
                `;

                cartAmount.textContent = savedCartInfo.totalAmount;
                totalPrice.textContent = savedCartInfo.totalPrice;

                cartContent.appendChild(cartItem);

                const plusButton = cartItem.querySelector('.plus-button');
                const minusButton = cartItem.querySelector('.minus-button');
                const crossButton = cartItem.querySelector('.cross-button');
                const orderAmount = cartItem.querySelector('.order-amount');

                plusButton.addEventListener('click', function() {
                    orderAmount.textContent = Number(orderAmount.textContent) + 1;
                    updateTotalPrice();
                    saveCartToLocalStorage();
                });

                minusButton.addEventListener('click', function() {
                    const amount = Number(orderAmount.textContent);
                    if (amount > 1) {
                        orderAmount.textContent = amount - 1;
                    } else {
                        cartContent.removeChild(cartItem);
                    }
                    updateTotalPrice();
                    saveCartToLocalStorage();
                });

                crossButton.addEventListener('click', function() {
                    cartContent.removeChild(cartItem);
                    updateCartAmount();
                    updateTotalPrice();
                    saveCartToLocalStorage();
                });
            });

            pizza_info.forEach(pizza => {
                const pizzaElement = document.createElement('div');
                pizzaElement.classList.add('pizza');

                pizzaElement.innerHTML = `
                    <img src="${pizza.icon}" alt="pizza" class="pizza-image">
                    <p class="pizza-name">${pizza.title}</p>
                    <p class="pizza-style">${pizza.type}</p>
                    <p class="pizza-description">${Object.values(pizza.content).flat().join(', ')}</p>
                    <div class="sizes-container">
                        <div class="size">
                            <div class="radius flex">
                                <img src="assets/images/size-icon.svg" alt="">
                                <p class="icon-text">${pizza.small_size.size}</p>
                            </div>
                            <div class="weight flex">
                                <img src="assets/images/weight.svg" alt="">
                                <p class="icon-text">${pizza.small_size.weight}</p>
                            </div>
                            <div class="price-container">
                                <p class="price-tag">${pizza.small_size.price}</p>
                                <p class="currency">грн.</p>
                            </div>
                            <button class="orange-button" data-size="small">Купити</button>
                        </div>
                        ${pizza.big_size ? `
                        <div class="size">
                            <div class="radius flex">
                                <img src="assets/images/size-icon.svg" alt="">
                                <p class="icon-text">${pizza.big_size.size}</p>
                            </div>
                            <div class="weight flex">
                                <img src="assets/images/weight.svg" alt="">
                                <p class="icon-text">${pizza.big_size.weight}</p>
                            </div>
                            <div class="price-container">
                                <p class="price-tag">${pizza.big_size.price}</p>
                                <p class="currency">грн.</p>
                            </div>
                            <button class="orange-button" data-size="big">Купити</button>
                        </div>` : ''}
                    </div>
                `;

                const orangeButtons = pizzaElement.querySelectorAll('.orange-button');

                orangeButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const size = button.getAttribute('data-size');
                        const pizzaSize = pizza[size + '_size'];

                        const existingCartItem = Array.from(cartContent.children).find(cartItem => {
                            const orderName = cartItem.querySelector('.order-name').textContent;
                            return orderName === `${pizza.title} (${pizzaSize.size})`;
                        });

                        if(existingCartItem) {
                            const orderAmount = existingCartItem.querySelector('.order-amount');
                            orderAmount.textContent = Number(orderAmount.textContent) + 1;
                        } else{
                            const cartItem = document.createElement('div');
                            cartItem.classList.add('cart-item');
                            cartItem.classList.add('flex');
                            cartItem.innerHTML = `
                            <div class="cart-item-description">
                                <p class="order-name">${pizza.title} (${pizzaSize.size})</p>
                                <div class="order-params flex">
                                    <div class="radius flex">
                                        <img src="assets/images/size-icon.svg" alt="">
                                        <p class="icon-text">${pizzaSize.size}</p>
                                    </div>
                                    <div class="weight flex">
                                        <img src="assets/images/weight.svg" alt="">
                                        <p class="icon-text">${pizzaSize.weight}</p>
                                    </div>
                                </div>
                                <div class="order-controls flex">
                                    <p class="order-price">${pizzaSize.price}грн</p>
                                    <div class="order-amount-container">
                                        <button class="round-button minus-button">-</button>
                                        <p class="order-amount">1</p>
                                        <button class="round-button plus-button">+</button>
                                    </div>
                                    <button class="round-button cross-button">x</button>
                                </div>
                            </div>
                            <div class="cart-item-image-container">
                                <img src="${pizza.icon}" alt="pizza" class="cart-item-image">
                            </div>
                        `;

                            cartContent.appendChild(cartItem);

                            const plusButton = cartItem.querySelector('.plus-button');
                            const minusButton = cartItem.querySelector('.minus-button');
                            const crossButton = cartItem.querySelector('.cross-button');
                            const orderAmount = cartItem.querySelector('.order-amount');

                            plusButton.addEventListener('click', function() {
                                orderAmount.textContent = Number(orderAmount.textContent) + 1;
                                updateTotalPrice();
                                saveCartToLocalStorage();
                            });

                            minusButton.addEventListener('click', function() {
                                const amount = Number(orderAmount.textContent);
                                if (amount > 1) {
                                    orderAmount.textContent = amount - 1;
                                } else {
                                    cartContent.removeChild(cartItem);
                                }
                                updateTotalPrice();
                                saveCartToLocalStorage();
                            });

                            crossButton.addEventListener('click', function() {
                                cartContent.removeChild(cartItem);
                                updateCartAmount();
                                updateTotalPrice();
                                saveCartToLocalStorage();
                            });
                        }

                        updateCartAmount();
                        updateTotalPrice();
                        saveCartToLocalStorage();
                    });
                });

                menu.appendChild(pizzaElement);
            });
        });
});