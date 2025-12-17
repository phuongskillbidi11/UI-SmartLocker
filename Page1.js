class ControlPanel {
  constructor() {
    this.currentView = 'menu'; // 'menu', 'history', 'export', 'productDetail'
    this.currentProduct = null; // Lưu sản phẩm đang xem
    this.currentCase = null; // Lưu case number
    this.tempQuantity = 0; // Lưu số lượng tạm thời khi xem chi tiết
    this.historyData = [];
    this.historyLoading = false;
    this.historyError = null;
// ============ AUTH CHECK & USER INFO ON PAGE LOAD ============
// Inject clear button into search container on page load
function renderUserInfo(name, time) {
  const userNameElement = document.getElementById('userNameText');
  const loginTimeElement = document.getElementById('loginTimeText');
  
  if (userNameElement) {
    userNameElement.textContent = name || 'User';
  }
  if (loginTimeElement) {
    loginTimeElement.textContent = `Đăng nhập: ${time || '--:-- - --/--/----'}`;
  }
}
document.addEventListener('DOMContentLoaded', function() {
  const searchContainer = document.getElementById('search-container');
  if (searchContainer && !document.getElementById('search-clear')) {
    const clearBtn = document.createElement('button');
    clearBtn.id = 'search-clear';
    clearBtn.innerHTML = '✕';
    clearBtn.onclick = clearSearch;
    clearBtn.style.cssText = 'position: absolute; right: 65px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #999; font-size: 20px; display: none; padding: 5px 8px;';
    searchContainer.insertBefore(clearBtn, document.getElementById('search-button'));
  }
}, { once: true });

  document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (typeof SLApi !== 'undefined' && SLApi.getAuthToken) {
      const token = SLApi.getAuthToken();
      
      if (!token) {
        // Not logged in, redirect to login page
        console.warn('User not logged in. Redirecting to Page.html');
        window.location.href = './Page.html';
        return;
      }
      
      // User is logged in, display user info
      const user = SLApi.getAuthUser ? SLApi.getAuthUser() : null;
      if (user) {
        const userName = user.userCode || user.username || user.name || 'User';
        const loginTime = user.loginTime || new Date().toLocaleString('vi-VN');
        
        const userNameElement = document.getElementById('userNameText');
        const loginTimeElement = document.getElementById('loginTimeText');
        
        if (userNameElement) {
          userNameElement.textContent = userName;
        }
        if (loginTimeElement) {
          loginTimeElement.textContent = `Đăng nhập: ${loginTime}`;
        }
      }
    }
  });

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
      import: { 
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
      import: 'Danh Sách Nhập',
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

        <!-- Hidden file input for image upload -->
        <input id="productImageInput" type="file" accept="image/*" class="hidden" onchange="controlPanel.onImageChosen(event)" />

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
              <div class="quantity-detail-controls" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <!-- Nút giảm -->
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
                
                <!-- Ô nhập số lượng -->
                <input 
                  type="number" 
                  class="quantity-detail-value" 
                  id="detailQuantity" 
                  value="0" 
                  min="0"
                  oninput="controlPanel.updateTempQuantity()"
                  style="text-align: center; background: transparent; border: none; color: #3bd4ff; font-size: 18px; font-weight: bold; width: 50px;"
                />
                
                <!-- Nút tăng -->
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
                
                <!-- Divider (phân cách) -->
                <span style="color: #fff; font-size: 16px; margin: 0 4px;">|</span>
                
                <!-- Số lượng hiện có -->
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="color: #fff; font-size: 11px; white-space: nowrap;">Hiện có:</span>
                  <span id="currentQuantity_${product.id}" style="color:#009EDB; font-size: 14px; font-weight: bold;">${product.quantity}</span>
                </div>
                
                <!-- Tổng số sau nhập -->
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="color: #fff; font-size: 11px; white-space: nowrap;">Sau nhập:</span>
                  <span id="totalQuantity_${product.id}" style="color: #009EDB; font-size: 14px; font-weight: bold;">${product.quantity}</span>
                </div>
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

          <button class="detail-btn detail-btn-save" onclick="controlPanel.saveProductInfo()">
            <div class="text">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 3H7a2 2 0 0 0-2 2v14l7-3 7 3V5a2 2 0 0 0-2-2z" fill="currentColor"/>
              </svg>
              <span>Lưu Thông Tin</span>
            </div>
            <div class="icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 3H7a2 2 0 0 0-2 2v14l7-3 7 3V5a2 2 0 0 0-2-2z" fill="currentColor"/>
              </svg>
            </div>
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
    this.currentProduct = product;
    this.currentCase = caseNumber;
    this.tempQuantity = 0; 
    this.currentView = 'productDetail';
    
    // Hiển thị modal
    const modalBackdrop = document.getElementById('import-modal-backdrop');
    const modalOverlay = document.getElementById('import-modal-overlay');
    const modalContent = document.getElementById('import-modal-content');
    
    if (modalBackdrop) modalBackdrop.classList.remove('hidden');
    if (modalOverlay) modalOverlay.classList.remove('hidden');
    if (modalContent) {
      modalContent.innerHTML = this.generateProductDetail();
      this.updateTotalQuantity();
    }
  }
  backToProductList() {
    // Đóng modal
    const modalBackdrop = document.getElementById('import-modal-backdrop');
    const modalOverlay = document.getElementById('import-modal-overlay');
    
    if (modalBackdrop) modalBackdrop.classList.add('hidden');
    if (modalOverlay) modalOverlay.classList.add('hidden');
    
    // Reset product
    this.currentProduct = null;
    
    console.log('Đã đóng modal chi tiết sản phẩm');
  }
  backToLockerGrid() {
    // Ẩn product list section
    const productListSection = document.getElementById('product-list-section');
    if (productListSection) {
      productListSection.classList.add('hidden');
    }
    
    // Hiển thị lại locker grid
    const lockerGrid = document.getElementById('locker-grid');
    if (lockerGrid) {
      lockerGrid.classList.remove('hidden');
    }
    
    // Reset trạng thái
    this.currentProduct = null;
    this.currentCase = null;
    this.tempQuantity = 0;
    
    console.log('Đã quay về locker grid');
  }
  increaseDetailQuantity() {
    if (!this.currentProduct) return;
    
    this.tempQuantity++; 
    document.getElementById('detailQuantity').value = this.tempQuantity;
    this.updateTotalQuantity();
  }
  updateTempQuantity() {
    const input = document.getElementById('detailQuantity');
    let value = parseInt(input.value) || 0;
    
    if (value < 0) value = 0; 
    
    this.tempQuantity = value;
    input.value = value; 
    this.updateTotalQuantity();
  }

  decreaseDetailQuantity() {
    if (!this.currentProduct || this.tempQuantity <= 0) return;
    
    this.tempQuantity--; 
    document.getElementById('detailQuantity').value = this.tempQuantity;
    this.updateTotalQuantity();
    
  }
  updateTotalQuantity() {
    if (!this.currentProduct) return;
    
    // Tính tổng số = số hiện có + số nhập thêm
    const total = this.currentProduct.quantity + this.tempQuantity;
    
    // Cập nhật vào span "Tổng số sau nhập"
    const totalSpan = document.getElementById(`totalQuantity_${this.currentProduct.id}`);
    if (totalSpan) {
      totalSpan.textContent = total;
    }
  }

  chooseImage() {
    const input = document.getElementById('productImageInput');
    if (input) input.click();
  }

  async onImageChosen(evt) {
    try {
      if (!this.currentProduct) return;
      const file = evt.target && evt.target.files && evt.target.files[0];
      if (!file) return;
      if (!window.SLApi || !SLApi.uploadImageApi) {
        alert('API tải ảnh chưa sẵn sàng');
        return;
      }
      const uploaded = await SLApi.uploadImageApi(file, this.currentProduct.id);
      // Server may return object or array
      let imageName;
      if (Array.isArray(uploaded) && uploaded.length) {
        imageName = uploaded[0].fileName || uploaded[0].imageName || uploaded[0].url;
      } else if (uploaded && typeof uploaded === 'object') {
        imageName = uploaded.fileName || uploaded.imageName || uploaded.url;
      }
      if (!imageName) {
        alert('Tải ảnh thành công nhưng không nhận được tên file');
        return;
      }
      const url = SLApi.buildImageUrl ? SLApi.buildImageUrl(imageName) : imageName;
      this.currentProduct.image = url;
      // Re-render modal
      const modalContent = document.getElementById('import-modal-content');
      if (modalContent) modalContent.innerHTML = this.generateProductDetail();
    } catch (err) {
      console.error(err);
      alert('Tải ảnh thất bại');
    } finally {
      const input = document.getElementById('productImageInput');
      if (input) input.value = '';
    }
  }

  async saveProductInfo() {
    if (!this.currentProduct) return;
    try {
      const nameInput = document.getElementById(`productName_${this.currentProduct.id}`);
      const descInput = document.getElementById(`productDesc_${this.currentProduct.id}`);
      const payload = {
        productName: nameInput ? nameInput.value : this.currentProduct.name,
        description: descInput ? descInput.value : this.currentProduct.description,
      };
      if (window.SLApi && SLApi.updateProductApi) {
        await SLApi.updateProductApi(this.currentProduct.id, payload);
      }
      // Update local state
      this.currentProduct.name = payload.productName;
      this.currentProduct.description = payload.description;
      alert('Đã lưu thông tin sản phẩm');
    } catch (err) {
      console.error(err);
      alert('Lưu thông tin thất bại');
    }
  }

  async importProduct() {
    if (!this.currentProduct || !this.currentCase) return;
    
    if (!this.tempQuantity || this.tempQuantity <= 0) {
      alert('Vui lòng nhập số lượng lớn hơn 0!');
      return;
    }
    
    if (!window.importList) {
      window.importList = [];
    }
    
    const nameInput = document.getElementById(`productName_${this.currentProduct.id}`);
    const descInput = document.getElementById(`productDesc_${this.currentProduct.id}`);
    const quantityToAdd = this.tempQuantity;
    
    if (nameInput) this.currentProduct.name = nameInput.value;
    if (descInput) this.currentProduct.description = descInput.value;

    // Calculate new total quantity
    const newTotalQuantity = (this.currentProduct.quantity || 0) + quantityToAdd;

    // Persist to backend: update product and record history
    try {
      console.log('Import API: updating product', {
        productId: this.currentProduct.id,
        location: this.currentCase,
        newQuantity: newTotalQuantity,
        quantityAdded: quantityToAdd
      });

      // Step 1: Update product stock and location
      if (window.SLApi && SLApi.updateProductApi) {
        const updatePayload = {
          location: String(this.currentCase), // Backend expects location as string
          quantity: newTotalQuantity,
        };
        console.log('Sending update payload:', updatePayload);
        const updateResult = await SLApi.updateProductApi(this.currentProduct.id, updatePayload);
        console.log('Update result:', updateResult);
      } else {
        throw new Error('updateProductApi không có sẵn');
      }

      // Step 2: Add to local import list (don't save to history yet)
      console.log('History will be saved when user clicks "Xác Nhận Nhập"');
    } catch (err) {
      console.error('Import API failed:', err);
      const errorMsg = err.message || err.toString();
      alert(`Lỗi nhập vật tư:\n${errorMsg}\n\nVui lòng kiểm tra kết nối với server.`);
      return;
    }

    // Update local inventory on success
    if (typeof addProductToInventory === 'function') {
      addProductToInventory(this.currentProduct.id, quantityToAdd);
    }
    
    // Update or add to import list
    const existingIndex = window.importList.findIndex(item => 
      item.maVatTu === this.currentProduct.code && 
      item.viTri === this.currentCase
    );
    
    if (existingIndex !== -1) {
      window.importList[existingIndex].soLuong += quantityToAdd;
      window.importList[existingIndex].tenVatTu = this.currentProduct.name;
    } else {
      window.importList.push({
        productId: this.currentProduct.id,
        maVatTu: this.currentProduct.code,
        tenVatTu: this.currentProduct.name,
        viTri: this.currentCase,
        soLuong: quantityToAdd
      });
    }

    // Đóng modal
    const modalBackdrop = document.getElementById('import-modal-backdrop');
    const modalOverlay = document.getElementById('import-modal-overlay');
    
    if (modalBackdrop) modalBackdrop.classList.add('hidden');
    if (modalOverlay) modalOverlay.classList.add('hidden');
    
    // Refresh product list to show updated quantity
    if (typeof renderProductList === 'function') {
      renderProductList(this.currentCase);
    }
    
    // Reset state
    this.currentView = 'import';
    this.currentProduct = null;
    this.tempQuantity = 0;
    
    // Render control panel and show success
    this.render('control-panel');
    
    console.log('✓ Nhập vật tư thành công:', window.importList);
    alert(`✓ Nhập thành công: ${this.currentProduct?.name || 'Sản phẩm'} x${quantityToAdd}`);
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
      // Dùng exportList thay vì dữ liệu mẫu
      const exportData = window.exportList || [];

      const rows = exportData.length > 0 ? exportData.map(item => `
        <tr>
          <td>${item.maVatTu}</td>
          <td>${item.tenVatTu}</td>
          <td>${item.viTri}</td>
          <td>${item.soLuong}</td>
        </tr>
      `).join('') : `
        <tr>
          <td colspan="4" style="text-align: center; padding: 20px; color: rgba(255,255,255,0.5);">
            Chưa có vật tư nào. Click vào locker để thêm.
          </td>
        </tr>
      `;

      return `
        <div class="history-container">
          <div class="table-wrapper">
            <table class="history-table">
              <thead>
                <tr>
                  <th>Mã Vật Tư</th>
                  <th>Tên Vật Tư</th>
                  <th>Vị Trí(Case)</th>
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
                <span>Xác Nhận Xuất</span>
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
    if (this.historyLoading) {
      return `
        <div class="history-container">
          <div class="table-wrapper">
            <table class="history-table">
              <tbody>
                <tr><td style="padding: 18px; color: rgba(255,255,255,0.7); text-align:center;">Đang tải lịch sử...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (this.historyError) {
      return `
        <div class="history-container">
          <div class="table-wrapper">
            <table class="history-table">
              <tbody>
                <tr><td style="padding: 18px; color: #ff9e9e; text-align:center;">${this.historyError}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    const rows = (this.historyData || []).length > 0 ? this.historyData.map(item => {
      const created = item.createdAt ? new Date(item.createdAt) : null;
      const timeLabel = created ? created.toLocaleString('vi-VN') : '';
      const statusLabel = item.quantity >= 0 ? 'Nhập' : 'Xuất';
      return `
        <tr>
          <td>${item.productCode || ''}</td>
          <td>${item.productName || ''}</td>
          <td>${item.location || ''}</td>
          <td>${Math.abs(item.quantity || 0)}</td>
          <td>${timeLabel}</td>
          <td>${item.userCode || ''}</td>
          <td class="status-cell ${statusLabel === 'Nhập' ? 'status-nhap' : 'status-xuat'}">${statusLabel}</td>
        </tr>
      `;
    }).join('') : `
      <tr>
        <td colspan="7" style="text-align: center; padding: 20px; color: rgba(255,255,255,0.5);">
          Chưa có dữ liệu lịch sử.
        </td>
      </tr>
    `;

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
                  <th>Thời Gian</th>
                  <th>Người Dùng</th>
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

  generateImportTable() {
    // Dữ liệu nhập - ban đầu rỗng, sẽ được thêm vào khi nhập
    const importData = window.importList || [];

    const rows = importData.length > 0 ? importData.map(item => `
      <tr>
        <td>${item.maVatTu}</td>
        <td>${item.tenVatTu}</td>
        <td>${item.viTri}</td>
        <td>${item.soLuong}</td>
      </tr>
    `).join('') : `
      <tr>
        <td colspan="4" style="text-align: center; padding: 20px; color: rgba(255,255,255,0.5);">
          Chưa có vật tư nào. Click vào locker để thêm.
        </td>
      </tr>
    `;

    return `
      <div class="history-container">
        <div class="table-wrapper">
          <table class="history-table">
            <thead>
              <tr>
                <th>Mã Vật Tư</th>
                <th>Tên Vật Tư</th>
                <th>Vị Trí (Case)</th>
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
          <button class="export-btn" onclick="confirmImport()">
            <div class="text">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.75 12H11.25V7.5H14.25L9 2.25L3.75 7.5H6.75V12ZM3.75 13.5H14.25V15H3.75V13.5Z" fill="currentColor"/>
              </svg>
              <span>Xác Nhận Nhập</span>
            </div>
            <div class="icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.75 12H11.25V7.5H14.25L9 2.25L3.75 7.5H6.75V12ZM3.75 13.5H14.25V15H3.75V13.5Z" fill="currentColor"/>
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
    // Set view type for productList
    if (typeof setViewType === 'function') {
      setViewType('export');
    }
    this.render('control-panel');
  }

  showImport() {
    this.currentView = 'import';
    // Set view type for productList
    if (typeof setViewType === 'function') {
      setViewType('import');
    }
    this.render('control-panel');
  }

  showMenu() {
      this.currentView = 'menu';
      
      // Ẩn product list nếu đang hiển thị
      const productListSection = document.getElementById('product-list-section');
      if (productListSection) {
          productListSection.classList.add('hidden');
      }
      
      // Hiện locker grid
      const lockerGrid = document.getElementById('locker-grid');
      if (lockerGrid) {
          lockerGrid.classList.remove('hidden');
      }
      
      // Reset current case
      currentCase = null;
      
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
      } else if (this.currentView === 'import') {  
        content = this.generateImportTable();
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
  controlPanel.showImport();
}
function confirmImport() {
  if (!window.importList || window.importList.length === 0) {
    alert('Danh sách nhập trống!');
    return;
  }
  
  console.log('Xác nhận nhập vật tư:', window.importList);
  
  // Save all entries to backend history
  (async function() {
    try {
      const user = window.SLApi && SLApi.getAuthUser ? SLApi.getAuthUser() : null;
      const userCode = user && (user.userCode || user.username || user.name) || 'unknown';
      
      let savedCount = 0;
      let errorCount = 0;
      
      for (const item of window.importList) {
        try {
          if (window.SLApi && SLApi.recordHistoryApi) {
            await SLApi.recordHistoryApi({
              userCode: userCode,
              productName: item.tenVatTu,
              productCode: item.maVatTu,
              location: String(item.viTri), // Convert to string as backend expects
              quantity: item.soLuong,
            });
            savedCount++;
            console.log(`✓ Saved history for ${item.maVatTu}`);
          }
        } catch (err) {
          errorCount++;
          console.error(`✗ Failed to save history for ${item.maVatTu}:`, err);
        }
      }
      
      // Show result
      if (errorCount === 0) {
        alert(`✓ Đã lưu thành công ${savedCount} vật tư vào lịch sử!`);
        window.importList = [];
        controlPanel.showImport(); // Refresh to show empty list
      } else {
        alert(`⚠ Lưu ${savedCount}/${window.importList.length} vật tư.\n${errorCount} vật tư lỗi. Vui lòng thử lại.`);
      }
    } catch (err) {
      console.error('Confirm import error:', err);
      alert('Lỗi khi lưu lịch sử. Vui lòng thử lại.');
    }
  })();
}
function caiDat() {
  console.log('Cài đặt');
  alert('Cài đặt');
}

function exportReport() {
  console.log('Xuất báo cáo');
  alert('Đang xuất báo cáo...');
}

function removeProductFromInventory(caseNumber, productId, quantityToRemove) {
    if (!productsByCase[caseNumber]) return false;
    
    const products = productsByCase[caseNumber];
    const product = products.find(p => p.id === productId);
    
    if (product && product.quantity >= quantityToRemove) {
        product.quantity -= quantityToRemove;
        console.log(`Removed ${quantityToRemove} from product ${productId}. New quantity: ${product.quantity}`);
        return true;
    }
    return false;
}

function confirmExport() { 
    if (!window.exportList || window.exportList.length === 0) {
        alert('Danh sách xuất trống!');
        return;
    }
    
    // Loop qua exportList và trừ số lượng từ inventory
    let success = true;
    let failedItems = [];
    const affectedCases = new Set(); // Track các case đã thay đổi
    
    for (const item of window.exportList) {
        if (!removeProductFromInventory(item.viTri, item.productId, item.soLuong)) {
            success = false;
            failedItems.push(item.tenVatTu);
        } else {
            affectedCases.add(item.viTri); // Lưu case đã thay đổi
        }
    }
    
    if (success) {
        console.log('Xác nhận xuất vật tư:', window.exportList);
        alert('Đã xuất ' + window.exportList.length + ' loại vật tư!');
        affectedCases.forEach(caseNum => {
            const tempCurrentCase = currentCase; // Backup currentCase
            currentCase = caseNum; // Set tạm để updateTotalQuantity() work
            if (typeof updateTotalQuantity === 'function') {
                updateTotalQuantity();
            }
            currentCase = tempCurrentCase; // Restore currentCase
        });
        
        // Clear export list và reset exportedQuantities
        window.exportList = [];
        
        // Reset tất cả exportedQuantities
        for (let caseNum in exportedQuantities) {
            exportedQuantities[caseNum] = {};
        }
        
        // Refresh product list nếu đang hiển thị
        if (typeof renderProductList === 'function' && currentCase) {
            renderProductList();
        }
        
        controlPanel.showExport(); // Refresh table
    } else {
        alert('Không đủ số lượng để xuất: ' + failedItems.join(', '));
    }
}
// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
  const lockerGrid = new LockerGrid();
  lockerGrid.render('locker-grid');

  controlPanel = new ControlPanel();
  controlPanel.render('control-panel');

  try {
    const raw = localStorage.getItem('smartlocker_user');
    const user = raw ? JSON.parse(raw) : null;
    const name = user && (user.userCode || user.username || user.name) || 'Người dùng';
    const iso = localStorage.getItem('smartlocker_login_time');
    const d = iso ? new Date(iso) : new Date();
    const timeStr = d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(',', ' -');
    const nameNode = document.getElementById('userNameText');
    const timeNode = document.getElementById('loginTimeText');
    if (nameNode) nameNode.textContent = name;
    if (timeNode) timeNode.textContent = 'Đăng nhập: ' + timeStr;
  } catch (e) { console.warn('Set user info failed', e); }

  console.log('Page1 initialized');
  // Setup search interactions
  setupSearchFiltering();
});

