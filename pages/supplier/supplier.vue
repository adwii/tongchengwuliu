<template>
	<view class="supplier page">
		<div class='search'>
			<div>
				<picker mode="selector" :value="listIndex" :range="siteChooseList" @change="chooseList" style="width: 100%;">
					<icons type="location-filled" :size="size" color="#fff"></icons>
					<span style='width: 120rpx;display: inline-block;white-space: nowrap; text-overflow: ellipsis; overflow: hidden; word-break: break-all;'>{{siteChooseList[listIndex]}}</span>
				</picker>
			</div>
			<div>
				<icons type="search" :size="size" color="#B2B2B2"></icons>
				<input type="text" v-model="searchInput" placeholder="店铺名称、主营类目、电话" @confirm='choose(active)'/>
			</div>
		</div>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
			<swiper-item v-for="(item,index) in swiperList" :key='index'>
				<view class="swiper-item">
					<image :src="'http://wl.ty300.cn/uploads/' + item.banner" mode=""></image>
				</view>
			</swiper-item>
		</swiper>
		<div class='scroll'>
			<scroll-view scroll-x="true">
				<view :class="active == index ? 'active' : ''" v-for='(item,index) in kindList' :key='index' @click="choose(index)">{{item.name}}</view>
			</scroll-view>
		</div>
		<div class='list'>
			<navigator :url="'../supplierDetail/supplierDetail?id=' + item.id" v-for="(item,index) in list" :key='index'>
				<image :src="'http://wl.ty300.cn/uploads/' + item.img[0]"></image>
				<div>
					<p>{{item.name}}</p>
					<p>{{item.cate_name.join('、')}}</p>
					<p>{{item.province + ' ' + item.city + ' ' + item.area + '  ' +item.address}}</p>
				</div>
			</navigator>
		</div>
		<login :showLogin='showLogin' @closeLogin='closeLogin' @referesPage='referesPage'></login>
	</view>
</template>

<script>
	
	import icons from '../../components/uni-icons/uni-icons.vue'
	var _this = null
	
	export default {
		data() {
			return {
				size: uni.upx2px(40),
				active: 0,
				list: [],
				swiperList: [],
				kindList: [],
				searchInput: '',
				showLogin: false,
				listIndex: '',
				siteChooseList: [],
				siteList: [],
				siteId: uni.getStorageSync('siteInfo').site_id
			};
		},
		components: {
			icons
		},
		onLoad() {
			_this = this
			_this.getSwiper()
			_this.getKindList()
			_this.getSiteList()
		},
		onShow() {
			this.needLogin()
			this.referesPage()
		},
		methods: {
			//检测是否需要登录
			needLogin(){
				let isLogin = uni.getStorageSync('userInfo')
				if(!isLogin){
					this.showLogin = true
				}else{
					this.showLogin = false
				}
			},
			choose(i){
				this.active = i
				this.http.getGoodsList({
					data: {
						cate_id: this.kindList[i].id,
						name: this.searchInput.trim().length ? this.searchInput.trim() : '',
						transpot_id: this.siteId
					},
					complete: function(res){
						console.log(res)
						if((res.msg == 'Token not provided' || res.msg == "用户无法刷新令牌，需要重新登录") && res.code == -1){
							_this.showLogin = true
						}else{
							_this.list = res.data
						}
						
					}
				})
			},
			//获取轮播图列表
			getSwiper(){
				this.http.getSwiperImage({
					data: {status: 1},
					success: function(res){
						console.log(res)
						_this.swiperList = res
					}
				})
			},
			//获取分类列表
			getKindList(){
				this.http.getGoodsKind({
					complete: function(res){
						if((res.msg == 'Token not provided' || res.msg == "用户无法刷新令牌，需要重新登录") && res.code == -1){
							_this.showLogin = true
						}else{
							_this.kindList = res.data
						}
						
						_this.choose(0)
					}
				})
			},
			referesPage(){
				_this.getKindList()
				_this.getSiteList()
			},
			//关闭登录窗口
			closeLogin(e){
				this.showLogin = false
			},
			//获取站点列表
			getSiteList(){
				console.log(uni.getStorageSync('siteInfo'))
				this.http.getSite({
					data: {
						gps_x: uni.getStorageSync('siteInfo').pos_gps_x,
						gps_y: uni.getStorageSync('siteInfo').pos_gps_y
					},
					complete: function(res){
						console.log(res)
						if((res.msg == 'Token not provided' || res.msg == "用户无法刷新令牌，需要重新登录") && res.code == -1){
							_this.showLogin = true
						}else{
							_this.siteList = res.data
							let arr = []
							for(let i = 0; i < res.data.length; i++){
								arr.push(res.data[i].name)
								if(_this.siteId == res.data[i].id){
									_this.listIndex = i
								}
							}
							_this.siteChooseList = arr
						}
						
					}
				})
			},
			chooseList(e){
				this.siteId = this.siteList[e.detail.value].id
				this.listIndex = e.detail.value
				this.choose(this.active)
			},
			cons(item){
				console.log(JSON.parse(JSON.stringify(item)))
			}
		}
	}
</script>

<style lang="less">
	.supplier{
		padding-top: 100rpx;
		.search{
			position: fixed;
			top: 0;
			left: 0;
			padding: 20rpx 0;
			background-color: #1E86E9;
			display: flex;
			width: 100%;
			justify-content: space-between;
			font-size: 28rpx;
			z-index: 5;
			div{
				&:nth-of-type(1){
					padding-top: 20rpx;
					color: #fff;
					width: 200rpx;
					icons{
						margin: 0 10rpx 0 20rpx;
						margin-top: -30rpx;
					}
				}
				&:nth-of-type(2){
					line-height: 80rpx;
					background-color: #fff;
					border-radius: 40rpx;
					padding: 0 20rpx;
					margin: 0 20rpx;
					display: flex;
					flex: 1;
					width: 500rpx;
					input{
						flex: 1;
						height: 80rpx;
						line-height: 80rpx;
						margin-left: 10rpx;
						font-size: 28rpx;
					}
				}
			}
		}
		&>swiper{
			width: 100%;
			height: 400rpx;
			swiper-item{
				width: 100%;
				height: 100%;
				view{
					width: 100%;
					height: 100%;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		.scroll{
			background-color: #fff;
			scroll-view{
				width: 100%;
				white-space: nowrap;
				line-height: 90rpx;
				font-size: 28rpx;
				view{
					display: inline-block;
					padding: 0 20rpx;
				}
				.active{
					color: #1E86E9;
					font-weight: 600;
				}
			}
		}
		.list{
			margin: 20rpx 0;
			navigator{
				background-color: #fff;
				padding: 20rpx;
				display: flex;
				margin: 6rpx 0;
				image{
					width: 200rpx;
					height: 200rpx;
					margin-right: 30rpx;
				}
				div{
					flex: 1;
					p{
						color: #101010;
						font-size: 28rpx;
						width: 100%;
						&:nth-of-type(1){
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							font-size: 32rpx;
							color: #555555;
							height: 80rpx;
							font-weight: 700;
						}
						&:nth-of-type(3){
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							height: 80rpx;
						}
					}
				}
			}
		}
	}
</style>
