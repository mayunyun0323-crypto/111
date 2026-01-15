/**
 * 失信名单页面 JavaScript
 */

// 模拟失信名单数据
const blacklistData = [
    {
        address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
        debt: 8500.00,
        overdueDays: 67,
        blacklistDate: '2025-11-02',
        status: 'blacklisted'
    },
    {
        address: '0x2345678901abcdef2345678901abcdef23456789',
        debt: 4200.50,
        overdueDays: 52,
        blacklistDate: '2025-11-17',
        status: 'blacklisted'
    },
    {
        address: '0xabcdef1234567890abcdef1234567890abcdef34',
        debt: 12300.00,
        overdueDays: 89,
        blacklistDate: '2025-10-12',
        status: 'blacklisted'
    },
    {
        address: '0x567890abcdef1234567890abcdef1234567890ab',
        debt: 3100.25,
        overdueDays: 45,
        blacklistDate: '2025-11-24',
        status: 'blacklisted'
    },
    {
        address: '0xdef1234567890abcdef1234567890abcdef123456',
        debt: 6750.00,
        overdueDays: 61,
        blacklistDate: '2025-11-08',
        status: 'blacklisted'
    },
    {
        address: '0x890abcdef1234567890abcdef1234567890abcdef',
        debt: 2800.00,
        overdueDays: 38,
        blacklistDate: '2025-12-01',
        status: 'blacklisted'
    },
    {
        address: '0x4567890abcdef1234567890abcdef1234567890cd',
        debt: 15600.00,
        overdueDays: 102,
        blacklistDate: '2025-09-28',
        status: 'blacklisted'
    },
    {
        address: '0xfedcba0987654321fedcba0987654321fedcba09',
        debt: 5400.75,
        overdueDays: 55,
        blacklistDate: '2025-11-14',
        status: 'blacklisted'
    },
    {
        address: '0x1234abcd5678efgh1234abcd5678efgh1234abcd',
        debt: 9200.00,
        overdueDays: 73,
        blacklistDate: '2025-10-27',
        status: 'blacklisted'
    },
    {
        address: '0xaaaabbbbccccddddeeeeffffgggghhhhiiiijjjj',
        debt: 1850.50,
        overdueDays: 33,
        blacklistDate: '2025-12-06',
        status: 'blacklisted'
    },
    {
        address: '0x9876543210fedcba9876543210fedcba98765432',
        debt: 7300.00,
        overdueDays: 58,
        blacklistDate: '2025-11-11',
        status: 'blacklisted'
    },
    {
        address: '0x0123456789abcdef0123456789abcdef01234567',
        debt: 4100.00,
        overdueDays: 41,
        blacklistDate: '2025-11-28',
        status: 'blacklisted'
    }
];

// 分页配置
const PAGE_SIZE = 10;
let currentPage = 1;
let filteredData = [...blacklistData];

// DOM 元素
const elements = {
    tableBody: document.getElementById('blacklistTableBody'),
    searchInput: document.getElementById('searchAddress'),
    searchBtn: document.getElementById('searchBtn'),
    sortFilter: document.getElementById('sortFilter'),
    currentPageEl: document.getElementById('currentPage'),
    totalPagesEl: document.getElementById('totalPages'),
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    totalBlacklisted: document.getElementById('totalBlacklisted'),
    totalDebt: document.getElementById('totalDebt'),
    avgOverdue: document.getElementById('avgOverdue')
};

/**
 * 格式化地址
 */
function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * 获取逾期等级
 */
function getOverdueLevel(days) {
    if (days >= 60) return 'severe';
    if (days >= 30) return 'medium';
    return 'light';
}

/**
 * 渲染表格
 */
function renderTable() {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageData = filteredData.slice(start, end);
    
    if (pageData.length === 0) {
        elements.tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
                    ${t('noResults') || '未找到匹配的地址'}
                </td>
            </tr>
        `;
        return;
    }
    
    elements.tableBody.innerHTML = pageData.map(item => {
        const level = getOverdueLevel(item.overdueDays);
        const statusText = item.status === 'blacklisted' 
            ? (t('statusBlacklisted') || '已列入') 
            : (t('statusRemoved') || '已移除');
        
        return `
            <tr>
                <td>
                    <div class="address-cell">
                        <div class="address-icon">!</div>
                        <span class="address-text">
                            <span class="short">${formatAddress(item.address)}</span>
                            <span class="full">${item.address}</span>
                        </span>
                    </div>
                </td>
                <td>
                    <span class="debt-amount">${item.debt.toLocaleString()} USDT</span>
                </td>
                <td>
                    <span class="overdue-days ${level}">
                        <span class="days-num">${item.overdueDays}</span>
                        <span>${t('days') || '天'}</span>
                    </span>
                </td>
                <td>${item.blacklistDate}</td>
                <td>
                    <span class="status-badge ${item.status}">${statusText}</span>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * 更新分页
 */
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / PAGE_SIZE) || 1;
    
    elements.currentPageEl.textContent = currentPage;
    elements.totalPagesEl.textContent = totalPages;
    elements.prevPage.disabled = currentPage <= 1;
    elements.nextPage.disabled = currentPage >= totalPages;
}

/**
 * 更新统计信息
 */
function updateStats() {
    const totalDebt = blacklistData.reduce((sum, item) => sum + item.debt, 0);
    const avgDays = Math.round(blacklistData.reduce((sum, item) => sum + item.overdueDays, 0) / blacklistData.length);
    
    elements.totalBlacklisted.textContent = blacklistData.length;
    elements.totalDebt.textContent = `$${(totalDebt / 1000).toFixed(1)}K`;
    elements.avgOverdue.textContent = avgDays;
}

/**
 * 搜索
 */
function handleSearch() {
    const query = elements.searchInput.value.trim().toLowerCase();
    
    if (query) {
        filteredData = blacklistData.filter(item => 
            item.address.toLowerCase().includes(query)
        );
    } else {
        filteredData = [...blacklistData];
    }
    
    currentPage = 1;
    sortData();
    renderTable();
    updatePagination();
}

/**
 * 排序
 */
function sortData() {
    const sortBy = elements.sortFilter.value;
    
    filteredData.sort((a, b) => {
        switch (sortBy) {
            case 'amount':
                return b.debt - a.debt;
            case 'days':
                return b.overdueDays - a.overdueDays;
            case 'date':
            default:
                return new Date(b.blacklistDate) - new Date(a.blacklistDate);
        }
    });
}

/**
 * 处理排序变更
 */
function handleSort() {
    sortData();
    renderTable();
}

/**
 * 上一页
 */
function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
        updatePagination();
    }
}

/**
 * 下一页
 */
function goToNextPage() {
    const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
        updatePagination();
    }
}

/**
 * 初始化
 */
function init() {
    // 绑定事件
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    elements.sortFilter.addEventListener('change', handleSort);
    elements.prevPage.addEventListener('click', goToPrevPage);
    elements.nextPage.addEventListener('click', goToNextPage);
    
    // 初始渲染
    sortData();
    updateStats();
    renderTable();
    updatePagination();
}

// 启动
document.addEventListener('DOMContentLoaded', init);
