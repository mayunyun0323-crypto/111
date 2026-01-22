/**
 * CryptoCredit - 个人中心交互逻辑
 */

// 信用等级配置
const CREDIT_GRADES = {
    A: { min: 750, max: 1000, quota: 5000, rate: 8, label: 'A级 优秀' },
    B: { min: 600, max: 749, quota: 2000, rate: 12, label: 'B级 良好' },
    C: { min: 450, max: 599, quota: 500, rate: 18, label: 'C级 一般' },
    D: { min: 0, max: 449, quota: 0, rate: 0, label: 'D级 不足' }
};

// 模拟黑名单状态（实际应从后端/链上获取）
// 设置为 true 可测试黑名单效果
const IS_BLACKLISTED = false;

// 逾期滞纳金费率配置
const OVERDUE_RATES = {
    light: { min: 1, max: 3, rate: 0.0005, creditLoss: 10 },      // 轻度逾期 1-3天
    medium: { min: 4, max: 7, rate: 0.001, creditLoss: 30 },      // 中度逾期 4-7天
    severe: { min: 8, max: 14, rate: 0.0015, creditLoss: 50 },    // 重度逾期 8-14天
    serious: { min: 15, max: 30, rate: 0.002, creditLoss: 100 },  // 严重逾期 15-30天
    default: { min: 31, max: Infinity, rate: 0, creditLoss: 0 }   // 违约 >30天
};

// 模拟数据
const mockData = {
    // 当前借款
    activeLoans: [
        {
            id: 'LC2026010801',
            amount: 2000,
            token: 'USDT',
            borrowDate: '2026-01-05T14:30:00Z',
            dueDate: '2026-02-04T14:30:00Z',
            term: 30,
            rate: 8,
            interest: 13.15,
            status: 'active',
            txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12'
        },
        {
            id: 'LC2026010701',
            amount: 800,
            token: 'USDC',
            borrowDate: '2026-01-01T09:15:00Z',
            dueDate: '2026-01-10T09:15:00Z',
            term: 14,
            rate: 8,
            interest: 2.46,
            status: 'due-soon',
            txHash: '0x2345678901abcdef2345678901abcdef23456789'
        },
        {
            id: 'LC2026010502',
            amount: 500,
            token: 'USDT',
            borrowDate: '2025-12-28T16:45:00Z',
            dueDate: '2026-01-04T16:45:00Z',
            term: 14,
            rate: 8,
            interest: 1.53,
            status: 'overdue',
            txHash: '0xabcdef1234567890abcdef1234567890abcdef34'
        },
        {
            id: 'LC2025122801',
            amount: 1000,
            token: 'USDT',
            borrowDate: '2025-12-20T11:20:00Z',
            dueDate: '2025-12-27T11:20:00Z',
            term: 7,
            rate: 8,
            interest: 1.53,
            status: 'overdue',
            txHash: '0x567890abcdef1234567890abcdef1234567890ab'
        }
    ],
    // 历史记录
    history: [
        {
            id: 'LC2026010801',
            amount: 2000,
            token: 'USDT',
            borrowDate: '2026-01-05T14:30:00Z',
            dueDate: '2026-02-04T14:30:00Z',
            term: 30,
            rate: 8,
            interest: 13.15,
            status: 'active',
            txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12'
        },
        {
            id: 'LC2026010701',
            amount: 800,
            token: 'USDC',
            borrowDate: '2026-01-01T09:15:00Z',
            dueDate: '2026-01-10T09:15:00Z',
            term: 14,
            rate: 8,
            interest: 2.46,
            status: 'active',
            txHash: '0x2345678901abcdef2345678901abcdef23456789'
        },
        {
            id: 'LC2026010502',
            amount: 500,
            token: 'USDT',
            borrowDate: '2025-12-28T16:45:00Z',
            dueDate: '2026-01-04T16:45:00Z',
            term: 14,
            rate: 8,
            interest: 1.53,
            status: 'overdue',
            txHash: '0xabcdef1234567890abcdef1234567890abcdef34'
        },
        {
            id: 'LC2025122801',
            amount: 1000,
            token: 'USDT',
            borrowDate: '2025-12-20T11:20:00Z',
            dueDate: '2025-12-27T11:20:00Z',
            term: 7,
            rate: 8,
            interest: 1.53,
            status: 'overdue',
            txHash: '0x567890abcdef1234567890abcdef1234567890ab'
        },
        {
            id: 'LC2025122001',
            amount: 1000,
            token: 'USDT',
            borrowDate: '2025-12-01T08:00:00Z',
            dueDate: '2025-12-31T08:00:00Z',
            term: 30,
            rate: 8,
            interest: 6.58,
            status: 'repaid',
            txHash: '0xdef1234567890abcdef1234567890abcdef1234'
        },
        {
            id: 'LC2025110501',
            amount: 800,
            token: 'USDC',
            borrowDate: '2025-11-01T10:30:00Z',
            dueDate: '2025-11-15T10:30:00Z',
            term: 14,
            rate: 8,
            interest: 2.63,
            status: 'repaid',
            txHash: '0x890abcdef1234567890abcdef1234567890abcd'
        },
        {
            id: 'LC2025100101',
            amount: 500,
            token: 'USDT',
            borrowDate: '2025-10-01T15:45:00Z',
            dueDate: '2025-10-08T15:45:00Z',
            term: 7,
            rate: 8,
            interest: 0.77,
            status: 'repaid',
            txHash: '0x4567890abcdef1234567890abcdef1234567890'
        }
    ],
    // 信用数据
    credit: {
        score: 785,
        grade: 'A',
        details: {
            wallet: 82,
            transaction: 88,
            asset: 75,
            defi: 68,
            repay: 95
        }
    }
};

