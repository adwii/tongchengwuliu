/*------网络封装类------*/

import constant from "./constant.js"
var token = ''

function getTokenId() {
	uni.getStorage({
		key: 'token',
		success(res) {
			token = res.data
		}
	})
	token = uni.getStorageSync('token')
	return token
}

/**
 * POST请求
 * @param {Object} param
 */
function postRequest(param, showMemId) {
	var token = getTokenId()
	param = param ? param : {};
	param.url = param.url ? param.url : ''
	param.data = param.data ? param.data : {}
	if (param.header) {
		param.header.Authorization = token
	} else {
		param.header = {
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": token
		}
	}
	param.success = param.success ? param.success : function() {}
	param.fail = param.fail ? param.fail : function() {}
	param.complete = param.complete ? param.complete : function(){}
	if (param.show) {
		uni.showLoading({
			title: "加载中...",
			mask: true
		})
	}
	param = setBaseInfo(param)
	uni.request({
		url: constant.API_URL + param.url,
		method: "POST",
		dataType: "json",
		header: param.header,
		data: param.data,
		success(res) {
			if (param.show) {
				uni.hideLoading()
			}
			if (res) {
				if (res.data.code == 1) {
					param.success(res.data.data)
				} else {
					console.log(JSON.stringify(res))
					// if (res.data.msgCode == -1) {
					// 	uni.getStorage({
					// 		key: 'token',
					// 		success: function(res) {
					// 			uni.removeStorage({
					// 				key: 'token'
					// 			})
					// 			uni.removeStorage({
					// 				key: 'memId'
					// 			})
					// 			uni.removeStorage({
					// 				key: 'ageId'
					// 			})
					// 			uni.$emit('token_filed', {
					// 				msg: '页面更新'
					// 			})
					// 		}
					// 	})
					// }
					if (param.fail) {
						param.fail(res)
					}
					if (res.data.msgCode != 'H20001' && res.data.msgCode != '-1' && param.url!=constant.DELETE_SHOP_CART) {
						uni.showToast({
							icon: "none",
							title: res.data.msg ? res.data.msg : '网络繁忙，请稍后重试'
						})
					}

				}
			}
		},
		fail(err) {
			if (param.show) {
				uni.hideLoading()
			}
			uni.showToast({
				icon: "none",
				title: "网络繁忙，请稍后重试！"
			})
		},
		complete() {
			uni.stopPullDownRefresh()
			// console.log('请求结束----' + constant.API_URL + param.url + '-------' + JSON.stringify(param.data))
		}
	})
}

/**
 * GET请求
 * @param {Object} param
 */
function getRequest(param) {
	var token = getTokenId()
	param = param || {};
	param.url = param.url || ''
	param.data = param.data || {}
	if (param.header) {
		param.header.Authorization = token
	} else {
		param.header = {
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": token
		}
	}
	param.success = param.success || function() {}
	param.fail = param.fail || function() {}
	param.complete = param.complete || function(){}
	if (param.show) {
		uni.showLoading({
			title: "加载中..."
		})
	}
	param = setBaseInfo(param)
	uni.request({
		url: constant.API_URL + param.url,
		method: "GET",
		dataType: "json",
		header: param.header,
		data: param.data,
		success(res) {
			if (res) {
				if (res.data.code == 1) {
					param.success(res.data.data)
				} else {
					param.fail(res.data)
				}
			}
		},
		fail(err) {
			uni.showToast({
				icon: 'none',
				title: "网络繁忙，请稍后重试！"
			})
		},
		complete(res) {
			param.complete(res.data)
			uni.hideLoading()
			// console.log('请求结束')
		}
	})
}
//图片上传
function updateFileAction(param) {
	if (param.show) {
		uni.showLoading({
			title: "加载中..."
		})
	}
	if (param.isOne) {
		uni.uploadFile({
			url: constant.API_URL + param.url,
			filePath: param.filePath[0],
			name: 'file',
			success(res) {
				if (res) {
					var data = JSON.parse(res.data)
					if (data.code == 1) {
						param.success(data.data)
					} else {
						if (param.fail) {
							param.fail(data)
						}
						uni.showToast({
							icon: "none",
							title: data.msg ? data.msg : '网络繁忙，请稍后重试'
						})
						console.log(data.msg)
					}
				}
			},
			fail(err) {
				uni.showToast({
					icon: "none",
					title: "网络繁忙，请稍后重试！"
				})

			},
			complete() {
				if (param.show) {
					uni.hideLoading()
				}
			}
		})
	} else {
		var list = []
		for (var i = 0; i < param.filePath.length; i++) {
			var data = {
				name: 'image' + i,
				uri: param.filePath[i]
			}
			list.push(data)
		}
		uni.uploadFile({
			url: constant.API_URL + param.url,
			files: list,
			success(res) {
				if (res) {
					var data = JSON.parse(res.data)
					if (data.code == 1) {
						param.success(data.data)
					} else {
						if (param.fail) {
							param.fail(data)
						}
						uni.showToast({
							icon: "none",
							title: data.msg ? data.msg : '请求失败'
						})
						console.log(data.msg)
					}
				}
			},
			fail(err) {
				uni.showToast({
					icon: "none",
					title: "请求失败"
				})

			},
			complete() {
				if (param.show) {
					uni.hideLoading()
				}
			}
		})
	}
}

/* 时间段换算 */

function timeDate(startTime){
	let systime = new Date().getTime();
	let dateBegin = new Date(startTime.replace(/-/g, "/"));
	let timestampToTime = dateBegin.getTime();
	let dateDiff = systime - timestampToTime;
	/* console.log(dateDiff); */
	let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
	let leave1 = dateDiff%(24*3600*1000) //计算天数后剩余的毫秒数
	let hours = Math.floor(leave1/(3600*1000))//计算出小时数
	//计算相差分钟数
	let leave2 = leave1%(3600*1000) //计算小时数后剩余的毫秒数
	let minutes = Math.floor(leave2/(60*1000))//计算相差分钟数
	//计算相差秒数
	let leave3 = leave2%(60*1000) //计算分钟数后剩余的毫秒数
	let seconds = Math.round(leave3/1000)
	/* console.log(" 相差 "+dayDiff+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
	console.log(dateDiff+"时间差的毫秒数",dayDiff+"计算出相差天数",leave1+"计算天数后剩余的毫秒数"
	,hours+"计算出小时数",minutes+"计算相差分钟数",seconds+"计算相差秒数"); */
	if(dayDiff > 0){
		return startTime
	}
	if( hours > 1 ){
		return hours+"小时前"
	}
	if(hours < 1){
		return minutes+"分钟前"
	}
}

/**
 * 公共参数
 */
function setBaseInfo(param) {
	return param
}

export const request = {
	postRequest,
	getRequest,
	updateFileAction,
	timeDate
}
