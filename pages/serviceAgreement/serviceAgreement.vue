<template>
	<view class="service_agreement">
		<rich-text :nodes="agreeMent"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				agreeMent: ''
			};
		},
		onLoad() {
			let _this = this
			this.http.getAgreeAbout({
				success: function(res){
					_this.agreeMent = res.agreement
				}
			})
		}
	}
</script>

<style lang="less">
	.service_agreement{
		padding: 10rpx 15rpx;
	}
</style>
