<template>
	<view class="mine_info page">
		<div class='info'>
			<li>
				<span>头像</span>
				<!-- <span @click='chooseImage'> -->
				<span>
					<image :src="info.head_img_url"></image>
					<!-- <uni-icons type="arrowright" color='#B2B2B2' :size='size'></uni-icons> -->
				</span>
			</li>
			<li>
				<span>联系人</span>
				<span>
					<input type="text" v-model='info.user_name' placeholder="请填写联系人姓名"/>
				</span>
			</li>
			<li>
				<span>联系人手机号</span>
				<span>
					<input v-model='info.phone' type="number" maxlength="11" placeholder="请填写联系人手机号"/>
				</span>
			</li>
			<li>
				<span>所在区域</span>
				<span>
					<picker mode="region" value="regionIndex" @change="chooseRegion">
						<view>
							{{regionIndex.length ? regionIndex.join(',') : '请选择省市区'}}
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
				<span>托运站</span>
				<span>
					<picker mode="selector" :value="listIndex" :range="list" @change="chooseList">
						<view>{{listIndex == '' ? '请选择' : list[listIndex]}}<icons :size="arrowSize" type="arrowright" color="#B2B2B2"></icons></view>
					</picker>
				</span>
			</li>
		</div>
		<div class='save' @click='saveInfo'>保存</div>
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
				list: [],
				regionIndex: '',
				siteList: ['请先选择省市区'],
				listIndex: '',
				info: {},
				siteId: '',
				region:[],
				showLogin: false,
				lat: '',
				log: ''
			};
		},
		components: {
			icons
		},
		onLoad() {
			_this = this
			_this.getInfo()
		},
		onShow() {
			uni.hideHomeBotton()
		},
		methods: {
			
			//检测是否需要登录
			needLogin(){
				let isLogin = uni.getStorageSync('userInfo')
				if(isLogin){
					this.showLogin = true
				}
			},
			//关闭登录窗口
			closeLogin(e){
				this.showLogin = false
			},
			chooseImage(){
				uni.chooseImage({
					count:1,
					success(e) {
						console.log(e)
						_this.http.uploadImage({
							data: {img: e.tempFilePaths[0]},
							header: {
								"Content-Type": "multipart/form-data"
							},
							success: function(res){
								console.log(res)
							},
							complete: function(res){
								console.log(res)
							}
						})
					}
				})
			},
			chooseRegion(e){
				console.log(e.detail.value)
				this.regionIndex = e.detail.value
				uni.getLocation({
					success(res) {
						_this.log = res.longitude
						_this.lat = res.latitude
						_this.getSiteList(res.latitude,res.longitude)
					}
				})
			},
			//获取站点列表
			getSiteList(latitude,longitude){
				this.http.getSite({
					data: {
						gps_x: latitude,
						gps_y: longitude
					},
					complete: function(res){
						console.log(res)
						if((res.msg == 'Token not provided' || res.msg == "用户无法刷新令牌，需要重新登录") && res.code == -1){
							_this.showLogin = true
						}else{
							_this.siteList = res.data
							let arr = []
							for(let i = 0; i < res.data.length; i++){
								arr.push(res.data[i].name)
								if(_this.siteId == res.data[i].id){
									_this.listIndex = i
								}
							}
							_this.list = arr
						}
						
					}
				})
			},
			chooseList(e){
				this.listIndex = e.detail.value
				this.siteId = this.siteList[this.listIndex].id
				console.log(this.listIndex)
				console.log(this.siteId)
			},
			//获取用户信息
			getInfo(){
				this.http.getUserInfo({
					complete: function(res){
						if((res.msg == 'Token not provided' || res.msg == "用户无法刷新令牌，需要重新登录") && res.code == -1){
							_this.showLogin = true
						}else{
							_this.info = res.data
							_this.regionIndex = res.data.province ? [res.data.province, res.data.city, res.data.area] : ''
							_this.siteId = res.data.transpot_id
							_this.getSiteList(res.data.pos_gps_x, res.data.pos_gps_y)
						}
					}
				})
			},
			saveInfo(){
				if(!this.info.user_name || !this.info.user_name.trim().length){
					uni.showToast({
						icon: 'none',
						title: '请填写联系人名字'
					})
					return
				}
				if(!this.info.phone || !this.info.phone.trim().length){
					uni.showToast({
						icon: 'none',
						title: '请填写联系人手机号'
					})
					return
				}
				if(this.info.phone.trim().length != 11){
					uni.showToast({
						icon: 'none',
						title: '请填写正确联系人手机号'
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
						title: '请填写详细地址'
					})
					return
				}
				if(this.siteId == ''){
					uni.showToast({
						icon: 'none',
						title: '请选择站点'
					})
					return
				}
				let data1 = {
					pos_gps_x: this.lat,
					pos_gps_y: this.log,
					site_id: this.siteId
				}
				uni.setStorageSync('siteInfo', data1)
				let data = {
					head_img_url: this.info.head_img_url,
					user_name: this.info.user_name,
					transpot_id: this.siteId,
					province: this.regionIndex[0],
					city: this.regionIndex[1],
					area: this.regionIndex[2],
					street: '无',
					phone: this.info.phone,
					detail: this.info.detail,
					pos_gps_x: this.lat,
					pos_gps_y: this.log
				}
				this.http.updateUserInfo({
					data: data,
					success: function(){
						uni.showToast({
							title: '保存成功',
							success() {
								setTimeout(function(){
									uni.switchTab({
										url: '../mine/mine'
									})
								},500)
							}
						})
					}
				})
			},
			referesPage(){
				_this.getInfo()
			},
		}
	}
</script>

<style lang="less">
	.mine_info{
		.info{
			li{
				background-color: #fff;
				padding: 10rpx 20rpx;
				line-height: 90rpx;
				color: #555;
				display: flex;
				justify-content: space-between;
				font-size: 28rpx;
				border-bottom: 2rpx solid #f7f7f7;
				&:nth-of-type(1){
					line-height: 124rpx;
					margin: 20rpx 0;
				}
				&:last-of-type{
					margin: 20rpx 0;
				}
				span{
					display: flex;
					&:nth-of-type(2){
						color: #666;
					}
				}
				input{
					width: 530rpx;
					height: 90rpx;
					line-height: 90rpx;
					text-align: right;
					color: #666;
				}
				image{
					width: 120rpx;
					height: 120rpx;
					border-radius: 120rpx;
					border: 2rpx solid #f7f7f7;
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
