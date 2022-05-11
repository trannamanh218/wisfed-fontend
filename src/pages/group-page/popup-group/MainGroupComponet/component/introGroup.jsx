import React, { useEffect } from 'react';
import './intro.scss';
import PropTypes from 'prop-types';

function IntroGroup({ groupType, description, memberGroups, createdAt }) {
	useEffect(() => {
		const newItem = createdAt?.split('-');
	}, [createdAt]);

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
							<strong>Kiểu nội dung:</strong> {groupType}
						</span>
					</div>
					<div className='group-sibar-left__text1'>
						<span>
							<strong>Tác giả:</strong> Nguyễn Hiển Lê <p>(Đã xác nhận)</p>
						</span>
					</div>
					<div className='group-sibar-left__text1'>
						<span>
							<strong>Giới thiệu:</strong> {description}
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
						<strong>Số lượng thành viên:</strong>{' '}
						{memberGroups?.length < 10 ? `0${memberGroups?.length}` : memberGroups?.length} thành viên (03
						thành viên mới)
					</span>
				</div>
				<div className='group-sibar-left__text1'>
					<span>
						<strong>Ngày tạo:</strong> 03 tháng trước
					</span>
				</div>
			</div>
		</div>
	);
}

IntroGroup.propTypes = {
	description: PropTypes.func,
	groupType: PropTypes.string,
	data: PropTypes.object,
	memberGroups: PropTypes.array,
	createdAt: PropTypes.string,
};

export default IntroGroup;
