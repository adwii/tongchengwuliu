<template>
	<view class="billing_rules page">
		<ul>
			<li>
				<span>起送价</span>
				<span>{{info.start_money}}元</span>
			</li>
			<li v-for='(item,index) in info.weight_money' :key='index'>
				<span>≤{{item[1]}}公斤</span>
				<span>{{item[2]}}元</span>
			</li>
		</ul>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:{}
			};
		},
		onLoad() {
			let _this = this
			this.http.getAgreeAbout({
				success: function(res){
					_this.info = res
				}
			})
		}
	}
</script>

<style lang="less">
	.billing_rules{
		background-color: #1E86E9;
		ul{
			margin: 0 50rpx;
			margin-top: 50rpx;
			background-color: #fff;
			li{
				display: flex;
				border: 1rpx solid #f7f7f7;
				span{
					flex: 1;
					text-align: center;
					line-height: 80rpx;
					font-size: 28rpx;
					color: #555;
					&:nth-of-type(1){
						border-right: 1rpx solid #f7f7f7;
					}
				}
			}
		}
	}
</style>
