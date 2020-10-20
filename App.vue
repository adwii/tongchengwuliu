<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			if(!uni.getStorageSync('region')){
				this.http.getRegion({
					success(res) {
						uni.setStorageSync('region', res)
					}
				})
			}
			this.http.getAgreeAbout({
				success: function(res){
					uni.setStorageSync('baseInfo',res)
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="less">
	/*每个页面公共css */
	.page{
		background-color: #F7F7F7;
		width: 100%;
		min-height: 100%;
		position: absolute;
	}
	
</style>