// 状态
let state = {
    isConnected: false,
    address: null,
    isBlacklisted: IS_BLACKLISTED,
    currentRepayLoan: null,
    currentRepayTotal: 0,
    currentDetailLoan: null
};

// DOM 元素
const elements = {
    connectWallet: document.getElementById('connectWallet'),
    walletText: document.getElementById('walletText'),
    connectPrompt: document.getElementById('connectPrompt'),
    dashboardMain: document.getElementById('dashboardMain'),
    promptConnectBtn: document.getElementById('promptConnectBtn'),
    
    // 待还款
    pendingRepay: document.getElementById('pendingRepay'),
    
    // 黑名单相关
    blacklistBanner: document.getElementById('blacklistBanner'),
    
    // 历史记录
    historyFilter: document.getElementById('historyFilter'),
    historyTableBody: document.getElementById('historyTableBody'),
    emptyHistory: document.getElementById('emptyHistory'),
    
// 还款弹窗
    repayModal: document.getElementById('repayModal'),
    repayLoanId: document.getElementById('repayLoanId'),
    repayPrincipal: document.getElementById('repayPrincipal'),
    repayInterest: document.getElementById('repayInterest'),
    repayPenalty: document.getElementById('repayPenalty'),
    repayTotal: document.getElementById('repayTotal'),
    walletBalance: document.getElementById('walletBalance'),
    repayModalClose: document.getElementById('repayModalClose'),
    repayCancel: document.getElementById('repayCancel'),
    repayConfirm: document.getElementById('repayConfirm'),
    partialRepaySection: document.getElementById('partialRepaySection'),
    partialRepayAmount: document.getElementById('partialRepayAmount'),
    remainingValue: document.getElementById('remainingValue'),
    repayConfirmAmount: document.getElementById('repayConfirmAmount'),

    // 成功弹窗
    successModal: document.getElementById('successModal'),
    successAmount: document.getElementById('successAmount'),
    successClose: document.getElementById('successClose'),
    
    // 详情弹窗
    detailModal: document.getElementById('detailModal'),
    detailLoanId: document.getElementById('detailLoanId'),
    detailStatus: document.getElementById('detailStatus'),
    detailPrincipal: document.getElementById('detailPrincipal'),
    detailTotal: document.getElementById('detailTotal'),
    detailBorrowDate: document.getElementById('detailBorrowDate'),
    detailDueDate: document.getElementById('detailDueDate'),
    detailTerm: document.getElementById('detailTerm'),
    detailDaysLabel: document.getElementById('detailDaysLabel'),
    detailDaysValue: document.getElementById('detailDaysValue'),
    overdueWarning: document.getElementById('overdueWarning'),
    overdueDesc: document.getElementById('overdueDesc'),
    detailTxHash: document.getElementById('detailTxHash'),
    copyTxHash: document.getElementById('copyTxHash'),
    detailModalClose: document.getElementById('detailModalClose'),
    detailClose: document.getElementById('detailClose'),
    detailRepayBtn: document.getElementById('detailRepayBtn')
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
                onWalletConnected();
            }
        } catch (error) {
            console.error('连接钱包失败:', error);
            showToast('连接钱包失败，请重试');
        }
    } else {
        // 模拟连接
        state.isConnected = true;
        state.address = '0x1234...abcd';
        onWalletConnected();
    }
}

