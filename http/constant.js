
/**
 * 开发
 */
const API_URL = 'https://wl.ty300.cn'

    
	
/**
 * api接口
 */
const userLogin = '/api/login'  //用户登录
const getUserOpenId = '/api/get_open_id'  //获取用户openId
const getUserPhoneNum = '/api/get_user_phone'  //获取用户手机号
const getSwiperImage = '/api/get_banner'  //获取轮播图 status区分: 1供货商轮播图2广告
const getNotic = '/api/user/get_notice'  //获取首页顶部公告列表
const getSite = '/api/user/get_trans_list'  //获取站点列表
const getGoodsKind = '/api/user/cate'  //获取店铺分类
const getGoodsList = '/api/user/shop'  //获取店铺列表
const getShopDetail = '/api/user/shop_detail'  //获取店铺详情
const getAgreeAbout = '/api/get_agreement'  //获取协议、关于我们、运费规则
const getOrderList = '/api/user/list'  //获取订单列表
const getAddressList = '/api/user/get_address'  //获取用户地址簿
const removeAddress = '/api/user/del_address'  //删除地址
const addAddress = '/api/user/add_address'  //新增地址
const updateAddress = '/api/user/update_address'  //修改编辑地址
const topAddress = '/api/user/top_address'  //设置默认地址
const createOrder = '/api/user/create_order'  //下单
const uploadImage = '/api/user/image'  //上传图片
const getUserInfo = '/api/user/index'  //获取用户基本信息
const updateUserInfo = '/api/user/update_info'  //修改用户基本信息
const orderDetail = '/api/user/detail'  //获取订单详情
const updateOrder = '/api/user/update_order'  //更新订单
const getRegion = '/api/get/address_all'  //获取区域文件

export default{
	API_URL,
	userLogin,
	getUserOpenId,
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