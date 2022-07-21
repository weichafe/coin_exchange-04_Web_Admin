import { BASEURL, fetch, post, patch, put, postConfig } from './http.js'

export const BASICURL = BASEURL;

export const getLoginCode = data => post('admin/system/employee/check', data);

export const signIn = data => post('admin/system/employee/sign/in', data);

export const getCodeAgain = data => post('admin/code/sms-provider/login', data);

export const queryEmployee = data => post('admin/system/employee/page-query', data);

export const helpDown = data => post('admin/cms/system-help/down', data);

export const manageDown = data => post('admin/system/announcement/down', data);

export const getCoinName = () => post('admin/system/coin/all-name-and-unit');

export const coinOutExcel = () => fetch('admin/otc/order/out-excel');

export const withdrawManage = data => fetch('admin/finance/withdraw-record/page-query', data);

export const auditPass = data => patch('admin/finance/withdraw-record/audit-pass', data);

export const auditNoPass = data => patch('admin/finance/withdraw-record/audit-no-pass', data);

export const memberDeposit = data => post('admin/finance/member-deposit/page-query', data);

export const dashBoardInfo = data => post('admin/system/statistics/dashboard', data);

export const personalTradeInfo = data => fetch(`admin/finance/withdraw-record/${data}`);

export const allTradeInfo = () => post('admin/finance/member-transaction/all');

export const perTradeAll = data => post('admin/finance/member-transaction/page-query', data);

export const MemberRealNameList = data => post('admin/member/member-application/page-query', data);

export const MemberRealNameDetail = data => post('admin/member/member-application/detail', data);

export const memberCheckPass = data => patch(`admin/member/member-application/${data}/pass`);

export const memberCheckNotPass = (url, data) => patch(`admin/member/member-application/${url}/no-pass`, data);

export const manageAd = data => post('admin/cms/system-advertise/page-query', data);

export const createAd = data => post('admin/cms/system-advertise/create', data);

export const deleteAd = data => post('admin/cms/system-advertise/deletes', data);

export const adDetail = data => post('admin/cms/system-advertise/detail', data);

export const updateAd = data => post('admin/cms/system-advertise/update', data);

export const helpManage = data => post('admin/cms/system-help/page-query', data);

export const stickTopHelp = data => post('admin/cms/system-help/top', data);

export const addHelpManage = data => post('admin/cms/system-help/create', data);

export const delHelpManage = data => post('admin/cms/system-help/deletes', data);

export const helpManageDetail = data => post('admin/cms/system-help/detail', data);

export const updateHelpManage = data => post('admin/cms/system-help/update', data);

export const stickTopAnnounce = data => post('admin/system/announcement/top', data);

export const memberManage = data => post('admin/member/page-query', data);

export const memberDetail = data => post('admin/member/detail', data);

export const announceManage = data => fetch('admin/system/announcement/page-query', data);

export const addAnnounce = data => post('admin/system/announcement/create', data);

export const delAnnounce = data => patch('admin/system/announcement/deletes', data);

export const announceDetail = parma => fetch(`admin/system/announcement/${parma}/detail`);

export const updateAnnounce = (urlID, data) => put(`admin/system/announcement/${urlID}/update`, data);

export const stickTopAdv = data => post('admin/cms/system-advertise/top', data);

export const roleManage = () => post('admin/system/role/all');

export const queryRolePermission = data => post('admin/system/role/permission', data);

export const addAuditRole = data => post('admin/system/role/merge', data);

export const deleteRole = data => post('admin/system/role/deletes', data);

export const departmentManage = () => post('admin/system/department/all');

export const addAuditDepart = data => post('admin/system/department/merge', data);

export const departDetail = data => post('admin/system/department/detail', data);

export const delDepart = data => post('admin/system/department/deletes', data);

export const getAllPermission = () => post('admin/system/role/permission/all');

export const permissionManage = data => post('admin/system/permission/page-query', data);

export const addAuditPermission = data => post('admin/system/permission/merge', data);

export const delPermission = data => post('admin/system/permission/deletes', data);

export const businessAudit = (parma, data) => patch(`admin/member/${parma}/audit-business`, data);

export const businessDetail = (url, data) => fetch(`admin/member/${url}/business-auth-detail`, data);

export const delOtcCoin = data => post('admin/otc/otc-coin/deletes', data);

export const queryOtcAdv = data => post('admin/otc/advertise/page-query', data);

