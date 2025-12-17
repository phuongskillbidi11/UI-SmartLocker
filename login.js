// login.js - Login Form Component and Functions

class LoginForm {
  constructor(config) {
    this.containerId = config.containerId || 'login-form';
    this.username = config.username || '';
    this.password = config.password || '';
  }

  generateHeader() {
    return `
      <h2 style="
        color: #ffffff; 
        font-family: 'Orbitron', sans-serif; 
        font-size: 14px; 
        font-weight: bold; 
        margin-bottom: 25px;
        margin-top: 5px;
        padding-bottom: 3px;
        border-bottom: 2px solid #009EDB;
        display: inline-block;
        text-transform: uppercase;
        letter-spacing: 1px;
      ">Đăng Nhập</h2>
    `;
  }

  generateUsernameInput() {
    return `
      <div id="username-container">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="
          position: absolute; 
          left: 12px; 
          top: 50%; 
          transform: translateY(-50%);
        ">
          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" fill="#ffffff"/>
          <path d="M12 14C6.33 14 2 16.69 2 20V22H22V20C22 16.69 17.67 14 12 14Z" fill="#ffffff"/>
        </svg>
        <input 
          type="text" 
          id="username-input"
          class="login-input"
          value="${this.username}" 
          placeholder="Tên đăng nhập"
          style="padding: 0 15px 0 38px;"
        >
      </div>
    `;
  }

  generatePasswordInput() {
    return `
      <div id="password-container">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="
          position: absolute; 
          left: 12px; 
          top: 50%; 
          transform: translateY(-50%);
        ">
          <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="#ffffff"/>
        </svg>
        <input 
          type="password" 
          id="password-input"
          class="login-input"
          value="${this.password}" 
          placeholder="Mật khẩu"
          style="padding: 0 38px 0 38px; letter-spacing: 1.5px;"
        >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none"
          onclick="togglePassword()"
          style="
            position: absolute; 
            right: 12px; 
            top: 50%; 
            transform: translateY(-50%);
            cursor: pointer;
            opacity: 0.8;
          "
        >
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#ffffff"/>
        </svg>
      </div>
    `;
  }

  generateForgotPassword() {
    return `
      <p id="forgot-password-link" style="
        color: rgba(0, 224, 255, 0.5); 
        font-size: 11px; 
        cursor: pointer;
        transition: color 0.3s;
      "
      onmouseover="this.style.color='#00E0FF'"
      onmouseout="this.style.color='rgba(0, 224, 255, 0.5)'"
      >
        Quên mật khẩu?
      </p>
    `;
  }

  generateLoginButton() {
    return `
      <div id="login-button-container">
        <button 
          onclick="handleLogin()"
          class="custom-btn btn-15"
        >
          Đăng Nhập
        </button>
      </div>
    `;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = `
        ${this.generateHeader()}
        ${this.generateUsernameInput()}
        ${this.generatePasswordInput()}
        ${this.generateForgotPassword()}
        ${this.generateLoginButton()}
      `;
    }
  }
}

// Toggle password visibility
function togglePassword() {
  const passwordInput = document.getElementById('password-input');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
}

// Handle login
async function handleLogin() {
  const username = document.getElementById('username-input').value;
  const password = document.getElementById('password-input').value;
  
  if (!username || !password) {
    alert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
    return;
  }
  
  console.log('Login attempt:', { username });
  
  const button = document.querySelector('.btn-15');
  const originalHtml = button.innerHTML;
  button.classList.add('loading');
  button.innerHTML = `
    <svg class="spinner-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="60" stroke-dashoffset="60" />
    </svg>
    ĐANG ĐĂNG NHẬP...
  `;
  button.disabled = true;

  try {
    const payload = { username, userCode: username, password };
    const result = await window.SLApi.loginApi(payload);
    const token = result?.token || result?.accessToken;
    const user = result?.user || result?.data || null;

    if (token) window.SLApi.setAuthToken(token);
    if (user) window.SLApi.setAuthUser(user);

    try { localStorage.setItem('smartlocker_login_time', new Date().toISOString()); } catch (e) {}

    window.location.href = 'Page1.html';
  } catch (err) {
    console.error('Login failed', err);
    alert('Đăng nhập thất bại: ' + (err.message || 'Không thể kết nối máy chủ'));
    button.classList.remove('loading');
    button.innerHTML = originalHtml;
    button.disabled = false;
  }
}

// Initialize Login Form when DOM is ready
function initLoginForm() {
  const loginForm = new LoginForm({
    containerId: 'login-form',
    username: 'phuong',
    password: 'phuong@123'
  });
  loginForm.render();
  
  console.log('Login form initialized');
}