/**
 * 钱包连接后处理
 */
function onWalletConnected() {
    updateWalletUI();
    elements.connectPrompt.style.display = 'none';
    elements.dashboardMain.style.display = 'block';
    loadDashboardData();
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
    }
}

/**
 * 加载仪表盘数据
 */
function loadDashboardData() {
    // 计算待还款（包含滞纳金）
    const activeLoans = mockData.activeLoans;
    let pendingRepay = 0;
    activeLoans.forEach(loan => {
        const overdueInfo = calculateOverdueInfo(loan);
        pendingRepay += loan.amount + loan.interest + overdueInfo.penalty;
    });
    
    // 更新待还款总额
    elements.pendingRepay.textContent = `${pendingRepay.toFixed(2)} USDT`;
    
    // 检查黑名单状态
    if (state.isBlacklisted) {
        elements.blacklistBanner.classList.add('active');
        document.body.classList.add('is-blacklisted');
    }
    
    // 渲染历史记录
    renderHistory();
}


/**
 * 格式化日期时间为 UTC+0 格式
 */
function formatDateTimeUTC(dateStr) {
    const date = new Date(dateStr);
    
    // 格式化为 YYYY-MM-DD HH:mm:ss UTC+0
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC+0`;
}

/**
 * 计算逾期信息
 */
function calculateOverdueInfo(loan) {
    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    const daysOverdue = Math.max(0, Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)));
    
    if (daysOverdue === 0) {
        return { daysOverdue: 0, penalty: 0, rate: 0, level: null };
    }
    
    // 根据逾期天数计算滞纳金
    let totalPenalty = 0;
    let currentDay = 1;
    
    while (currentDay <= daysOverdue) {
        let dayRate = 0;
        if (currentDay <= 3) {
            dayRate = OVERDUE_RATES.light.rate;
        } else if (currentDay <= 7) {
            dayRate = OVERDUE_RATES.medium.rate;
        } else if (currentDay <= 14) {
            dayRate = OVERDUE_RATES.severe.rate;
        } else if (currentDay <= 30) {
            dayRate = OVERDUE_RATES.serious.rate;
        }
        totalPenalty += loan.amount * dayRate;
        currentDay++;
    }
    
    // 确定逾期级别
    let level = 'light';
    if (daysOverdue > 30) level = 'default';
    else if (daysOverdue > 14) level = 'serious';
    else if (daysOverdue > 7) level = 'severe';
    else if (daysOverdue > 3) level = 'medium';
    
    return { daysOverdue, penalty: totalPenalty, level };
}



/**
 * 渲染历史记录
 */
function renderHistory(filter = 'all') {
    let history = mockData.history;
    
    if (filter !== 'all') {
        history = history.filter(h => h.status === filter);
    }
    
    if (history.length === 0) {
        elements.historyTableBody.parentElement.style.display = 'none';
        elements.emptyHistory.style.display = 'block';
        return;
    }
    
    elements.historyTableBody.parentElement.style.display = 'table';
    elements.emptyHistory.style.display = 'none';
    
    elements.historyTableBody.innerHTML = history.map(item => {
        const statusLabels = {
            active: '进行中',
            repaid: '已还款',
            overdue: '已逾期'
        };
        
        const needsRepay = item.status === 'active' || item.status === 'overdue';
        
        return `
            <tr>
                <td>${item.id}</td>
                <td>${item.amount.toLocaleString()} ${item.token}</td>
                <td>${item.borrowDate}</td>
                <td>${item.dueDate}</td>
                <td>${item.interest.toFixed(2)} ${item.token}</td>
                <td><span class="status-badge ${item.status}">${statusLabels[item.status]}</span></td>
                <td>
                    ${needsRepay 
                        ? `<button class="btn btn-primary btn-small history-repay-btn" data-id="${item.id}">还款</button>`
                        : ''
                    }
                    <button class="btn btn-outline btn-small history-detail-btn" data-id="${item.id}">详情</button>
                </td>
            </tr>
        `;
    }).join('');
    
    // 绑定历史记录还款按钮
    elements.historyTableBody.querySelectorAll('.history-repay-btn').forEach(btn => {
        btn.addEventListener('click', () => openRepayModal(btn.dataset.id));
    });
    
    // 绑定历史记录详情按钮
    elements.historyTableBody.querySelectorAll('.history-detail-btn').forEach(btn => {
        btn.addEventListener('click', () => openDetailModal(btn.dataset.id));
    });
}

/**
 * 打开还款弹窗
 */
function openRepayModal(loanId) {
    // 从 activeLoans 或 history 中查找借款
    let loan = mockData.activeLoans.find(l => l.id === loanId);
    if (!loan) {
        loan = mockData.history.find(l => l.id === loanId && (l.status === 'active' || l.status === 'overdue'));
    }
    if (!loan) return;
    
    state.currentRepayLoan = loan;
    
    // 计算逾期信息
    const overdueInfo = calculateOverdueInfo(loan);
    const total = loan.amount + loan.interest + overdueInfo.penalty;
    state.currentRepayTotal = total;
    
    // 更新弹窗内容
    elements.repayLoanId.textContent = loan.id;
    elements.repayPrincipal.textContent = `${loan.amount.toLocaleString()} ${loan.token}`;
    elements.repayInterest.textContent = `${loan.interest.toFixed(2)} ${loan.token}`;
    elements.repayPenalty.textContent = `${overdueInfo.penalty.toFixed(2)} ${loan.token}`;
    elements.repayTotal.textContent = `${total.toFixed(2)} ${loan.token}`;
    elements.walletBalance.textContent = `${(Math.random() * 5000 + 3000).toFixed(2)} USDT`;
    
    // 重置还款方式为全额还款
    document.querySelector('input[name="repayType"][value="full"]').checked = true;
    elements.partialRepaySection.style.display = 'none';
    elements.partialRepayAmount.value = '';
    elements.repayConfirmAmount.textContent = `${total.toFixed(2)} USDT`;
    updateRemainingAmount();
    
    // 清除快捷按钮选中状态
    document.querySelectorAll('.hint-btn').forEach(btn => btn.classList.remove('active'));
    
    elements.repayModal.classList.add('active');
}

/**
 * 切换还款方式
 */
function toggleRepayType(type) {
    if (type === 'partial') {
        elements.partialRepaySection.style.display = 'block';
        elements.partialRepayAmount.value = '';
        elements.repayConfirmAmount.textContent = '';
        updateRemainingAmount();
    } else {
        elements.partialRepaySection.style.display = 'none';
        elements.repayConfirmAmount.textContent = `${state.currentRepayTotal.toFixed(2)} USDT`;
    }
}

/**
 * 更新剩余待还金额
 */
function updateRemainingAmount() {
    const repayAmount = parseFloat(elements.partialRepayAmount.value) || 0;
    const remaining = Math.max(0, state.currentRepayTotal - repayAmount);
    elements.remainingValue.textContent = `${remaining.toFixed(2)} USDT`;
    
    if (repayAmount > 0) {
        elements.repayConfirmAmount.textContent = `${repayAmount.toFixed(2)} USDT`;
    } else {
        elements.repayConfirmAmount.textContent = '';
    }
}

/**
 * 设置还款百分比
 */
function setRepayPercent(percent) {
    const amount = (state.currentRepayTotal * percent / 100).toFixed(2);
    elements.partialRepayAmount.value = amount;
    updateRemainingAmount();
    
    // 更新按钮状态
    document.querySelectorAll('.hint-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.percent) === percent);
    });
}

/**
 * 关闭还款弹窗
 */
function closeRepayModal() {
    elements.repayModal.classList.remove('active');
    state.currentRepayLoan = null;
    state.currentRepayTotal = 0;
}

/**
 * 确认还款
 */
async function confirmRepay() {
    if (!state.currentRepayLoan) return;
    
    const loan = state.currentRepayLoan;
    const isPartial = document.querySelector('input[name="repayType"]:checked').value === 'partial';
    
    let repayAmount;
    if (isPartial) {
        repayAmount = parseFloat(elements.partialRepayAmount.value) || 0;
        if (repayAmount <= 0) {
            showToast(t('toastEnterAmount') || '请输入还款金额');
            return;
        }
        if (repayAmount > state.currentRepayTotal) {
            repayAmount = state.currentRepayTotal;
        }
    } else {
        repayAmount = state.currentRepayTotal;
    }
    
    // 显示加载状态
    elements.repayConfirm.classList.add('loading');
    elements.repayConfirm.disabled = true;
    
    // 模拟还款处理
    await sleep(2000);
    
    const isFullyRepaid = repayAmount >= state.currentRepayTotal - 0.01;
    
    if (isFullyRepaid) {
        // 全额还款 - 从活跃列表移除
        const loanIndex = mockData.activeLoans.findIndex(l => l.id === loan.id);
        if (loanIndex > -1) {
            mockData.activeLoans.splice(loanIndex, 1);
        }
        
        const historyIndex = mockData.history.findIndex(h => h.id === loan.id);
        if (historyIndex > -1) {
            mockData.history[historyIndex].status = 'repaid';
        }
    } else {
        // 部分还款 - 更新剩余金额
        const remaining = state.currentRepayTotal - repayAmount;
        const loanIndex = mockData.activeLoans.findIndex(l => l.id === loan.id);
        if (loanIndex > -1) {
            // 按比例减少本金（简化处理）
            const ratio = remaining / state.currentRepayTotal;
            mockData.activeLoans[loanIndex].amount = parseFloat((loan.amount * ratio).toFixed(2));
            mockData.activeLoans[loanIndex].interest = parseFloat((loan.interest * ratio).toFixed(2));
        }
    }
    
    // 恢复按钮状态
    elements.repayConfirm.classList.remove('loading');
    elements.repayConfirm.disabled = false;
    
    // 关闭还款弹窗，显示成功弹窗
    closeRepayModal();
    
    elements.successAmount.textContent = `${repayAmount.toFixed(2)} ${loan.token}`;
    elements.successModal.classList.add('active');
}

/**
 * 关闭成功弹窗
 */
function closeSuccessModal() {
    elements.successModal.classList.remove('active');
    // 刷新数据
    loadDashboardData();
}

/**
 * 打开详情弹窗
 */
function openDetailModal(loanId) {
    // 从 activeLoans 或 history 中查找借款
    let loan = mockData.activeLoans.find(l => l.id === loanId);
    if (!loan) {
        loan = mockData.history.find(l => l.id === loanId);
    }
    if (!loan) return;
    
    state.currentDetailLoan = loan;
    
    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    const borrowDate = new Date(loan.borrowDate);
    const totalDays = Math.ceil((dueDate - borrowDate) / (1000 * 60 * 60 * 24));
    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    // 计算逾期信息
    const overdueInfo = calculateOverdueInfo(loan);
    
    // 更新基本信息
    elements.detailLoanId.textContent = loan.id;
    
    // 更新状态
    let statusClass = 'active';
    let statusText = '进行中';
    
    if (loan.status === 'repaid') {
        statusClass = 'repaid';
        statusText = '已还款';
    } else if (daysLeft <= 0) {
        statusClass = 'overdue';
        statusText = '已逾期';
    } else if (daysLeft <= 3) {
        statusClass = 'due-soon';
        statusText = '即将到期';
    }
    
    elements.detailStatus.textContent = statusText;
    elements.detailStatus.className = `detail-status ${statusClass}`;
    
    // 更新金额信息
    elements.detailPrincipal.textContent = `${loan.amount.toLocaleString()} ${loan.token}`;
    
    const total = loan.amount + loan.interest + overdueInfo.penalty;
    elements.detailTotal.textContent = `${total.toFixed(2)} ${loan.token}`;
    
    // 更新时间信息（显示完整时间和 UTC+0）
    elements.detailBorrowDate.textContent = formatDateTimeUTC(loan.borrowDate);
    elements.detailDueDate.textContent = formatDateTimeUTC(loan.dueDate);
    elements.detailTerm.textContent = `${loan.term} 天`;
    
    if (daysLeft > 0) {
        elements.detailDaysLabel.textContent = '剩余天数';
        elements.detailDaysValue.textContent = `${daysLeft} 天`;
        elements.detailDaysValue.style.color = daysLeft <= 3 ? '#f59e0b' : '';
    } else if (loan.status === 'repaid') {
        elements.detailDaysLabel.textContent = '还款状态';
        elements.detailDaysValue.textContent = '已完成';
        elements.detailDaysValue.style.color = '#22c55e';
    } else {
        elements.detailDaysLabel.textContent = '逾期天数';
        elements.detailDaysValue.textContent = `${Math.abs(daysLeft)} 天`;
        elements.detailDaysValue.style.color = '#ef4444';
    }
    
    // 逾期警告
    if (daysLeft <= 0 && loan.status !== 'repaid') {
        elements.overdueWarning.style.display = 'flex';
        
        const levelMessages = {
            light: '请尽快还款，逾期将影响您的信用评分（-10分）',
            medium: '您的借款额度已被降低，请立即还款（信用 -30分）',
            severe: '您的借款资格已暂停，请立即还款（信用 -50分）',
            serious: '您已被列入灰名单，请立即还款以恢复信用（信用 -100分）',
            default: '您已被列入黑名单，请联系客服处理'
        };
        
        elements.overdueDesc.textContent = levelMessages[overdueInfo.level] || levelMessages.light;
    } else {
        elements.overdueWarning.style.display = 'none';
    }
    
    // 更新交易信息
    const shortHash = loan.txHash 
        ? `${loan.txHash.slice(0, 6)}...${loan.txHash.slice(-4)}`
        : '--';
    elements.detailTxHash.textContent = shortHash;
    
    // 还款按钮状态
    if (loan.status === 'repaid') {
        elements.detailRepayBtn.style.display = 'none';
    } else {
        elements.detailRepayBtn.style.display = 'block';
    }
    
    elements.detailModal.classList.add('active');
}

/**
 * 关闭详情弹窗
 */
function closeDetailModal() {
    elements.detailModal.classList.remove('active');
    state.currentDetailLoan = null;
}

/**
 * 从详情弹窗跳转到还款
 */
function detailToRepay() {
    if (state.currentDetailLoan) {
        const loanId = state.currentDetailLoan.id;
        closeDetailModal();
        openRepayModal(loanId);
    }
}

/**
 * 复制交易哈希
 */
function copyToClipboard(text, fullHash) {
    const textToCopy = fullHash || text;
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('已复制到剪贴板');
    }).catch(() => {
        showToast('复制失败，请手动复制');
    });
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
    // 添加动画样式
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
    
    // 钱包连接
    elements.connectWallet.addEventListener('click', connectWallet);
    elements.promptConnectBtn.addEventListener('click', connectWallet);
    
    // 历史筛选
    elements.historyFilter.addEventListener('change', (e) => {
        renderHistory(e.target.value);
    });
    
    // 还款弹窗
    elements.repayModalClose.addEventListener('click', closeRepayModal);
    elements.repayCancel.addEventListener('click', closeRepayModal);
    elements.repayModal.querySelector('.modal-overlay').addEventListener('click', closeRepayModal);
    elements.repayConfirm.addEventListener('click', confirmRepay);
    
    // 还款方式切换
    document.querySelectorAll('input[name="repayType"]').forEach(radio => {
        radio.addEventListener('change', (e) => toggleRepayType(e.target.value));
    });
    
    // 部分还款金额输入
    elements.partialRepayAmount.addEventListener('input', () => {
        updateRemainingAmount();
        // 清除快捷按钮选中状态
        document.querySelectorAll('.hint-btn').forEach(btn => btn.classList.remove('active'));
    });
    
    // 快捷百分比按钮
    document.querySelectorAll('.hint-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const percent = parseInt(btn.dataset.percent);
            setRepayPercent(percent);
        });
    });
    
    // 成功弹窗
    elements.successClose.addEventListener('click', closeSuccessModal);
    elements.successModal.querySelector('.modal-overlay').addEventListener('click', closeSuccessModal);
    
    // 详情弹窗
    elements.detailModalClose.addEventListener('click', closeDetailModal);
    elements.detailClose.addEventListener('click', closeDetailModal);
    elements.detailModal.querySelector('.modal-overlay').addEventListener('click', closeDetailModal);
    elements.detailRepayBtn.addEventListener('click', detailToRepay);
    
    // 复制交易哈希
    elements.copyTxHash.addEventListener('click', () => {
        if (state.currentDetailLoan && state.currentDetailLoan.txHash) {
            copyToClipboard(elements.detailTxHash.textContent, state.currentDetailLoan.txHash);
        }
    });
}

// 启动
document.addEventListener('DOMContentLoaded', init);
