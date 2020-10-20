<template>
	<view class="waybill_detail page">
		<div class='person_info' @click='chooseAddress'>
			<p>{{info.shop_name}}</p>
			<p>
				<span>{{info.user_name}}</span>
				<span>{{info.phone}}</span>
			</p>
			<p>{{info.province + ' ' + info.city + ' ' + info.area + ' ' + info.detail}}</p>
			<icons v-if="type == 'update'" :size="size" type="arrowright" color="#B2B2B2"></icons>
		</div>
		<ul>
			<li>
				<span>配送进度</span>
				<span>
					您的托运{{info.status_txt}}
				</span>
			</li>
			<li>
				<span>货运件数</span>
				<span>
					<input type="number" v-model="info.package" :disabled="type != 'update'"/>
				</span>
			</li>
			<li>
				<span>付款方式</span>
				<span>
					<picker mode="selector" :range="payType" :value="info.pay_type" :disabled="type != 'update'" @change="choosePay">
						<view>{{payType[info.pay_type]}}<icons v-if="type == 'update'" :size="size" type="arrowright" color="#B2B2B2"></icons></view>
					</picker>
				</span>
			</li>
			<li>
				<span>付款状态</span>
				<span>
					{{info.pay_status == 0 ? '未付款' : '已付款'}}
				</span>
			</li>
			<li>
				<span>签单回执</span>
				<span>
					<picker mode="selector" :value="info.sign_back" :range="signType" :disabled="type != 'update'" @change="chooseSign">
						<view>{{signType[info.sign_back]}}<icons v-if="type == 'update'" :size="size" type="arrowright" color="#B2B2B2"></icons></view>
					</picker>
				</span>
			</li>
			<li>
				<span>签单回执展示</span>
				<span>
					<image :src="'http://wl.ty300.cn/uploads/' + info.sign_back_img" @click="priviewImage"></image>
				</span>
			</li>
		</ul>
		<div class='message'>
			<p>附件留言</p>
			<p><textarea :value="info.msg || ''" @input='setMsg' :disabled="type == 'update' ? false : true" style="width: 100%;" placeholder="请输入留言"/></p>
		</div>
		<div class='time_info'>
			<p>运单编号：{{info.order_no}}</p>
			<p>下单时间：{{info.order_time}}</p>
		</div>
		<div class='bottom'>
			<p @click='toIndex'>再次下单</p>
			<p @click='update' v-if="type == 'update'">提交</p>
		</div>
	</view>
</template>

