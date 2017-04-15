// LOAD MODULES =================================================================
var express = require('express');
var serveStatic = require('serve-static');
var multer  = require('multer');
var bodyParser = require('body-parser');
var faker = require('faker/locale/zh_TW');
var casual = require('casual');
var app = express();
var router = express.Router();
var port = process.env.PORT || 8880;
// SETUP EXPRESS APPLICATION ====================================================
var upload = multer({dest: './uploads'});
var sessionArray = ["70517141-0632-42dd-85d2-be215a2208d1","cdd34496-621e-4813-ba59-c96b1758b970","aa37fe7f-e128-4d70-b0d9-da605a81831b"];
app.use('/', router);
app.use(serveStatic(__dirname, {'index': ['default.html', 'default.htm']}));
app.listen(port);
// FUNCTIONS
function generateID(l) {
	var x="123456789poiuytrewqasdfghjklmnbvcxzQWERTYUIPLKJHGFDSAZXCVBNM";
	var id="";
	for( var i = 0 ; i < l ; i++ ){
		id += x.charAt(Math.ceil(Math.random()*10000000000)%x.length);
	}
	return id;
}
// ROUTES =======================================================================
router.use('/',function(req,res,next){
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	console.log('%s %s',req.method,req.url||req.path,ip);
	next();
});
router.get('/', function(req, res) {
	var options = {
		root: __dirname + '/'
	};
	res.sendFile('index.html',options);
});
// LOGIN ========================================================================
router.post('/api/login', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var queryOption = {
		username : req.body.username,
		password : req.body.password
	};
	console.log(queryOption);
	if(queryOption.username == "admin" && queryOption.password == "admin"){
		var resJson = {
			sessionID : "70517141-0632-42dd-85d2-be215a2208d1",
			userID : "admin",
			userRole : "admin",
			isAuthenticated : true
		};
		res.send(resJson);
	}else if(queryOption.username == "supplier" && queryOption.password == "supplier"){
		var resJson = {
			sessionID : "cdd34496-621e-4813-ba59-c96b1758b970",
			userID : "supplier",
			userRole : "supplier",
			isAuthenticated : true
		};
		res.send(resJson);
	}else if(queryOption.username == "seller" && queryOption.password == "seller"){
		var resJson = {
			sessionID : "aa37fe7f-e128-4d70-b0d9-da605a81831b",
			userID : "seller",
			userRole : "seller",
			isAuthenticated : true
		};
		res.send(resJson);
	}else{
		res.send("error");
	}
});
router.post('/api/signup', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var query = {
		sessionID: req.body.comname,
		userID : req.body.email,
		data : req.body.password
	};
	var result = 'success';
	res.send(result);
});
router.post('/api/sessionCheck', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var id = req.body.sessionID;
	if(id == "70517141-0632-42dd-85d2-be215a2208d1"){
		var resJson = {
			sessionID : "70517141-0632-42dd-85d2-be215a2208d1",
			userID : "admin",
			userRole : "admin",
			isAuthenticated : true
		};
		res.send(resJson);
	}else if(id == "cdd34496-621e-4813-ba59-c96b1758b970"){
		var resJson = {
			sessionID : "cdd34496-621e-4813-ba59-c96b1758b970",
			userID : "supplier",
			userRole : "supplier",
			isAuthenticated : true
		};
		res.send(resJson);
	}else if(id == "aa37fe7f-e128-4d70-b0d9-da605a81831b"){
		var resJson = {
			sessionID : "aa37fe7f-e128-4d70-b0d9-da605a81831b",
			userID : "seller",
			userRole : "seller",
			isAuthenticated : true
		};
		res.send(resJson);
	}else{
		res.send("error");
	}
});
// UPLOADS ======================================================================
router.post('/api/upload', upload.single('file'), function(req,res) {
	console.log(req.file,req.body);
	var result = req.file.destination + '/' + req.file.filename;
	res.send(result);
});
// SPECS ========================================================================
router.post('/api/specs/attrs', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var query = {
		sessionID: req.body.sessionID,
		categories : []
	};
	if ( typeof req.body.categories ==="string" ) {
		query.categories.push(req.body.categories);
	} else {
		for (var i = 0;i < req.body.categories.length;i++) {
			query.categories.push(req.body.categories[i]);
		}
	};
	console.log(query);
	if ( query.sessionID == "70517141-0632-42dd-85d2-be215a2208d1" || query.sessionID == "cdd34496-621e-4813-ba59-c96b1758b970" || query.sessionID == "aa37fe7f-e128-4d70-b0d9-da605a81831b") {
		var attrs = [];
		var categories = query.categories;
		var cateLength = categories.length;
		for (var i = 0;i < 20;i++) {
			var cateKey = Math.ceil(Math.random()*(cateLength - 1));
			var rowData = {id: generateID(10),name: faker.fake('{{commerce.productName}}'),category: categories[cateKey].name,categoryID: categories[cateKey].id}
			attrs.push(rowData);
		}
	} else {
		var attrs = 'error';
	};
	res.send(attrs);
});
// PRODUCT ======================================================================
router.get('/api/product', function(req, res) {
	console.log(req.query);
	var query = {
		sessionID: req.query.sessionID,
		currentRole: req.query.currentRole || null,
		pid : req.query.pid || null
	};
	var result = {};
	if ( sessionArray.indexOf(query.sessionID) != -1 ) {
		if ( !!query.pid ) {
			result.product = {
				active: false,
				productID: query.pid,
				supplierID: "D876H8JNU56FQ",
				skuMainID: "BG600O5JK48QQ",
				supplierName: "穌家美食網",
				mainName: "漢坊【臻饌禮盒】綜合8入禮盒",
				secName: "在家輕鬆料理享受五星法式鴨胸大餐",
				dataUrl: casual.url,
				description: "<h3>商品介紹</h3><p>濃郁的蛋捲搭配養生的芝麻，以堅持不加一滴水的高品質，綿密清香的口感，創造好口碑，全新粉紅色樣式，搭配心型相框，食用完可以當作面紙盒,又可以把最心愛的相片跟KT放在一起，天天看,天天好心情。</p>",
				status: '1',
				createrID: "70517141-0632-42dd-85d2-be215a2208d1",
				createDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
				updateDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
				updateIP: casual.ip,
				specs: [
					{
						skuID: generateID(10),
						attrs: [
							{id: generateID(10),name: faker.fake('{{commerce.productName}}'),category: faker.fake('{{commerce.productAdjective}}'),categoryID: generateID(10)}
						],
						imgs: [],
						stock: Math.ceil(Math.random()*1000),
						safeStock: Math.ceil(Math.random()*10),
						cost: Math.ceil(Math.random()*1000),
						refPrice: Math.ceil(Math.random()*2000),
						sellPrice: Math.ceil(Math.random()*1000),
						shareProfit: Math.ceil(Math.random()*30) / 100,
						salesNum: faker.fake('{{random.number}}'),
						shelves: true,
						createrID: faker.fake('{{random.uuid}}'),
						createDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
						updateDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
						updateIP: casual.ip,
						active: false
					},{
						skuID: generateID(10),
						attrs: [
							{id: generateID(10),name: faker.fake('{{commerce.productName}}'),category: faker.fake('{{commerce.productAdjective}}'),categoryID: generateID(10)}
						],
						imgs: [],
						stock: Math.ceil(Math.random()*1000),
						safeStock: Math.ceil(Math.random()*10),
						cost: Math.ceil(Math.random()*1000),
						refPrice: Math.ceil(Math.random()*2000),
						sellPrice: Math.ceil(Math.random()*1000),
						shareProfit: Math.ceil(Math.random()*30) / 100,
						salesNum: faker.fake('{{random.number}}'),
						shelves: true,
						createrID: faker.fake('{{random.uuid}}'),
						createDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
						updateDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
						updateIP: casual.ip,
						active: false
					},{
						skuID: generateID(10),
						attrs: [
							{id: generateID(10),name: faker.fake('{{commerce.productName}}'),category: faker.fake('{{commerce.productAdjective}}'),categoryID: generateID(10)}
						],
						imgs: [],
						stock: Math.ceil(Math.random()*1000),
						safeStock: Math.ceil(Math.random()*10),
						cost: Math.ceil(Math.random()*1000),
						refPrice: Math.ceil(Math.random()*2000),
						sellPrice: Math.ceil(Math.random()*1000),
						shareProfit: Math.ceil(Math.random()*30) / 100,
						salesNum: faker.fake('{{random.number}}'),
						shelves: true,
						createrID: faker.fake('{{random.uuid}}'),
						createDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
						updateDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
						updateIP: casual.ip,
						active: false
					},{
						skuID: "BG600O5JK48QQ",
						attrs: [
							{id: generateID(10),name: faker.fake('{{commerce.productName}}'),category: faker.fake('{{commerce.productAdjective}}'),categoryID: generateID(10)}
						],
						imgs: [],
						stock: Math.ceil(Math.random()*1000),
						safeStock: Math.ceil(Math.random()*10),
						cost: Math.ceil(Math.random()*1000),
						refPrice: Math.ceil(Math.random()*2000),
						sellPrice: Math.ceil(Math.random()*1000),
						shareProfit: Math.ceil(Math.random()*30) / 100,
						salesNum: faker.fake('{{random.number}}'),
						shelves: true,
						createrID: faker.fake('{{random.uuid}}'),
						createDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
						updateDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
						updateIP: casual.ip,
						active: false
					},{
						skuID: generateID(10),
						attrs: [
							{id: generateID(10),name: faker.fake('{{commerce.productName}}'),category: faker.fake('{{commerce.productAdjective}}'),categoryID: generateID(10)}
						],
						imgs: [],
						stock: Math.ceil(Math.random()*1000),
						safeStock: Math.ceil(Math.random()*10),
						cost: Math.ceil(Math.random()*1000),
						refPrice: Math.ceil(Math.random()*2000),
						sellPrice: Math.ceil(Math.random()*1000),
						shareProfit: Math.ceil(Math.random()*30) / 100,
						salesNum: faker.fake('{{random.number}}'),
						shelves: true,
						createrID: faker.fake('{{random.uuid}}'),
						createDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
						updateDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
						updateIP: casual.ip,
						active: false
					}
				]
			};
		} else {
			result.product = {
				productID: faker.fake('{{random.uuid}}'),
				supplierID: null,
				skuMainID: null,
				supplierName: null,
				mainName: null,
				secName: null,
				dataUrl: null,
				description: null,
				status: '1',
				createrID: "70517141-0632-42dd-85d2-be215a2208d1",
				createDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
				updateDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
				updateIP: casual.ip,
				specs: []
			};
			result.supplierList = [];
			if ( query.currentRole == 'supplier' ) {
				var row = {};
				row.supplierID = generateID(10);
				row.name = faker.fake('{{name.firstName}}{{name.lastName}}') + '股份有份公司';
				result.supplierList.push(row);
			} else if ( query.currentRole == 'admin') {
				var row = {};
				for (var i = 0; i < 20; i++) {
					var row = {};
					row.supplierID = generateID(10);
					row.name = faker.fake('{{name.firstName}}{{name.lastName}}') + '股份有份公司';
					result.supplierList.push(row);
				};
			};
		}
		result.interface = {
			// ALL CATEGORIRES
			categories: [
				{id: generateID(10),name: faker.fake('{{commerce.productAdjective}}')},
				{id: generateID(10),name: faker.fake('{{commerce.productAdjective}}')},
				{id: generateID(10),name: faker.fake('{{commerce.productAdjective}}')},
				{id: generateID(10),name: faker.fake('{{commerce.productAdjective}}')},
				{id: generateID(10),name: faker.fake('{{commerce.productAdjective}}')},
				{id: generateID(10),name: faker.fake('{{commerce.productAdjective}}')},
				{id: generateID(10),name: faker.fake('{{commerce.productAdjective}}')},
				{id: generateID(10),name: faker.fake('{{commerce.productAdjective}}')},
				{id: generateID(10),name: faker.fake('{{commerce.productAdjective}}')},
				{id: generateID(10),name: faker.fake('{{commerce.productAdjective}}')}
			]
		}
	} else {
		var result = 'error';
	};
	res.send(result);
});
router.post('/api/product/editor', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var query = {
		sessionID: req.body.sessionID,
		userID : req.body.userID || null,
		data : req.body.data
	};
	if ( query.sessionID == "70517141-0632-42dd-85d2-be215a2208d1" || query.sessionID == "cdd34496-621e-4813-ba59-c96b1758b970" || query.sessionID == "aa37fe7f-e128-4d70-b0d9-da605a81831b") {
		var result = 'success';
	} else {
		var result = 'error';
	};
	res.send(result);
});
router.get('/api/products', function(req, res) {
	console.log(req.query);
	if(req.query.num == null || req.query.num == ""){
		req.query.num = 1
	}
	var queryOption = {
		sessionID: req.query.sessionID,
		rows : req.query.num,
		pagenumber : req.query.page,
		currentRole: req.query.currentRole || null
	};
	//var result = faker.fake('{{name.lastName}}, {{name.firstName}} {{name.suffix}}');
	var result = {
		rows: [],
		supplierList: [],
		totalItems: 500,
		itemsPerPage: queryOption.rows,
		currentPage: queryOption.pagenumber
	};
	for (var i = 0; i < queryOption.rows;i++) {
		var row = {};
		row.selected = false;
		row.status = Math.ceil(Math.random()*3);
		row.productID = faker.fake('{{random.uuid}}');
		row.productImg = 'http://lorempixel.com/480/480/food/';
		row.supplierName = faker.fake('{{name.firstName}}{{name.lastName}}') + '股份有份公司';
		row.mainName = faker.fake('{{commerce.productName}}');
		row.cost = Math.floor(faker.fake('{{finance.amount}}'));
		row.sellprice = Math.floor(faker.fake('{{finance.amount}}'));
		row.sellnum = faker.fake('{{random.number}}');
		row.sellProft = Math.ceil(Math.random()*30) / 100;
		row.productDataUrl = faker.fake('{{internet.url}}');
		row.createDate = casual.date(format = 'YYYY-MM-DD');
		row.updateDate = casual.date(format = 'YYYY-MM-DD');
		result.rows.push(row);
	}
	if ( queryOption.currentRole == 'supplier' ) {
		var row = {};
		row.supplierID = generateID(10);
		row.name = faker.fake('{{name.firstName}}{{name.lastName}}') + '股份有份公司';
		result.supplierList.push(row);
	} else if ( queryOption.currentRole == 'admin') {
		var row = {};
		for (var i = 0; i < 20; i++) {
			var row = {};
			row.supplierID = generateID(10);
			row.name = faker.fake('{{name.firstName}}{{name.lastName}}') + '股份有份公司';
			result.supplierList.push(row);
		};
	};
	res.send(result);
});
router.get('/api/products/browser', function(req, res) {
	console.log(req.query);
	if(req.query.num == null || req.query.num == ""){
		req.query.num = 1
	}
	var query = {
		sessionID: req.query.sessionID,
		rows : req.query.num,
		pagenumber : req.query.page
	};
	var result = {
		rows: [],
		totalItems: 500,
		itemsPerPage: query.rows,
		currentPage: query.pagenumber
	};
	for (var i = 0; i < query.rows;i++) {
		var row = {};
		row.productID = faker.fake('{{random.uuid}}');
		row.productImg = 'http://lorempixel.com/500/500/food/';
		row.supplierName = faker.fake('{{name.firstName}}{{name.lastName}}') + '股份有份公司';
		row.mainName = faker.fake('{{commerce.productName}}');
		row.secName = faker.fake('{{commerce.productName}}');
		row.sellprice = Math.floor(faker.fake('{{finance.amount}}'));
		row.sellnum = faker.fake('{{random.number}}');
		row.sellProft = row.sellprice * Math.ceil(Math.random()*30) / 100;
		row.nowSellUrl = casual.url;
		result.rows.push(row);
	}
	res.send(result);
});
router.post('/api/products/browser/addplace', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var query = {
		sessionID: req.body.sessionID,
		productID : req.body.productID,
		userID: req.body.userID
	};
	if ( query.sessionID == "70517141-0632-42dd-85d2-be215a2208d1" || query.sessionID == "cdd34496-621e-4813-ba59-c96b1758b970" || query.sessionID == "aa37fe7f-e128-4d70-b0d9-da605a81831b") {
		var result = {
			status: 'success',
			placeUrl: casual.url
		};
	} else {
		var result = 'error';
	};
	res.send(result);
});
router.post('/api/products/modify', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var query = {
		sessionID: req.body.sessionID,
		ids : req.body.ids,
		status : req.body.status
	};
	if ( query.sessionID == "70517141-0632-42dd-85d2-be215a2208d1" || query.sessionID == "cdd34496-621e-4813-ba59-c96b1758b970" || query.sessionID == "aa37fe7f-e128-4d70-b0d9-da605a81831b") {
		var result = 'success';
	} else {
		var result = 'error';
	};
	res.send(result);
});
router.post('/api/products/delete', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var query = {
		sessionID: req.body.sessionID,
		ids : req.body.ids
	};
	if ( query.sessionID == "70517141-0632-42dd-85d2-be215a2208d1" || query.sessionID == "cdd34496-621e-4813-ba59-c96b1758b970" || query.sessionID == "aa37fe7f-e128-4d70-b0d9-da605a81831b") {
		var result = 'success';
	} else {
		var result = 'error';
	};
	res.send(result);
});
// MARKETPLACE ==================================================================
router.get('/api/marketplace', function(req, res) {
	console.log(req.query);
	if(req.query.num == null || req.query.num == ""){
		req.query.num = 1
	}
	var queryOption = {
		rows : req.query.num,
		pagenumber : req.query.page,
		currentRole: req.query.currentRole || null
	};
	//var result = faker.fake('{{name.lastName}}, {{name.firstName}} {{name.suffix}}');
	var result = {
		rows: [],
		sellerList: [],
		totalItems: 500,
		itemsPerPage: queryOption.rows,
		currentPage: queryOption.pagenumber
	};
	for (var i = 0; i < queryOption.rows;i++) {
		var row = {};
		row.selected = false;
		row.status = 1;
		row.type = 1;
		row.sellerID = generateID(10);
		row.sellerName = faker.fake('{{name.firstName}}{{name.lastName}}');
		row.placeID = faker.fake('{{random.uuid}}');
		row.placeName = faker.fake('{{commerce.productName}}');
		row.placeUrl = casual.url;
		row.placeShortenUrl = null;
		row.qrcodeData = row.placeShortenUrl || row.placeUrl;
		row.productID = faker.fake('{{random.uuid}}');
		row.productName = faker.fake('{{commerce.productName}}');
		row.productImg = 'http://lorempixel.com/480/480/food/';
		row.sellprice = Math.floor(faker.fake('{{finance.amount}}'));
		row.sellnum = faker.fake('{{random.number}}');
		row.sellProft = Math.ceil(Math.random()*500);
		row.sellTotalProft = Math.ceil(Math.random()*1500);
		row.productDataUrl = faker.fake('{{internet.url}}');
		row.createDate = casual.date(format = 'YYYY-MM-DD');
		row.updateDate = casual.date(format = 'YYYY-MM-DD');
		row.updateIP = casual.ip;
		result.rows.push(row);
	}
	if ( queryOption.currentRole == 'seller' ) {
		var row = {};
		row.sellerID = generateID(10);
		row.name = faker.fake('{{name.firstName}}{{name.lastName}}');
		result.sellerList.push(row);
	} else if ( queryOption.currentRole == 'admin') {
		var row = {};
		for (var i = 0; i < 20; i++) {
			var row = {};
			row.sellerID = generateID(10);
			row.name = faker.fake('{{name.firstName}}{{name.lastName}}');
			result.sellerList.push(row);
		};
	};
	res.send(result);
});
router.post('/api/marketplace/update', bodyParser.json(), function(req, res) {
	console.log(req.body)
	var query = {
		sessionID: req.body.sessionID,
		place : req.body.place
	};
	var result = 'success';
	res.send(result);
});
router.post('/api/marketplace/add/shortenurl', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var query = {
		sessionID: req.body.sessionID,
		id : req.body.placeID,
		url : req.body.url
	};
	if ( query.sessionID == "70517141-0632-42dd-85d2-be215a2208d1" || query.sessionID == "cdd34496-621e-4813-ba59-c96b1758b970" || query.sessionID == "aa37fe7f-e128-4d70-b0d9-da605a81831b") {
		var result = 'success';
	} else {
		var result = 'error';
	};
	res.send(result);
});
// ORDERS =======================================================================
router.get('/api/order', function(req, res) {
	console.log(req.query);
	var query = {
		sessionID: req.query.sessionID,
		oid : req.query.oid || null
	};
	if ( sessionArray.indexOf(query.sessionID) != -1 && !!query.oid ) {
		var result = {
			order: {
				summary: {
					orderID: query.oid,
					orderAmounts: null,
					orderDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
					orderStatus: Math.floor(Math.random()*3),
					orderPayment: "ATM",
					shippingTime: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
					shipTrackingNumber: "黑猫宅急便# 9471490833, 9/15日寄出",
					shipArrivalResTime: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
					orderNotice: null,
					orderInternalNotice: null
				},
				products: [
					{
						id: faker.fake('{{random.uuid}}'),
						name: faker.fake('{{commerce.productName}}'),
						img: "http://lorempixel.com/480/480/food/",
						skuID: generateID(10),
						attrs: [
							{id: generateID(10),name: casual.color_name,category: faker.fake('{{commerce.productAdjective}}'),categoryID: generateID(10)},
							{id: generateID(10),name: casual.color_name,category: faker.fake('{{commerce.productAdjective}}'),categoryID: generateID(10)}
						],
						sellPrice: Math.floor(faker.fake('{{finance.amount}}')),
						quantity: Math.ceil(Math.random()*10),
						subtotal: null
					}
				],
				consumerInfo: {
					id: faker.fake('{{random.uuid}}'),
					name: faker.fake('{{name.firstName}}{{name.lastName}}'),
					phoneNumber: faker.fake('{{phone.phoneNumber}}'),
					email: casual.email,
					identity: "f126440000",
					birthday: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
					address: faker.fake('{{address.cityPrefix}}{{address.citySuffix}}{{address.streetAddress}}')
				},
				recipientInfo: {
					name: faker.fake('{{name.firstName}}{{name.lastName}}'),
					phoneNumber: faker.fake('{{phone.phoneNumber}}'),
					telNumber: faker.fake('{{phone.phoneNumber}}'),
					address: faker.fake('{{address.cityPrefix}}{{address.citySuffix}}{{address.streetAddress}}')
				},
				transactionInfo: {
					payment: 'ATM',
					status: '已付款',
					id: generateID(10),
					amounts: null,
					transDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss')
				},
				invoiceInfo: {
					type: '二聯式',
					number: 'WB39331586',
					createDate: casual.date(format = 'YYYY-MM-DD HH:mm:ss')
				},
				supplierInfo: {
					id: generateID(10),
					comName: faker.fake('{{company.companyName}}'),
					tel: faker.fake('{{phone.phoneNumber}}'),
					fax: faker.fake('{{phone.phoneNumber}}'),
					email: casual.email,
					profit: null
				},
				sellerInfo: {
					id: generateID(10),
					name: faker.fake('{{name.firstName}}{{name.lastName}}'),
					phoneNumber: '0980000211',
					email: casual.email,
					placeID: generateID(10),
					profit: Math.ceil(Math.random()*100)
				},
				shipFee: 100
			}
		};
		result.order.products[0].subtotal = result.order.products[0].sellPrice * result.order.products[0].quantity;
		result.order.supplierInfo.profit = result.order.products[0].subtotal - result.order.sellerInfo.profit;
		result.order.summary.orderAmounts = result.order.products[0].subtotal + 100;
		result.order.transactionInfo.amounts = result.order.summary.orderAmounts;
	} else {
		var result = 'error';
	};
	res.send(result);
});
router.post('/api/order/update', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var query = {
		sessionID: req.body.sessionID,
		ids: req.body.ids,
		orderInternalNotice: req.body.orderInternalNotice 
	};
	if ( sessionArray.indexOf(query.sessionID) != -1) {
		var result = 'success';
	} else {
		var result = 'error';
	};
	res.send(result);
});
router.get('/api/orders', function(req, res) {
	console.log(req.query);
	if(req.query.num == null || req.query.num == ""){
		req.query.num = 1
	}
	var queryOption = {
		rows : req.query.num,
		pagenumber : req.query.page,
		currentRole: req.query.currentRole || null
	};
	var result = {
		rows: [],
		supplierList: [],
		sellerList: [],
		totalItems: 500,
		itemsPerPage: queryOption.rows,
		currentPage: queryOption.pagenumber
	};
	for (var i = 0; i < queryOption.rows;i++) {
		var row = {};
		row.selected = false;
		row.status = Math.floor(Math.random()*3);
		row.orderDate = casual.date(format = 'YYYY-MM-DD');
		row.orderID = faker.fake('{{random.uuid}}');
		row.consumerName = faker.fake('{{name.firstName}}{{name.lastName}}');
		row.shipCity = faker.fake('{{address.cityPrefix}}');
		row.shipAddress = faker.fake('{{address.cityPrefix}}{{address.citySuffix}}{{address.streetAddress}}');
		row.recipientName = faker.fake('{{name.firstName}}{{name.lastName}}');
		row.recipientMobile = faker.fake('{{phone.phoneNumber}}');
		row.productName = faker.fake('{{commerce.productName}}');
		row.quantity = Math.ceil(Math.random()*10);
		row.orderAmounts = Math.ceil(Math.random()*1000);
		row.profitAmounts = Math.ceil(Math.random()*100);
		result.rows.push(row);
	}
	if ( queryOption.currentRole == 'supplier' ) {
		var row = {supplierID: generateID(10),name: faker.fake('{{name.firstName}}{{name.lastName}}') + '股份有份公司'};
		result.supplierList.push(row);
		for (var i = 0; i < 20; i++) {
			var row = {sellerID: generateID(10),name: faker.fake('{{name.firstName}}{{name.lastName}}')};
			result.sellerList.push(row);
		};
	} else if ( queryOption.currentRole == 'seller' ) {
		var row = {sellerID: generateID(10),name: faker.fake('{{name.firstName}}{{name.lastName}}')};
		result.sellerList.push(row);
		for (var i = 0; i < 20; i++) {
			var row = {supplierID: generateID(10),name: faker.fake('{{name.firstName}}{{name.lastName}}' + '股份有份公司')};
			result.supplierList.push(row);
		};
	} else if ( queryOption.currentRole == 'admin' ) {
		var row = {};
		for (var i = 0; i < 20; i++) {
			var row = {supplierID: generateID(10),name: faker.fake('{{name.firstName}}{{name.lastName}}' + '股份有份公司')};
			result.supplierList.push(row);
		};
		for (var i = 0; i < 20; i++) {
			var row = {sellerID: generateID(10),name: faker.fake('{{name.firstName}}{{name.lastName}}')};
			result.sellerList.push(row);
		};
	};
	res.send(result);
});
router.post('/api/order/ship', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var query = {
		sessionID: req.body.sessionID,
		ids : req.body.ids
	};
	if ( query.sessionID == "70517141-0632-42dd-85d2-be215a2208d1" || query.sessionID == "cdd34496-621e-4813-ba59-c96b1758b970" || query.sessionID == "aa37fe7f-e128-4d70-b0d9-da605a81831b") {
		var result = 'success';
	} else {
		var result = 'error';
	};
	res.send(result);
});
router.post('/api/order/done', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var query = {
		sessionID: req.body.sessionID,
		ids : req.body.ids
	};
	if ( query.sessionID == "70517141-0632-42dd-85d2-be215a2208d1" || query.sessionID == "cdd34496-621e-4813-ba59-c96b1758b970" || query.sessionID == "aa37fe7f-e128-4d70-b0d9-da605a81831b") {
		var result = 'success';
	} else {
		var result = 'error';
	};
	res.send(result);
});
router.post('/api/order/cancel', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var query = {
		sessionID: req.body.sessionID,
		ids : req.body.ids
	};
	if ( query.sessionID == "70517141-0632-42dd-85d2-be215a2208d1" || query.sessionID == "cdd34496-621e-4813-ba59-c96b1758b970" || query.sessionID == "aa37fe7f-e128-4d70-b0d9-da605a81831b") {
		var result = 'success';
	} else {
		var result = 'error';
	};
	res.send(result);
});
router.post('/api/order/return', bodyParser.json(), function(req, res) {
	console.log(req.body)
	var query = {
		sessionID: req.body.sessionID,
		ids : req.body.ids
	};
	if ( query.sessionID == "70517141-0632-42dd-85d2-be215a2208d1" || query.sessionID == "cdd34496-621e-4813-ba59-c96b1758b970" || query.sessionID == "aa37fe7f-e128-4d70-b0d9-da605a81831b") {
		var result = 'success';
	} else {
		var result = 'error';
	};
	res.send(result);
});
router.post('/api/order/returnDone', bodyParser.json(), function(req, res) {
	console.log(req.body)
	var query = {
		sessionID: req.body.sessionID,
		ids : req.body.ids
	};
	if ( query.sessionID == "70517141-0632-42dd-85d2-be215a2208d1" || query.sessionID == "cdd34496-621e-4813-ba59-c96b1758b970" || query.sessionID == "aa37fe7f-e128-4d70-b0d9-da605a81831b") {
		var result = 'success';
	} else {
		var result = 'error';
	};
	res.send(result);
});
// BILLING ======================================================================
router.get('/api/billing', function(req, res) {
	console.log(req.query);
	var query = {
		sessionID: req.query.sessionID,
		userID: req.query.id || null,
		userRole: req.query.currentRole,
		queryType : req.query.queryType || 'accounts'
	};
	if ( sessionArray.indexOf(query.sessionID) != -1 ) {
		var result = null;
		switch(query.queryType) {
			case 'accounts':
				result = [];
				for (var i = 0; i < 40; i++) {
					var row = {};
					row.active = false;
					row.id = generateID(10);
					if (i < 19) {
						row.name = faker.fake('{{name.firstName}}{{name.lastName}}');
						row.userRole = "seller";
					} else {
						row.name = faker.fake('{{name.firstName}}{{name.lastName}}') + '股份有份公司';
						row.userRole = "supplier";
					};
					result.push(row);
				};
				break;
			case 'billingList':
				var result = {};
				result.userID = query.userID;
				if (query.userRole == 'supplier') {
					result.username = faker.fake('{{name.firstName}}{{name.lastName}}') + '股份有份公司';
				};
				if (query.userRole == 'seller') {
					result.username = faker.fake('{{name.firstName}}{{name.lastName}}');
				}
				if (query.userRole == 'admin') {
					result.username = faker.fake('{{name.firstName}}{{name.lastName}}') + 'or 股份有份公司';
				}
				result.bankAccountNumber = '070-524400' + casual.integer(from = 5000000, to = 10000000);
				result.rows = [];
				for (var i = 0; i < 20; i++) {
					var row = {};
					var d = new Date();
					var nd = new Date(d.getFullYear(),d.getMonth()+1,1);
					row.active = false;
					row.totalRevenue = casual.integer(from = 10000, to = 1000000);
					row.billingID = generateID(10);
					row.billCreated = casual.date(format = 'YYYY-MM-DD') + ' 23:23:59';
					row.dateStart = new Date(casual.date(format = 'YYYY-MM-DD'));
					row.dateEnd = new Date(row.dateStart);
					row.dateEnd.setDate(row.dateStart.getDate()+30);
					result.rows.push(row);
				};
				break;
			case 'billing':
				var paymentArray = ['信用卡付費','支付寶付費','ATM轉帳','貨到付款','手機小額付費'];
				var result = {};
				result.billingID = query.userID;
				if (!result.billingID) {
					var d = new Date();
					var nd = new Date(d.getFullYear(),d.getMonth()+1,1);
					result.dateStart = new Date(d.getFullYear(),d.getMonth(),1);
					//result.dateStart = result.dateStart.format('yyyy-MM-dd');
					result.dateEnd = new Date(nd - (24*60*60*1000));
					result.billingStatus = 0;
					result.expectRemittances = new Date(nd - (24*60*60*1000) + (10*24*60*60*1000));
					result.remittancesDate = null;
				} else {
					result.dateStart = new Date(casual.date(format = 'YYYY-MM-DD'));
					result.dateEnd = new Date(result.dateStart);
					result.dateEnd.setDate(result.dateStart.getDate()+30);
					result.billingStatus = Math.ceil(Math.random()*3);
					result.expectRemittances = new Date(result.dateEnd);
					result.expectRemittances.setDate(result.dateEnd.getDate()+10);
					result.remittancesDate = new Date(result.expectRemittances);
				};
				if (query.userRole == 'supplier') {
					result.username = faker.fake('{{name.firstName}}{{name.lastName}}') + '股份有份公司';
					result.billingRole = "supplier";
				};
				if (query.userRole == 'seller') {
					result.username = faker.fake('{{name.firstName}}{{name.lastName}}');
					result.billingRole = "seller";
				}
				if (query.userRole == 'admin') {
					result.username = faker.fake('{{name.firstName}}{{name.lastName}}') + 'or 股份有份公司';
					result.billingRole = "supplier";
				}
				result.bankAccountNumber = '070-524400' + casual.integer(from = 5000000, to = 10000000);
				result.rows = [];
				for (var i = 0; i < 5; i++) {
					var row = {};
					row.payment = paymentArray[i];
					row.revenue = casual.integer(from = 10000, to = 1000000);
					row.ezsellcost = Math.round(row.revenue * 0.05);
					row.sellercost = Math.round(row.revenue * 0.11);
					row.profit = row.revenue - row.ezsellcost - row.sellercost;
					(i == 3) && (row.profit = -(row.ezsellcost + row.sellercost));
					result.rows.push(row);
				};
				break;
			default:
				result = "ok";
		}
	} else {
		result = "err";
	}
	res.send(result);
});
router.get('/api/billing/query', function(req, res) {
	console.log(req.query);
	var query = {
		sessionID: req.query.sessionID,
		id: req.query.userID || null,
		dateStart: req.query.dateStart,
		dateEnd: req.query.dateEnd
	};
	if (sessionArray.indexOf(query.sessionID) != -1 && !!query.id) {
		var result = {};
		var paymentArray = ['信用卡付費','支付寶付費','ATM轉帳','貨到付款','手機小額付費'];
		result.rows = [];
		for (var i = 0; i < 5; i++) {
			var row = {};
			row.paymentID = "Credit3451"
			row.payment = paymentArray[i];
			row.revenue = casual.integer(from = 10000, to = 1000000);
			row.ezsellcost = Math.round(row.revenue * 0.05);
			row.sellercost = Math.round(row.revenue * 0.11);
			row.profit = row.revenue - row.ezsellcost - row.sellercost;
			(i == 3) && (row.profit = -(row.ezsellcost + row.sellercost));
			result.rows.push(row);
		};
	} else {
		var result = 'error';
	};
	res.send(result);
});
router.post('/api/billing/update', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var query = {
		sessionID: req.body.sessionID,
		updateStatus : req.body.updateStatus,
		id: req.body.id
	};
	if ( sessionArray.indexOf(query.sessionID) != -1 ) {
		var result = 'success';
	} else {
		var result = 'error';
	};
	res.send(result);
});
router.post('/api/billing/send', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var query = {
		sessionID: req.body.sessionID,
		data: req.body.data
	};
	if ( sessionArray.indexOf(query.sessionID) != -1 ) {
		var result = {
			status: 'success',
			row: {
				active: false,
				totalRevenue: casual.integer(from = 10000, to = 1000000),
				billingID: generateID(10),
				billCreated: casual.date(format = 'YYYY-MM-DD') + ' 23:23:59',
				dateStart: new Date(casual.date(format = 'YYYY-MM-DD')),
				dateEnd: null
			}
		};
		result.row.dateEnd = new Date(result.row.dateStart);
		result.row.dateEnd.setDate(result.row.dateStart.getDate()+30);
	} else {
		var result = 'error';
	};
	res.send(result);
});
// ACCOUNT ======================================================================
router.get('/api/account/query', function(req, res) {
	console.log(req.query);
	var query = {
		sessionID: req.query.sessionID,
		queryType : req.query.queryType || 'accounts',
		userID: req.query.userID || null
	};
	if ( sessionArray.indexOf(query.sessionID) != -1 ) {
		var result = null;
		switch(query.queryType) {
			case 'accounts':
				result = [];
				for (var i = 0; i < 40; i++) {
					var row = {};
					row.active = false;
					row.id = generateID(10);
					if (i < 19) {
						row.name = faker.fake('{{name.firstName}}{{name.lastName}}');
						row.userRole = "seller";
					} else {
						row.name = faker.fake('{{name.firstName}}{{name.lastName}}') + '股份有份公司';
						row.userRole = "supplier";
					};
					result.push(row);
				};
			break;
			case 'info':
				result = {};
				result.userID = query.userID;
				result.userRole = 'supplier';
				result.userAccountName = 'jive@rojo.tw';
				result.userAccountPass = 'asdfasdf5';
				result.basicInfo = {
					comName: faker.fake('{{name.firstName}}{{name.lastName}}') + '股份有份公司',
					comTax: '25000000',
					comTel: '02-25700130',
					comFax: '02-25786908',
					comEmail: 'service@rojo.tw',
					comAddress: '台北市松山區南京東路170號5樓之5'
				};
				result.bankInfo = {
					bankName: '國泰世華',
					branchName: '中山分行',
					accountName: '樂宙股份有限公司',
					accountNumber: '070-524400' + casual.integer(from = 5000000, to = 10000000),
					swiftCode: generateID(8)
				};
			break;
		}
	}
	res.send(result);
});
router.post('/api/account/update', bodyParser.json(), function(req, res) {
	console.log(req.body);
	var query = {
		sessionID: req.body.sessionID,
		updateStatus : req.body.updateStatus,
		id: req.body.id
	};
	if ( sessionArray.indexOf(query.sessionID) != -1 ) {
		var result = 'success';
	} else {
		var result = 'error';
	};
	res.send(result);
});