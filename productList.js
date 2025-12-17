// productList.js - Product List Management

// Product data storage by case/part number
const productsByCase = {};

// Current active case
let currentCase = null;
//tracking list export

// Current view type: 'import' or 'export'
let currentViewType = 'import';

// Exported quantities tracking (for export view)
// Format: { caseNumber: { productId: exportedQuantity } }
const exportedQuantities = {};

// Set current view type
function setViewType(viewType) {
    currentViewType = viewType;
    console.log('View type set to:', currentViewType);
}

// Get exported quantity for a product
function getExportedQuantity(caseNumber, productId) {
    if (!exportedQuantities[caseNumber]) {
        exportedQuantities[caseNumber] = {};
    }
    return exportedQuantities[caseNumber][productId] || 0;
}

// Set exported quantity for a product
function setExportedQuantity(caseNumber, productId, quantity) {
    if (!exportedQuantities[caseNumber]) {
        exportedQuantities[caseNumber] = {};
    }
    exportedQuantities[caseNumber][productId] = quantity;
}
// Fetch products by case from API (location === caseNumber)
async function fetchProductsByCase(caseNumber) {
    if (!window.SLApi || !SLApi.fetchProductsApi) return null;
    const products = await SLApi.fetchProductsApi();
    const filtered = (products || [])
        .filter(p => Number.parseInt(p.location || p.partNumber, 10) === Number(caseNumber));

    const mapped = await Promise.all(filtered.map(async p => {
        let imageUrl = p.imageName && SLApi.buildImageUrl ? SLApi.buildImageUrl(p.imageName) : (p.imageName || '');

        // Try to fetch first image for this product
        if (!imageUrl && SLApi.fetchImagesApi) {
            try {
                const images = await SLApi.fetchImagesApi(p.id);
                if (images && images.length) {
                    const imgName = images[0].fileName || images[0].imageName || images[0].url;
                    if (imgName) {
                        imageUrl = SLApi.buildImageUrl ? SLApi.buildImageUrl(imgName) : imgName;
                    }
                }
            } catch (err) {
                console.warn('Could not fetch images for product', p.id, err);
            }
        }

        if (!imageUrl) {
            imageUrl = 'https://via.placeholder.com/67/009edb/ffffff?text=IMG';
        }

        return {
            id: p.id,
            name: p.productName,
            description: p.description || '',
            code: p.productCode,
            image: imageUrl,
            quantity: Number(p.quantity) || 0,
        };
    }));

    return mapped.length ? mapped : [];
}

