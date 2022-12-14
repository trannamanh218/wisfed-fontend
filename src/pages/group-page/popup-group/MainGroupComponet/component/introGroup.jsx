import React, { useEffect, useState, useRef } from 'react';
import './intro.scss';
import PropTypes from 'prop-types';

function IntroGroup({ groupType, description, createdAt, data, toggleClickSeeMore, setToggleClickSeeMore }) {
	const [date, setDate] = useState({});
	const [arrDate, setArrDate] = useState([]);
	const [authorsNames, setAuthorsNames] = useState([]);

	const groupIntroTab = useRef(null);

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

	useEffect(() => {
		const newArr = [];
		if (data?.groupAuthors?.length > 0) {
			data.groupAuthors.forEach(item => newArr.push(item.author?.firstName + ' ' + item.author?.lastName));
		}
		setAuthorsNames(newArr);
	}, []);

	useEffect(() => {
		if (toggleClickSeeMore) {
			window.scroll({
				top: groupIntroTab.current.offsetTop - 120,
				behavior: 'smooth',
			});
			setToggleClickSeeMore(false);
		}
	}, [toggleClickSeeMore]);

	return (
		<div className='intro__container' ref={groupIntroTab}>
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
							<strong>Kiểu nội dung: </strong>
							{groupType === 'book' ? 'Sách' : groupType === 'author' ? 'Tác giả' : 'Chia sẻ'}
						</span>
					</div>
					<div className='group-sibar-left__text1'>
						<span>
							<strong>Tác giả: </strong>
						</span>
						{authorsNames.length > 0
							? authorsNames.map((item, index) => {
									if (index < authorsNames.length - 1) {
										return <span key={index}>{item}, </span>;
									} else {
										return <span key={index}>{item}. </span>;
									}
							  })
							: 'Chưa có dữ liệu'}
						{/* {data.active ? <p>(Đã xác nhận)</p> : <p>(Chưa xác nhận)</p>} */}
					</div>
					<div className='group-sibar-left__text1'>
						<span>
							<strong>Giới thiệu: </strong> {description || 'Chưa có dữ liệu'}
						</span>
					</div>
				</div>
			</div>
			<div className='intro-activity'>
				<h3>Hoạt động của nhóm</h3>
				<br />
				<span>
					Hôm nay có <strong>{`${data?.countPost} bài viết mới`}</strong>
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
	description: PropTypes.string,
	groupType: PropTypes.string,
	data: PropTypes.object,
	createdAt: PropTypes.string,
};

export default IntroGroup;
