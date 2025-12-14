class ControlPanel {
  constructor() {
    this.currentView = 'menu'; // 'menu', 'history', 'export', 'productDetail'
    this.currentProduct = null; // Lưu sản phẩm đang xem
    this.currentCase = null; // Lưu case number
  }

  getLabelPosition() {
    const positions = {
      menu: {
        marginBottom: '15px',
        marginTop: '5px',
        marginLeft: '20px',
        marginRight: '0px',
        fontSize: '14px'
      },
      history: {
        marginBottom: '15px',
        marginTop: '5px',
        marginLeft: '5px',
        marginRight: '0px',
        fontSize: '14px'
      },
      export: {  
        marginBottom: '15px',
        marginTop: '5px',
        marginLeft: '5px',
        marginRight: '0px',
        fontSize: '14px'
      },
      productDetail: {
        marginBottom: '15px',
        marginTop: '5px',
        marginLeft: '5px',
        marginRight: '0px',
        fontSize: '14px'
      }
    };
    
    return positions[this.currentView] || positions.menu;
  }

  generateUserLabel() {
    const titles = {
      menu: 'Tùy Chọn',
      history: 'Lịch Sử Xuất/Nhập',
      export: 'Danh Sách Xuất',
      productDetail: 'Thông Tin Vật Tư'
    };
    
    const title = titles[this.currentView] || titles.menu;
    const pos = this.getLabelPosition();
    
    return `
      <h2 style="
        color: #ffffff; 
        font-family: 'Poppins', sans-serif; 
        font-size: ${pos.fontSize}; 
        font-weight: bold; 
        margin-bottom: ${pos.marginBottom};
        margin-top: ${pos.marginTop};
        margin-left: ${pos.marginLeft};
        margin-right: ${pos.marginRight};                  
        padding-bottom: 3px;               
        display: inline-block;
        text-transform: none;
        letter-spacing: 1px;
      ">${title}</h2>
    `;
  }
  generateProductDetail() {
    if (!this.currentProduct) return '';
    
    const product = this.currentProduct;
    const currentDate = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(',', ' -');

    return `
      <div class="product-detail-container">
        <!-- Header Card -->
        <div class="product-detail-header">
          <div class="header-left">
            <span class="case-label">CASE: ${this.currentCase || 1}</span>
          </div>
          <div class="header-right">
            <span class="time-label">Thời Gian Nhập Hàng : ${currentDate}</span>
          </div>
        </div>

        <!-- Main Content -->
        <div class="product-detail-content">
          <!-- Left Side - Image -->
          <div class="product-detail-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150/009edb/ffffff?text=IMG'" />
          </div>

          <!-- Right Side - Info -->
          <div class="product-detail-info">
            <div class="info-row">
              <label>Tên Hàng</label>
              <input type="text" value="${product.name}" id="productName_${product.id}" />
            </div>

            <div class="info-row">
              <label>Mã Hàng</label>
              <input type="text" value="${product.code}" id="productCode_${product.id}" readonly />
            </div>

            <div class="info-row-quantity">
              <label>Số lượng</label>
              <div class="quantity-detail-controls">
                <button class="quantity-detail-btn" onclick="controlPanel.decreaseDetailQuantity()" title="Giảm">
                  <svg width="39" height="25" viewBox="0 0 39 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter_detail_down)">
                      <rect x="4" y="2" width="31" height="17" rx="5" fill="#D9D9D9"/>
                    </g>
                    <path d="M15.0025 6.00001H11L17.5148 14.8021H21.5173L15.0025 6.00001Z" fill="url(#paint0_detail_down)"/>
                    <path d="M24.5149 6.00001H28.5173L22.0025 14.8021H18L24.5149 6.00001Z" fill="url(#paint1_detail_down)"/>
                    <defs>
                      <filter id="filter_detail_down" x="0" y="0" width="39" height="25" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="2"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                      </filter>
                      <linearGradient id="paint0_detail_down" x1="18.1213" y1="14.585" x2="20.1654" y2="5.32052" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#009EDB"/>
                        <stop offset="1" stop-color="#00F6FA" stop-opacity="0.1"/>
                      </linearGradient>
                      <linearGradient id="paint1_detail_down" x1="21.3961" y1="14.585" x2="19.352" y2="5.32052" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#009EDB"/>
                        <stop offset="1" stop-color="#00F6FA" stop-opacity="0.1"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </button>
                <span class="quantity-detail-value" id="detailQuantity">${product.quantity}</span>
                <button class="quantity-detail-btn" onclick="controlPanel.increaseDetailQuantity()" title="Tăng">
                  <svg width="39" height="25" viewBox="0 0 39 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter_detail_up)">
                      <rect x="4" y="2" width="31" height="17" rx="5" fill="#D9D9D9"/>
                    </g>
                    <path d="M15.0025 14.8021H11L17.5148 6H21.5173L15.0025 14.8021Z" fill="url(#paint0_detail_up)"/>
                    <path d="M24.5149 14.8021H28.5173L22.0025 6H18L24.5149 14.8021Z" fill="url(#paint1_detail_up)"/>
                    <defs>
                      <filter id="filter_detail_up" x="0" y="0" width="39" height="25" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="2"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                      </filter>
                      <linearGradient id="paint0_detail_up" x1="18.1213" y1="6.21715" x2="20.1654" y2="15.4816" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#009EDB"/>
                        <stop offset="1" stop-color="#00F6FA" stop-opacity="0.1"/>
                      </linearGradient>
                      <linearGradient id="paint1_detail_up" x1="21.3961" y1="6.21715" x2="19.352" y2="15.4816" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#009EDB"/>
                        <stop offset="1" stop-color="#00F6FA" stop-opacity="0.1"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>

            <div class="info-row-description">
              <label>Mô tả</label>
              <textarea id="productDesc_${product.id}">${product.description}</textarea>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="product-detail-buttons">
          <button class="detail-btn detail-btn-image" onclick="controlPanel.chooseImage()">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 4.5H9L7.5 3H3C2.175 3 1.5075 3.675 1.5075 4.5L1.5 13.5C1.5 14.325 2.175 15 3 15H15C15.825 15 16.5 14.325 16.5 13.5V6C16.5 5.175 15.825 4.5 15 4.5ZM15 13.5H3V6H15V13.5ZM6 9.7575L7.0575 10.815L8.25 9.63V12.75H9.75V9.63L10.9425 10.8225L12 9.7575L9.0075 6.75L6 9.7575Z" fill="currentColor"/>
            </svg>
            <span>Chọn Ảnh</span>
          </button>

          <button class="detail-btn detail-btn-back" onclick="controlPanel.backToProductList()">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Trở Lại</span>
          </button>

          <button class="detail-btn detail-btn-import" onclick="controlPanel.importProduct()">
            <div class="text">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.75 12H11.25V7.5H14.25L9 2.25L3.75 7.5H6.75V12ZM3.75 13.5H14.25V15H3.75V13.5Z" fill="currentColor"/>
              </svg>
              <span>Nhập Vật Tư</span>
            </div>
            <div class="icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.75 12H11.25V7.5H14.25L9 2.25L3.75 7.5H6.75V12ZM3.75 13.5H14.25V15H3.75V13.5Z" fill="currentColor"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    `;
  }
  showProductDetail(product, caseNumber) {
    this.currentView = 'productDetail';
    this.currentProduct = product;
    this.currentCase = caseNumber;
    
    // Hide product list
    hideProductList();
    
    // Render in control panel
    this.render('control-panel');
  }

  backToProductList() {
    // Reset view và product
    this.currentView = 'menu';
    this.currentProduct = null;
    this.currentCase = null;
    
    // Ẩn product list section
    const productListSection = document.getElementById('product-list-section');
    if (productListSection) {
        productListSection.classList.add('hidden');
    }
    
    // Hiện locker grid
    const lockerGrid = document.getElementById('locker-grid');
    if (lockerGrid) {
        lockerGrid.classList.remove('hidden');
    }
    
    // Render menu tùy chọn trong control panel
    this.render('control-panel');
  }

  increaseDetailQuantity() {
    if (!this.currentProduct) return;
    this.currentProduct.quantity++;
    document.getElementById('detailQuantity').textContent = this.currentProduct.quantity;
    
    // Update in productsByCase
    if (currentCase && productsByCase[currentCase]) {
      const prod = productsByCase[currentCase].find(p => p.id === this.currentProduct.id);
      if (prod) prod.quantity = this.currentProduct.quantity;
    }
  }

  decreaseDetailQuantity() {
    if (!this.currentProduct || this.currentProduct.quantity <= 0) return;
    this.currentProduct.quantity--;
    document.getElementById('detailQuantity').textContent = this.currentProduct.quantity;
    
    // Update in productsByCase
    if (currentCase && productsByCase[currentCase]) {
      const prod = productsByCase[currentCase].find(p => p.id === this.currentProduct.id);
      if (prod) prod.quantity = this.currentProduct.quantity;
    }
  }

  chooseImage() {
    alert('Chức năng chọn ảnh');
  }

  importProduct() {
    alert('Nhập vật tư vào kho');
  }

  showHistory() {
    this.currentView = 'history';
    this.render('control-panel');
  }

  showExport() { 
    this.currentView = 'export';
    this.render('control-panel');
  }

  showMenu() {
    this.currentView = 'menu';
    this.currentProduct = null;
    this.render('control-panel');
  }  
  generateActionButtons() {
    const buttons = [
      { text: 'Xuất Vật Tư', action: 'xuatVatTu' },
      { text: 'Báo Cáo', action: 'baoCao1' },
      { text: 'Nhập Vật Tư', action: 'nhapVatTu' },
      { text: 'Cài Đặt', action: 'caiDat' }
    ];

    const buttonHTML = buttons.map(btn => `
      <button class="action-btn" onclick="${btn.action}()">
        ${btn.text}
      </button>
    `).join('');

    return `
      <div class="action-buttons">
        ${buttonHTML}
      </div>
    `;
  }
  generateExportTable() {
    // Dữ liệu mẫu cho danh sách xuất
    const exportData = [
      { maVatTu: 'JGW87914', tenVatTu: 'Nón bảo hộ', viTri: 2, soLuong: 1 },
      { maVatTu: 'JGW87914', tenVatTu: 'Nón bảo hộ', viTri: 2, soLuong: 1 },
      { maVatTu: 'JGW87914', tenVatTu: 'Nón bảo hộ', viTri: 2, soLuong: 1 },
      { maVatTu: 'JGW87914', tenVatTu: 'Nón bảo hộ', viTri: 2, soLuong: 1 },
      { maVatTu: 'JGW87914', tenVatTu: 'Nón bảo hộ', viTri: 2, soLuong: 1 },
      { maVatTu: 'JGW87914', tenVatTu: 'Nón bảo hộ', viTri: 2, soLuong: 1 },
      { maVatTu: 'JGW87914', tenVatTu: 'Nón bảo hộ', viTri: 2, soLuong: 1 },
      { maVatTu: 'JGW87914', tenVatTu: 'Nón bảo hộ', viTri: 2, soLuong: 1 }
    ];

    const rows = exportData.map(item => `
      <tr>
        <td>${item.maVatTu}</td>
        <td>${item.tenVatTu}</td>
        <td>${item.viTri}</td>
        <td>${item.soLuong}</td>
      </tr>
    `).join('');

    return `
      <div class="history-container">
        <div class="table-wrapper">
          <table class="history-table">
            <thead>
              <tr>
                <th>Mã Vật Tư</th>
                <th>Tên Vật Tư</th>
                <th>Vị Trí</th>
                <th>Số Lượng</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
        
        <div class="button-row">
          <button class="back-btn" onclick="controlPanel.showMenu()">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
            <span>Trở Lại</span>
          </button>                
          <button class="export-btn" onclick="confirmExport()">
            <div class="text">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 10 12 5 7 10"></polyline>
                <line x1="12" y1="5" x2="12" y2="21"></line>
              </svg>
              <span>Xuất Vật Tư</span>
            </div>
            <div class="icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 10 12 5 7 10"></polyline>
                <line x1="12" y1="5" x2="12" y2="21"></line>
              </svg>
            </div>
          </button>
        </div>
      </div>
    `;
  }

  generateHistoryTable() {
    // Dữ liệu mẫu lịch sử
    const historyData = [
      { maVatTu: 'JGW87914', tenVatTu: 'Nón bảo hộ', viTri: 2, soLuong: 1, thoiGianXuat: '09:50 - 17/11/2025', thoiGianNhap: '15:50 - 20/11/2025', trangThai: 'Đã Nhập' },
      { maVatTu: 'JGW87912', tenVatTu: 'Mắt kính', viTri: 4, soLuong: 3, thoiGianXuat: '13:50 - 14/11/2025', thoiGianNhap: '', trangThai: 'Đã Xuất' },
      { maVatTu: 'JGW87914', tenVatTu: 'Nón bảo hộ', viTri: 2, soLuong: 1, thoiGianXuat: '09:50 - 17/11/2025', thoiGianNhap: '15:50 - 20/11/2025', trangThai: 'Đã Nhập' },
      { maVatTu: 'JGW87912', tenVatTu: 'Mắt kính', viTri: 4, soLuong: 3, thoiGianXuat: '13:50 - 14/11/2025', thoiGianNhap: '', trangThai: 'Đã Xuất' }
    ];

    const rows = historyData.map(item => `
      <tr>
        <td>${item.maVatTu}</td>
        <td>${item.tenVatTu}</td>
        <td>${item.viTri}</td>
        <td>${item.soLuong}</td>
        <td>${item.thoiGianXuat}</td>
        <td>${item.thoiGianNhap}</td>
        <td class="status-cell ${item.trangThai === 'Đã Nhập' ? 'status-nhap' : 'status-xuat'}">
          ${item.trangThai}
        </td>
      </tr>
    `).join('');

    return `
      <div class="history-container">
        <div class="table-wrapper">
          <table class="history-table">
            <thead>
              <tr>
                <th>Mã Vật Tư</th>
                <th>Tên Vật Tư</th>
                <th>Vị Trí</th>
                <th>Số Lượng</th>
                <th>Thời Gian Xuất</th>
                <th>Thời Gian Nhập</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
        
        <div class="button-row">
          <button class="back-btn" onclick="controlPanel.showMenu()">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
            <span>Trở Lại</span>
          </button>
          
          <button class="export-btn" onclick="exportReport()">
            <div class="text">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Xuất Báo Cáo</span>
            </div>
            <div class="icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
          </button>
        </div>
      </div>
    `;
  }

  showHistory() {
    this.currentView = 'history';
    this.render('control-panel');
  }

  showExport() { 
    this.currentView = 'export';
    this.render('control-panel');
  }

  showMenu() {
    this.currentView = 'menu';
    this.render('control-panel');
  }

  render(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      let content;
      
      if (this.currentView === 'menu') {
        content = this.generateActionButtons();
      } else if (this.currentView === 'history') {
        content = this.generateHistoryTable();
      } else if (this.currentView === 'export') {  
        content = this.generateExportTable();
      } else if (this.currentView === 'productDetail') {
        content = this.generateProductDetail();
      }

      container.innerHTML = `
        ${this.generateUserLabel()}
        ${content}
      `;
    }
  }
}

// Global instance
let controlPanel;

// Event Handlers
function xuatVatTu() {
  console.log('Hiển thị danh sách xuất');
  controlPanel.showExport();  
}

function baoCao1() {
  console.log('Báo cáo - Hiển thị lịch sử');
  controlPanel.showHistory();
}

function nhapVatTu() {
  console.log('Nhập vật tư');
  alert('Nhập vật tư');
}

function caiDat() {
  console.log('Cài đặt');
  alert('Cài đặt');
}

function exportReport() {
  console.log('Xuất báo cáo');
  alert('Đang xuất báo cáo...');
}

function confirmExport() { 
  console.log('Xác nhận xuất vật tư');
  alert('Đang xuất vật tư...');
}

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
  const lockerGrid = new LockerGrid();
  lockerGrid.render('locker-grid');

  controlPanel = new ControlPanel();
  controlPanel.render('control-panel');

  console.log('Page1 initialized');
});