// Initialize product data for a case (prefers API, falls back to mock)
async function initProductData(caseNumber) {
    if (!productsByCase[caseNumber]) {
        // Try API first
        try {
            const apiProducts = await fetchProductsByCase(caseNumber);
            if (apiProducts && apiProducts.length) {
                productsByCase[caseNumber] = apiProducts;
                return productsByCase[caseNumber];
            }
        } catch (err) {
            console.warn('Could not load products from API, falling back to mock data', err);
        }

        // Define mock data cho TỪNG CASE cụ thể
        const mockDataByCase = {
            // Case 1: Đầy đủ 4 loại
            1: [
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
            ],
            
            // Case 2: Chỉ 2 loại
            2: [
                {
                    id: 1,
                    name: 'Găng tay',
                    description: 'Găng vải có lớp cao su chống trượt chống cắt',
                    code: 'JGW87914',
                    image: 'https://via.placeholder.com/67/009edb/ffffff?text=GT',
                    quantity: 25
                },
                {
                    id: 2,
                    name: 'Giày bảo hộ',
                    description: 'Giày bảo hộ đế chống trượt',
                    code: 'JGW87920',
                    image: 'https://via.placeholder.com/67/00aa00/ffffff?text=GB',
                    quantity: 15
                }
            ],
            
            // Case 3: Chỉ 1 loại
            3: [
                {
                    id: 1,
                    name: 'Nút tai',
                    description: 'Nút tai chống ồn có dây',
                    code: 'JGW87916',
                    image: 'https://via.placeholder.com/67/009edb/ffffff?text=NT',
                    quantity: 150
                }
            ],
            
            // Case 4: Khác hoàn toàn
            4: [
                {
                    id: 1,
                    name: 'Khẩu trang',
                    description: 'Khẩu trang y tế 3 lớp',
                    code: 'JGW87921',
                    image: 'https://via.placeholder.com/67/0099ff/ffffff?text=KT',
                    quantity: 200
                },
                {
                    id: 2,
                    name: 'Găng tay y tế',
                    description: 'Găng tay nitrile không bột',
                    code: 'JGW87922',
                    image: 'https://via.placeholder.com/67/009edb/ffffff?text=GT',
                    quantity: 100
                }
            ],
            
            // Case 5-10: Mix khác nhau
            5: [
                {
                    id: 1,
                    name: 'Áo phản quang',
                    description: 'Áo phản quang dạng lưới màu cam',
                    code: 'JGW87915',
                    image: 'https://via.placeholder.com/67/ff6600/ffffff?text=APQ',
                    quantity: 35
                },
                {
                    id: 2,
                    name: 'Nón vải',
                    description: 'Nón vải dùng cho phòng sạch',
                    code: 'JGW87917',
                    image: 'https://via.placeholder.com/67/009edb/ffffff?text=NV',
                    quantity: 20
                }
            ],
            
            6: [
                {
                    id: 1,
                    name: 'Găng tay',
                    description: 'Găng vải có lớp cao su chống trượt chống cắt',
                    code: 'JGW87914',
                    image: 'https://via.placeholder.com/67/009edb/ffffff?text=GT',
                    quantity: 50
                }
            ],
            
            7: [
                {
                    id: 1,
                    name: 'Giày bảo hộ',
                    description: 'Giày bảo hộ đế chống trượt',
                    code: 'JGW87920',
                    image: 'https://via.placeholder.com/67/00aa00/ffffff?text=GB',
                    quantity: 30
                },
                {
                    id: 2,
                    name: 'Khẩu trang',
                    description: 'Khẩu trang y tế 3 lớp',
                    code: 'JGW87921',
                    image: 'https://via.placeholder.com/67/0099ff/ffffff?text=KT',
                    quantity: 80
                }
            ],
            
            8: [
                {
                    id: 1,
                    name: 'Nút tai',
                    description: 'Nút tai chống ồn có dây',
                    code: 'JGW87916',
                    image: 'https://via.placeholder.com/67/009edb/ffffff?text=NT',
                    quantity: 120
                },
                {
                    id: 2,
                    name: 'Nón vải',
                    description: 'Nón vải dùng cho phòng sạch',
                    code: 'JGW87917',
                    image: 'https://via.placeholder.com/67/009edb/ffffff?text=NV',
                    quantity: 40
                }
            ],
            
            9: [
                {
                    id: 1,
                    name: 'Găng tay y tế',
                    description: 'Găng tay nitrile không bột',
                    code: 'JGW87922',
                    image: 'https://via.placeholder.com/67/009edb/ffffff?text=GT',
                    quantity: 75
                }
            ],
            
            10: [
                {
                    id: 1,
                    name: 'Áo phản quang',
                    description: 'Áo phản quang dạng lưới màu cam',
                    code: 'JGW87915',
                    image: 'https://via.placeholder.com/67/ff6600/ffffff?text=APQ',
                    quantity: 60
                },
                {
                    id: 2,
                    name: 'Găng tay',
                    description: 'Găng vải có lớp cao su chống trượt chống cắt',
                    code: 'JGW87914',
                    image: 'https://via.placeholder.com/67/009edb/ffffff?text=GT',
                    quantity: 45
                }
            ],
            
            // Cases 11-25: Tạo random mix (có thể tùy chỉnh sau)
            11: [
                { id: 1, name: 'Găng tay', description: 'Găng vải có lớp cao su', code: 'JGW87914', image: 'https://via.placeholder.com/67/009edb/ffffff?text=GT', quantity: 22 }
            ],
            12: [
                { id: 1, name: 'Nút tai', description: 'Nút tai chống ồn có dây', code: 'JGW87916', image: 'https://via.placeholder.com/67/009edb/ffffff?text=NT', quantity: 88 },
                { id: 2, name: 'Khẩu trang', description: 'Khẩu trang y tế 3 lớp', code: 'JGW87921', image: 'https://via.placeholder.com/67/0099ff/ffffff?text=KT', quantity: 110 }
            ],
            13: [
                { id: 1, name: 'Áo phản quang', description: 'Áo phản quang dạng lưới', code: 'JGW87915', image: 'https://via.placeholder.com/67/ff6600/ffffff?text=APQ', quantity: 55 }
            ],
            14: [
                { id: 1, name: 'Nón vải', description: 'Nón vải dùng cho phòng sạch', code: 'JGW87917', image: 'https://via.placeholder.com/67/009edb/ffffff?text=NV', quantity: 33 },
                { id: 2, name: 'Giày bảo hộ', description: 'Giày bảo hộ đế chống trượt', code: 'JGW87920', image: 'https://via.placeholder.com/67/00aa00/ffffff?text=GB', quantity: 18 }
            ],
            15: [
                { id: 1, name: 'Găng tay y tế', description: 'Găng tay nitrile không bột', code: 'JGW87922', image: 'https://via.placeholder.com/67/009edb/ffffff?text=GT', quantity: 95 }
            ],
            16: [
                { id: 1, name: 'Khẩu trang', description: 'Khẩu trang y tế 3 lớp', code: 'JGW87921', image: 'https://via.placeholder.com/67/0099ff/ffffff?text=KT', quantity: 140 }
            ],
            17: [
                { id: 1, name: 'Găng tay', description: 'Găng vải có lớp cao su', code: 'JGW87914', image: 'https://via.placeholder.com/67/009edb/ffffff?text=GT', quantity: 38 },
                { id: 2, name: 'Nón vải', description: 'Nón vải dùng cho phòng sạch', code: 'JGW87917', image: 'https://via.placeholder.com/67/009edb/ffffff?text=NV', quantity: 27 }
            ],
            18: [
                { id: 1, name: 'Giày bảo hộ', description: 'Giày bảo hộ đế chống trượt', code: 'JGW87920', image: 'https://via.placeholder.com/67/00aa00/ffffff?text=GB', quantity: 42 }
            ],
            19: [
                { id: 1, name: 'Nút tai', description: 'Nút tai chống ồn có dây', code: 'JGW87916', image: 'https://via.placeholder.com/67/009edb/ffffff?text=NT', quantity: 165 }
            ],
            20: [
                { id: 1, name: 'Áo phản quang', description: 'Áo phản quang dạng lưới', code: 'JGW87915', image: 'https://via.placeholder.com/67/ff6600/ffffff?text=APQ', quantity: 71 },
                { id: 2, name: 'Găng tay y tế', description: 'Găng tay nitrile không bột', code: 'JGW87922', image: 'https://via.placeholder.com/67/009edb/ffffff?text=GT', quantity: 63 }
            ],
            21: [
                { id: 1, name: 'Khẩu trang', description: 'Khẩu trang y tế 3 lớp', code: 'JGW87921', image: 'https://via.placeholder.com/67/0099ff/ffffff?text=KT', quantity: 185 }
            ],
            22: [
                { id: 1, name: 'Găng tay', description: 'Găng vải có lớp cao su', code: 'JGW87914', image: 'https://via.placeholder.com/67/009edb/ffffff?text=GT', quantity: 29 }
            ],
            23: [
                { id: 1, name: 'Nón vải', description: 'Nón vải dùng cho phòng sạch', code: 'JGW87917', image: 'https://via.placeholder.com/67/009edb/ffffff?text=NV', quantity: 51 },
                { id: 2, name: 'Giày bảo hộ', description: 'Giày bảo hộ đế chống trượt', code: 'JGW87920', image: 'https://via.placeholder.com/67/00aa00/ffffff?text=GB', quantity: 36 }
            ],
            24: [
                { id: 1, name: 'Nút tai', description: 'Nút tai chống ồn có dây', code: 'JGW87916', image: 'https://via.placeholder.com/67/009edb/ffffff?text=NT', quantity: 132 },
                { id: 2, name: 'Áo phản quang', description: 'Áo phản quang dạng lưới', code: 'JGW87915', image: 'https://via.placeholder.com/67/ff6600/ffffff?text=APQ', quantity: 48 }
            ],
            25: [
                { id: 1, name: 'Găng tay y tế', description: 'Găng tay nitrile không bột', code: 'JGW87922', image: 'https://via.placeholder.com/67/009edb/ffffff?text=GT', quantity: 87 },
                { id: 2, name: 'Khẩu trang', description: 'Khẩu trang y tế 3 lớp', code: 'JGW87921', image: 'https://via.placeholder.com/67/0099ff/ffffff?text=KT', quantity: 156 }
            ]
        };
        
        // Lấy data cho case cụ thể, nếu không có thì fallback về empty array
        // productsByCase[caseNumber] = mockDataByCase[caseNumber] || [];
    }
    
    // return productsByCase[caseNumber];
}

