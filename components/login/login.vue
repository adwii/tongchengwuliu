<template>
	<view>
		<div class='login' v-if='showLogin'>
			
			<div class='login_content' v-if='loginDiv'>
				<p>授权登录</p>
				<p>您还未登录，请先登录</p>
				<p>
					<button @click="closeLogin">取消</button>
					<button open-type="getUserInfo" @getuserinfo='getUserInfo'>登录</button>
				</p>
			</div>
			<div class='login_content' v-if='phoneDiv'>
				<p>授权登录</p>
				<p>请授权手机号</p>
				<p>
					<button @click="closeLogin">取消</button>
					<button open-type="getPhoneNumber" @getphonenumber='getPhoneNumber'>授权</button>
				</p>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loginDiv: true,
				phoneDiv: false,
				userInfo: {}
			};
		},
		props: {
			showLogin: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			getUserInfo(e){
				console.log(e)
				let _this = this
				if(e.detail.errMsg == 'getUserInfo:ok'){
					uni.showToast({
						title: '需要您授权手机号',
						icon: 'none'
					})
					this.userInfo = e.detail
					this.loginDiv = false
					this.phoneDiv = true
					uni.setStorageSync('userInfo',e.detail)
				}else{
					uni.showToast({
						title: '请授权微信登录',
						icon: 'none'
					})
				}
				// let data = {
				// 	phone: '13333333333',
				// 	openid: 'esfdgfdgd234345',
				// 	user_name: e.detail.userInfo.nickName,
				// 	head_img_url: e.detail.userInfo.avatarUrl
				// }
				// this.http.userLogin({
				// 	data: data,
				// 	success: function(res){
				// 		uni.setStorageSync('token', res.token)
				// 		if(!res.is_exist){
				// 			uni.redirectTo({
				// 				url: '../../pages/mineInfo/mineInfo'
				// 			})
				// 		}else{
				// 			_this.http.getUserInfo({
				// 				complete: function(res){
				// 					let data = {
				// 						pos_gps_x: res.data.pos_gps_x,
				// 						pos_gps_y: res.data.pos_gps_x,
				// 						site_id: res.data.transpot_id
				// 					}
				// 					uni.setStorageSync('siteInfo', data)
				// 				}
				// 			})
				// 		}
				// 		uni.hideLoading()
				// 		_this.closeLogin()
				// 		_this.$emit('referesPage', 'referes')
				// 	}
				// })
			},
			getPhoneNumber(e){
				console.log(e)
				let _this = this
				if(e.detail.errMsg == "getPhoneNumber:ok"){
					uni.showLoading({
						title: '登录中',
						mask: true
					})
					uni.login({
						provider: 'weixin',
						success(res) {
							_this.http.getOpenId({
								data: {code: res.code},
								success: function(res1){
									uni.login({
										provider: 'weixin',
										success(res2) {
											let data1 = {
												code: res2.code,
												iv: e.detail.iv,
												encryptedData: e.detail.encryptedData
											}
											_this.http.getUserPhoneNum({
												data: data1,
												success: function(res3){
													let data = {
														phone: res3.phoneNumber,
														openid: res1.openid,
														user_name: _this.userInfo.userInfo.nickName,
														head_img_url: _this.userInfo.userInfo.avatarUrl
													}
													_this.http.userLogin({
														data: data,
														success: function(res){
															uni.setStorageSync('token', res.token)
															if(!res.is_exist){
																uni.redirectTo({
																	url: '../../pages/mineInfo/mineInfo'
																})
															}else{
																_this.http.getUserInfo({
																	complete: function(res){
																		let data = {
																			pos_gps_x: res.data.pos_gps_x,
																			pos_gps_y: res.data.pos_gps_x,
																			site_id: res.data.transpot_id
																		}
																		uni.setStorageSync('siteInfo', data)
																	}
																})
															}
															uni.hideLoading()
															_this.closeLogin()
															_this.$emit('referesPage', 'referes')
														}
													})
												}
											})
										}
									})
								}
							})
						}
					})
				}else{
					uni.showToast({
						title: '请授权手机号',
						icon: 'none'
					})
				}
			},
			closeLogin(){
				this.$emit('closeLogin','close')
			}
		}
	}
</script>

<style lang="less">
	.login{
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0,0,0,0.3);
		z-index: 10;
		width: 100%;
		height: 100%;
		.login_content{
			position: absolute;
			top: 50%;
			left: 50%;
			width: 550rpx;
			height: 300rpx;
			margin: -150rpx -275rpx;
			background-color: #fff;
			border-radius: 10rpx;
			p{
				text-align: center;
				&:nth-of-type(1){
					font-size: 30rpx;
					line-height: 80rpx;
					border-bottom: 2rpx solid #f7f7f7;
				}
				&:nth-of-type(2){
					font-size: 28rpx;
					padding: 20rpx;
					line-height: 100rpx;
					border-bottom: 2rpx solid #f7f7f7;
				}
				&:nth-of-type(3){
					display: flex;
					button::after{
						border: none;
					}
					button{
						flex: 1;
						margin: 0;
						background-color: #fff;
						color: #1E86E9;
						font-size: 28rpx;
						&:nth-of-type(1){
							color: #555;
							&::after{
								border-right: 2rpx solid #f7f7f7;
							}
						}
					}
				}
			}
		}
	}
</style>
