document.addEventListener('DOMContentLoaded', function() {
    fetch('../src/Pizza_List.json')
        .then(response => response.json())
        .then(pizza_info => {
            // Select the .menu element
            const menu = document.querySelector('.menu');
            const cartContent = document.querySelector('.cart-content');
            const cartAmount = document.querySelector('.cart .amount');

            const updateCartAmount = () => {
                cartAmount.textContent = cartContent.children.length;
            };

            // Loop over the pizza_info array
            pizza_info.forEach(pizza => {
                // Create a new .pizza element
                const pizzaElement = document.createElement('div');
                pizzaElement.classList.add('pizza');

                // Fill the .pizza element with the appropriate data
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
                        // Determine which size of pizza to add to the cart
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
                            // Create a new cart item
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

                            // Append the new cart item to the cart content
                            cartContent.appendChild(cartItem);
                        }

                        updateCartAmount();
                    });
                });

                // Append the .pizza element to the .menu element
                menu.appendChild(pizzaElement);
            });
        });
});