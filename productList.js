// productList.js - Product List Management

// Product data storage by case/part number
const productsByCase = {};

// Current active case
let currentCase = null;

// Initialize product data for a case
function initProductData(caseNumber) {
    if (!productsByCase[caseNumber]) {
        productsByCase[caseNumber] = [
            {
                id: 1,
                name: 'Găng tay',
                description: 'Găng vải có lớp cao su chống trượt chống cắt',
                code: 'JGW87914',
                image: 'https://via.placeholder.com/67/009edb/ffffff?text=GT',
                quantity: 10
            },
            {
                id: 2,
                name: 'Áo phản quang',
                description: 'Áo phản quang dạng lưới màu cam',
                code: 'JGW87915',
                image: 'https://via.placeholder.com/67/ff6600/ffffff?text=APQ',
                quantity: 49
            },
            {
                id: 3,
                name: 'Nút tai',
                description: 'Nút tai chống ồn có dây',
                code: 'JGW87916',
                image: 'https://via.placeholder.com/67/009edb/ffffff?text=NT',
                quantity: 99
            },
            {
                id: 4,
                name: 'Nón vải',
                description: 'Nón vải dùng cho phòng sạch',
                code: 'JGW87917',
                image: 'https://via.placeholder.com/67/009edb/ffffff?text=NV',
                quantity: 30
            }
        ];
    }
    return productsByCase[caseNumber];
}

// Show product list for a specific case
function showProductList(caseNumber) {
    currentCase = caseNumber;
    
    // Hide locker grid
    document.getElementById('locker-grid').classList.add('hidden');
    
    // Show product list
    document.getElementById('product-list-section').classList.remove('hidden');
    
    // Update case title
    document.getElementById('caseTitle').textContent = `CASE ${caseNumber}`;
    
    // Initialize and render products
    initProductData(caseNumber);
    renderProductList();
}

// Hide product list and return to locker grid
function hideProductList() {
    // Show locker grid
    document.getElementById('locker-grid').classList.remove('hidden');
    
    // Hide product list
    document.getElementById('product-list-section').classList.add('hidden');
    
    currentCase = null;
}

// Update total quantity
function updateTotalQuantity() {
    if (!currentCase) return;
    
    const products = productsByCase[currentCase] || [];
    const total = products.reduce((sum, product) => sum + product.quantity, 0);
    document.getElementById('totalQuantity').textContent = total;
}