// Show product list for a specific case
async function showProductList(caseNumber) {
    currentCase = caseNumber;

    if (typeof controlPanel !== 'undefined' && controlPanel) {
        controlPanel.currentView = currentViewType;  
        controlPanel.currentCase = caseNumber;
        // cập nhật control panel 
        controlPanel.render('control-panel');
    }

    // Ẩn locker grid, hiện product list
    const lockerGrid = document.getElementById('locker-grid');
    if (lockerGrid) lockerGrid.classList.add('hidden');

    const productListSection = document.getElementById('product-list-section');
    if (productListSection) productListSection.classList.remove('hidden');

    // Cập nhật title
    const caseTitle = document.getElementById('caseTitle');
    if (caseTitle) caseTitle.textContent = `CASE ${caseNumber}`;

    // Khởi tạo dữ liệu & render
    await initProductData(caseNumber);
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
    
    const totalElement = document.getElementById('totalQuantity');
    if (!totalElement) return; // ✅ Check element exists
    
    const products = productsByCase[currentCase] || [];
    const total = products.reduce((sum, product) => sum + product.quantity, 0);
    totalElement.textContent = total;
}

// Create product item HTML
function createProductItem(product, index) {
    const isImportView = currentViewType === 'import';
    const isExportView = currentViewType === 'export';
    
    // Get exported quantity for export view
    const exportedQty = getExportedQuantity(currentCase, product.id);
    
    // Quantity display
    let quantityDisplay;
    let quantityButtons = '';
    let deleteButton = '';
    
    if (isExportView) {
        // Export view: "0/10" format with +- buttons
        quantityDisplay = `${exportedQty}/${product.quantity}`;
        
        quantityButtons = `
            <!-- Nút Giảm -->
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
            
            <div class="product-quantity">${quantityDisplay}</div>
            
            <!-- Nút Tăng -->
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
        `;
    } else {
        // Import view: simple number with delete button
        quantityDisplay = product.quantity;
        quantityButtons = `<div class="product-quantity">${quantityDisplay}</div>`;
        
        deleteButton = `
            <button class="delete-btn" onclick="removeProductItem(${product.id})" title="Xóa sản phẩm">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 14.25C4.5 15.075 5.175 15.75 6 15.75H12C12.825 15.75 13.5 15.075 13.5 14.25V5.25H4.5V14.25ZM14.25 3H11.625L10.875 2.25H7.125L6.375 3H3.75V4.5H14.25V3Z" fill="#F0F0F0"></path>
                </svg>
            </button>
        `;
    }
    
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
                        ${quantityButtons}
                    </div>
                    ${deleteButton}
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
    if (product && currentViewType === 'import') {
        const modalBackdrop = document.getElementById('import-modal-backdrop');
        const modalOverlay = document.getElementById('import-modal-overlay');
        const modalContent = document.getElementById('import-modal-content');
        
        if (modalBackdrop && modalOverlay && modalContent) {
            // Gửi thông tin cho control panel
            if (controlPanel) {
                controlPanel.currentProduct = product;
                controlPanel.currentCase = currentCase;
                modalContent.innerHTML = controlPanel.generateProductDetail();
            }
            
            // Hiện modal
            modalBackdrop.classList.remove('hidden');
            modalOverlay.classList.remove('hidden');
        }
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

// Increase quantity (for EXPORT view - tăng số lượng lấy ra)
function increaseQuantity(id) {
    if (!currentCase) return;
    
    const products = productsByCase[currentCase];
    const product = products.find(p => p.id === id);
    
    if (!product) return;
    
    if (currentViewType === 'export') {
        // Export view: tăng số lượng lấy ra (không vượt quá số có sẵn)
        const currentExported = getExportedQuantity(currentCase, id);
        if (currentExported < product.quantity) {
            setExportedQuantity(currentCase, id, currentExported + 1);
            
            if (!window.exportList) {
                window.exportList = [];
            }
            
            const existingIndex = window.exportList.findIndex(item => 
                item.maVatTu === product.code && 
                item.viTri === currentCase
            );
            
            if (existingIndex !== -1) {
                // Đã có trong list → tăng số lượng
                window.exportList[existingIndex].soLuong = currentExported + 1;
            } else {
                // Chưa có → thêm mới
                window.exportList.push({
                    productId: product.id,  // Cần để trừ inventory sau
                    maVatTu: product.code,
                    tenVatTu: product.name,
                    viTri: currentCase,
                    soLuong: 1
                });
            }
            
            // Cập nhật Export Table nếu đang hiển thị
            if (controlPanel && controlPanel.currentView === 'export') {
                controlPanel.render('control-panel');
            }
            
            renderProductList();
        }
    }
}

// Decrease quantity (for EXPORT view - giảm số lượng lấy ra)
function decreaseQuantity(id) {
    if (!currentCase) return;
    
    const products = productsByCase[currentCase];
    const product = products.find(p => p.id === id);
    
    if (!product) return;
    
    if (currentViewType === 'export') {
        // Export view: giảm số lượng lấy ra
        const currentExported = getExportedQuantity(currentCase, id);
        if (currentExported > 0) {
            setExportedQuantity(currentCase, id, currentExported - 1);
            
            //  CẬP NHẬT exportList
            if (window.exportList) {
                const existingIndex = window.exportList.findIndex(item => 
                    item.maVatTu === product.code && 
                    item.viTri === currentCase
                );
                
                if (existingIndex !== -1) {
                    if (currentExported - 1 === 0) {
                        // Số lượng = 0 → xóa khỏi list
                        window.exportList.splice(existingIndex, 1);
                    } else {
                        // Còn số lượng → giảm xuống
                        window.exportList[existingIndex].soLuong = currentExported - 1;
                    }
                }
            }
            
            // Cập nhật Export Table nếu đang hiển thị
            if (controlPanel && controlPanel.currentView === 'export') {
                controlPanel.render('control-panel');
            }
            
            renderProductList();
        }
    }
}
// Add product to inventory (for IMPORT - tăng số lượng tồn kho)
function addProductToInventory(productId, quantityToAdd) {
    if (!currentCase) return;
    
    const products = productsByCase[currentCase];
    const product = products.find(p => p.id === productId);
    
    if (product) {
        product.quantity += quantityToAdd;
        renderProductList();
        console.log(`Added ${quantityToAdd} to product ${productId}. New quantity: ${product.quantity}`);
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

// Remove product item (only for IMPORT view)
function removeProductItem(id) {
    if (!currentCase || currentViewType !== 'import') return;
    
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