<template>
	<view class="address_book page">
		<div class='search'>
			<div>
				<icons type="search" color="#B2B2B2" :size="size"></icons>
				<input type="text" v-model="searchText"  placeholder="店铺、姓名、手机号" confirm-type='search' @confirm='getAddress'/>
			</div>
		</div>
		<div class='address_list'>
			<li v-for='(item,index) in addressList' :key='index' @click='chooseAddress(item)'>
				<p>{{item.shop_name}}</p>
				<p>
					<span>{{item.name}}</span>
					<span>{{item.phone}}</span>
				</p>
				<p>{{item.province + ' ' + item.city + ' ' + item.area + ' ' + item.detail}}</p>
				<p>
					<span>
						
						<checkbox-group @click.stop @change='setDefault(item.id)'>
							<label>
								<checkbox :checked="index == 0 ? true : false" color="#007AFF"/><text>设置为默认地址</text>
							</label>
						</checkbox-group>
					</span>
					<span>
						<text @click.stop="editAddress(item)">编辑</text>
						<text @click.stop="removeAddress(item.id,index)">删除</text>
					</span>
				</p>
			</li>
		</div>
		<navigator class="add_address" url="../editAddress/editAddress">
			新增地址
		</navigator>
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
				addressList: [],
				showLogin: false,
				type: '',
				searchText: ''
			};
		},
		components: {
			icons
		},
		onLoad(e) {
			_this = this
			_this.type = e.type
		},
		onShow() {
			_this.getAddress()
			
		},
		methods: {
			//检测是否需要登录
			needLogin(){
				let isLogin = uni.getStorageSync('userInfo')
				if(!isLogin){
					this.showLogin = true
				}
			},
			//关闭登录窗口
			closeLogin(e){
				this.showLogin = false
			},
			getAddress(){
				_this.addressList = []
				this.http.getAddressList({
					data: {search: this.searchText},
					complete: function(res){
						if((res.msg == 'Token not provided' || res.msg == "用户无法刷新令牌，需要重新登录") && res.code == -1){
							_this.showLogin = true
						}else{
							_this.addressList = res.data
							uni.setStorageSync('defauleAddress', res.data[0])
						}
					}
				})
			},
			referesPage(){
				_this.getAddress()
			},
			//编辑地址
			editAddress(item){
				uni.navigateTo({
					url: '../editAddress/editAddress?info=' + JSON.stringify(item)
				})
			},
			//删除地址
			removeAddress(id,index){
				uni.showModal({
					title: '确认删除',
					content: '确定删除这个地址吗？',
					confirmColor: '#1E86E9',
					success(e) {
						if(e.confirm){
						_this.http.removeAddress({
							data: {id: id},
							success: function(){
								uni.showToast({
									icon: 'none',
									title: '删除成功'
								})
								_this.addressList.splice(index, 1)
							}
						})
						}
					}
				})
			},
			setDefault(id){
				this.http.topAddress({
					data: {id: id},
					success: function(res){
						uni.showToast({
							title: '设置成功',
							success() {
								_this.getAddress()
							}
						})
					}
				})
			},
			chooseAddress(item){
				if(this.type == 'choose'){
					uni.setStorageSync('addressSelect', item)
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.address_book{
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
		.add_address{
			position: fixed;
			bottom: 0;
			width: 100%;
			line-height: 100rpx;
			text-align: center;
			font-size: 28rpx;
			color: #fff;
			background-color: #1E86E9;
		}
		.address_list{
			li{
				margin: 20rpx;
				background-color: #fff;
				padding: 20rpx;
				p{
					&:nth-of-type(1){
						font-size: 32rpx;
						font-weight: 600;
						line-height: 46rpx;
					}
					&:nth-of-type(2){
						display: flex;
						justify-content: space-between;
						font-size: 28rpx;
						line-height: 46rpx;
					}
					&:nth-of-type(3){
						font-size: 24rpx;
						color: #858585;
						padding: 8rpx 0;
						border-bottom: 2rpx solid #f7f7f7;
						line-height: 40rpx;
					}
					&:nth-of-type(4){
						display: flex;
						justify-content: space-between;
						padding: 12rpx 0;
						line-height: 46rpx;
						span{
							&:nth-of-type(1){
								font-size: 24rpx;
								radio{
									transform: scale(0.8);
								}
							}
							&:nth-of-type(2){
								display: flex;
								font-size: 28rpx;
								text{
									padding-left: 20rpx;
								}
							}
						}
					}
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
	}
</style>
