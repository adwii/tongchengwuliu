<template>
	<view class="mine page">
		<div class='info'>
			<image src="../../static/jijian_bg.png" mode="widthFix"></image>
			<div>
				<div>
					<image :src="info.head_img_url" @click="toMineInfo"></image>
					<div>
						<p @click="toMineInfo">{{info.user_name ? info.user_name : '点击登录'}}</p>
						<p @click="toMineInfo">{{info.phone}}</p>
					</div>
				</div>
				<icons type="arrowright" color="#fff" :size="size" @click="toMineInfo"></icons>
			</div>
		</div>
		<div class='order'>
			<p>
				<span>我的运单</span>
				<navigator url="../waybill/waybill" open-type="switchTab">
					查看全部<icons type="arrowright" color="#1E86E9" :size="size"></icons>
				</navigator>
			</p>
			<ul>
				<li v-for='(item,index) in list' :key='index' @click='toWaybill(index)'>
					<image :src="item.image"></image>
					<p>{{item.name}}</p>
				</li>
			</ul>
		</div>
		<div class='nav_list'>
			<li @click='navTo(index)' v-for='(item,index) in navList' :key='index'>
				<span>{{item}}</span>
				<icons type="arrowright" color="#B2B2B2" :size="size"></icons>
			</li>
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
				size: uni.upx2px(30),
				list: [
					{
						image: '../../static/dailanjian.png',
						name: '待揽件'
					},
					{
						image: '../../static/daifahuo.png',
						name: '待发货'
					},
					{
						image: '../../static/peisongzong.png',
						name: '配送中'
					},
					{
						image: '../../static/yiqianshou.png',
						name: '已签收'
					},
					{
						image: '../../static/daifukuan.png',
						name: '待付款'
					}
				],
				navList: ['地址簿','计费规则','客服电话','服务协议','关于我们'],
				info:{},
				showLogin: false
			};
		},
		components: {
			icons
		},
		onLoad() {
			_this = this
			let isLogin = uni.getStorageSync('userInfo')
			if(!isLogin){
				this.showLogin = true
			}else{
				this.getInfo()
			}
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
			//关闭登录窗口
			closeLogin(e){
				this.showLogin = false
			},
			//获取用户信息
			getInfo(){
				this.http.getUserInfo({
					success: function(res){
						_this.info = res
					}
				})
			},
			navTo(i){
				switch(i){
					case 0:
						uni.navigateTo({
							url: '../addressBook/addressBook'
						})
						break
					case 1:
						uni.navigateTo({
							url: '../billingRules/billingRules'
						})
						break
					case 3:
						uni.navigateTo({
							url: '../serviceAgreement/serviceAgreement'
						})
						break
					case 4:
						uni.navigateTo({
							url: '../aboutUs/aboutUs'
						})
						break
					case 2:
						uni.makePhoneCall({
							phoneNumber: uni.getStorageSync('baseInfo').phone
						})
						break
				}
			},
			toWaybill(i){
				uni.setStorageSync('wayStatus', i + 1)
				uni.switchTab({
					url: '../waybill/waybill'
				})
			},
			toMineInfo(){
				if(!this.info){
					this.showLogin = true
				}else{
					uni.navigateTo({
						url: '../mineInfo/mineInfo'
					})
				}
			},
			referesPage(){
				this.getInfo()
			}
		}
	}
</script>

<style lang="less">
	.mine{
		.info{
			position: relative;
			margin-top: -140rpx;
			&>image{
				width: 100%;
			}
			&>div{
				position: absolute;
				width: 100%;
				top: 0;
				left: 0;
				display: flex;
				padding: 32rpx 0;
				padding-bottom: 50rpx;
				justify-content: space-between;
				color: #fff;
				margin-top: 140rpx;
				&>div{
					display: flex;
					margin-left: 32rpx;
					image{
						width: 120rpx;
						height: 120rpx;
						border-radius: 60rpx;
						border: 2rpx solid #fff;
						margin-right: 30rpx;
					}
					div{
						p{
							font-weight: 700;
							&:nth-of-type(1){
								font-size: 30rpx;
								line-height: 70rpx;
							}
							&:nth-of-type(2){
								font-size: 28rpx;
								line-height: 50rpx;
							}
						}
					}
				}
				icons{
					margin-right: 32rpx;
					line-height: 120rpx;
				}
			}
		}
		.order{
			margin: 20rpx;
			margin-top: -116rpx;
			background-color: #fff;
			padding: 20rpx;
			position: relative;
			z-index: 5;
			&>p{
				display: flex;
				justify-content: space-between;
				line-height: 80rpx;
				border-bottom: 2rpx solid #f7f7f7;
				span{
					font-size: 32rpx;
					color: #101010;
					font-weight: 700;
				}
				navigator{
					color: #1E86E9;
					font-size: 28rpx;
				}
			}
			ul{
				display: flex;
				margin-top: 30rpx;
				li{
					flex: 1;
					text-align: center;
					image{
						width: 60rpx;
						height: 60rpx;
					}
					p{
						color: #858585;
						font-size: 28rpx;
					}
				}
			}
		}
		.nav_list{
			margin: 0 20rpx;
			background-color: #fff;
			padding: 20rpx;
			li{
				display: flex;
				border-bottom: 2rpx solid #f7f7f7;
				line-height: 100rpx;
				font-size: 28rpx;
				color: #555;
				justify-content: space-between;
				&:last-of-type{
					border: 0;
				}
			}
		}
	}
</style>
