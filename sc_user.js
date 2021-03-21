// ==UserScript==
// @name         xx
// @namespace    xx_script
// @version      0.2
// @description  try to take over the world!
// @author       x
// @match        https://ypt.jxddkeji.com/*
// @updateURL    https://raw.githubusercontent.com/Leon0X/xx/main/sc_user.js
// @grant        none
// @charset		 UTF-8
// ==/UserScript==

(function() {
	'use strict';
	//
	//
	/////***********************
	//// 登录网址
	//customer_id=czo0OiI5OTQ3Ijs
	var customer_id = "czo0OiI5OTQ3Ijs";
	var login_action = "a=login";
	//https://ypt.jxddkeji.com/wsy_user/web/index.php?m=login&a=login&customer_id=czo0OiI5OTQ3Ijs
	var login_url = "https://ypt.jxddkeji.com/wsy_user/web/index.php?m=login&a=login";
	var sy_action = "a=index";
	var sy_url = "https://ypt.jxddkeji.com/wsy_pub/web/index.php?m=app_index&a=index";
	var mine_action = "a=personal_center";
	var mine_url = "https://ypt.jxddkeji.com/wsy_pub/web/index.php?m=app_index&a=personal_center";

	var product_url = "https://ypt.jxddkeji.com/collage/web/index.php?m=product&a=product_list&list_type=1"

	// 拼团详情
	var group_action = "a=activities_details";

	//订单确认
	var order_action = "a=order_confirmation";

	//
	var pay_action = "a=history_back";

	//
	var orderlist_action = "a=order_list";

	var speed = [
		group_action,
		order_action,
		pay_action,
		mine_action,
		orderlist_action,
	];


	/////***********************
	var $ = $ || window.$;
	var window_url = window.location.href;
	var website_host = window.location.host;

	var info = `
<div class="user-ment">



</div>`;

	var userList = {
		'15858668229': {
			user_id: 0,
			user: '15858668229',
			pw: 'a666666',
			paypw: '666666',
		},
		'13906597281': {
			user_id: 0,
			user: '13906597281',
			pw: 'a123456',
			paypw: '666666',
		},
		'18772692561': {
			user_id: 0,
			user: '18772692561',
			pw: 'a123456',
			paypw: '666666',
		},
	}

	var common = {
		info: function(msg) {

			console.log(msg);
		},
		debug: function(msg) {
			console.log("debug:   ");
			console.log(msg);
		},
		getDateTimeStr: function(date) {

			if (!date) {
				date = new Date();
			}

			var year = date.getFullYear();        //年
			var month = date.getMonth() + 1;      //月
			var day = date.getDate();             //日

			var hh = date.getHours();             //时
			var mm = date.getMinutes();           //分
			var ss = date.getSeconds();
			var clock = year + "-";
			if (month < 10) clock += "0";
			clock += month + "-";
			if (day < 10) clock += "0";
			clock += day + " ";
			if (hh < 10) clock += "0";
			clock += hh + ":";
			if (mm < 10) clock += '0';
			clock += mm + ":";
			if (ss < 10) clock += '0';
			clock += ss;

			return (clock);

		},

		timeFormat: function(time) {

			var difftime = time / 1000; //计算时间差,并把毫秒转换成秒

			var days = parseInt(difftime / 86400); // 天  24*60*60*1000
			var hours = parseInt(difftime / 3600) - 24 * days; // 小时 60*60 总小时数-过去的小时数=现在的小时数
			var minutes = parseInt(difftime % 3600 / 60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
			var seconds = parseInt(difftime % 60); // 以60秒为一整份 取余 剩下秒数
			return (days > 0 ? days + "天" : "") + (hours > 0 ? hours + "小时" : "") + (minutes > 0 ? minutes + "分钟" : "") + (seconds > 0 ? seconds + "秒" : "") + time % 1000;

		},
		toDayEnd: function() {
			//  common.toDayEnd();
			// 离当天结束剩余时间（毫秒）
			var d = new Date();
			d.setHours(24, 0, 0);
			var now = new Date();

			return d.getTime() - now.getTime();
		}


	}

	var mineVal = {
		action: mine_action, //   login_action, //
		pre_action: login_action,
		next_action: "", //sy_action ,
		init_coin: 0,
		coin: 0,
		lasttime_coin: 0,
		ispay: 0,
		// 任务
		isTack: 0,
		group: {},
		grouped: [],
		common_parameters: "",
		/*
       {
				'api_key' : '036bfa4d6a5a26188241f8739afe7091',
				'app_id'  : 10000,
				'customer_id' : '9947',
				'customer_id_en' : 'czo0OiI5OTQ3Ijs',
				'common_link' : 'https://ypt.jxddkeji.com',
				'lang' : 'zh_cn',
				'show_monetary_unit' : '￥',
			}
     //   */

		user_info: {

		},
		// 参团间隔时间
		group_wait_time: 20000,
		// 默认 零钱刷新等待时间
		def_wait_time: 5 * 60 * 1000,
		// 零钱刷新等待时间
		wait_time: 5 * 60 * 1000,
		// 零钱刷新等待次数
		wait_time_count: 0,

		currpj: 0,
		pjs: [{
				customer_id: "",
				ac_name: "眼镜活动",
				activities_id: "339",
				product_id: "522",
				coin: 100,
				count: 0,
				isenable: 1,
			}, {
				customer_id: "",
				ac_name: "护肤系列",
				activities_id: "340",
				product_id: "523",
				coin: 100,
				count: 0,
				isenable: 1,
				ch_spec: [0],


			}, {
				customer_id: "",
				ac_name: "保健贴活动",
				activities_id: "341",
				product_id: "524",
				coin: 100,
				count: 0,
				isenable: 1,
			}, {
				customer_id: "",
				ac_name: "秘方膏药",
				activities_id: "338",
				product_id: "521",
				coin: 100,
				count: 0,
				isenable: 1,
			}

		]
	}


	var helper = {
		mineVal: mineVal
	};

	helper.getAction = function(url) {
		var x1 = url.indexOf("a=");
		var x2 = url.indexOf("&", x1);
		x2 = x2 > 0 ? x2 : url.length;
		var action = url.substring(x1, x2);
		return action;
	}

	helper.setsession = function() {
		var user = ""; //  mineVal.user_info.user;
		sessionStorage.setItem(user + "mineVal", JSON.stringify(mineVal));
	}
	helper.getsession = function() {
		var user = ""; //mineVal.user_info.user || window.vm.user_info.phone ;

		var str = sessionStorage.getItem(user + "mineVal");
		mineVal = str ? JSON.parse(str) : mineVal;
	}


	helper.showTack = function() {
		if ($('#x_style_tack').length == 0) {

			var css = `
#x_box_ { position:fixed;top:200px; left:0px; padding:5px 0px; z-index:9999999899999;  }
#x_start {     margin: 5px; padding: 5px; border: 2px solid; font-weight: bold; cursor:pointer; }
`;
			$("body").prepend("<style id='x_style_tack'>" + css + "</style>");
		}

		var startmsg = mineVal.isTack == 1 ? "停止刷单" : (mineVal.isTack == 2 ? "今天任务都完成了" : "开始刷单");

		$('#x_box_').remove();

		var html = `
<div id='x_box_'>
<div id='x_start' > ${startmsg} </div>
</div>
`;

		$("body").append(html);

		$("#x_box_ #x_start").off("click").on("click", function() {

			mineVal.isTack = mineVal.isTack ? 0 : 1;
			helper.setsession();
			if (mineVal.isTack) {
				helper.gotomine();
			} else {

				helper.showTack();

			}
		});

	}

	helper.showLogin = function() {
		var css = `
#x_box_ { position:fixed;top:200px; left:0px; padding:5px 0px; z-index:9999999899999;  }
.x_li { text-align: center;  margin: 2px ;  font-weight: bold; cursor:pointer; }
#x_login_box {display:block; position:absolute;top:-0px;left:120px;overflow:hidden;}
`;
		$("body").prepend("<style>" + css + "</style>");


		var lis = "";
		for (var u in userList) {
			lis += ' <div class="x_li " id="' + u + '" > ' + u + '  </div> ';
		}


		var html = `
<div id='x_box_'>
<div class="x_ul">
${lis}
</div>
<div id="x_login_box">
<div>帐号</div> <input class="x_input" id="x_user" >
<div>密码</div><input class="x_input" id="x_pw">
<div>支付密码</div><input class="x_input" id="x_paypw">
<div >  <input style="margin: 5px 50px;padding: 5px;"  type="button" value="登录" id="x_login_bt">  </div>
</div>
</div>
`;

		$("body").append(html);

		$("#x_box_ .x_li").off("click").on("click", function(eve) {
			var user = userList[this.id];
			$("#x_user").val(user.user);
			$("#x_pw").val(user.pw);
			$("#x_paypw").val(user.paypw);
		});
		$("#x_box_ #x_login_bt").off("click").on("click", function(eve) {


			var user = {
				userid: 0,
				user: $("#x_user").val() + "",
				pw: $("#x_pw").val() + "",
				paypw: $("#x_paypw").val() + ""
			}
			if (!user.user) {
				alert("请输入  帐号");
				return;
			}
			if (!user.pw) {
				alert("请输入  密码");
				return;
			}

			if (!user.paypw) {
				alert("请输入  支付密码");
				return;
			}

			common.debug("登录");
			mineVal.user_info = user;

			helper.login(mineVal.user_info);

		});

	}


	helper.login = function(userInfo) {

		if (window.location.href.indexOf(login_action) > 0 && window.vm) {
			$('#app .phone_num').val(userInfo.user);
			$('#app .password').val(userInfo.pw);
			window.vm.password = userInfo.pw;
			window.vm.phone_num = userInfo.user;
			mineVal.action = mine_action;
			helper.setsession();
			$('#app .com-pay-btn').click();
		} else if (helper.issy()) {} else if (helper.ismine()) {}

	}



	// 首页
	helper.gotosy = function() {

		//https://ypt.jxddkeji.com/wsy_pub/web/index.php?m=app_index&a=index&customer_id=czo0OiI5OTQ3Ijs&template_id=&t=1615205154527
		//window.location.href=$($('.footer-box a')[0])[0].href;
		var seler = '.footer-box a:eq(0)';
		setInterval(function() {
			common.debug("loop  gotosy ");
			if ($(seler)) {
				var url = $(seler)[0].href;
				mineVal.pre_action = mineVal.action;
				mineVal.action = helper.getAction(url);
				helper.setsession();
				window.location.href = url;

			}

		}, 1000);

	}

	helper.issy = function() {
		return window.location.href.indexOf(sy_action) > 0;
	}

	helper.gotomine = function() {
		// 我的
		//https://ypt.jxddkeji.com/wsy_pub/web/index.php?m=app_index&a=personal_center&customer_id=czo0OiI5OTQ3Ijs&template_id=&t=1615206285110

		// /*

		var url = "https://ypt.jxddkeji.com/wsy_pub/web/index.php?m=app_index&a=personal_center&customer_id=czo0OiI5OTQ3Ijs";
		mineVal.pre_action = mineVal.action;
		mineVal.action = helper.getAction(url);
		helper.setsession();
		window.location.href = url;
		// */
		/*
        var seler = '.footer-box a:eq(1)';
        setInterval(function(){

            common.debug("loop  gotomine ");
            if($(seler)){
                var url = $(seler)[0].href;
                mineVal.action = helper.getAction(url);
                helper.setsession();
                window.location.href=url;

            }

        }, 1000);
//   */

	}
	helper.ismine = function() {
		return window.location.href.indexOf(mine_action) > 0;
	}

	helper.waitfor = function(time) {

		common.debug(" currDate :" + common.getDateTimeStr(new Date()));
		common.debug("waitfor　－－－　wait_time :" + 　time + "  wait_time_count:  " + mineVal.wait_time_count);


		setTimeout(function() {
			mineVal.wait_time = time;
			mineVal.wait_time_count += 1;
			if (mineVal.wait_time == mineVal.def_wait_time && mineVal.wait_time_count > 4) {
				mineVal.wait_time = 60000;
				mineVal.wait_time_count = 0;
			} else if (mineVal.wait_time = 60000) {} else {
				mineVal.wait_time = mineVal.def_wait_time
				mineVal.wait_time_count = 0;
			}

			helper.gotomine();

		}, time);


	}

	helper.initV = function() {

		var count = 0;
		var pjs = [];
		for (var i = 0, len = mineVal.pjs.length; i < len; i++) {
			var pj = mineVal.pjs[i];
			pj.isenable && pjs.push(pj);

		}
		mineVal.pjs = pjs;


		if (helper.ismine() && window.vm) {
			mineVal.common_parameters = window.common_parameters;
			var tm = setInterval(function() {
				if (window.vm.user_info.uid) {
					common.debug(" user_id::  " + window.vm.user_info.uid);
					mineVal.user_info.user_id = window.vm.user_info.uid;
					helper.setsession();
					clearInterval(tm);
				}

			}, 1000);
		}

	}
	helper.getcoin = function() {
		//零钱
		var time = 1000;
		var time_count = 0;
		if (helper.ismine() && window.vm) {

			var tm = setInterval(function() {

				common.debug("loop  getcoin ");

				//c = parseFloat( $('#app .custom-data li:eq(0) a .num').text());
				var c = parseFloat(window.vm.pocket_money);

				if (c > 0) {
					common.info("我的零钱：" + c);
					mineVal.coin = c;
					mineVal.init_coin = 1;
					mineVal.lasttime_coin = new Date().getTime();
					helper.setsession();
					clearInterval(tm);

					if (mineVal.coin < 100) {
						helper.waitfor(mineVal.wait_time);
					} else {
						mineVal.wait_time_count = 0;
						mineVal.wait_time = mineVal.def_wait_time;
					}

				}
				time_count += 1;
				/*
				if(time == 1800000 && mineVal.time_count > 3 ){
				   helper.getcoin(600000);
				}else if(time == 600000 && mineVal.time_count > 19 ){
				    helper.getcoin(60000);

				}else
				*/
				if (time == 1000 && time_count > 19) {
					helper.waitfor(mineVal.wait_time);
				}



			}, time);


		} else {
			helper.gotomine();

		}
	}



	helper.go_group = function() {
		if (mineVal.currpj >= mineVal.pjs.length) {
			helper.isfinish();
			return;
		}

		var currpj = mineVal.pjs[mineVal.currpj];

		var customer_id = mineVal.common_parameters.customer_id_en;
		var user_id = mineVal.user_info.user_id;
		if (!user_id) {
			debugger
			user_id = window.vm.user_info.uid;
			mineVal.user_info.user_id = user_id;

		}

		var url = "https://ypt.jxddkeji.com/collage/web/";
		$.post(url + "index.php?m=product&a=get_order_group", {
			product_id: currpj.product_id,
			activities_id: currpj.activities_id,
			customer_id: customer_id
		}, function(res) {
			if (res.errcode == 0) {

				var group_info = res.data.order_group.group_info;
                var ret = false;
				for (var i = 0, len = group_info.length; i < len; i++) {
					var g_info = group_info[i];
					if (g_info.last_size > 10 && mineVal.grouped.indexOf(g_info.id) == -1) {
						var group_id = g_info.id;
						var discern_num = g_info.discern_num;


						//var customer_id = mineVal.common_parameters.customer_id_en;
						//var user_id = mineVal.user_info.user_id;
						var product_id = currpj.product_id;
						var activities_id = currpj.activities_id;
						//var group_id = mineVal.group.id;
						//var discern_num = mineVal.group.discern_num;
						
						var url = "https://ypt.jxddkeji.com/collage/web/";
						$.ajax({
							type: "POST",
							url: url + "index.php?m=order&a=pay_details",
							async: false, // 同步
							data: {
								product_id: product_id,
								activities_id: activities_id,
								user_id: user_id,
								customer_id: customer_id,
								group_id: group_id,
								discern_num: discern_num
							},
							dataType: "json",
							success: function(res) {
								// 判断是否无法再参加
								if (res.errcode === 400 && res.type == 1) {
									mineVal.currpj += 1;
									helper.go_group();
									ret = true;
									return;
								}



								mineVal.group = {
									"id": group_id,
									"user_id": g_info.user_id,
									"discern_num": discern_num,
									"group_type": g_info.group_type,
								};

								var order_url = "https://ypt.jxddkeji.com/collage/web/index.php?m=order&a=activities_details" +
									"&product_id=" + currpj.product_id + "&activities_id=" + currpj.activities_id +
									"&group_id=" + group_id + "&discern_num=" + discern_num +
									"&customer_id=" + customer_id + "&user_id=" + user_id;
								mineVal.pre_action = mineVal.action;
								mineVal.action = "a=activities_details";
								helper.setsession();

								window.location.href = order_url;



							},
							error: function(res) {
								helper.gotomine();
							}

						});
						if (ret) {
							break;
						}

					}

				}
if (!ret) {
				helper.main();
}

				/*
				            self.group_page = res.data.order_group.group_page;

				            if(self.group_info.length>0){
				                self.group_count_time();  //倒计时方法
				            }
				            self.is_group = parseInt(self.is_group_restrict)&&self.group_info.length>0 ? 1 : 0;
				            */
			}
		}, "json");



	}


	helper.group = function() {



		var tm = setInterval(function() {
			if (window.vm.collage_status) {

				var collage_status = window.vm.collage_status;
				if (collage_status === "notjoin") {
					var currpj = mineVal.pjs[mineVal.currpj];
					if (currpj.ch_spec) {
						//选属性

						//window.vm.ch_spec=currpj.ch_spec;
						for (var i = 0, len = currpj.ch_spec.length; i < len; i++) {
							window.vm.chose_spec(i, currpj.ch_spec[i]);
						}
					}

					mineVal.pre_action = mineVal.action;
					mineVal.action = order_action;
					helper.setsession();
					window.vm.join_group_judge2();

				} else {
					helper.gotomine();
				}

				clearInterval(tm);

			}

		}, 1000);

	}


	helper.order = function() {
		var tm = setInterval(function() {
			if (window.vm.phone) {
				clearInterval(tm);
				mineVal.pre_action = mineVal.action;
				mineVal.action = pay_action;
				helper.setsession();
				window.vm.create_order();
			}

		}, 1000);
	}


	helper.pay = function() {
		var tm = setInterval(function() {
			if (window.vm.pocket_money) {
				clearInterval(tm);

				mineVal.ispay = 1;
				mineVal.pre_action = mineVal.action;
				mineVal.action = mine_action;
				helper.setsession();
				window.vm.pay();
			}

		}, 1000);
	}


	helper.paypassword = function() {

		common.debug("  come paypassword   ");
		var tm = setInterval(function() {

			clearInterval(tm);
			common.debug(" paypassword   ");
			mineVal.pre_action = mineVal.action;
			mineVal.action = orderlist_action;

			helper.setsession();
			window.vm.input_focus();
			window.vm.password_data = mineVal.user_info.paypw; // "666666";
			window.vm.password;

		}, 1000);

	}

	helper.isfinish = function() {
		mineVal.isTack = 2;
		helper.showTack();
		common.info(mineVal.pjs.length + "项活动已完成");
        helper.refresh();
	}

	helper.reInit = function() {
		mineVal.pjs = 0;
		mineVal.grouped = [];
		mineVal.isTack = 1;
		helper.gotomine();
	}

	helper.refresh = function() {
		var t = common.toDayEnd();
		common.info("等待0点刷新 距0点：" + common.timeFormat(t));
		setTimeout(function() {
			helper.reInit();
		}, t);
	}

	window.helper = helper;

	function main() {

		var curaction = helper.getAction(window_url);
		common.debug(" curaction:   " + curaction);

		if (curaction == login_action) {
			if (!mineVal.user_info.user) {
				helper.showLogin();
				return;
			} else {
				//登录
				common.debug("登录");

				helper.login(mineVal.user_info);
			}
		}

		helper.getsession();
		common.debug(" datetime:   " + (new Date().getTime()));
		common.debug(mineVal);
		if (!mineVal.isTack) {
			helper.showTack();
			return;
		}
		if (curaction != mineVal.action) {
			common.info("非活动页");
			return;
		}

		if (mineVal.currpj >= mineVal.pjs.length) {
			helper.isfinish();
			return;
		}

		if (curaction == mine_action) {
			// 获取 零钱
			common.debug("获取 零钱");
			if (mineVal.init_coin == 0) {
				helper.showTack();
				helper.initV();
				helper.getcoin();
			} else if (mineVal.coin < 100) {
				helper.showTack();
				helper.getcoin();
			}
			if (mineVal.ispay) {
				helper.paypassword();
			} else if (mineVal.next_action == sy_action) {
				common.debug("去首页");
				helper.gotosy();
			} else {
				var g_t = 0
				var g_tm = setInterval(function() {
					if (mineVal.user_info.user_id && mineVal.coin >= 100) {
						clearInterval(g_tm);
						helper.go_group();

					}
					g_t++;

					if (g_t > 20) {
						clearInterval(g_tm);

					}
				}, 1000);
			}
		} else if (curaction == sy_action) {

		} else if (curaction == group_action) {

			helper.group();

		} else if (curaction == order_action) {
			helper.order();
		} else if (curaction == pay_action) {
			helper.pay();
		} else if (curaction == orderlist_action) {
			mineVal.pre_action = mineVal.action;
			mineVal.action = mine_action;
			mineVal.ispay = 0;
			mineVal.coin -= mineVal.pjs[mineVal.currpj].coin;
			mineVal.grouped.push(mineVal.group.id);
			helper.setsession();

			setTimeout(function() {

				//  helper.gotomine();
				window.history.go(-1);
			}, mineVal.group_wait_time);
		}
	}

	main();

	//加载事件
	///*
	//  window.onload=function(){
	//    main();
	//  };


})();
