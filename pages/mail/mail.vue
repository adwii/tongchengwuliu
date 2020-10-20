<template>
	<view class="mail page">
		<div class='top'>
			<image src="../../static/jijian_bg.png" mode="widthFix"></image>
			<div class='top_notice'>
				<icons :size="size" type="sound" color="#fff"></icons>
				<swiper :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000" circular>
					<swiper-item v-for="(item,index) in noticList" :key='index'>
						<view class="swiper-item">{{item.message}}</view>
					</swiper-item>
				</swiper>
			</div>
		</div>
		<div class='site'>
			
			<swiper :indicator-dots="false" :autoplay="true" :interval="3500" :duration="1000" circular>
				<swiper-item v-for="(item,index) in siteList" :key='index'>
					<view class="swiper-item">
						<p>
							<span>托运站：{{item.address}}</span>
							<span>{{index+1}}/{{siteList.length}}</span>
						</p>
						<div>
							<p>{{item.name}}</p>
							<p>揽件时间：{{item.archive_time}}</p>
							<p>发车班车：{{item.send_time}}</p>
						</div>
					</view>
				</swiper-item>
			</swiper>
		</div>
		<div class='ad'>
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" indicator-color='#FFFFFF' :duration="1000" circular>
				<swiper-item v-for="(item,index) in swiperList" :key='index'>
					<view class="swiper-item">
						<image :src="'http://wl.ty300.cn/uploads/' + item.banner"></image>
					</view>
				</swiper-item>
			</swiper>
		</div>
		<div class='fill_info'>
			<ul>
				<li>
					<span>收货人</span>
					<span>
						<navigator url="../addressBook/addressBook?type=choose" style="padding-left: 100rpx;">
							{{chooseAdd.id ? chooseAdd.shop_name : '地址簿'}}<icons :size="arrowSize" type="arrowright" color="#1E86E9"></icons>
						</navigator>
					</span>
				</li>
				<li>
					<span>货物件数</span>
					<span>
						<input type="number" v-model="goodsNum" placeholder="请填写" @input='setCost'/>
					</span>
				</li>
				<li>
					<span>付款方式</span>
					<span>
						<picker mode="selector" :range="payType" :value="paySelect" @change="choosePay">
							<view>{{payType[paySelect]}}<icons :size="arrowSize" type="arrowright" color="#B2B2B2"></icons></view>
						</picker>
					</span>
				</li>
				<li>
					<span>签单回执</span>
					<span>
						<picker mode="selector" :value="signSelect" :range="signType" @change="chooseSign">
							<view>{{signType[signSelect]}}<icons :size="arrowSize" type="arrowright" color="#B2B2B2"></icons></view>
						</picker>
					</span>
				</li>
				<li style='display: block;border: 0;'>
					<span>附加留言</span>
					<textarea @input='setMsg' :value='message' placeholder="对配送员说点什么（选填）"/>
				</li>
				<li>
					<span>费用预估</span>
					<span>实际费用以揽件复核为准  <b v-if="cost != ''">￥{{cost}}</b></span>
				</li>
			</ul>
			<div>
				<checkbox-group @change='checkAgreement'>
					<label class="radio">
						<checkbox /><p>我已阅读并同意<span @click='toAgree'>《相关协议》</span></p>
					</label>
				</checkbox-group>
				
			</div>
			<p @click='submitOrder' :style='{background: background,color: textColor}'>提交运单</p>
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
				size: uni.upx2px(48),
				payType: ['请选择','托运人支付','收货人支付'],
				signType: ['请选择','不需要', '需要'],
				arrowSize: uni.upx2px(28),
				showLogin: false,
				checkAgree: false,
				swiperList: [],
				noticList: [],
				siteList: [],
				paySelect: 0,
				signSelect: 0,
				goodsNum: '',
				chooseAdd: {},
				message: '',
				cost: '',
				background: '#F7F7F7',
				textColor: '#858585',
				type:'',
				againInfo: uni.getStorageSync('againInfo')
			};
		},
		components: {
			icons
		},
		onLoad() {
			_this = this
			_this.getSwiper()
			_this.getNoticList()
			_this.getSiteList()
		},
		onShow() {
			if(uni.getStorageSync('defauleAddress')){
				this.chooseAdd = uni.getStorageSync('defauleAddress')
			}
			let chooseAddress = uni.getStorageSync('addressSelect')
			if(chooseAddress){
				this.chooseAdd = chooseAddress
				uni.removeStorageSync('addressSelect')
				if(this.goodsNum != ''){
					this.cost = uni.getStorageSync('baseInfo').start_money
				}
			}
			if(uni.getStorageSync('againInfo')){
				this.chooseAdd.id = this.againInfo.address_id
				this.chooseAdd.shop_name = this.againInfo.shop_name
				this.goodsNum = this.againInfo.package
				this.paySelect = this.againInfo.pay_type
				this.signSelect = this.againInfo.sign_back + 1
				this.message = this.againInfo.msg
				this.cost = uni.getStorageSync('baseInfo').start_money
				uni.removeStorageSync('againInfo')
			}
			this.isAllin()
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
			//关闭登录窗口
			closeLogin(e){
				this.showLogin = false
			},
			//同意/拒绝相关协议
			checkAgreement(e){
				this.needLogin()
				if(e.detail.value.length){
					this.checkAgree = true
				}else{
					this.checkAgree = false
				}
				this.isAllin()
			},
			//获取广告图片轮播
			getSwiper(){
				this.http.getSwiperImage({
					data: {status: 2},
					success: function(res){
						console.log(res)
						_this.swiperList = res
					}
				})
			},
			//获取公告列表
			getNoticList(){
				this.http.getNotic({
					complete: function(res){
						console.log(res)
						if((res.msg == 'Token not provided' || res.msg == "用户无法刷新令牌，需要重新登录") && res.code == -1){
							_this.showLogin = true
						}else{
							_this.noticList = res.data
						}
					}
				})
			},
			//获取站点列表
			getSiteList(){
				this.http.getSite({
					complete: function(res){
						console.log(res)
						if((res.msg == 'Token not provided' || res.msg == "用户无法刷新令牌，需要重新登录") && res.code == -1){
							_this.showLogin = true
						}else{
							_this.siteList = res.data
						}
						
					}
				})
			},
			referesPage(){
				_this.getNoticList()
				_this.getSiteList()
			},
			choosePay(e){
				this.paySelect = e.detail.value
				this.isAllin()
			},
			chooseSign(e){
				this.signSelect = e.detail.value
				this.isAllin()
			},
			toAgree(){
				uni.navigateTo({
					url: '../serviceAgreement/serviceAgreement'
				})
			},
			submitOrder(){
				this.needLogin()
				if(!this.chooseAdd.id){
					uni.showToast({
						icon: 'none',
						title: '请选择地址'
					})
					return 
				}
				if(this.goodsNum <= 0 || this.goodsNum == ''){
					uni.showToast({
						icon: 'none',
						title: '货物件数不能小于1'
					})
					return 
				}
				if(this.paySelect == 0){
					uni.showToast({
						icon: 'none',
						title: '请选择付款方式'
					})
					return 
				}
				if(this.signSelect == 0){
					uni.showToast({
						icon: 'none',
						title: '请选择签单回执'
					})
					return 
				}
				if(!this.checkAgree){
					uni.showToast({
						icon: 'none',
						title: '请勾选同意协议'
					})
					return 
				}
				let data = {
					address_id: this.chooseAdd.id,
					package: this.goodsNum,
					pay_type: this.paySelect,
					sign_back: this.signSelect - 1,
					msg: this.message,
					money: this.cost
				}
				this.http.createOrder({
					data: data,
					success: function(){
						uni.showToast({
							title: '下单成功',
							success() {
								_this.chooseAdd = {}
								_this.goodsNum = ''
								_this.signSelect = 0
								_this.paySelect = 0
								_this.message = ''
								uni.switchTab({
									url:'../waybill/waybill'
								})
							}
						})
					}
				})
			},
			getReg(){
				uni.downloadFile({
					url: 'https://wl.hamburger121.top/region.json',
					success: function(res){
						console.log(res)
					}
				})
			},
			setCost(e){
				if(e.detail.value <= 0 && e.detail.value != ''){
					uni.showToast({
						icon: 'none',
						title: '货物件数不能为0'
					})
					return
				}
				this.goodsNum = parseInt(e.detail.value)
				this.isAllin()
				if(this.chooseAdd.id){
					let weight = this.goodsNum  * 25
					let arr = uni.getStorageSync('baseInfo').weight_money
					let last = Object.keys(arr)[Object.keys(arr).length - 1]
					for(let i in arr){
						if(weight < arr[i][1]){
							this.cost = arr[i][2]
							break
						}
						if(i == last){
							this.cost = arr[i][2] + '起'
						}
					}
				}
			},
			isAllin(){
				if(this.chooseAdd.id && this.goodsNum >=1 && this.paySelect > 0 && this.signSelect > 0 && this.checkAgree){
					this.background = '#1E86E9'
					this.textColor = '#fff'
				}else{
					this.background = '#f7f7f7'
					this.textColor = '#858585'
				}
			},
			setMsg(e){
				this.message = e.detail.value
			}
		}
	}
