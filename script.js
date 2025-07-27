// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6ZcbwWlkfB-fe1D4jRZA-WcxFCyMu7EY",
  authDomain: "lamistore-db.firebaseapp.com",
  projectId: "lamistore-db",
  storageBucket: "lamistore-db.firebasestorage.app",
  messagingSenderId: "557754615530",
  appId: "1:557754615530:web:e6ef9f8336cf65fc6ab993",
  measurementId: "G-LFJ4KV08LE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// --- 1. Definición de Productos y Base de Datos (JSON simulado) ---
const products = [
    {
        id: 'cartera-clasica',
        name: 'Cartera de Cuero Clásica',
        description: 'Elegante cartera de cuero genuino con múltiples compartimentos para tarjetas y billetes. Diseño atemporal y duradero, perfecta para el uso diario y ocasiones especiales. Cuenta con acabados de alta calidad y costuras reforzadas.',
        price: 49.99,
        // Imagen generada por IA para la Cartera Clásica
        image: 'https://storage.googleapis.com/gemini-generated-images-with-multimodal-input/img/769b7f5f84d092d6b38c035688569c7f_1721950486016.png', 
        stock: 50
    },
    {
        id: 'billetera-artesanal',
        name: 'Billetera de Cuero Artesanal',
        description: 'Billetera compacta hecha a mano por artesanos locales, con un diseño único y duradero. Ideal para llevar lo esencial de forma organizada. Incluye bolsillo para monedas y ranuras para tarjetas.',
        price: 29.50,
        // Imagen generada por IA para la Billetera Artesanal
        image: 'https://storage.googleapis.com/gemini-generated-images-with-multimodal-input/img/055678129712bf37651a51dd7c92b8d4_1721950486016.png',
        stock: 30
    },
    {
        id: 'cinturon-genuino',
        name: 'Cinturón de Cuero Genuino',
        description: 'Cinturón de cuero 100% genuino con hebilla de alta calidad y acabado pulido. Un accesorio indispensable que combina con cualquier atuendo, desde formal hasta casual. Disponible en varias tallas.',
        price: 39.00,
        // Imagen generada por IA para el Cinturón Genuino
        image: 'https://storage.googleapis.com/gemini-generated-images-with-multimodal-input/img/67e2e36502e6c5ee847847c21f7ed0ef_1721950486016.png',
        stock: 25
    },
    {
        id: 'portafolio-ejecutivo',
        name: 'Portafolio Ejecutivo de Cuero',
        description: 'Portafolio elegante y funcional para profesionales. Amplio espacio para documentos, laptop y accesorios. Fabricado con cuero de alta calidad para una durabilidad excepcional.',
        price: 120.00,
        // Imagen generada por IA para el Portafolio Ejecutivo
        image: 'https://storage.googleapis.com/gemini-generated-images-with-multimodal-input/img/c6d860d8ed9d3c5f4b6389f41785502c_1721950486016.png',
        stock: 15
    },
    {
        id: 'pulsera-trenza',
        name: 'Pulsera de Cuero Trenzada',
        description: 'Pulsera de cuero trenzado con cierre magnético. Un accesorio moderno y casual, perfecto para complementar tu estilo diario. Disponible en varios colores.',
        price: 15.75,
        // Imagen generada por IA para la Pulsera Trenzada
        image: 'https://storage.googleapis.com/gemini-generated-images-with-multimodal-input/img/b35e80816928e0797171d102e3b2e2d0_1721950486016.png',
        stock: 100
    },
    {
        id: 'guantes-conducir',
        name: 'Guantes de Conducir de Cuero',
        description: 'Guantes clásicos de cuero para conducir, ofreciendo un agarre superior y comodidad. Ideales para un estilo sofisticado al volante.',
        price: 65.00,
        // Imagen generada por IA para los Guantes de Conducir
        image: 'https://storage.googleapis.com/gemini-generated-images-with-multimodal-input/img/6005c24e6a6a0dd30206100234b68e59_1721950486016.png',
        stock: 20
    }
];


let cart = []; // Almacena { productId, quantity }
let users = []; // Base de datos simulada de usuarios (persiste solo mientras la página esté abierta)
let currentUser = null; // Usuario actualmente loggeado