// Create product item HTML
// Create product item HTML
function createProductItem(product, index) {
    return `
        <div class="product-item" data-id="${product.id}">
            <div class="product-card" onclick="showProductDetail(${product.id})">
                <img src="${product.image}" class="product-image" alt="${product.name}" />
                
                <div class="product-info">
                    <div class="product-row">
                        <span class="product-name">${product.name}</span>
                        <span class="product-code">${product.code}</span>
                    </div>
                    <div class="product-description">${product.description}</div>
                </div>
                
                <div class="product-actions" onclick="event.stopPropagation()">
                    <div class="quantity-controls">
                        <!-- Nút Giảm (nutDown) -->
                        <button class="quantity-btn-svg" onclick="decreaseQuantity(${product.id})" title="Giảm">
                            <svg width="39" height="25" viewBox="0 0 39 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g filter="url(#filter0_d_down_${product.id})">
                                    <rect x="4" y="2" width="31" height="17" rx="5" fill="#D9D9D9"/>
                                </g>
                                <path d="M15.0025 6.00001H11L17.5148 14.8021H21.5173L15.0025 6.00001Z" fill="url(#paint0_linear_down_${product.id})"/>
                                <path d="M24.5149 6.00001H28.5173L22.0025 14.8021H18L24.5149 6.00001Z" fill="url(#paint1_linear_down_${product.id})"/>
                                <defs>
                                    <filter id="filter0_d_down_${product.id}" x="0" y="0" width="39" height="25" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                        <feOffset dy="2"/>
                                        <feGaussianBlur stdDeviation="2"/>
                                        <feComposite in2="hardAlpha" operator="out"/>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_down_${product.id}"/>
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_down_${product.id}" result="shape"/>
                                    </filter>
                                    <linearGradient id="paint0_linear_down_${product.id}" x1="18.1213" y1="14.585" x2="20.1654" y2="5.32052" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#009EDB"/>
                                        <stop offset="1" stop-color="#00F6FA" stop-opacity="0.1"/>
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_down_${product.id}" x1="21.3961" y1="14.585" x2="19.352" y2="5.32052" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#009EDB"/>
                                        <stop offset="1" stop-color="#00F6FA" stop-opacity="0.1"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </button>
                        
                        <div class="product-quantity">${product.quantity}</div>
                        
                        <!-- Nút Tăng (nutUp) -->
                        <button class="quantity-btn-svg" onclick="increaseQuantity(${product.id})" title="Tăng">
                            <svg width="39" height="25" viewBox="0 0 39 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g filter="url(#filter0_d_up_${product.id})">
                                    <rect x="4" y="2" width="31" height="17" rx="5" fill="#D9D9D9"/>
                                </g>
                                <path d="M15.0025 14.8021H11L17.5148 6H21.5173L15.0025 14.8021Z" fill="url(#paint0_linear_up_${product.id})"/>
                                <path d="M24.5149 14.8021H28.5173L22.0025 6H18L24.5149 14.8021Z" fill="url(#paint1_linear_up_${product.id})"/>
                                <defs>
                                    <filter id="filter0_d_up_${product.id}" x="0" y="0" width="39" height="25" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                        <feOffset dy="2"/>
                                        <feGaussianBlur stdDeviation="2"/>
                                        <feComposite in2="hardAlpha" operator="out"/>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_up_${product.id}"/>
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_up_${product.id}" result="shape"/>
                                    </filter>
                                    <linearGradient id="paint0_linear_up_${product.id}" x1="18.1213" y1="6.21715" x2="20.1654" y2="15.4816" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#009EDB"/>
                                        <stop offset="1" stop-color="#00F6FA" stop-opacity="0.1"/>
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_up_${product.id}" x1="21.3961" y1="6.21715" x2="19.352" y2="15.4816" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#009EDB"/>
                                        <stop offset="1" stop-color="#00F6FA" stop-opacity="0.1"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </button>
                    </div>
                    
                    <button class="delete-btn" onclick="removeProductItem(${product.id})" title="Xóa sản phẩm">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.5 14.25C4.5 15.075 5.175 15.75 6 15.75H12C12.825 15.75 13.5 15.075 13.5 14.25V5.25H4.5V14.25ZM14.25 3H11.625L10.875 2.25H7.125L6.375 3H3.75V4.5H14.25V3Z" fill="#F0F0F0"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}
// Show product detail
function showProductDetail(productId) {
    if (!currentCase) return;
    
    const products = productsByCase[currentCase];
    const product = products.find(p => p.id === productId);
    
    if (product && controlPanel) {
        controlPanel.showProductDetail(product, currentCase);
    }
}
// Render product list
function renderProductList() {
    if (!currentCase) return;
    
    const container = document.getElementById('productListContainer');
    const products = productsByCase[currentCase] || [];
    
    container.innerHTML = products.map((product, index) => createProductItem(product, index)).join('');
    updateTotalQuantity();
}

// Increase quantity
function increaseQuantity(id) {
    if (!currentCase) return;
    
    const products = productsByCase[currentCase];
    const product = products.find(p => p.id === id);
    if (product) {
        product.quantity++;
        renderProductList();
    }
}

// Decrease quantity
function decreaseQuantity(id) {
    if (!currentCase) return;
    
    const products = productsByCase[currentCase];
    const product = products.find(p => p.id === id);
    if (product && product.quantity > 0) {
        product.quantity--;
        renderProductList();
    }
}

// Add new product item
function addProductItem() {
    if (!currentCase) return;
    
    const products = productsByCase[currentCase];
    const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        name: `Sản phẩm ${products.length + 1}`,
        description: 'Mô tả sản phẩm mới',
        code: `JGW${String(90000 + products.length).slice(-5)}`,
        image: 'https://via.placeholder.com/67/009edb/ffffff?text=SP',
        quantity: 0
    };
    
    products.push(newProduct);
    renderProductList();
    
    const container = document.getElementById('productListContainer');
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 100);
}

// Remove product item
function removeProductItem(id) {
    if (!currentCase) return;
    
    const products = productsByCase[currentCase];
    const index = products.findIndex(p => p.id === id);
    if (index > -1) {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            products.splice(index, 1);
            renderProductList();
        }
    }
}

console.log('Product List module loaded');