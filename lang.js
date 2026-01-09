/**
 * CryptoCredit - 多语言支持
 */

// 语言包
const LANG = {
    zh: {
        // 通用
        connectWallet: '连接钱包',
        walletConnected: '已连接',
        borrow: '借款',
        dashboard: '个人中心',
        close: '关闭',
        confirm: '确认',
        cancel: '取消',
        copy: '复制',
        copied: '已复制到剪贴板',
        copyFailed: '复制失败，请手动复制',
        loading: '加载中...',
        
        // 首页
        heroTitle: '无抵押，即时借款',
        heroSubtitle: '基于链上信用评估，最高可借',
        heroBadge: 'DeFi 信用借贷',
        borrowNow: '立即借款',
        checkRepay: '查账还款',
        
        // 特点
        featureNoCollateral: '无需抵押',
        featureNoCollateralDesc: '信用借款，无需锁仓',
        featureInstant: '秒级到账',
        featureInstantDesc: '审核通过即时放款',
        featureFlexible: '灵活还款',
        featureFlexibleDesc: '支持提前还款',
        
        // 统计
        statTotalLent: '累计放款',
        statActiveUsers: '活跃用户',
        statMinRate: '最低年化',
        statRepayRate: '还款率',
        
        // 如何借款
        howItWorks: '如何借款',
        step1Title: '连接钱包',
        step1Desc: '支持 MetaMask、WalletConnect 等主流钱包',
        step2Title: '信用评估',
        step2Desc: '系统自动分析链上数据生成信用评分',
        step3Title: '确认借款',
        step3Desc: '选择金额和期限，签名确认即可',
        step4Title: '资金到账',
        step4Desc: 'USDT 直接转入您的钱包地址',
        
        // 页脚
        footerDocs: '文档',
        footerTerms: '条款',
        footerPrivacy: '隐私',
        footerContact: '联系我们',
        
        // 借款页面
        creditScore: '信用评分',
        creditGrade: '信用等级',
        availableQuota: '可借额度',
        annualRate: '年化利率',
        borrowApplication: '借款申请',
        borrowAmount: '借款金额',
        borrowTerm: '借款期限',
        receiveToken: '收款币种',
        feeDetails: '费用明细',
        principal: '借款本金',
        interest: '借款利息',
        totalRepay: '到期还款',
        confirmBorrow: '确认借款',
        borrowAgreement: '点击确认借款即表示您同意',
        agreementLink: '借款协议',
        days: '天',
        
        // 信用明细
        walletHistory: '钱包历史',
        transactionRecord: '交易记录',
        assetHolding: '资产持有',
        defiParticipation: 'DeFi参与',
        repaymentRecord: '还款记录',
        
        // 信用等级
        gradeA: 'A级 优秀',
        gradeB: 'B级 良好',
        gradeC: 'C级 一般',
        gradeD: 'D级 不足',
        gradeBlacklist: '黑名单',
        
        // 个人中心
        currentDebt: '当前借款',
        pendingRepay: '待还款',
        totalRepaid: '累计还款',
        currentLoans: '当前借款',
        noActiveLoans: '暂无进行中的借款',
        creditReport: '信用报告',
        creditTips: '💡 信用提升建议',
        tip1: '保持定期交易活动',
        tip2: '按时还款，避免逾期',
        tip3: '参与更多 DeFi 协议',
        loanHistory: '借款历史',
        filterAll: '全部',
        filterActive: '进行中',
        filterRepaid: '已还款',
        filterOverdue: '已逾期',
        
        // 借款状态
        statusActive: '进行中',
        statusDueSoon: '即将到期',
        statusOverdue: '已逾期',
        statusRepaid: '已还款',
        
        // 借款卡片
        borrowDate: '借款日期',
        dueDate: '到期日期',
        totalDue: '应还总额',
        loanProgress: '借款进度',
        daysLeft: '剩余',
        daysOverdue: '逾期',
        repayNow: '立即还款',
        viewDetails: '查看详情',
        
        // 逾期
        overdueLight: '轻度逾期',
        overdueMedium: '中度逾期',
        overdueSevere: '重度逾期',
        overdueSerious: '严重逾期',
        overdueDefault: '已违约',
        lateFee: '滞纳金',
        
        // 还款弹窗
        repayConfirm: '还款确认',
        loanId: '借款编号',
        walletBalance: '钱包余额',
        confirmRepay: '确认还款',
        repaySuccess: '还款成功',
        repaySuccessDesc: '您已成功还款，感谢您的信任！',
        repayAmount: '还款金额',
        creditChange: '信用分变动',
        done: '完成',
        
        // 详情弹窗
        loanDetails: '借款详情',
        amountInfo: '💰 金额信息',
        timeInfo: '📅 时间信息',
        progressInfo: '📊 还款进度',
        txInfo: '🔗 交易信息',
        term: '借款期限',
        daysRemaining: '剩余天数',
        daysOverdueLabel: '逾期天数',
        repayStatus: '还款状态',
        completed: '已完成',
        borrowTx: '放款交易',
        repayTx: '还款交易',
        
        // 逾期警告
        overdueWarning: '借款已逾期',
        overdueWarningLight: '请尽快还款，逾期将影响您的信用评分（-10分）',
        overdueWarningMedium: '您的借款额度已被降低，请立即还款（信用 -30分）',
        overdueWarningSevere: '您的借款资格已暂停，请立即还款（信用 -50分）',
        overdueWarningSerious: '您已被列入灰名单，请立即还款以恢复信用（信用 -100分）',
        overdueWarningDefault: '您已被列入黑名单，请联系客服处理',
        
        // 黑名单
        blacklistBanner: '您的账户已被列入黑名单，借款功能已禁用。请还清逾期借款后等待解除。',
        blacklistBannerLink: '查看详情',
        blacklistTitle: '账户已被限制',
        blacklistReason: '您的账户因逾期超过30天已被列入黑名单',
        blacklistDebt: '待还款金额',
        blacklistLoans: '逾期借款',
        blacklistHowTo: '如何解除黑名单：',
        blacklistStep1: '还清所有逾期借款（本金 + 利息 + 滞纳金）',
        blacklistStep2: '等待 30 天冷静期',
        blacklistStep3: '信用分将从 300 分重新开始累积',
        goToRepay: '前往还款',
        contactSupport: '联系客服',
        creditStatus: '信用状态',
        unlockSteps: '解除黑名单步骤：',
        stepPending: '待完成',
        stepCompleted: '已完成',
        borrowDisabled: '借款功能已禁用',
        
        // 黑名单信用提示
        blacklistTip1: '您的账户已被列入黑名单',
        blacklistTip2: '请尽快还清所有逾期借款',
        blacklistTip3: '还清后等待 30 天冷静期',
        blacklistTip4: '信用分将从 300 分重新开始累积',
        
        // 连接提示
        connectPromptTitle: '连接钱包开始借款',
        connectPromptDesc: '请先连接您的钱包，系统将自动评估您的链上信用',
        dashboardPromptTitle: '查看您的借款记录',
        dashboardPromptDesc: '连接钱包后可查看借款状态、还款记录和信用报告',
        
        // 历史表格
        tableId: '借款编号',
        tableAmount: '借款金额',
        tableBorrowDate: '借款日期',
        tableDueDate: '到期日期',
        tableInterest: '利息',
        tableStatus: '状态',
        tableAction: '操作',
        noHistory: '暂无借款记录',
        
        // 借款成功
        borrowSuccess: '借款成功',
        borrowSuccessDesc: '已发放至您的钱包',
        repayDate: '还款日期',
        
        // Toast
        toastConnectFirst: '请先连接钱包',
        toastConnectFailed: '连接钱包失败，请重试',
        toastBlacklisted: '您的账户已被列入黑名单，无法借款',
        toastCreditLow: '您的信用分不足，暂无法借款',
        toastAmountMin: '借款金额不能少于 100 USDT',
        toastAmountMax: '借款金额不能超过',
        toastDevInProgress: '功能开发中',
    },
    
    en: {
        // Common
        connectWallet: 'Connect Wallet',
        walletConnected: 'Connected',
        borrow: 'Borrow',
        dashboard: 'Dashboard',
        close: 'Close',
        confirm: 'Confirm',
        cancel: 'Cancel',
        copy: 'Copy',
        copied: 'Copied to clipboard',
        copyFailed: 'Copy failed, please copy manually',
        loading: 'Loading...',
        
        // Homepage
        heroTitle: 'Instant Loans, No Collateral',
        heroSubtitle: 'Credit-based lending, borrow up to',
        heroBadge: 'DeFi Credit Lending',
        borrowNow: 'Borrow Now',
        checkRepay: 'Check & Repay',
        
        // Features
        featureNoCollateral: 'No Collateral',
        featureNoCollateralDesc: 'Credit-based, no lockup required',
        featureInstant: 'Instant Arrival',
        featureInstantDesc: 'Funds arrive immediately',
        featureFlexible: 'Flexible Repay',
        featureFlexibleDesc: 'Early repayment supported',
        
        // Stats
        statTotalLent: 'Total Lent',
        statActiveUsers: 'Active Users',
        statMinRate: 'Min APR',
        statRepayRate: 'Repay Rate',
        
        // How it works
        howItWorks: 'How It Works',
        step1Title: 'Connect Wallet',
        step1Desc: 'Support MetaMask, WalletConnect and more',
        step2Title: 'Credit Assessment',
        step2Desc: 'Auto-analyze on-chain data for credit score',
        step3Title: 'Confirm Loan',
        step3Desc: 'Select amount and term, sign to confirm',
        step4Title: 'Receive Funds',
        step4Desc: 'USDT sent directly to your wallet',
        
        // Footer
        footerDocs: 'Docs',
        footerTerms: 'Terms',
        footerPrivacy: 'Privacy',
        footerContact: 'Contact',
        
        // Borrow page
        creditScore: 'Credit Score',
        creditGrade: 'Credit Grade',
        availableQuota: 'Available Quota',
        annualRate: 'Annual Rate',
        borrowApplication: 'Loan Application',
        borrowAmount: 'Loan Amount',
        borrowTerm: 'Loan Term',
        receiveToken: 'Receive Token',
        feeDetails: 'Fee Details',
        principal: 'Principal',
        interest: 'Interest',
        totalRepay: 'Total Repayment',
        confirmBorrow: 'Confirm Borrow',
        borrowAgreement: 'By confirming, you agree to the',
        agreementLink: 'Loan Agreement',
        days: 'Days',
        
        // Credit details
        walletHistory: 'Wallet History',
        transactionRecord: 'Transactions',
        assetHolding: 'Asset Holding',
        defiParticipation: 'DeFi Activity',
        repaymentRecord: 'Repay History',
        
        // Credit grades
        gradeA: 'Grade A Excellent',
        gradeB: 'Grade B Good',
        gradeC: 'Grade C Fair',
        gradeD: 'Grade D Poor',
        gradeBlacklist: 'Blacklisted',
        
        // Dashboard
        currentDebt: 'Current Debt',
        pendingRepay: 'Pending Repay',
        totalRepaid: 'Total Repaid',
        currentLoans: 'Current Loans',
        noActiveLoans: 'No active loans',
        creditReport: 'Credit Report',
        creditTips: '💡 Credit Tips',
        tip1: 'Maintain regular trading activity',
        tip2: 'Repay on time, avoid overdue',
        tip3: 'Participate in more DeFi protocols',
        loanHistory: 'Loan History',
        filterAll: 'All',
        filterActive: 'Active',
        filterRepaid: 'Repaid',
        filterOverdue: 'Overdue',
        
        // Loan status
        statusActive: 'Active',
        statusDueSoon: 'Due Soon',
        statusOverdue: 'Overdue',
        statusRepaid: 'Repaid',
        
        // Loan card
        borrowDate: 'Borrow Date',
        dueDate: 'Due Date',
        totalDue: 'Total Due',
        loanProgress: 'Loan Progress',
        daysLeft: 'Left',
        daysOverdue: 'Overdue',
        repayNow: 'Repay Now',
        viewDetails: 'View Details',
        
        // Overdue
        overdueLight: 'Light Overdue',
        overdueMedium: 'Medium Overdue',
        overdueSevere: 'Severe Overdue',
        overdueSerious: 'Serious Overdue',
        overdueDefault: 'Defaulted',
        lateFee: 'Late Fee',
        
        // Repay modal
        repayConfirm: 'Repay Confirmation',
        loanId: 'Loan ID',
        walletBalance: 'Wallet Balance',
        confirmRepay: 'Confirm Repay',
        repaySuccess: 'Repay Success',
        repaySuccessDesc: 'Payment successful, thank you!',
        repayAmount: 'Repay Amount',
        creditChange: 'Credit Change',
        done: 'Done',
        
        // Detail modal
        loanDetails: 'Loan Details',
        amountInfo: '💰 Amount Info',
        timeInfo: '📅 Time Info',
        progressInfo: '📊 Repay Progress',
        txInfo: '🔗 Transaction Info',
        term: 'Term',
        daysRemaining: 'Days Remaining',
        daysOverdueLabel: 'Days Overdue',
        repayStatus: 'Repay Status',
        completed: 'Completed',
        borrowTx: 'Borrow TX',
        repayTx: 'Repay TX',
        
        // Overdue warning
        overdueWarning: 'Loan is overdue',
        overdueWarningLight: 'Please repay soon, overdue affects credit (-10)',
        overdueWarningMedium: 'Your quota has been reduced, repay now (Credit -30)',
        overdueWarningSevere: 'Your borrowing is suspended, repay now (Credit -50)',
        overdueWarningSerious: 'You are greylisted, repay to restore credit (Credit -100)',
        overdueWarningDefault: 'You are blacklisted, please contact support',
        
        // Blacklist
        blacklistBanner: 'Your account is blacklisted. Borrowing is disabled. Please repay all overdue loans.',
        blacklistBannerLink: 'View Details',
        blacklistTitle: 'Account Restricted',
        blacklistReason: 'Your account is blacklisted due to 30+ days overdue',
        blacklistDebt: 'Amount Due',
        blacklistLoans: 'Overdue Loans',
        blacklistHowTo: 'How to remove from blacklist:',
        blacklistStep1: 'Repay all overdue loans (principal + interest + late fees)',
        blacklistStep2: 'Wait 30-day cooling period',
        blacklistStep3: 'Credit score will restart from 300',
        goToRepay: 'Go to Repay',
        contactSupport: 'Contact Support',
        creditStatus: 'Credit Status',
        unlockSteps: 'Steps to unlock:',
        stepPending: 'Pending',
        stepCompleted: 'Completed',
        borrowDisabled: 'Borrowing Disabled',
        
        // Blacklist credit tips
        blacklistTip1: 'Your account is blacklisted',
        blacklistTip2: 'Please repay all overdue loans',
        blacklistTip3: 'Wait 30-day cooling period after repayment',
        blacklistTip4: 'Credit will restart from 300 points',
        
        // Connect prompts
        connectPromptTitle: 'Connect Wallet to Start',
        connectPromptDesc: 'Connect your wallet to auto-evaluate your on-chain credit',
        dashboardPromptTitle: 'View Your Loan Records',
        dashboardPromptDesc: 'Connect wallet to view loans, repayments and credit report',
        
        // History table
        tableId: 'Loan ID',
        tableAmount: 'Amount',
        tableBorrowDate: 'Borrow Date',
        tableDueDate: 'Due Date',
        tableInterest: 'Interest',
        tableStatus: 'Status',
        tableAction: 'Action',
        noHistory: 'No loan history',
        
        // Borrow success
        borrowSuccess: 'Borrow Success',
        borrowSuccessDesc: 'sent to your wallet',
        repayDate: 'Repay Date',
        
        // Toast
        toastConnectFirst: 'Please connect wallet first',
        toastConnectFailed: 'Failed to connect wallet, please retry',
        toastBlacklisted: 'Your account is blacklisted, cannot borrow',
        toastCreditLow: 'Credit score too low to borrow',
        toastAmountMin: 'Minimum amount is 100 USDT',
        toastAmountMax: 'Maximum amount is',
        toastDevInProgress: 'Feature in development',
    }
};

// 当前语言
let currentLang = localStorage.getItem('lang') || 'zh';

/**
 * 获取翻译文本
 */
function t(key) {
    return LANG[currentLang][key] || key;
}

/**
 * 切换语言
 */
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyLanguage();
}

/**
 * 应用语言到页面
 */
function applyLanguage() {
    // 更新所有带 data-lang 属性的元素
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (LANG[currentLang][key]) {
            el.textContent = LANG[currentLang][key];
        }
    });
    
    // 更新 placeholder
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const key = el.getAttribute('data-lang-placeholder');
        if (LANG[currentLang][key]) {
            el.placeholder = LANG[currentLang][key];
        }
    });
    
    // 更新语言切换按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.langSwitch === currentLang);
    });
    
    // 触发自定义事件，让各页面处理动态内容
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
}

/**
 * 初始化语言
 */
function initLanguage() {
    applyLanguage();
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initLanguage);
