/**
 * CryptoCredit - 借款页面交互逻辑
 */

// 模拟黑名单状态（实际应从后端/链上获取）
// 设置为 true 可测试黑名单效果
const IS_BLACKLISTED = false;

// 黑名单模拟数据
const BLACKLIST_DATA = {
    totalDebt: 2156.50,
    overdueLoans: 2
};

// 信用等级配置
const CREDIT_GRADES = {
    A: { min: 750, max: 1000, quota: 5000, rate: 8, color: '#22c55e' },
    B: { min: 600, max: 749, quota: 2000, rate: 12, color: '#3b82f6' },
    C: { min: 450, max: 599, quota: 500, rate: 18, color: '#f59e0b' },
    D: { min: 0, max: 449, quota: 0, rate: 0, color: '#ef4444' }
};

// 状态管理
let state = {
    isConnected: false,
    address: null,
    isBlacklisted: IS_BLACKLISTED,
    creditScore: 0,
    creditGrade: null,
    maxQuota: 0,
    interestRate: 0,
    creditDetails: {
        wallet: 0,
        transaction: 0,
        asset: 0,
        defi: 0,
        repay: 0
    }
};

// DOM 元素
const elements = {
    connectWallet: document.getElementById('connectWallet'),
    walletText: document.getElementById('walletText'),
    connectPrompt: document.getElementById('connectPrompt'),
    borrowMain: document.getElementById('borrowMain'),
    promptConnectBtn: document.getElementById('promptConnectBtn'),
    
    // 黑名单相关
    blacklistBanner: document.getElementById('blacklistBanner'),
    blacklistPrompt: document.getElementById('blacklistPrompt'),
    blacklistDebt: document.getElementById('blacklistDebt'),
    blacklistLoans: document.getElementById('blacklistLoans'),
    
    // 信用评分
    scoreValue: document.getElementById('scoreValue'),
    scoreRing: document.getElementById('scoreRing'),
    creditGrade: document.getElementById('creditGrade'),
    maxQuota: document.getElementById('maxQuota'),
    interestRate: document.getElementById('interestRate'),
    
    // 借款表单
    borrowAmount: document.getElementById('borrowAmount'),
    amountSlider: document.getElementById('amountSlider'),
    maxSliderLabel: document.getElementById('maxSliderLabel'),
    borrowForm: document.getElementById('borrowForm'),
    submitBtn: document.getElementById('submitBtn'),
    
    // 费用显示
    feeAmount: document.getElementById('feeAmount'),
    feeTerm: document.getElementById('feeTerm'),
    feeRate: document.getElementById('feeRate'),
    feeInterest: document.getElementById('feeInterest'),
    feeTotal: document.getElementById('feeTotal'),
    
    // 弹窗
    successModal: document.getElementById('successModal'),
    modalAmount: document.getElementById('modalAmount'),
    modalDueDate: document.getElementById('modalDueDate'),
    modalRepayAmount: document.getElementById('modalRepayAmount'),
    modalCloseBtn: document.getElementById('modalCloseBtn')
};

/**
 * 连接钱包
 */
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (accounts.length > 0) {
                state.isConnected = true;
                state.address = accounts[0];
                updateWalletUI();
                
                // 检查黑名单状态
                if (state.isBlacklisted) {
                    showBlacklistInterface();
                } else {
                    showBorrowInterface();
                    await evaluateCredit();
                }
            }
        } catch (error) {
            console.error('连接钱包失败:', error);
            showToast('连接钱包失败，请重试');
        }
    } else {
        // 模拟连接
        simulateWalletConnect();
    }
}

/**
 * 模拟钱包连接
 */
function simulateWalletConnect() {
    state.isConnected = true;
    state.address = '0x1234...abcd';
    updateWalletUI();
    
    // 检查黑名单状态
    if (state.isBlacklisted) {
        showBlacklistInterface();
    } else {
        showBorrowInterface();
        evaluateCredit();
    }
}

/**
 * 更新钱包 UI
 */
function updateWalletUI() {
    if (state.isConnected) {
        const shortAddress = state.address.length > 10 
            ? `${state.address.slice(0, 6)}...${state.address.slice(-4)}`
            : state.address;
        
        elements.walletText.textContent = shortAddress;
        elements.connectWallet.classList.add('wallet-connected');
    } else {
        elements.walletText.textContent = '连接钱包';
        elements.connectWallet.classList.remove('wallet-connected');
    }
}

/**
 * 显示借款界面
 */
function showBorrowInterface() {
    elements.connectPrompt.style.display = 'none';
    elements.blacklistPrompt.style.display = 'none';
    elements.borrowMain.style.display = 'block';
}

