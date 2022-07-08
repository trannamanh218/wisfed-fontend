import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import './group-links.scss';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const GroupLinks = ({ title, list, className }) => {
	const navigate = useNavigate();
	const goToGroup = item => {
		navigate(`/group/${item.id}`);
	};
	if (list && list.length) {
		return (
			<div className='group-links'>
				<div className={classNames('group-links', { [`${className}`]: className })}>
					<h4>{title}</h4>
					<div className='group-links__card'>
						{list.map(item => (
							<div className='group-links__item' key={item.id}>
								<p
									className='group-links__item__name'
									onClick={() => goToGroup(item)}
									title={'Xem chi tiết group'}
								>
									{item.name}
								</p>
								<div className='timeline'>
									<span className='active'></span>
									<span>{`Hoạt động lần cuối ${moment(item.updatedAt).format('DD/MM/YYYY')} `} </span>
								</div>
								<span>200k Thành viên, 05 Bài viết/ Ngày</span>
							</div>
						))}
					</div>
					<Link className='view-all-link' to='/group'>
						Xem tất cả
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='group-links'>
			<div className={classNames('group-links', { [`${className}`]: className })}>
				<h4>{title}</h4>
				<div className='group-links__card'>
					<p className='blank-content'>Không có dữ liệu</p>
				</div>
			</div>
		</div>
	);
};

GroupLinks.defaultProps = {
	title: '',
	list: [],
	className: '',
};
GroupLinks.propTypes = {
	title: PropTypes.string,
	list: PropTypes.array,
	className: PropTypes.string,
};

export default GroupLinks;