export const upDownAdv = data => post('admin/otc/advertise/alter-status', data);

export const queryAppeal = data => post('admin/otc/appeal/page-query', data);

export const releaseAppealCoin = data => post('admin/otc/appeal/release-coin', data);

export const cancelAppealOrder = data => post('admin/otc/appeal/cancel-order', data);

export const queryOtcOrder = data => post('admin/otc/order/page-query', data);

export const queryOtcCoin = data => post('admin/otc/otc-coin/page-query', data);

export const addOtcCoin = data => post('admin/otc/otc-coin/create', data);

export const updateOtcCoin = data => post('admin/otc/otc-coin/update', data);

export const rechargeOtcCoin = data => fetch('admin/legal-wallet-recharge/page', data);

export const otcCoinDetail = (url, data) => fetch(`admin/legal-wallet-recharge/${url}`, data);

export const rechargeOtcCoinPass = (url, data) => patch(`admin/legal-wallet-recharge/${url}/pass`, data);

export const rechargeOtcCoinNoPass = (url, data) => patch(`admin/legal-wallet-recharge/${url}/no-pass`, data);

export const legalOtcCoin = () => post('admin/system/coin/all-name/legal');

export const withdrawOtcCoin = data => fetch('admin/legal-wallet-withdraw/page', data);

export const withdrawOtcCoinDetail = (url, data) => fetch(`admin/legal-wallet-withdraw/${url}`, data);

export const withdrawOtcCoinPass = (url, data) => patch(`admin/legal-wallet-withdraw/${url}/pass`, data);

export const withdrawOtcCoinNoPass = (url, data) => patch(`admin/legal-wallet-withdraw/${url}/no-pass`, data);

export const withdrawOtcCoinRemit = (url, data) => patch(`admin/legal-wallet-withdraw/${url}/remit`, data);

export const exgOrderDetail = data => post('admin/exchange/exchange-order/detail', data);

export const delBBSetting = data => post('admin/exchange/exchange-coin/deletes', data);

export const queryBBSetting = data => post('admin/exchange/exchange-coin/page-query', data);

export const addBBSetting = data => post('admin/exchange/exchange-coin/merge', data);

export const fixBBSetting = data => post('admin/exchange/exchange-coin/alter-rate', data);

export const startBBTrader = data => post('admin/exchange/exchange-coin/start-trader', data);

export const stopBBTrader = data => post('admin/exchange/exchange-coin/stop-trader', data);

export const resetBBTrader = data => post('admin/exchange/exchange-coin/reset-trader', data);

export const getRobotConfig = data => post('admin/exchange/exchange-coin/robot-config', data);

export const setRobotConfig = data => post('admin/exchange/exchange-coin/alter-robot-config', data);

export const createRobotConfig = data => post('admin/exchange/exchange-coin/create-robot-config', data);

export const setPriceRobotConfig = data => post('admin/exchange/exchange-coin/alter-robot-config-price', data);

export const createPriceRobotConfig = data => post('admin/exchange/exchange-coin/create-robot-config-price', data);

export const getRobotKdataList = data => post('admin/exchange/exchange-coin/robot-kline-list', data);

export const saveRobotKdata = data => post('admin/exchange/exchange-coin/save-robot-kline', data);

export const saveRobotKdataFlow = data => post('admin/exchange/exchange-coin/save-robot-flow', data);

export const getCustomCoinPairList = data => post('admin/exchange/exchange-coin/custom-coin-list', data);

export const cancelBBAllOrders = data => post('admin/exchange/exchange-coin/cancel-all-order', data);

export const overviewBB = data => post('admin/exchange/exchange-coin/exchange-overview', data);

export const queryBBOrder = data => post('admin/exchange/exchange-order/page-query', data);

export const memberAsset = data => post('admin/member/member-wallet/balance', data);

export const passCoin = data => patch('admin/finance/withdraw-record/remittance', data);

export const passCoinByOne = data => patch('admin/finance/withdraw-record/add-transaction-number', data);

export const addAuditEmployee = data => post('admin/system/employee/merge', data);

export const employeeDetail = data => post('admin/system/employee/detail', data);

export const delEmployee = data => post('admin/system/employee/deletes', data);

// export const queryOtc = data => post('admin/otc/order/page-query', data);

export const manualPay = data => post('admin/member/member-wallet/recharge', data);

