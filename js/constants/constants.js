app.constant('USER_ROLES', {
	all: '*',
	admin: 'admin',
	supplier: 'supplier',
	seller: 'seller'
}).constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	logoutSuccess: 'auth-logout-success',
	sessionTimeout: 'auth-session-timeout',
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
}).constant('PRODUCT_STATUS_OPTION', [
	{'status':'1','name':'可查詢、可銷售'},
	{'status':'2','name':'可查詢、不可銷售'},
	{'status':'3','name':'不可查詢、不可銷售'}
]).constant('PLACE_TYPE_OPTION', [
	{'type':'1','name':'單件商品賣場'}
]).constant('PLACE_STATUS_OPTION', [
	{'status':'0','name':'賣場關閉中'},
	{'status':'1','name':'賣場開啟中'}
]).constant('ORDER_STATUS_OPTION', [
	{'status':'0','name':'待付款','description':'尚未付款訂單，未付款訂單無法操作出貨功能，在帳務上也不會列入計算，但貨到付款商品將會自已跳過此階段，視為"假已付款"，並直接列入帳務計算中'},
	{'status':'1','name':'未出貨','description':'會到此狀態的前提是消費者已付款，貨到付款將會自動進入此狀態'},
	{'status':'2','name':'已出貨','description':'供應商已將商品出貨，已出貨訂單已無法取消，若消費者不要商品了，要走退貨流程'},
	{'status':'3','name':'完成配送','description':'物流回報已完成配送'},
	{'status':'4','name':'已取消','description':'在還未出貨情況下，已先被消費者取消！'},
	{'status':'5','name':'要求退貨','description':'消費者已發出退貨需求'},
	{'status':'6','name':'已退貨','description':'訂單在消費者發出退貨需求後，完成退貨作業。'}
]).constant('BILLING_STATUS_OPTION', [
	{'status':'0','name':'編輯中，未出帳'},
	{'status':'1','name':'已出帳，待用戶確認'},
	{'status':'2','name':'用戶已確認'},
	{'status':'3','name':'已結款'}
]);