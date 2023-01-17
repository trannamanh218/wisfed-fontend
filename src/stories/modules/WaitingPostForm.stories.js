import PostWaitting from 'pages/group-page/popup-group/MainGroupComponet/AminSettings/PostWatting';
const PostItem = () => {
	return (
		<div className='post-item-waitting'>
			<div className='post-item-waitting__main-post'>
				<div className='post-item-waitting__header'>
					<img
						src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
						alt='image'
					/>
					<div className='post-item-waitting__header-content'>
						<span>Shadow</span>
						<div className='header-content__text'>
							<span className='text-1'>Giờ trước</span>
							<span className='text-2'>Cập nhật tiến độ đọc sách</span>
							<span>Xếp hạng</span>
						</div>
					</div>
				</div>
				<div className='post-item-waitting__post'>
					Tình yêu quê hương đất nước là tình cảm yêu mến và gắn bó sâu sắc, chân thành đối với những sự vật,
					con người thuộc về nơi chúng ta sinh ra.
					<br />
					<span> #yeuthuongaicungnhuai</span>
				</div>
			</div>

			<div className='post-item-waitting__btn'>
				<button className='post-item-waitting__btn-1'>Duyệt</button>
				<button className='post-item-waitting__btn-2'>Không duyệt</button>
				<button className='post-item-waitting__btn-3'>Xóa</button>
			</div>
			<hr />
		</div>
	);
};

export default {
	title: 'Components/Modules/PostWattingForm',
	component: PostWaitting,
};

const Template = args => <PostWaitting {...args} />;
const Item = args => <PostItem {...args} />;

export const Default = Template.bind({});
export const ItemPost = Item.bind({});
