import React, { useEffect, useState } from 'react';
import './intro.scss';
import PropTypes from 'prop-types';

function IntroGroup({ groupType, description, createdAt, data }) {
	const [date, setDate] = useState({});
	const [arrDate, setArrDate] = useState([]);

	useEffect(() => {
		const newItem = createdAt?.split('-');
		setArrDate(newItem);
	}, [createdAt]);

	useEffect(() => {
		if (arrDate?.length === 3) {
			const newDate = {
				year: arrDate[0],
				mounth: arrDate[1],
				day: arrDate[2].substring(0, 2),
			};
			setDate(newDate);
		}
	}, [arrDate]);

	return (
		<div className='intro__container'>
			<div className='intro-content'>
				<div className='intro-content__title'>
					<h3>
						Giới thiệu về nhóm này
						{/* ({data.active ? <span>Tác giả đã xác nhận</span> : <span>Tác giả chưa xác nhận</span>}) */}
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
							<strong>Tác giả:</strong>
						</span>
						{data?.authors?.map((item, index) => {
							return (
								<>
									<span>
										{' '}
										{item.fullName || item.firstName + ' ' + item.lastName}{' '}
										{index < data.authors.length - 1 && ','}
									</span>
								</>
							);
						})}
						{/* {data.active ? <p>(Đã xác nhận)</p> : <p>(Chưa xác nhận)</p>} */}
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
					hôm nay có <strong>{`${data?.countPost} bài viết mới`}</strong>
				</span>
				<div className='group-sibar-left__text1'>
					<span>
						<strong>Số lượng thành viên:</strong>{' '}
						{data.countMember < 10 ? `0${data?.countMember}` : data?.countMemberh} thành viên
					</span>
				</div>
				<div className='group-sibar-left__text1'>
					<span>
						<strong>Ngày tạo:</strong> {date.day + '/' + date.mounth + '/' + date.year}
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
	createdAt: PropTypes.string,
};

export default IntroGroup;
