<template>
	<view class="waybill page">
		<div class='search'>
			<div>
				<icons type="search" color="#B2B2B2" :size="size"></icons>
				<input type="text" v-model="searchText"  placeholder="店铺、姓名、手机号" confirm-type='search' @confirm='getOrder(active)'/>
			</div>
		</div>
		<scroll-view scroll-x="true" >
			<view v-for="(item,index) in scrollList" :key='index' :class="active == index ? 'active' : ''" @click="choose(index)">{{item}}</view>
		</scroll-view>
		<ul>
			<navigator :url="'../waybillDetail/waybillDetail?id=' + item.id" v-for="(item,index) in orderList" :key='index'>
				<div class='time'>
					<div>
						<p>{{item.order_time}}</p>
						<p>运单编号：{{item.order_no}}</p>
					</div>
					<div>
						<p>
							{{item.status_txt}}<icons type="arrowright" color="#1E86E9" :size="size1"></icons>
						</p>
					</div>
				</div>
				<div class='info'>
					<p>{{item.shop_name}}</p>
					<p><span>{{item.name}}</span><span>{{item.phone}}</span></p>
					<p>{{item.province + ' ' + item.city + ' ' + item.area + ' ' + item.detail}}</p>
				</div>
				<div class='set'>
					<span @click.stop='cancleOrder(item)' v-if='item.status != 3 && item.status != 4 && item.status != 7'>取消</span>
					<span @click.stop='updateOrder(item)' v-if='item.status != 3 && item.status != 4 && item.status != 7'>编辑</span>
				</div>
			</navigator>
		</ul>
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
				size1: uni.upx2px(30),
				active: 0,
				scrollList: ['全部','待揽件','待发货','配送中','已签收','待付款'],
				orderList: [],
				showLogin: false,
				searchText: ''
			};
		},
		components: {
			icons
		},
		onLoad(){
			_this = this
		},
		onShow() {
			let status = uni.getStorageSync('wayStatus')
			if(status != ''){
				this.choose(status)
				uni.removeStorageSync('wayStatus')
			}else{
				this.choose()
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
			referesPage(){
				this.choose(0)
			},
			choose(i){
				this.active = i
				this.getOrder(i)
			},
			//获取订单列表
			getOrder(status){
				_this.http.getOrderList({
					data: {
						status: status || '',
						search: this.searchText
					},
					complete: function(res){
						if((res.msg == 'Token not provided' || res.msg == "用户无法刷新令牌，需要重新登录") && res.code == -1){
							_this.showLogin = true
						}else{
							_this.orderList = res.data
						}
					}
				})
			},
			cancleOrder(item){
				item.status = 7
				this.http.updateOrder({
					data: item,
					success:function(){
						uni.showToast({
							title: '已取消'
						})
					}
				})
			},
			updateOrder(item){
				uni.navigateTo({
					url: '../waybillDetail/waybillDetail?type=update&id=' + item.id
				})
			}
		}
	}
</script>

<style lang="less">
	.waybill{
		padding: 130rpx 0 100rpx 0;
		.search{
			position: fixed;
			top: 0;
			width: 100%;
			background-color: #1E86E9;
			z-index: 5;
			div{
				margin: 22rpx 26rpx;
				background-color: #fff;
				border-radius: 40rpx;
				line-height: 80rpx;
				display: flex;
				input{
					height: 80rpx;
					line-height: 80rpx;
					flex: 1;
				}
				icons{
					margin: 0 18rpx;
				}
			}
		}
		&>scroll-view{
			background-color: #fff;
			white-space: nowrap;
			view{
				display: inline-block;
				font-size: 28rpx;
				line-height: 90rpx;
				padding: 0 23rpx;
			}
			.active{
				color: #1E86E9;
				font-weight: 700;
			}
		}
		&>ul{
			navigator{
				background-color: #fff;
				padding: 20rpx;
				margin-top: 16rpx;
				.time{
					display: flex;
					justify-content: space-between;
					div{
						&:nth-of-type(1){
							p{
								&:nth-of-type(1){
									color: #858585;
									font-size: 24rpx;
									line-height: 38rpx;
								}
								&:nth-of-type(2){
									font-size: 28rpx;
									color: #101010;
									line-height: 40rpx;
								}
							}
						}
						&:nth-of-type(2){
							color: #1E86E9;
							font-size: 28rpx;
							display: flex;
							flex-direction: column;
							justify-content: center;
							p{
								line-height: 30rpx;
							}
						}
					}
				}
				.info{
					padding: 20rpx 0;
					border-bottom: 2rpx solid #f7f7f7;
					p{
						&:nth-of-type(1){
							color: #555555;
							font-size: 32rpx;
							font-weight: 700;
						}
						&:nth-of-type(2){
							font-size: 28rpx;
							color: #555;
							margin: 10rpx 0;
							span{
								margin-right: 20rpx;
							}
						}
						&:nth-of-type(3){
							font-size: 28rpx;
							font-weight: 400;
						}
					}
				}
				.set{
					display: flex;
					justify-content: flex-end;
					margin-top: 20rpx;
					line-height: 60rpx;
					font-size: 28rpx;
					span{
						&:last-of-type{
							border: 2rpx solid #BBBBBB;
							border-radius: 30rpx;
							margin-left: 20rpx;
							width: 180rpx;
							text-align: center;
						}
					}
				}
			}
		}
	}
</style>