<script>
	
	import icons from '../../components/uni-icons/uni-icons.vue'
	var _this = null
	
	export default {
		data() {
			return {
				size: uni.upx2px(30),
				infoList: [
					{
						name: '货运件数',
						value: ''
					},
					{
						name: '付款方式',
						value: ''
					},
					{
						name: '付款状态',
						value: ''
					},
					{
						name: '签到回执',
						value: ''
					}
				],
				id: '',
				info:{},
				type: '',
				payType: ['请选择','托运人支付','收货人支付'],
				signType: ['不需要', '需要'],
			};
		},
		components: {
			icons
		},
		onLoad(e) {
			_this = this
			this.id = e.id
			uni.showLoading({
				mask: true
			})
			this.getOrderDetail()
			this.type = e.type
		},
		onShow() {
			let chooseAddress = uni.getStorageSync('addressSelect')
			if(this.type == 'update' && chooseAddress){
				this.info.shop_name = chooseAddress.shop_name
				this.info.user_name = chooseAddress.name
				this.info.phone = chooseAddress.phone
				this.info.province = chooseAddress.province
				this.info.city = chooseAddress.city
				this.info.area = chooseAddress.area
				this.info.detail = chooseAddress.detail
				this.info.address_id = chooseAddress.id
				uni.removeStorageSync('addressSelect')
			}
		},
		methods: {
			getOrderDetail(){
				this.http.orderDetail({
					data: {id: this.id},
					success: function(res){
						uni.hideLoading()
						_this.info = res
						_this.infoList[0].value = '共' + res.package + '件'
						_this.infoList[1].value = res.pay_type_txt
						_this.infoList[2].value = res.pay_status == 0 ? '未付款' : '已付款'
						_this.infoList[3].value = res.sign_back_txt
					}
				})
			},
			toIndex(){
				uni.setStorageSync('againInfo', this.info)
				uni.switchTab({
					url: '../mail/mail?type=again'
				})
			},
			update(){
				let data = {
					address_id: this.info.address_id,
					status: this.info.status,
					package: this.info.package,
					pay_type: this.info.pay_type,
					sign_back: this.info.sign_back,
					msg: this.info.msg,
					id: this.info.id
				}
				this.http.updateOrder({
					data: data,
					success: function(){
						uni.showToast({
							title: '提交成功'
						})
					}
				})
			},
			chooseAddress(){
				if(this.type == 'update'){
					uni.navigateTo({
						url: '../addressBook/addressBook?type=choose'
					})
				}
			},
			setMsg(e){
				this.info.msg = e.detail.value
			},
			priviewImage(){
				uni.previewImage({
					urls: ['http://wl.ty300.cn/uploads/' + this.info.sign_back_img],
					success() {
						console.log(1)
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.waybill_detail{
		padding-bottom: 100rpx;
		.person_info{
			padding: 24rpx;
			background-color: #fff;
			position: relative;
			p{
				color: #555555;
				font-size: 28rpx;
				&:nth-of-type(1){
					font-size: 32rpx;
					font-weight: 700;
				}
				&:nth-of-type(2){
					margin: 20rpx 0;
					span:nth-of-type(1){
						margin-right: 20rpx;
						font-weight: 600;
					}
				}
			}
			icons{
				position: absolute;
				right: 40rpx;
				top: 50%;
				margin-top: -30rpx;
			}
		}
		&>ul{
			li{
				padding: 0 46rpx 0 18rpx;
				line-height: 90rpx;
				font-size: 28rpx;
				display: flex;
				justify-content: space-between;
				background-color: #fff;
				border-bottom: 2rpx solid #f7f7f7;
				span{
					&:nth-of-type(1){
						color: #555;
					}
					&:nth-of-type(2){
						color: #858585;
						input{
							height: 90rpx;
							line-height: 90rpx;
							text-align: right;
						}
						image{
							width: 100rpx;
							height: 100rpx;
							display: block;
						}
					}
				}
				&:nth-of-type(6){
					line-height: 100rpx;
					padding-top: 10rpx;
					padding-bottom: 10rpx;
				}
				&:nth-of-type(1), &:nth-of-type(3), &:nth-of-type(5){
					margin-top: 16rpx;
				}
				// &:nth-of-type(3), &:nth-of-type(5){
				// 	padding-right: 18rpx;
				// }
			}
		}
		.message{
			padding: 18rpx;
			margin-top: 16rpx;
			background-color: #fff;
			p{
				font-size: 28rpx;
				&:nth-of-type(1){
					border-bottom: 2rpx solid #EFEFEF;
					line-height: 70rpx;
					color: #555;
				}
				&:nth-of-type(2){
					color: #858585;
					margin-top: 16rpx;
				}
			}
		}
		.time_info{
			padding: 18rpx;
			font-size: 28rpx;
			color: #101010;
			line-height: 40rpx;
		}
		.bottom{
			position: fixed;
			bottom: 0;
			width: 100%;
			text-align: right;
			height: 100rpx;
			background-color: #fff;
			p{
				display: inline-block;
				line-height: 60rpx;
				font-size: 28rpx;
				color: #101010;
				width: 180rpx;
				text-align: center;
				margin-right: 22rpx;
				border-radius: 30rpx;
				border: 2rpx solid #BBBBBB;
				margin-top: 20rpx;
			}
		}
	}
</style>