// Global search/filter by keyword to show only matching cases
function setupSearchFiltering() {
  const input = document.getElementById('search-input');
  const button = document.getElementById('search-button');
  if (!input || !button) return;

  let allProductsCache = null;

  async function loadAllProducts() {
    if (allProductsCache) return allProductsCache;
    try {
      if (window.SLApi && SLApi.fetchProductsApi) {
        const products = await SLApi.fetchProductsApi();
        allProductsCache = (products || []).map(p => ({
          code: p.productCode || '',
          name: p.productName || '',
          description: p.description || '',
          location: parseInt(p.location || p.partNumber, 10)
        }));
        return allProductsCache;
      }
    } catch (e) {
      console.warn('Search: fetchProductsApi failed, fallback to local data', e);
    }
    // Fallback: build from local productsByCase if available
    try {
      const result = [];
      if (typeof productsByCase === 'object') {
        Object.keys(productsByCase).forEach(k => {
          const loc = parseInt(k, 10);
          (productsByCase[k] || []).forEach(p => {
            result.push({ code: p.code || '', name: p.name || '', description: p.description || '', location: loc });
          });
        });
      }
      allProductsCache = result;
      return allProductsCache;
    } catch (_) {
      allProductsCache = [];
      return allProductsCache;
    }
  }

  function normalize(str) {
    return (str || '').toString().toLowerCase();
  }

  async function runSearch() {
    const q = normalize(input.value.trim());
    const lockers = Array.from(document.querySelectorAll('#locker-grid .locker-item'));
    if (!q) {
      lockers.forEach(el => el.classList.remove('hidden'));
      return;
    }
    const all = await loadAllProducts();
    const matchingLocations = new Set(
      all.filter(p => normalize(p.code).includes(q) || normalize(p.name).includes(q) || normalize(p.description).includes(q))
         .map(p => parseInt(p.location, 10))
         .filter(n => Number.isFinite(n))
    );
    lockers.forEach(el => {
      const part = parseInt(el.getAttribute('data-part'), 10);
      if (matchingLocations.has(part)) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
  }

  let typingTimer = null;
  input.addEventListener('input', () => {
    if (typingTimer) clearTimeout(typingTimer);
    typingTimer = setTimeout(runSearch, 250);
  });
  button.addEventListener('click', runSearch);

// Clear search input and show all products
function clearSearch() {
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  const lockers = Array.from(document.querySelectorAll('#locker-grid .locker-item'));
  
  if (input) {
    input.value = '';
    input.focus();
  }
  if (clearBtn) {
    clearBtn.style.display = 'none';
  }
  // Show all locker items
  lockers.forEach(el => el.classList.remove('hidden'));
}

// Show clear button when typing in search
document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  
  if (input && clearBtn) {
    input.addEventListener('input', function() {
      if (input.value.trim()) {
        clearBtn.style.display = 'block';
      } else {
        clearBtn.style.display = 'none';
      }
    });
  }
});
}