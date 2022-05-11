import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import './news-links.scss';

const NewsLinks = ({ title, list, className }) => {
	return (
		<div className='news-links'>
			<div className={classNames('news-links', { [`${className}`]: className })}>
				<h4>{title}</h4>
				<div className='news-links__card'>
					{list.map((item, index) => (
						<div className='news-links__item' key={index}>
							<a className='news-links__item__link'>Cuốn sách xuất sắc nhất về nuôi dạy con năm 2021</a>
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

NewsLinks.defaultProps = {
	title: '',
	list: [],
	className: '',
};
NewsLinks.propTypes = {
	title: PropTypes.string,
	list: PropTypes.array,
	className: PropTypes.string,
};

export default NewsLinks;
