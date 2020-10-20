<template>
	<view class="supplier_detail page">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
			<swiper-item v-for="(item,index) in info.img" :key='index'>
				<view class="swiper-item">
					<image :src="'http://wl.ty300.cn/uploads/' + item" mode=""></image>
				</view>
			</swiper-item>
		</swiper>
		<div class='name_info'>
			<p>{{info.name}}</p>
			<p>{{info.province + ' ' + info.city + ' ' + info.area + '  ' +info.address}}</p>
		</div>
		<div class='phone_info'>
			<span>{{info.phone}}</span>
			<icons type="phone-filled" color="#1E86E9" :size="size" @click="phonecall"></icons>
		</div>
		<div class='kind_info'>
			<p class='info_title'>主营类目</p>
			<ul>
				<li v-for='(item,index) in info.cate_name' :key='index'>{{item}}</li>
			</ul>
		</div>
		<div class='detail_info'>
			<p class='info_title'>店铺介绍</p>
			<div>
				<rich-text :nodes="info.desc"></rich-text>
			</div>
		</div>
	</view>
</template>

<script>
	
	import icons from '../../components/uni-icons/uni-icons.vue'
	
	export default {
		data() {
			return {
				size: uni.upx2px(48),
				info: {}
			};
		},
		components: {
			icons
		},
		onLoad(e) {
			// console.log(e.detail)
			// this.info = JSON.parse(e.detail)
			let _this = this
			this.http.getShopDetail({
				data: {id: e.id},
				success: function(res){
					_this.info = res
				}
			})
		},
		methods: {
			phonecall(){
				uni.makePhoneCall({
					phoneNumber: this.info.phone
				})
			}
		}
	}
</script>

<style lang="less">
	.supplier_detail{
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
		.name_info{
			background-color: #fff;
			padding: 20rpx;
			p{
				&:nth-of-type(1){
					font-size: 32rpx;
					color: #555555;
					line-height: 50rpx;
				}
				&:nth-of-type(2){
					color: #858585;
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
		}
		.phone_info{
			margin-top: 16rpx;
			padding: 0 20rpx;
			line-height: 100rpx;
			background-color: #fff;
			display: flex;
			font-size: 28rpx;
			color: #555555;
			justify-content: space-between;
		}
		.info_title{
			font-size: 28rpx;
			color: #555;
			border-bottom: 2rpx solid #f7f7f7;
			line-height: 60rpx;
		}
		.kind_info{
			background-color: #fff;
			margin-top: 16rpx;
			padding: 20rpx;
			ul{
				overflow: hidden;
				li{
					float: left;
					background-color: #D7EAFC;
					border-radius: 10rpx;
					line-height: 60rpx;
					font-size: 24rpx;
					color: #1E86E9;
					text-align: center;
					width: 140rpx;
					margin-right: 50rpx;
					margin-top: 20rpx;
					&:nth-of-type(4n){
						margin-right: 0;
					}
				}
			}
		}
		.detail_info{
			padding: 20rpx;
			background-color: #fff;
			margin-top: 16rpx;
			div{
				color: #858585;
				font-size: 28rpx;
				line-height: 40rpx;
				image{
					width: 100%;
				}
			}
		}
	}
</style>
