import React from 'react';
import './intro.scss';

function IntroGroup() {
	return (
		<div className='intro__container'>
			<div className='intro-content'>
				<div className='intro-content__title'>
					<h3>
						Giới thiệu về nhóm này (<span>Tác giả đã xác nhận</span>)
					</h3>
				</div>
				<div>
					<div className='group-sibar-left__text1'>
						<span>
							<strong>Kiểu nội dung:</strong> Tác giả
						</span>
					</div>
					<div className='group-sibar-left__text1'>
						<span>
							<strong>Tác giả:</strong> Nguyễn Hiển Lê <p>(Đã xác nhận)</p>
						</span>
					</div>
					<div className='group-sibar-left__text1'>
						<span>
							<strong>Giới thiệu:</strong> Tình yêu quê hương đất nước là tình cảm yêu mến và gắn bó sâu
							sắc, chân thành đối với những. Tình yêu quê hương đất nước là tình cảm yêu mến và gắn bó sâu
							sắc, chân thành đối với những. Tình yêu quê hương đất nước là tình cảm yêu mến và gắn bó sâu
							sắc, chân thành ... Xem thêm
						</span>
					</div>
				</div>
			</div>
			<div className='intro-activity'>
				<h3>Hoạt động của nhóm</h3>
				<span>
					hôm nay có <strong>12 bài viết mới</strong>
				</span>
				<div className='group-sibar-left__text1'>
					<span>
						<strong>Số lượng thành viên:</strong> 154K thành viên (03 thành viên mới)
					</span>
				</div>
				<div className='group-sibar-left__text1'>
					<span>
						<strong>Ngày tạo:</strong>03 tháng trước
					</span>
				</div>
			</div>
		</div>
	);
}

export default IntroGroup;