/**
 * 显示黑名单界面
 */
function showBlacklistInterface() {
    elements.connectPrompt.style.display = 'none';
    elements.borrowMain.style.display = 'none';
    elements.blacklistPrompt.style.display = 'flex';
    
    // 更新黑名单信息
    elements.blacklistDebt.textContent = `${BLACKLIST_DATA.totalDebt.toLocaleString()} USDT`;
    elements.blacklistLoans.textContent = `${BLACKLIST_DATA.overdueLoans} 笔`;
    
    // 显示横幅
    elements.blacklistBanner.classList.add('active');
    document.body.classList.add('is-blacklisted');
}

/**
 * 评估信用分（模拟）
 */
async function evaluateCredit() {
    // 显示加载状态
    elements.scoreValue.textContent = '...';
    
    // 模拟 API 延迟
    await sleep(1500);
    
    // 模拟生成信用分数据
    state.creditDetails = {
        wallet: Math.floor(Math.random() * 40) + 60,    // 60-100
        transaction: Math.floor(Math.random() * 30) + 70, // 70-100
        asset: Math.floor(Math.random() * 35) + 65,      // 65-100
        defi: Math.floor(Math.random() * 50) + 50,       // 50-100
        repay: Math.floor(Math.random() * 20) + 80       // 80-100
    };
    
    // 计算加权总分
    const weights = { wallet: 0.2, transaction: 0.25, asset: 0.25, defi: 0.15, repay: 0.15 };
    state.creditScore = Math.round(
        state.creditDetails.wallet * weights.wallet * 10 +
        state.creditDetails.transaction * weights.transaction * 10 +
        state.creditDetails.asset * weights.asset * 10 +
        state.creditDetails.defi * weights.defi * 10 +
        state.creditDetails.repay * weights.repay * 10
    );
    
    // 限制在合理范围
    state.creditScore = Math.min(Math.max(state.creditScore, 300), 950);
    
    // 确定信用等级
    for (const [grade, config] of Object.entries(CREDIT_GRADES)) {
        if (state.creditScore >= config.min && state.creditScore <= config.max) {
            state.creditGrade = grade;
            state.maxQuota = config.quota;
            state.interestRate = config.rate;
            break;
        }
    }
    
    // 更新 UI
    updateCreditUI();
    updateFormLimits();
}

/**
 * 更新信用评分 UI
 */
function updateCreditUI() {
    // 更新分数
    animateNumber(elements.scoreValue, state.creditScore);
    
    // 更新圆环进度
    const progress = (state.creditScore / 1000) * 534;
    elements.scoreRing.style.strokeDashoffset = 534 - progress;
    elements.scoreRing.style.stroke = CREDIT_GRADES[state.creditGrade].color;
    
    // 更新等级徽章
    const gradeBadge = elements.creditGrade.querySelector('.grade-badge');
    const gradeText = elements.creditGrade.querySelector('.grade-text');
    
    gradeBadge.textContent = state.creditGrade;
    gradeBadge.className = `grade-badge grade-${state.creditGrade.toLowerCase()}`;
    
    const gradeDescriptions = {
        A: '信用优秀',
        B: '信用良好',
        C: '信用一般',
        D: '信用不足'
    };
    gradeText.textContent = gradeDescriptions[state.creditGrade];
    
    // 更新额度和利率
    elements.maxQuota.textContent = `${state.maxQuota.toLocaleString()} USDT`;
    elements.interestRate.textContent = `${state.interestRate}%`;
    
    // 更新信用明细条
    setTimeout(() => {
        document.getElementById('barWallet').style.width = `${state.creditDetails.wallet}%`;
        document.getElementById('barTransaction').style.width = `${state.creditDetails.transaction}%`;
        document.getElementById('barAsset').style.width = `${state.creditDetails.asset}%`;
        document.getElementById('barDefi').style.width = `${state.creditDetails.defi}%`;
        document.getElementById('barRepay').style.width = `${state.creditDetails.repay}%`;
        
        document.getElementById('scoreWallet').textContent = state.creditDetails.wallet;
        document.getElementById('scoreTransaction').textContent = state.creditDetails.transaction;
        document.getElementById('scoreAsset').textContent = state.creditDetails.asset;
        document.getElementById('scoreDefi').textContent = state.creditDetails.defi;
        document.getElementById('scoreRepay').textContent = state.creditDetails.repay;
    }, 300);
}

/**
 * 更新表单限制
 */
function updateFormLimits() {
    const max = state.maxQuota;
    
    elements.borrowAmount.max = max;
    elements.amountSlider.max = max;
    elements.maxSliderLabel.textContent = max;
    
    // 如果当前值超过最大值，调整
    if (parseInt(elements.borrowAmount.value) > max) {
        elements.borrowAmount.value = max;
        elements.amountSlider.value = max;
    }
    
    updateFeeDetails();
}