export const orderNum = () => post('admin/otc/order/get-order-num');

export const lockWallet = data => post('admin/member/member-wallet/lock-wallet', data);

export const unlockWallet = data => post('admin/member/member-wallet/unlock-wallet', data);

export const cancelOrder = data => post('admin/exchange/exchange-order/cancel', data);

export const fixPersonalPW = data => post('admin/system/employee/update-password', data);

export const accessLog = (url, data) => fetch(`admin/system/access-log/page-query/${url}`, data);

export const addVote = (data, config) => postConfig('admin/system/vote/merge', data, config);

export const queryVote = data => post('admin/system/vote/page-query', data);

// export const queryDividend = data => post('admin/system/dividend/page-query', data);

export const startDividend = data => post('admin/system/dividend/start', data);

export const queryDividendFee = data => post('admin/system/dividend/fee/info', data);

export const querySysCoin = data => post('admin/system/coin/page-query', data);

export const addSysCoin = data => post('admin/system/coin/create', data);

export const updateSysCoin = data => post('admin/system/coin/update', data);

export const sysCoinDetail = data => post('admin/system/coin/detail', data);

export const queryTansAdr = () => post('admin/system/transfer-address/page-query');

export const auditTansAdr = data => post('admin/system/transfer-address/merge', data);

export const tansAdrDetail = data => post('admin/system/transfer-address/detail', data);

export const delTansAdr = data => post('admin/system/transfer-address/deletes', data);

export const coinReviseSys = data => post('admin/code/sms-provider/system/coin-revise', data);

export const setPlatformCoin = data => post('admin/system/coin/set/platform', data);

export const createMemberWallet = data => post('admin/system/coin/create-member-wallet', data);

export const transferColdWallet = data => post('admin/system/coin/transfer', data);

export const getColdWalletCode = data => post('admin/code/sms-provider/transfer-cold-wallet', data);

export const coinTransferDetail = data => post('admin/system/coin/hot-transfer-record/page-query', data);

export const addAuthenticationSys = data => post('admin/system/member-application-config/merge', data);

export const queryAuthenticationSys = data => post('admin/system/member-application-config/detail', data);

export const publishAdvOtc = data => post('admin/member/alter-publish-advertisement-status	', data);

export const forbiddenMemberTrans = data => post('admin/member/alter-transaction-status', data);

export const setSuperPartner = data => post('admin/member/alter-member-superpartner', data);

export const forbiddenMember = data => post('admin/member/alter-status', data);

export const resetMemberAddr = data => post('admin/member/member-wallet/reset-address', data);

export const advDetailOtc = data => post('admin/otc/advertise/detail', data);

export const queryRecommend = data => post('admin/promotion/member/page-query', data);

export const queryRewardRecommend = data => fetch('admin/promotion/reward/page-query', data);

export const rewardRecommendDetail = data => post('admin/promotion/reward/detail', data);

export const auditRewardRecommend = data => post('admin/promotion/reward/merge', data);

export const recommendDetail = data => post('admin/promotion/member/details', data);

export const recommendOutExcel = data => fetch('admin/promotion/member/out-excel', data);

export const appealManageDetail = data => post('admin/otc/appeal/detail', data);

export const dictionaryQuery = data => fetch('admin/system/data-dictionary', data);

export const createDictionary = data => post('admin/system/data-dictionary', data);

export const updateDictionary = (url, data) => put(`admin/system/data-dictionary/${url}`, data);

export const memberSignQuery = data => fetch('admin/activity/member-sign-record/page-query', data);

export const activityQuery = data => fetch('admin/activity/sign/page-query', data);

export const createSign = data => post('admin/activity/sign', data);

export const activityList = data => post('admin/activity/activity/page-query', data);

export const addActivity = data => post('admin/activity/activity/add', data);

export const modifyActivity = data => post('admin/activity/activity/modify', data);

export const modifyActivityProgress = data => post('admin/activity/activity/modify-progress', data);

export const activityDetail = parma => fetch(`admin/activity/activity/${parma}/detail`);

export const activityOrderList = parma => fetch(`admin/activity/activity/${parma}/orderlist`);

export const distributeOrder = data => post(`admin/activity/activity/distribute`, data);

export const lockedActivityList = data => post('admin/activity/activity/locked-activity', data);

export const lockMemberCoin = data => post('admin/activity/activity/lock-member-coin', data);

