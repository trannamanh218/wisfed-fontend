import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import './group-links.scss';

const GroupLinks = ({ title, list, className }) => {
	return (
		<div className='group-links'>
			<div className={classNames('group-links', { [`${className}`]: className })}>
				<h4>{title}</h4>
				<div className='group-links__card'>
					{list.map((item, index) => (
						<div className='group-links__item' key={index}>
							<p className='group-links__item__name'>{item.name}</p>
							<div className='timeline'>
								<span className='active'></span>
								<span>Hoạt động lần cuối 19/11/2021</span>
							</div>
							<span>200k Thành viên, 05 Bài viết/ Ngày</span>
						</div>
					))}
				</div>
				<Link className='view-all-link' to='/'>
					Xem tất cả
				</Link>
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
	className: PropTypes.array,
};

export default GroupLinks;
