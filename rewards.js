/**
 * 激励记录页面 JavaScript
 */

// 模拟每日激励数据
const dailyRewards = [
    { date: '2026-01-08', address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', amount: '1,000 LISTA', status: 'pending' },
    { date: '2026-01-07', address: '0x5e6f7890abcdef1234567890abcdef1234567890', amount: '1,000 LISTA', status: 'claimed' },
    { date: '2026-01-06', address: '0x9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7890', amount: '1,000 LISTA', status: 'claimed' },
    { date: '2026-01-05', address: '0xab12cd34ef56gh78ij90kl12mn34op56qr78st90', amount: '1,000 LISTA', status: 'claimed' },
    { date: '2026-01-04', address: '0xef56gh78ij90kl12mn34op56qr78st90uv12wx34', amount: '1,000 LISTA', status: 'claimed' },
    { date: '2026-01-03', address: '0x2345678901abcdef2345678901abcdef23456789', amount: '1,000 LISTA', status: 'claimed' },
    { date: '2026-01-02', address: '0xfedcba0987654321fedcba0987654321fedcba09', amount: '1,000 LISTA', status: 'claimed' },
    { date: '2026-01-01', address: '0x7654321098765432109876543210987654321098', amount: '1,000 LISTA', status: 'claimed' },
];

// 模拟每周激励数据
const weeklyRewards = [
    { week: '2026 第2周', date: '2026-01-06', address: '0xab12cd34ef56gh78ij90kl12mn34op56qr78st90', amount: '10,000 LISTA', status: 'claimed' },
    { week: '2026 第1周', date: '2025-12-30', address: '0x5e6f7890abcdef1234567890abcdef1234567890', amount: '10,000 LISTA', status: 'claimed' },
    { week: '2025 第52周', date: '2025-12-23', address: '0x2345678901abcdef2345678901abcdef23456789', amount: '10,000 LISTA', status: 'claimed' },
    { week: '2025 第51周', date: '2025-12-16', address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', amount: '10,000 LISTA', status: 'claimed' },
];

// DOM 元素
const elements = {
    dailyRewardsBody: document.getElementById('dailyRewardsBody'),
    weeklyRewardsBody: document.getElementById('weeklyRewardsBody'),
    dailyPanel: document.getElementById('dailyPanel'),
    weeklyPanel: document.getElementById('weeklyPanel'),
    tabBtns: document.querySelectorAll('.tab-btn')
};

/**
 * 格式化地址
 */
function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * 渲染每日激励记录
 */
function renderDailyRewards() {
    elements.dailyRewardsBody.innerHTML = dailyRewards.map(reward => `
        <tr>
            <td>${reward.date}</td>
            <td class="recipient-address">${formatAddress(reward.address)}</td>
            <td class="reward-cell">${reward.amount}</td>
            <td>
                <span class="status-${reward.status}">
                    ${reward.status === 'claimed' ? (t('claimed') || '已领取') : (t('pendingClaim') || '待领取')}
                </span>
            </td>
        </tr>
    `).join('');
}

/**
 * 渲染每周激励记录
 */
function renderWeeklyRewards() {
    elements.weeklyRewardsBody.innerHTML = weeklyRewards.map(reward => `
        <tr>
            <td>${reward.week}</td>
            <td class="recipient-address">${formatAddress(reward.address)}</td>
            <td class="reward-cell">${reward.amount}</td>
            <td>
                <span class="status-${reward.status}">
                    ${reward.status === 'claimed' ? (t('claimed') || '已领取') : (t('pendingClaim') || '待领取')}
                </span>
            </td>
        </tr>
    `).join('');
}

/**
 * 切换标签页
 */
function switchTab(tab) {
    elements.tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    elements.dailyPanel.classList.toggle('active', tab === 'daily');
    elements.weeklyPanel.classList.toggle('active', tab === 'weekly');
}

/**
 * 初始化
 */
function init() {
    // 绑定标签页事件
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // 渲染数据
    renderDailyRewards();
    renderWeeklyRewards();
}

// 启动
document.addEventListener('DOMContentLoaded', init);