export const signDetail = (url) => fetch(`admin/activity/sign/${url}`);

export const fixSignDetail = (url, data) => put(`admin/activity/sign/${url}`, data);

export const earlyCloseSign = url => patch(`admin/activity/sign/${url}/early-closing`);

export const queryIfEnd = () => fetch('admin/activity/sign/has-underway');

export const envelopeList = data => post('admin/envelope/page-query', data);

export const envelopeDetail = parma => fetch(`admin/envelope/${parma}/detail`);

export const envelopeReceiveDetail = data => post('admin/envelope/receive-detail', data);

export const envelopeAdd = data => post('admin/envelope/add', data);

export const envelopeModify = data => post('admin/envelope/modify', data);

export const tansTimeout = data => fetch('admin/system/coin/get-no-check-key', data);

export const financeTurnover = data => post('admin/finance/statistics/turnover-all', data);

export const financeFee = data => post('admin/finance/statistics/fee', data);

export const financeRecharge = data => post('admin/finance/statistics/recharge-or-withdraw-amount', data);

export const memberBoard = data => post('admin/index/statistics/member-statistics-info', data);

export const memberChart = data => post('admin/index/statistics/member-statistics-chart', data);

export const otcChart = data => post('admin/index/statistics/otc-statistics-num-chart', data);

export const otcBoard = data => post('admin/index/statistics/otc-statistics-turnover', data);

export const coinChart = data => post('admin/index/statistics/exchange-statistics-turnover-chart', data);

export const coinBoard = data => post('admin/index/statistics/exchange-statistics-turnover', data);

export const allOtcCoin = () => post('admin/otc/otc-coin/all-otc-coin-units');

export const allBaseCoin = () => post('admin/exchange/exchange-coin/all-base-symbol-units');

export const allExchangeUnits = data => post('admin/exchange/exchange-coin/all-coin-symbol-units', data);

export const queryBusinessAuth = data => fetch('admin/business-auth/page', data);

export const createBusinessAuth = data => post('admin/business-auth/create', data);

export const updateBusinessAuth = data => patch('admin/business-auth/update', data);

export const queryCancelApply = data => post('admin/business/cancel-apply/page-query', data);

export const cancelApplyDetail = data => post('admin/business/cancel-apply/detail', data);

export const checkApply = data => post('admin/business/cancel-apply/check', data);

export const queryBusiness = data => post('admin/business-auth/apply/page-query', data);

export const queryBusinessStatus = () => post('admin/business-auth/get-search-status');

export const cancelBusinessStatus = () => post('admin/business/cancel-apply/get-search-status');

export const authBusinessDetail = data => post('admin/business-auth/apply/detail', data);

export const parnter = data => post('admin/system/coin/add-partner', data);

export const ctcOrderList = data => post('admin/ctc/order/page-query', data);

export const ctcOrderDetail = data => post('admin/ctc/order/detail', data);

export const ctcOrderConfirm = data => post('admin/ctc/order/confirm-order', data);

export const inviteRecord = data => postConfig('admin/invite/management/query', data);

export const inviteSecondRecord = data => postConfig('admin/invite/management/info', data);

export const inviteRank = data => postConfig('admin/invite/management/rank', data);

export const setInviter = data => post('admin/member/setInviter', data);

export const alterRank = data => post('admin/invite/management/update-rank', data);

export const ctcOrderPay = data => post('admin/ctc/order/pay-order', data);

export const ctcOrderCancel = data => post('admin/ctc/order/cancel-order', data);

export const ctcOrderComplete = data => post('admin/ctc/order/complete-order', data);

export const ctcAcceptorList = data => post('admin/ctc/acceptor/page-query', data);

export const ctcAcceptorSwitch = data => post('admin/ctc/acceptor/switch', data);

export const sysAppRevision = data => fetch('admin/system/app-revision/page-query', data);

export const queryOptionCoinList = data => post('admin/option-coin/page-query', data);

export const addOptionCoin = data => post('admin/option-coin/add', data);

export const alterOptionCoin = data => post('admin/option-coin/alter', data);

export const queryOptionList = data => post('admin/option/page-query', data);

export const queryOptionOrderList = data => post('admin/option/order/page-query', data);

export const withdrawFeeFunc = data => post('admin/fee/withdraw', data);

export const withdrawFeeDetail = data => post('admin/fee/withdraw/page-query', data);