// --- 2. Elementos del DOM (Interfaz) - Obtenidos una vez al inicio ---
// Usamos 'const' porque estas referencias a elementos no cambian.
// Es crucial que estos IDs existan en el HTML.
const productsGrid = document.getElementById('products-grid');
const cartItemCount = document.getElementById('cartItemCount');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.getElementById('closeCartBtn');
const openCartIcon = document.getElementById('openCartIcon');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkoutBtn');

const paymentModal = document.getElementById('payment-modal');
const closePaymentModalBtn = document.getElementById('closePaymentModal');
const paymentForm = document.getElementById('payment-form');
const paymentMessage = document.getElementById('payment-message');

const accountModal = document.getElementById('account-modal');
const closeAccountModalBtn = document.getElementById('closeAccountModal');
const openAccountIcon = document.getElementById('openAccountIcon');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const accountMessage = document.getElementById('account-message');

const productDetailModal = document.getElementById('product-detail-modal');
const closeProductDetailModalBtn = document.getElementById('closeProductDetailModal');
const detailImage = document.getElementById('detail-image');
const detailName = document.getElementById('detail-name');
const detailDescription = document.getElementById('detail-description');
const detailPrice = document.getElementById('detail-price');
const detailStock = document.getElementById('detail-stock');
// Este botón es especial, se re-referencia en showProductDetail
let detailAddToCartBtn = document.getElementById('detail-add-to-cart-btn');

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const toastContainer = document.getElementById('toast-container');

// --- 3. Funciones de Control de Modales (Centralizadas y Robustas) ---

/**
 * Abre un modal dado y deshabilita el scroll del body.
 * @param {HTMLElement} modalElement - El elemento modal a abrir.
 */
function openModal(modalElement) {
    if (modalElement) {
        modalElement.classList.add('open');
        document.body.style.overflow = 'hidden'; // Deshabilita el scroll
        console.log(`[MODAL] Abierto: ${modalElement.id}. Scroll deshabilitado.`);
    } else {
        console.error(`[MODAL ERROR] Intentó abrir un modal nulo.`);
    }
}

/**
 * Cierra un modal dado y habilita el scroll del body si no hay otros modales/sidebar abiertos.
 * @param {HTMLElement} modalElement - El elemento modal a cerrar.
 */
function closeModal(modalElement) {
    if (modalElement) {
        modalElement.classList.remove('open');
        console.log(`[MODAL] Cerrado: ${modalElement.id}.`);
        // Solo habilita el scroll si NO hay NINGÚN otro modal o sidebar visible
        const anyOverlayOpen = paymentModal.classList.contains('open') ||
                               accountModal.classList.contains('open') ||
                               productDetailModal.classList.contains('open') ||
                               cartSidebar.classList.contains('open');
        if (!anyOverlayOpen) {
            document.body.style.overflow = 'auto'; // Habilita el scroll
            console.log("[MODAL] Todos los overlays cerrados. Scroll habilitado.");
        }
    } else {
        console.error(`[MODAL ERROR] Intentó cerrar un modal nulo.`);
    }
}

// --- 4. Funciones Principales de la Tienda ---

/**
 * Renderiza los productos en la cuadrícula principal.
 * @param {Array} filteredProducts - Lista de productos a mostrar.
 */
