// components.js - Locker Components Only

// Locker Item Component
class LockerItem {
  constructor(config) {
    this.width = config.width || '125px';
    this.height = config.height || '115px';
    this.left = config.left || '0';
    this.top = config.top || '0';
    this.partNumber = config.partNumber || 1;
    this.points = config.points || 1000;
    this.status = config.status || 'available';
  }

  generateGradientSVG() {
    return `
      <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute" preserveAspectRatio="none">
        <path d="M4.00248 8.80211H0L6.51485 0H10.5173L4.00248 8.80211Z" fill="url(#paint0_linear_gradient_${this.partNumber})"></path>
        <defs>
          <linearGradient id="paint0_linear_gradient_${this.partNumber}" x1="7.12128" y1="0.217154" x2="9.16537" y2="9.4816" gradientUnits="userSpaceOnUse">
            <stop stop-color="#009EDB"></stop>
            <stop offset="1" stop-color="#00F6FA" stop-opacity="0.1"></stop>
          </linearGradient>
        </defs>
      </svg>
    `;
  }

  generateBackgroundSVG() {
    return `
      <svg width="108" height="93" viewBox="0 0 108 93" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute left-[54.32px] top-[119.43px]" preserveAspectRatio="none">
        <path d="M1.91224 87.6544L0 0L73.2869 0.169853L84.2422 11.4708H103.739L107.564 15.4037V89.1214L103.739 92.4222H7.1709L1.91224 87.6544Z" fill="#DBDBDB"></path>
      </svg>
    `;
  }

  generateFrameSVG() {
    const fillColor = this.status === 'available' ? '#35FFBF' : 
                      this.status === 'occupied' ? '#FF3535' : '#FFA500';
    
    return `
      <svg width="128" height="152" viewBox="0 0 125 150" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute left-[43.5px] top-[110.5px]" preserveAspectRatio="none">
        <g filter="url(#filter0_if_${this.partNumber})">
          <path d="M81.8979 4.49121L94.3274 16.9602H113.928L119.665 21.3619V98.0136L113.928 102.781H14.0134L6.36439 95.5487L4.45215 4.49121H81.8979Z" 
                fill="${fillColor}" fill-opacity="0.5"></path>
          <path d="M119.17 94.132C119.157 91.8485..." fill="black"></path>
        </g>
        <defs>
          <filter id="filter0_if_${this.partNumber}" x="0" y="0" width="124.165" height="107.16" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
            <feOffset dy="2"></feOffset>
            <feGaussianBlur stdDeviation="2.5"></feGaussianBlur>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
            <feColorMatrix type="matrix" values="0 0 0 0 0.528846 0 0 0 0 0.842949 0 0 0 0 1 0 0 0 1 0"></feColorMatrix>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_${this.partNumber}"></feBlend>
            <feGaussianBlur stdDeviation="2" result="effect2_foregroundBlur_${this.partNumber}"></feGaussianBlur>
          </filter>
        </defs>
      </svg>
    `;
  }

  render() {
      return `
        <div class="locker-item" 
            style="width: ${this.width}; height: ${this.height}; position: absolute; left: ${this.left}; top: ${this.top};"
            onclick="showProductList(${this.partNumber})">
          ${this.generateFrameSVG()}
          ${this.generateBackgroundSVG()}
          ${this.generateDecorativeElements()}
          <p class="absolute left-[58.65px] top-[121.4px] text-[10px] font-bold text-black pointer-events-none">PART ${this.partNumber}</p>
          <p class="absolute left-[139px] top-[117px] text-[10px] font-bold text-[#3bd4ff] pointer-events-none">${this.points}</p>
        </div>
      `;
    }

  generateDecorativeElements() {
    const positions = [
      'left-[56.71px] top-[120.9px]',
      'left-[71.06px] top-[120.9px]',
      'left-[77.75px] top-[120.9px]',
      'left-[84.44px] top-[120.9px]',
      'left-[91.14px] top-[120.9px]',
      'left-[97.83px] top-[120.9px]'
    ];

    return positions.map((pos, idx) => 
      `<div class="absolute ${pos}">${this.generateGradientSVG()}</div>`
    ).join('');
  }
}

// Locker Grid Manager
class LockerGrid {
  constructor() {
    this.lockers = [];
    this.initializeLockers();
  }

  initializeLockers() {
    const lockerConfigs = [
      // Row 1
      { partNumber: 1, left: '0px', top: '40px', points: 1000, status: 'available' },
      { partNumber: 2, left: '130px', top: '40px', points: 1000, status: 'available' },
      { partNumber: 3, left: '260px', top: '40px', points: 1000, status: 'occupied' },
      { partNumber: 4, left: '390px', top: '40px', points: 1000, status: 'available' },
      { partNumber: 5, left: '520px', top: '40px', points: 1500, status: 'available' },
      
      // Row 2
      { partNumber: 6, left: '0px', top: '160px', points: 1000, status: 'available' },
      { partNumber: 7, left: '130px', top: '160px', points: 1000, status: 'available' },
      { partNumber: 8, left: '260px', top: '160px', points: 1000, status: 'available' },
      { partNumber: 9, left: '390px', top: '160px', points: 1000, status: 'available' },
      { partNumber: 10, left: '520px', top: '160px', points: 1000, status: 'available' },
      
      // Row 3
      { partNumber: 11, left: '0px', top: '280px', points: 1000, status: 'available' },
      { partNumber: 12, left: '130px', top: '280px', points: 1000, status: 'available' },
      { partNumber: 13, left: '260px', top: '280px', points: 1000, status: 'available' },
      { partNumber: 14, left: '390px', top: '280px', points: 1000, status: 'available' },
      { partNumber: 15, left: '520px', top: '280px', points: 1000, status: 'available' },
      
      // Row 4
      { partNumber: 16, left: '0px', top: '400px', points: 1000, status: 'available' },
      { partNumber: 17, left: '130px', top: '400px', points: 1000, status: 'available' },
      { partNumber: 18, left: '260px', top: '400px', points: 1000, status: 'occupied' },
      { partNumber: 19, left: '390px', top: '400px', points: 1000, status: 'available' },
      { partNumber: 20, left: '520px', top: '400px', points: 1000, status: 'available' },
    ];

    this.lockers = lockerConfigs.map(config => new LockerItem(config));
  }

  render(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = this.lockers.map(locker => locker.render()).join('');
    }
  }

  updateLockerStatus(partNumber, status) {
    const locker = this.lockers.find(l => l.partNumber === partNumber);
    if (locker) {
      locker.status = status;
      this.render('locker-grid');
    }
  }

  getAvailableLockers() {
    return this.lockers.filter(l => l.status === 'available');
  }
}

// Initialize Locker Grid when DOM is ready
function initLockerGrid() {
  const lockerGrid = new LockerGrid();
  lockerGrid.render('locker-grid');
  
  console.log('Locker grid initialized with', lockerGrid.lockers.length, 'lockers');
}