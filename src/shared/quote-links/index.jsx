import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import './quote-links.scss';

const QuotesLinks = ({ title, list, className }) => {
	if (list && list.length) {
		return (
			<div className={classNames('quote-links', { [`${className}`]: className })}>
				<h4>{title}</h4>
				<div className='quote-links__card'>
					{list.map((item, index) => (
						<div className='quote-links__item' key={index}>
							<p className='quote-links__item__content'>{`\"${item.content}\"`}</p>
							<span className='quote-links__item__sub'>{`${item.author}, ${item.book}`}</span>
						</div>
					))}
				</div>
				<Link className='view-all-link' to='/'>
					Xem tất cả
				</Link>
			</div>
		);
	}

	return null;
};

QuotesLinks.defaultProps = {
	title: '',
	list: [],
	className: '',
};
QuotesLinks.propTypes = {
	title: PropTypes.string,
	list: PropTypes.array,
	className: PropTypes.array,
};

export default QuotesLinks;
