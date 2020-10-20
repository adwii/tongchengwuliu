<template>
	<view class="about_us">
		<rich-text :nodes="aboutUs"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				aboutUs: ''
			};
		},
		onLoad() {
			let _this = this
			this.http.getAgreeAbout({
				success: function(res){
					_this.aboutUs = res.about_us
				}
			})
		}
	}
</script>

<style lang="less">
	.about_us{
		padding: 10rpx 15rpx;
	}
</style>
