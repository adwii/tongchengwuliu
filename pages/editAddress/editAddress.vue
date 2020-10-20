<template>
	<view class="edit_address page">
		<ul>
			<li>
				<span>店铺名称</span>
				<span>
					<input type="text" v-model='info.shop_name' placeholder="请填写收货店铺名称"/>
				</span>
			</li>
			<li>
				<span>收货人</span>
				<span>
					<input type="text" v-model='info.name' placeholder="请填写收货人姓名"/>
				</span>
			</li>
			<li>
				<span>联系电话</span>
				<span>
					<input type="number" maxlength="11" v-model='info.phone' placeholder="请填写收货人手机号"/>
				</span>
			</li>
			<li>
				<span>所在区域</span>
				<span>
					<picker mode="region" value="regionIndex" @change="chooseRegion">
						<view>
							{{regionIndex.length ? regionIndex : '请选择省市区'}}
							<icons type="arrowright" color="#b2b2b2" :size="size"></icons>
						</view>
					</picker>
				</span>
			</li>
			<li>
				<span>详细地址</span>
				<span>
					<input type="text" v-model='info.detail' placeholder="如街道、门牌号、小区楼栋号"/>
				</span>
			</li>
			<li>
				<span>设置默认地址</span>
				<span>
					<switch :checked="info.is_top" @change="setDefault" color="#007AFF"/>
				</span>
			</li>
		</ul>
		<div class='save' @click='saveAddress'>保存</div>
	</view>
</template>

<script>
	
	import icons from '../../components/uni-icons/uni-icons.vue'
	
	export default {
		data() {
			return {
				size: uni.upx2px(40),
				regionIndex: '',
				info: {
					is_top: 0
				}
			};
		},
		components: {
			icons
		},
		onLoad(e) {
			this.info = JSON.parse(e.info)
			this.regionIndex = [this.info.province, this.info.city, this.info.area]
		},
		methods: {
			chooseRegion(e){
				this.regionIndex = e.detail.value
			},
			setDefault(e){
				this.info.is_top = Number(e.detail.value)
			},
			saveAddress(){
				if(!this.info.shop_name || !this.info.shop_name.trim().length){
					uni.showToast({
						icon: 'none',
						title: '请输入店铺名称'
					})
					return
				}
				if(!this.info.name || !this.info.name.trim().length){
					uni.showToast({
						icon: 'none',
						title: '请输入收货人名字'
					})
					return
				}
				if(!this.info.phone || !this.info.phone.trim().length){
					uni.showToast({
						icon: 'none',
						title: '请输入收货人手机号'
					})
					return
				}
				if(this.info.phone.trim().length != 11){
					uni.showToast({
						icon: 'none',
						title: '请输入正确手机号'
					})
					return
				}
				if(!this.regionIndex.length){
					uni.showToast({
						icon: 'none',
						title: '请选择省市区'
					})
					return
				}
				if(!this.info.detail || !this.info.detail.trim().length){
					uni.showToast({
						icon: 'none',
						title: '请输入详细地址'
					})
					return
				}
				this.info.province = this.regionIndex[0]
				this.info.city = this.regionIndex[1]
				this.info.area = this.regionIndex[2]
				this.info.street = '无'
				if(!this.info.id){
					this.http.addAddress({
						data: this.info,
						success: function(res){
							uni.showToast({
								title: '保存成功',
								success() {
									setTimeout(function(){
										uni.navigateBack({
											delta: 1
										})
									},1000)
								}
							})
						}
					})
				}else{
					this.http.updateAddress({
						data: this.info,
						success: function(res){
							uni.showToast({
								title: '保存成功',
								success() {
									setTimeout(function(){
										uni.navigateBack({
											delta: 1
										})
									},1000)
								}
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.edit_address{
		ul{
			margin: 10rpx 0 20rpx 0;
			li{
				display: flex;
				justify-content: space-between;
				font-size: 28rpx;
				margin-top: 2rpx;
				padding: 0 30rpx;
				line-height: 90rpx;
				background-color: #fff;
				span{
					&:nth-of-type(2){
						display: flex;
						input{
							width: 450rpx;
							text-align: right;
							color: #999;
							height: 90rpx;
							line-height: 90rpx;
						}
						icons{
							line-height: 90rpx;
						}
					}
					switch{
						transform: scale(0.8);
					}
				}
				&:last-of-type{
					margin-top: 30rpx;
				}
			}
		}
		.save{
			position: fixed;
			bottom: 0;
			width: 100%;
			line-height: 100rpx;
			font-size: 30rpx;
			color: #fff;
			background-color: #1E86E9;
			text-align: center;
		}
	}
</style>
