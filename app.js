/**
 * CryptoCredit - 首页交互逻辑
 */

// 模拟黑名单状态（实际应从后端/链上获取）
// 设置为 true 可测试黑名单效果
const IS_BLACKLISTED = false;

// 钱包连接状态
let walletState = {
    isConnected: false,
    address: null,
    isBlacklisted: IS_BLACKLISTED
};

// DOM 元素
const connectWalletBtn = document.getElementById('connectWallet');
const walletText = document.getElementById('walletText');
const borrowBtn = document.getElementById('borrowBtn');

/**
 * 模拟连接钱包
 */
async function connectWallet() {
    // 检查是否安装了 MetaMask
    if (typeof window.ethereum !== 'undefined') {
        try {
            // 请求连接钱包
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (accounts.length > 0) {
                walletState.isConnected = true;
                walletState.address = accounts[0];
                updateWalletUI();
            }
        } catch (error) {
            console.error('连接钱包失败:', error);
            showToast('连接钱包失败，请重试');
        }
    } else {
        // 没有安装 MetaMask，显示模拟连接
        simulateWalletConnect();
    }
}

/**
 * 模拟钱包连接（用于演示）
 */
function simulateWalletConnect() {
    if (walletState.isConnected) {
        // 断开连接
        walletState.isConnected = false;
        walletState.address = null;
        showToast('钱包已断开');
    } else {
        // 模拟连接
        walletState.isConnected = true;
        walletState.address = '0x1234...abcd';
        showToast('钱包已连接');
    }
    updateWalletUI();
}

/**
 * 更新钱包 UI 状态
 */
function updateWalletUI() {
    if (walletState.isConnected) {
        const shortAddress = walletState.address.length > 10 
            ? `${walletState.address.slice(0, 6)}...${walletState.address.slice(-4)}`
            : walletState.address;
        
        walletText.textContent = shortAddress;
        connectWalletBtn.classList.add('wallet-connected');
    } else {
        walletText.textContent = '连接钱包';
        connectWalletBtn.classList.remove('wallet-connected');
    }
}

/**
 * 处理借款按钮点击
 */
function handleBorrow() {
    if (walletState.isBlacklisted) {
        showToast('您的账户已被列入黑名单，无法借款');
        return;
    }
    // 跳转到借款页面
    window.location.href = 'borrow.html';
}

/**
 * 检查并显示黑名单状态
 */
function checkBlacklistStatus() {
    const banner = document.getElementById('blacklistBanner');
    
    if (walletState.isBlacklisted) {
        banner.classList.add('active');
        document.body.classList.add('is-blacklisted');
        
        // 禁用借款按钮
        borrowBtn.disabled = true;
        borrowBtn.style.opacity = '0.5';
        borrowBtn.style.cursor = 'not-allowed';
        borrowBtn.innerHTML = '借款功能已禁用';
    } else {
        banner.classList.remove('active');
        document.body.classList.remove('is-blacklisted');
    }
}

/**
 * 显示 Toast 提示
 */
function showToast(message, duration = 3000) {
    // 移除已存在的 toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建 toast 元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        padding: 14px 28px;
        background: #1e1e2e;
        color: #fff;
        border-radius: 12px;
        font-size: 14px;
        z-index: 1000;
        animation: toastIn 0.3s ease;
        border: 1px solid #2e2e3e;
    `;
    
    document.body.appendChild(toast);
    
    // 自动移除
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// 添加 toast 动画样式
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes toastIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    @keyframes toastOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
    }
`;
document.head.appendChild(toastStyles);

/**
 * 监听钱包账户变化
 */
function setupWalletListeners() {
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                walletState.isConnected = false;
                walletState.address = null;
            } else {
                walletState.address = accounts[0];
            }
            updateWalletUI();
        });
        
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
    }
}

/**
 * 页面滚动效果
 */
function setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        }
    });
}

/**
 * 数字动画效果
 */
function animateNumbers() {
    const statValues = document.querySelectorAll('.stat-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                
                // 简单的数字动画效果
                target.style.opacity = '0';
                setTimeout(() => {
                    target.style.transition = 'opacity 0.5s ease';
                    target.style.opacity = '1';
                }, 100);
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statValues.forEach(stat => observer.observe(stat));
}

/**
 * 初始化
 */
function init() {
    // 绑定事件
    connectWalletBtn.addEventListener('click', connectWallet);
    borrowBtn.addEventListener('click', handleBorrow);
    
    // 设置监听器
    setupWalletListeners();
    setupScrollEffects();
    animateNumbers();
    
    // 检查黑名单状态
    checkBlacklistStatus();
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