</script>

<style lang="less">
	.mail{
		.top{
			width: 100%;
			position: relative;
			margin-top: -120rpx;
			&>image{
				width: 100%;
			}
			&>div{
				display: flex;
				background-color: rgba(85,85,85,0.25);
				width: 100%;
				position: absolute;
				line-height: 80rpx;
				top: 120rpx;
				left: 0;
				icons{
					margin: 0 30rpx;
				}
				swiper{
					height: 80rpx;
					flex: 1;
					color: #fff;
					padding: 0 20rpx;
					swiper-item{
						width: 100%;
						font-size: 28rpx;
					}
				}
			}
		}
		.site{
			margin: 0 20rpx;
			margin-top: -160rpx;
			background-color: #fff;
			// padding: 26rpx;
			z-index: 2;
			height: 240rpx;
			position: relative;
			swiper{
				width: 100%;
				height: 100%;
				swiper-item{
					width: 100%;
					height: 100%;
					&>view{
						padding: 26rpx;
						&>p{
							display: flex;
							justify-content: space-between;
							span{
								&:nth-of-type(1){
									font-size: 32rpx;
									color: #1E86E9;
									font-weight: 600;
								}
								&:nth-of-type(2){
									font-size: 28rpx;
									color: #101010;
								}
							}
						}
						&>div{
							font-size: 28rpx;
							color: #555555;
							line-height: 50rpx;
							margin-top: 10rpx;
						}
					}
				}
			}
			
		}
		.ad{
			margin: 20rpx;
			swiper{
				width: 100%;
				height: 200rpx;
				swiper-item{
					width: 100%;
					height: 100%;
					view{
						width: 100%;
						height: 100%;
					}
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		.fill_info{
			margin: 20rpx;
			background-color: #fff;
			padding: 13rpx;
			ul{
				list-style: none;
				li{
					display: flex;
					line-height: 100rpx;
					font-size: 28rpx;
					justify-content: space-between;
					border-bottom: 2rpx solid #EFEFEF;
					padding: 0 10rpx;
					&:nth-of-type(1){
						span:nth-of-type(2){
							color: #1E86E9;
						}
					}
					span{
						&:nth-of-type(2){
							color: #B2B2B2;
							b{
								display: inline;
								color: #1E86E9;
								font-size: 30rpx;
							}
						}
						input{
							width: 200rpx;
							height: 100rpx;
							line-height: 100rpx;
							font-size: 28rpx;
							text-align: right;
							padding-right: 10rpx;
						}
					}
					textarea{
						width: 97%;
						border:  2rpx solid rgba(239, 239, 239, 1);
						font-size: 28rpx;
						padding: 4rpx;
						height: 210rpx;
					}
				}
			}
			&>div{
				font-size: 28rpx;
				.radio{
					display: flex;
					line-height: 90rpx;
				}
				p{
					margin-left: 10rpx;
					span{
						color: #1E86E9;
					}
				}
			}
			&>p{
				margin: 24rpx;
				line-height: 100rpx;
				font-size: 32rpx;
				text-align: center;
				background-color: #F7F7F7;
				border-radius: 50rpx;
				color: #858585;
			}
		}
	}
	checkbox .wx-checkbox-input{
		border-radius: 50%;
		transform: scale(0.8);
	}
	checkbox .wx-checkbox-input.wx-checkbox-input-checked{
		background: #1E86E9;
		color: #fff!important;
	}
</style>
