import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { BackArrow } from 'components/svg';
import SearchField from 'shared/search-field';
import SelectBox from 'shared/select-box';
import './PostWaiting.scss';

function PostWatting({ handleChange }) {
	const ListTime = [
		{ value: 'book', title: 'Sách' },
		{ value: 'authors', title: 'Tác giả' },
		{ value: 'share', title: ' Chia sẻ' },
	];
	// const tranparentRef = useRef({ value: 'public', title: 'Công khai', img: <CheckIcon /> });
	const ListTimeRef = useRef({ value: 'default', title: 'Thời gian gửi yêu cầu ' });
	const onchangeKindOfJoin = data => {
		ListTimeRef.current = data;
	};
	return (
		<div className='post-wating__container'>
			<div className='post-wating__title'>
				<button onClick={() => handleChange('tabs')}>
					<BackArrow />
				</button>
				<h2>
					Bài viết đang chờ <span>(24)</span>
				</h2>
			</div>
			<hr />

			<div className='post-wating__content'>
				<div>
					<div className='post-wating__action'>
						<SearchField placeholder='Tìm kiếm' />
						<SelectBox
							name='timePost'
							list={ListTime}
							defaultOption={ListTimeRef.current}
							onChangeOption={onchangeKindOfJoin}
						/>
					</div>
					<div>
						<div className='post-item-waitting'>
							<div className='post-item-waitting__main-post'>
								<div className='post-item-waitting__header'>
									<img
										src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
										alt=''
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
									Tình yêu quê hương đất nước là tình cảm yêu mến và gắn bó sâu sắc, chân thành đối
									với những sự vật, con người thuộc về nơi chúng ta sinh ra.
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
						<div className='post-item-waitting'>
							<div className='post-item-waitting__main-post'>
								<div className='post-item-waitting__header'>
									<img
										src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
										alt=''
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
									Tình yêu quê hương đất nước là tình cảm yêu mến và gắn bó sâu sắc, chân thành đối
									với những sự vật, con người thuộc về nơi chúng ta sinh ra.
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
					</div>
				</div>
			</div>
		</div>
	);
}
PostWatting.propTypes = {
	handleChange: PropTypes.func,
};
export default PostWatting;