function renderProducts(filteredProducts = products) {
    if (!productsGrid) {
        console.error("[RENDER] productsGrid no encontrado.");
        return;
    }
    productsGrid.innerHTML = ''; // Limpia la cuadrícula actual
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; width: 100%; color: #777;">No se encontraron productos que coincidan con su búsqueda.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.dataset.productId = product.id; // Guarda el ID en el elemento card

        const stockDisplay = product.stock > 0 ? `Stock: ${product.stock}` : '<span style="color: red; font-weight: bold;">Agotado</span>';

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 70)}...</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" data-product-id="${product.id}" ${product.stock <= 0 ? 'disabled' : ''}>Agregar al Carrito</button>
                <p class="product-stock">${stockDisplay}</p>
            </div>
        `;
        productsGrid.appendChild(productCard);

        // Event listener para abrir el modal de detalle del producto al hacer clic en la TARJETA
        productCard.addEventListener('click', (event) => {
            // Asegúrate de que el clic NO provenga del botón "Agregar al Carrito"
            if (!event.target.classList.contains('add-to-cart-btn')) {
                console.log(`[PRODUCTOS] Click en tarjeta: ${product.name}`);
                showProductDetail(product);
            }
        });

        // Event listener para el botón "Agregar al Carrito" DENTRO de la tarjeta
        const addToCartButton = productCard.querySelector('.add-to-cart-btn');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', (event) => {
                event.stopPropagation(); // ¡Importante! Evita que el clic en el botón active también el listener de la tarjeta
                console.log(`[CARRITO] Click en botón 'Agregar al Carrito' de tarjeta: ${product.name}`);
                addToCart(product.id);
                showToast('Producto añadido al carrito!', 'success');
            });
        }
    });
    console.log(`[RENDER] Productos renderizados. Total: ${filteredProducts.length}`);
}

/**
 * Añade un producto al carrito.
 * @param {string} productId - ID del producto a añadir.
 */
function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) {
        showToast('Error: Producto no encontrado.', 'error');
        console.error(`[CARRITO ERROR] Intento de añadir producto no encontrado: ${productId}`);
        return;
    }
    if (product.stock <= 0) {
        showToast('Lo sentimos, este producto está agotado y no se puede añadir.', 'error');
        console.warn(`[CARRITO WARN] Intento de añadir producto agotado: ${product.name}`);
        return;
    }

    const cartItem = cart.find(item => item.productId === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }

    product.stock--; // Decrementa el stock
    checkStockAndRestock(product); // Verifica si necesita reabastecerse
    updateCartDisplay(); // Actualiza la visualización del carrito
    renderProducts(); // Re-renderiza para actualizar el stock visible en las tarjetas
    console.log(`[CARRITO] Producto '${product.name}' añadido/actualizado. Cantidad: ${cartItem ? cartItem.quantity : 1}. Stock restante: ${product.stock}`);
}

/**
 * Actualiza la visualización del carrito y su total.
 */
function updateCartDisplay() {
    if (!cartItemCount || !cartItemsContainer || !cartTotalSpan || !checkoutBtn) {
        console.error("[CARRITO ERROR] Elementos del DOM del carrito no encontrados.");
        return;
    }

    const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCount.textContent = totalItemsInCart; // Actualiza el contador de ítems en el icono del carrito

    cartItemsContainer.innerHTML = ''; // Limpia el contenido actual del carrito
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío.</p>';
        cartTotalSpan.textContent = '0.00';
        checkoutBtn.disabled = true; // Deshabilita el botón de pago si el carrito está vacío
        console.log("[CARRITO] Carrito vacío. Botón de pago deshabilitado.");
        return;
    }

    checkoutBtn.disabled = false; // Habilita el botón de pago
    let cartTotalPrice = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            const itemPricePerUnit = calculateDiscountedPrice(product.price, item.quantity);
            cartTotalPrice += itemPricePerUnit * item.quantity;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="item-details">
                    <h4>${product.name}</h4>
                    <p>Precio Unitario: $${product.price.toFixed(2)}</p>
                    <p>Subtotal: $${(itemPricePerUnit * item.quantity).toFixed(2)}</p>
                </div>
                <div class="item-actions">
                    <input type="number" value="${item.quantity}" min="1" max="${product.stock + item.quantity}" data-product-id="${product.id}" class="item-quantity-input">
                    <button class="remove-item-btn" data-product-id="${product.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        }
    });

    cartTotalSpan.textContent = cartTotalPrice.toFixed(2);
    console.log(`[CARRITO] Display actualizado. Total ítems: ${totalItemsInCart}. Precio total: $${cartTotalPrice.toFixed(2)}`);

    // Adjuntar event listeners a los inputs de cantidad y botones de eliminar
    document.querySelectorAll('.item-quantity-input').forEach(input => {
        input.addEventListener('change', (event) => {
            const productId = event.target.dataset.productId;
            const newQuantity = parseInt(event.target.value);
            console.log(`[CARRITO] Cambiando cantidad de ${productId} a ${newQuantity}`);
            updateCartQuantity(productId, newQuantity);
        });
    });

    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            // Asegurarse de obtener el ID del botón o de su padre más cercano si el clic es en el icono
            const productId = event.target.dataset.productId || event.target.closest('button').dataset.productId;
            console.log(`[CARRITO] Removiendo producto: ${productId}`);
            removeFromCart(productId);
            showToast('Producto eliminado del carrito.', 'info');
        });
    });
}

/**
 * Actualiza la cantidad de un producto en el carrito.
 * @param {string} productId - ID del producto.
 * @param {number} newQuantity - Nueva cantidad.
 */
function updateCartQuantity(productId, newQuantity) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.productId === productId);

    if (!product || !cartItem) {
        console.error(`[CARRITO ERROR] Error al actualizar cantidad: Producto o item de carrito no encontrado para ID ${productId}`);
        return;
    }

    const oldQuantity = cartItem.quantity;
    const quantityChange = newQuantity - oldQuantity;

    if (newQuantity <= 0) {
        removeFromCart(productId);
        showToast('Producto eliminado del carrito.', 'info');
        return;
    }

    // Calcular el stock disponible real, incluyendo las unidades que ya están en el carrito
    const availableStockIncludingCart = product.stock + oldQuantity;
    if (newQuantity > availableStockIncludingCart) {
        showToast(`Solo hay ${availableStockIncludingCart} unidades disponibles de "${product.name}".`, 'error');
        // Restablece el valor del input a la cantidad anterior válida
        document.querySelector(`.item-quantity-input[data-product-id="${productId}"]`).value = oldQuantity;
        console.warn(`[CARRITO WARN] Intento de exceder stock para ${product.name}. Solicitado: ${newQuantity}, Disponible: ${availableStockIncludingCart}`);
        return;
    }

    product.stock -= quantityChange; // Ajusta el stock real del producto
    cartItem.quantity = newQuantity; // Actualiza la cantidad en el carrito

    checkStockAndRestock(product);
    updateCartDisplay();
    renderProducts(); // Re-renderiza para que el stock se actualice en las tarjetas
    showToast(`Cantidad de ${product.name} actualizada a ${newQuantity}.`, 'info');
    console.log(`[CARRITO] Cantidad de '${product.name}' en carrito actualizada a ${newQuantity}. Stock restante: ${product.stock}`);
}

/**
 * Elimina un producto del carrito.
 * @param {string} productId - ID del producto a eliminar.
 */
function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.productId === productId);

    if (product && cartItem) {
        product.stock += cartItem.quantity; // Devuelve el stock al producto
        checkStockAndRestock(product); // Verifica si ahora necesita reabastecerse
    }

    cart = cart.filter(item => item.productId !== productId); // Elimina el item del carrito
    updateCartDisplay(); // Actualiza el display del carrito
    renderProducts(); // Re-renderiza para mostrar el stock actualizado en las tarjetas
    console.log(`[CARRITO] Producto '${productId}' eliminado del carrito.`);
}

// --- 5. Función Matemática: Cálculo de Descuento Progresivo ---
/**
 * Calcula el precio unitario con descuento basado en la cantidad.
 */
function calculateDiscountedPrice(basePrice, quantity) {
    if (quantity === 1) return basePrice;
    if (quantity === 2) return basePrice * 0.95; // 5% de descuento por 2 unidades
    if (quantity >= 3) return basePrice * 0.90; // 10% de descuento por 3 o más unidades
    return basePrice;
}

// --- 6. Lógica de Reabastecimiento Automático ---
/**
 * Verifica y reabastece el stock de un producto si está por debajo del umbral.
 */
function checkStockAndRestock(product) {
    const REFILL_THRESHOLD = 20; // Umbral para reabastecer
    const REFILL_AMOUNT = 1000; // Cantidad a reabastecer

    if (product.stock <= REFILL_THRESHOLD) {
        product.stock += REFILL_AMOUNT;
        console.warn(`[STOCK] ¡ATENCIÓN! El stock de "${product.name}" estaba bajo. Se reabastecieron ${REFILL_AMOUNT} unidades. Nuevo stock: ${product.stock}`);
        showToast(`¡Stock de ${product.name} reabastecido!`, 'info');
    }
}

// --- 7. Simulación de Compra con Tarjeta ---
/**
 * Maneja el envío del formulario de pago.
 */
function handlePayment(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    console.log("[PAGO] Intento de pago...");

    // Verificación de existencia de los elementos del formulario de pago
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');

    if (!cardNumberInput || !expiryDateInput || !cvvInput) {
        console.error("[PAGO ERROR] Algunos campos del formulario de pago no se encontraron.");
        displayPaymentMessage('Error interno: Campos de pago no encontrados.', 'error');
        showToast('Error de formulario.', 'error');
        return;
    }

    const cardNumber = cardNumberInput.value.trim();
    const expiryDate = expiryDateInput.value.trim();
    const cvv = cvvInput.value.trim();

    // Validación básica de los campos de la tarjeta
    if (cardNumber.replace(/\s/g, '').length !== 16 || !/^\d{2}\/\d{2}$/.test(expiryDate) || !/^\d{3,4}$/.test(cvv)) {
        displayPaymentMessage('Por favor, ingresa datos de tarjeta válidos (Número 16 dígitos, MM/AA, CVV 3/4 dígitos).', 'error');
        showToast('Error de validación de pago.', 'error');
        console.warn("[PAGO WARN] Validación de pago fallida.");
        return;
    }

    const isPaymentSuccessful = Math.random() > 0.2; // 80% de éxito en la simulación

    if (isPaymentSuccessful) {
        displayPaymentMessage('¡Pago exitoso! Tu pedido ha sido procesado.', 'success');
        showToast('¡Compra realizada con éxito!', 'success');
        console.log("[PAGO] Pago exitoso.");
        cart = []; // Vacía el carrito
        updateCartDisplay(); // Actualiza el display del carrito
        setTimeout(() => {
            closeModal(paymentModal); // Cierra el modal de pago después de un tiempo
            alert('¡Gracias por tu compra en LamiStore!'); // Alerta final
        }, 2000);
    } else {
        displayPaymentMessage('¡Error en el pago! Por favor, verifica tus datos e inténtalo de nuevo.', 'error');
        showToast('Error en el pago. Inténtalo de nuevo.', 'error');
        console.error("[PAGO ERROR] Pago fallido.");
    }
}

/**
 * Muestra un mensaje en el modal de pago.
 */
function displayPaymentMessage(message, type) {
    if (paymentMessage) {
        paymentMessage.textContent = message;
        paymentMessage.className = `payment-message ${type}`; // Asigna clases para estilos
        paymentMessage.style.display = 'block'; // Muestra el mensaje
    }
}

// --- 8. Funciones de Usuario (Registro/Login Simulado) ---
/**
 * Maneja el registro de un nuevo usuario.
 */
function handleRegister(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    console.log("[REGISTRO] Clic en botón 'Registrarse'. Intento de registro...");

    // Verificación de existencia de los campos de registro
    const registerUsernameInput = document.getElementById('registerUsername');
    const registerPasswordInput = document.getElementById('registerPassword');

    if (!registerUsernameInput || !registerPasswordInput) {
        console.error("[REGISTRO ERROR] Campos de registro no encontrados.");
        displayAccountMessage('Error interno: Campos de registro no encontrados.', 'error');
        showToast('Error de formulario.', 'error');
        return;
    }

    const username = registerUsernameInput.value.trim();
    const password = registerPasswordInput.value.trim();

    if (username.length < 3 || password.length < 4) {
        displayAccountMessage('El nombre de usuario (mín. 3 caracteres) y la contraseña (mín. 4 caracteres) son requeridos.', 'error');
        showToast('Datos de registro inválidos.', 'error');
        console.warn("[REGISTRO WARN] Validación de registro fallida: campos incompletos/cortos.");
        return;
    }
    if (users.some(u => u.username === username)) {
        displayAccountMessage('Ese nombre de usuario ya existe. Por favor, elige otro.', 'error');
        showToast('Usuario ya existe.', 'error');
        console.warn(`[REGISTRO WARN] Intento de registro con usuario existente: ${username}`);
        return;
    }

    users.push({ username: username, password: password });
    displayAccountMessage(`¡Cuenta creada para ${username}! Ahora puedes iniciar sesión.`, 'success');
    showToast(`¡${username}, tu cuenta ha sido creada!`, 'success');
    console.log(`[REGISTRO] Usuario registrado: ${username}. Total usuarios: ${users.length}`);
    registerForm.reset(); // Limpia el formulario de registro
}

/**
 * Maneja el inicio de sesión del usuario.
 */
function handleLogin(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    console.log("[LOGIN] Clic en botón 'Iniciar Sesión'. Intento de inicio de sesión...");

    // Verificación de existencia de los campos de login
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');

    if (!loginUsernameInput || !loginPasswordInput) {
        console.error("[LOGIN ERROR] Campos de login no encontrados.");
        displayAccountMessage('Error interno: Campos de login no encontrados.', 'error');
        showToast('Error de formulario.', 'error');
        return;
    }

    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user; // Establece el usuario actual
        displayAccountMessage(`¡Bienvenido de nuevo, ${currentUser.username}!`, 'success');
        showToast(`¡Bienvenido, ${currentUser.username}!`, 'success');
        console.log(`[LOGIN] Inicio de sesión exitoso para: ${currentUser.username}`);
        updateUserDisplay(); // Actualiza el nombre de usuario en el header
        setTimeout(() => {
            closeModal(accountModal); // Cierra el modal de cuenta después de un tiempo
        }, 1500);
    } else {
        displayAccountMessage('Nombre de usuario o contraseña incorrectos.', 'error');
        showToast('Credenciales incorrectas.', 'error');
        console.warn(`[LOGIN WARN] Inicio de sesión fallido para usuario: ${username}. Credenciales incorrectas.`);
    }
    loginForm.reset(); // Limpia el formulario de login
}

/**
 * Muestra un mensaje en el modal de cuenta.
 */
function displayAccountMessage(message, type) {
    if (accountMessage) {
        accountMessage.textContent = message;
        accountMessage.className = `payment-message ${type}`; // Asigna clases para estilos
        accountMessage.style.display = 'block'; // Muestra el mensaje
    }
}

/**
 * Actualiza el display del usuario en el header.
 */
function updateUserDisplay() {
    if (!openAccountIcon) {
        console.error("[USUARIO] openAccountIcon no encontrado para actualizar display.");
        return;
    }
    if (currentUser) {
        openAccountIcon.innerHTML = `<i class="fas fa-user"></i> <span>${currentUser.username}</span>`;
        console.log(`[USUARIO] Header actualizado a: ${currentUser.username}`);
    } else {
        openAccountIcon.innerHTML = `<i class="fas fa-user"></i>`;
        console.log("[USUARIO] Header reseteado (ningún usuario loggeado).");
    }
}

// --- 9. Funciones de Detalle de Producto (Modal) ---
/**
 * Muestra el modal de detalle de producto con la información del producto dado.
 */
function showProductDetail(product) {
    // Verificar que todos los elementos existan antes de manipularlos
    if (!productDetailModal || !detailImage || !detailName || !detailDescription || !detailPrice || !detailStock || !detailAddToCartBtn) {
        console.error("[DETALLE ERROR] Algunos elementos del modal de detalle de producto no se encontraron en el DOM.");
        return;
    }

    // Rellenar la información del modal
    detailImage.src = product.image;
    detailImage.alt = product.name;
    detailName.textContent = product.name;
    detailDescription.textContent = product.description;
    detailPrice.textContent = product.price.toFixed(2);
    detailStock.textContent = product.stock > 0 ? product.stock : 'Agotado';

    // Ajustar el botón "Agregar al Carrito" según el stock
    if (product.stock <= 0) {
        detailAddToCartBtn.disabled = true;
        detailAddToCartBtn.textContent = 'Agotado';
    } else {
        detailAddToCartBtn.disabled = false;
        detailAddToCartBtn.textContent = 'Agregar al Carrito';
    }

    // --- CÓDIGO CRÍTICO para asegurar un solo listener para detailAddToCartBtn ---
    // Clonar el nodo para eliminar eficientemente todos los listeners anteriores
    // y luego re-adjuntar el nuevo.
    const oldBtn = detailAddToCartBtn;
    const newBtn = oldBtn.cloneNode(true); // Crea una copia idéntica sin listeners
    oldBtn.parentNode.replaceChild(newBtn, oldBtn); // Reemplaza el botón antiguo por la copia
    detailAddToCartBtn = newBtn; // Actualiza la referencia a la nueva instancia del botón

    // Luego, asigna el nuevo listener al nuevo botón
    detailAddToCartBtn.addEventListener('click', () => {
        console.log(`[DETALLE] Click en botón 'Agregar al Carrito' del modal: ${product.name}`);
        addToCart(product.id);
        closeModal(productDetailModal); // Cierra el modal después de añadir al carrito
        showToast('Producto añadido al carrito!', 'success'); // Notificación de confirmación
    });

    openModal(productDetailModal); // Abre el modal de detalle de producto
    console.log(`[DETALLE] Modal de detalle de producto abierto para: ${product.name}`);
}

// --- 10. Notificaciones Toast ---
/**
 * Muestra una notificación "toast" en la esquina superior derecha de la pantalla.
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - Tipo de mensaje ('success', 'error', 'info').
 */
function showToast(message, type = 'info') {
    if (!toastContainer) {
        console.error("[TOAST ERROR] El contenedor de toast no se encontró en el DOM.");
        return;
    }
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Eliminar el toast después de un tiempo con las animaciones CSS
    setTimeout(() => {
        toast.remove();
    }, 3000); // Duración total del toast (3 segundos)
    console.log(`[TOAST] Mostrado: "${message}" (${type})`);
}

// --- 11. Event Listeners (Control de la Interacción del Usuario) ---

// **Inicialización al cargar la página**
// Se asegura de que el DOM esté completamente cargado antes de interactuar con él.
document.addEventListener('DOMContentLoaded', () => {
    console.log("------------------------------------------");
    console.log("¡SCRIPT LAMI-STORE CARGADO Y DOM LISTO!");
    console.log("------------------------------------------");

    // **Verificación de elementos cruciales al inicio (solo para depuración)**
    console.log("[INIT] Verificando elementos principales:");
    console.log(`  productsGrid: ${productsGrid ? 'OK' : 'NULL'}`);
    console.log(`  cartSidebar: ${cartSidebar ? 'OK' : 'NULL'}`);
    console.log(`  paymentModal: ${paymentModal ? 'OK' : 'NULL'}`);
    console.log(`  accountModal: ${accountModal ? 'OK' : 'NULL'}`);
    console.log(`  productDetailModal: ${productDetailModal ? 'OK' : 'NULL'}`);
    console.log(`  openAccountIcon: ${openAccountIcon ? 'OK' : 'NULL'}`);
    console.log(`  registerForm: ${registerForm ? 'OK' : 'NULL'}`);
    console.log(`  loginForm: ${loginForm ? 'OK' : 'NULL'}`);
    console.log("------------------------------------------");


    renderProducts();
    updateCartDisplay();
    updateUserDisplay(); // Asegura que el estado del usuario se refleje al cargar

    // **Event Listeners para el Sidebar del Carrito**
    if (openCartIcon) {
        openCartIcon.addEventListener('click', (event) => {
            event.preventDefault(); // Evita el comportamiento por defecto del enlace
            console.log("[EVENT] Click en icono de carrito.");
            openModal(cartSidebar);
        });
    } else { console.error("[EVENT ERROR] openCartIcon no encontrado."); }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            console.log("[EVENT] Click en botón cerrar carrito.");
            closeModal(cartSidebar); // Usa la función centralizada
        });
    } else { console.error("[EVENT ERROR] closeCartBtn no encontrado."); }

    // **Event Listeners para el Modal de Pago**
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            console.log("[EVENT] Click en botón 'Proceder al Pago'.");
            closeModal(cartSidebar); // Cierra el sidebar del carrito antes de abrir el modal
            openModal(paymentModal); // Abre el modal de pago
            if (paymentForm) paymentForm.reset(); // Limpia el formulario de pago
            displayPaymentMessage('', ''); // Oculta y limpia mensajes anteriores
        });
    } else { console.error("[EVENT ERROR] checkoutBtn no encontrado."); }

    if (closePaymentModalBtn) {
        closePaymentModalBtn.addEventListener('click', () => {
            console.log("[EVENT] Click en botón cerrar modal de pago.");
            closeModal(paymentModal);
        });
    } else { console.error("[EVENT ERROR] closePaymentModalBtn no encontrado."); }

    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePayment); // Adjunta el handler al envío del formulario de pago
    } else { console.error("[EVENT ERROR] paymentForm no encontrado para añadir listener."); }

    // **Event Listeners para el Modal de Cuenta de Usuario**
    if (openAccountIcon) {
        openAccountIcon.addEventListener('click', (event) => {
            event.preventDefault(); // Evita el comportamiento por defecto del enlace
            console.log("[EVENT] Click en icono de cuenta.");
            openModal(accountModal); // Abre el modal de cuenta
            if (registerForm) registerForm.reset(); // Limpia ambos formularios
            if (loginForm) loginForm.reset();
            displayAccountMessage('', ''); // Oculta y limpia mensajes anteriores
        });
    } else { console.error("[EVENT ERROR] openAccountIcon no encontrado."); }

    if (closeAccountModalBtn) {
        closeAccountModalBtn.addEventListener('click', () => {
            console.log("[EVENT] Click en botón cerrar modal de cuenta.");
            closeModal(accountModal);
        });
    } else { console.error("[EVENT ERROR] closeAccountModalBtn no encontrado."); }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister); // Adjunta el handler al formulario de registro
    } else { console.error("[EVENT ERROR] registerForm no encontrado para añadir listener de submit."); }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);       // Adjunta el handler al formulario de login
    } else { console.error("[EVENT ERROR] loginForm no encontrado para añadir listener de submit."); }

    // **Event Listeners para el Modal de Detalle de Producto**
    if (closeProductDetailModalBtn) {
        closeProductDetailModalBtn.addEventListener('click', () => {
            console.log("[EVENT] Click en botón cerrar modal de detalle de producto.");
            closeModal(productDetailModal);
        });
    } else { console.error("[EVENT ERROR] closeProductDetailModalBtn no encontrado."); }

    // **Event Listeners para la Búsqueda**
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    } else { console.error("[EVENT ERROR] searchButton no encontrado."); }

    if (searchInput) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    } else { console.error("[EVENT ERROR] searchInput no encontrado."); }

    function performSearch() {
        console.log("[BUSQUEDA] Realizando búsqueda...");
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        renderProducts(filtered); // Vuelve a renderizar los productos con el filtro
        showToast(`Búsqueda por "${searchInput.value}" completada.`, 'info');
    }

    // **Cerrar overlays (sidebar/modales) al hacer clic fuera de su contenido**
    document.addEventListener('click', (event) => {
        // Cierra el sidebar si se hace clic fuera de él y no en su botón de apertura o en el botón de checkout
        if (cartSidebar && cartSidebar.classList.contains('open') &&
            !cartSidebar.contains(event.target) &&
            !openCartIcon.contains(event.target) &&
            event.target !== checkoutBtn) {
            console.log("[OVERLAY] Click fuera del sidebar del carrito. Cerrando...");
            closeModal(cartSidebar);
        }

        // Cierra el modal de pago si se hace clic fuera de su contenido y no en su botón de cierre o el botón de checkout
        if (paymentModal && paymentModal.classList.contains('open') &&
            !paymentModal.querySelector('.modal-content').contains(event.target) &&
            event.target !== closePaymentModalBtn &&
            event.target !== checkoutBtn) {
            console.log("[OVERLAY] Click fuera del modal de pago. Cerrando...");
            closeModal(paymentModal);
        }

        // Cierra el modal de cuenta si se hace clic fuera de su contenido y no en su botón de cierre o el icono de apertura
        if (accountModal && accountModal.classList.contains('open') &&
            !accountModal.querySelector('.modal-content').contains(event.target) &&
            event.target !== closeAccountModalBtn &&
            event.target !== openAccountIcon) {
            console.log("[OVERLAY] Click fuera del modal de cuenta. Cerrando...");
            closeModal(accountModal);
        }

        // Cierra el modal de detalle de producto si se hace clic fuera de su contenido y no en su botón de cierre o el botón "Agregar al Carrito" del modal
        if (productDetailModal && productDetailModal.classList.contains('open') &&
            !productDetailModal.querySelector('.modal-content').contains(event.target) &&
            event.target !== closeProductDetailModalBtn &&
            event.target !== detailAddToCartBtn) { // Asegura que el clic en el botón Añadir al Carrito del modal no lo cierre
            console.log("[OVERLAY] Click fuera del modal de detalle de producto. Cerrando...");
            closeModal(productDetailModal);
        }
    });
});