/**
 * 更新费用明细
 */
function updateFeeDetails() {
    const amount = parseInt(elements.borrowAmount.value) || 0;
    const termInput = document.querySelector('input[name="term"]:checked');
    const term = termInput ? parseInt(termInput.value) : 30;
    const token = document.querySelector('input[name="token"]:checked')?.value || 'USDT';
    
    // 计算利息
    const dailyRate = state.interestRate / 365 / 100;
    const interest = amount * dailyRate * term;
    const total = amount + interest;
    
    // 更新显示
    elements.feeAmount.textContent = `${amount.toLocaleString()} ${token}`;
    elements.feeTerm.textContent = `${term} 天`;
    elements.feeRate.textContent = `${state.interestRate}%`;
    elements.feeInterest.textContent = `${interest.toFixed(2)} ${token}`;
    elements.feeTotal.textContent = `${total.toFixed(2)} ${token}`;
}

/**
 * 处理借款提交
 */
async function handleBorrow(e) {
    e.preventDefault();
    
    if (!state.isConnected) {
        showToast('请先连接钱包');
        return;
    }
    
    if (state.creditGrade === 'D') {
        showToast('您的信用分不足，暂无法借款');
        return;
    }
    
    const amount = parseInt(elements.borrowAmount.value);
    if (amount < 100) {
        showToast('借款金额不能少于 100 USDT');
        return;
    }
    
    if (amount > state.maxQuota) {
        showToast(`借款金额不能超过 ${state.maxQuota} USDT`);
        return;
    }
    
    // 显示加载状态
    elements.submitBtn.classList.add('loading');
    elements.submitBtn.disabled = true;
    
    // 模拟借款处理
    await sleep(2000);
    
    // 恢复按钮状态
    elements.submitBtn.classList.remove('loading');
    elements.submitBtn.disabled = false;
    
    // 显示成功弹窗
    showSuccessModal();
}

/**
 * 显示成功弹窗
 */
function showSuccessModal() {
    const amount = parseInt(elements.borrowAmount.value);
    const term = parseInt(document.querySelector('input[name="term"]:checked').value);
    const token = document.querySelector('input[name="token"]:checked').value;
    
    const dailyRate = state.interestRate / 365 / 100;
    const interest = amount * dailyRate * term;
    const total = amount + interest;
    
    // 计算到期日
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + term);
    const dueDateStr = dueDate.toISOString().split('T')[0];
    
    elements.modalAmount.textContent = `${amount.toLocaleString()} ${token}`;
    elements.modalDueDate.textContent = dueDateStr;
    elements.modalRepayAmount.textContent = `${total.toFixed(2)} ${token}`;
    
    elements.successModal.classList.add('active');
}

/**
 * 关闭弹窗
 */
function closeModal() {
    elements.successModal.classList.remove('active');
}

/**
 * 数字动画
 */
function animateNumber(element, target) {
    const duration = 1000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 缓动函数
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * 显示 Toast
 */
function showToast(message, duration = 3000) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
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
    
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * 辅助函数
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 初始化
 */
function init() {
    // 添加 Toast 动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastIn {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes toastOut {
            from { opacity: 1; transform: translateX(-50%) translateY(0); }
            to { opacity: 0; transform: translateX(-50%) translateY(20px); }
        }
    `;
    document.head.appendChild(style);
    
    // 绑定钱包连接
    elements.connectWallet.addEventListener('click', connectWallet);
    elements.promptConnectBtn.addEventListener('click', connectWallet);
    
    // 金额输入同步
    elements.borrowAmount.addEventListener('input', () => {
        let value = parseInt(elements.borrowAmount.value) || 100;
        value = Math.max(100, Math.min(value, state.maxQuota || 5000));
        elements.amountSlider.value = value;
        updateFeeDetails();
    });
    
    elements.amountSlider.addEventListener('input', () => {
        elements.borrowAmount.value = elements.amountSlider.value;
        updateFeeDetails();
    });
    
    // 期限和币种选择
    document.querySelectorAll('input[name="term"], input[name="token"]').forEach(input => {
        input.addEventListener('change', updateFeeDetails);
    });
    
    // 表单提交
    elements.borrowForm.addEventListener('submit', handleBorrow);
    
    // 弹窗关闭
    elements.modalCloseBtn.addEventListener('click', closeModal);
    elements.successModal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    // 初始化费用显示
    state.interestRate = 8; // 默认利率
    updateFeeDetails();
}

// 启动
document.addEventListener('DOMContentLoaded', init);
