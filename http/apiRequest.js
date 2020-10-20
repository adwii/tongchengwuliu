import {
	request
} from "./httpRequest.js"
import constant from "./constant.js"

// 
// /**-----api接口------**/
function userLogin(param){
	param.url = constant.userLogin
	console.log(request)
	request.postRequest(param)
}
function getOpenId(param){
	param.url = constant.getUserOpenId
	request.getRequest(param)
}
function getUserPhoneNum(param){
	param.url = constant.getUserPhoneNum
	request.postRequest(param)
}
function getSwiperImage(param){
	param.url = constant.getSwiperImage
	request.getRequest(param)
}
function getNotic(param){
	param.url = constant.getNotic
	request.getRequest(param)
}
function getSite(param){
	param.url = constant.getSite
	request.getRequest(param)
}
function getGoodsKind(param){
	param.url = constant.getGoodsKind
	request.getRequest(param)
}
function getGoodsList(param){
	param.url = constant.getGoodsList
	request.getRequest(param)
}
function getShopDetail(param){
	param.url = constant.getShopDetail
	request.getRequest(param)
}
function getAgreeAbout(param){
	param.url = constant.getAgreeAbout
	request.getRequest(param)
}
function getOrderList(param){
	param.url = constant.getOrderList
	request.getRequest(param)
}
function getAddressList(param){
	param.url = constant.getAddressList
	request.getRequest(param)
}
function removeAddress(param){
	param.url = constant.removeAddress
	request.postRequest(param)
}
function addAddress(param){
	param.url = constant.addAddress
	request.postRequest(param)
}
function updateAddress(param){
	param.url = constant.updateAddress
	request.postRequest(param)
}
function topAddress(param){
	param.url = constant.topAddress
	request.postRequest(param)
}
function createOrder(param){
	param.url = constant.createOrder
	request.postRequest(param)
}
function uploadImage(param){
	param.url = constant.uploadImage
	request.postRequest(param)
}
function getUserInfo(param){
	param.url = constant.getUserInfo
	request.getRequest(param)
}
function updateUserInfo(param){
	param.url = constant.updateUserInfo
	request.postRequest(param)
}
function orderDetail(param){
	param.url = constant.orderDetail
	request.getRequest(param)
}
function updateOrder(param){
	param.url = constant.updateOrder
	request.postRequest(param)
}
function getRegion(param){
	console.log(constant.getRegion)
	param.url = constant.getRegion
	request.postRequest(param)
}

export const http = {
	userLogin,
	getOpenId,
	getUserPhoneNum,
	getSwiperImage,
	getNotic,
	getSite,
	getGoodsKind,
	getGoodsList,
	getAgreeAbout,
	getOrderList,
	getAddressList,
	removeAddress,
	addAddress,
	updateAddress,
	topAddress,
	createOrder,
	uploadImage,
	getUserInfo,
	updateUserInfo,
	orderDetail,
	updateOrder,
	getRegion,
	getShopDetail
}