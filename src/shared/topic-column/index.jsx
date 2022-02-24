import classNames from 'classnames';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import caretIcon from 'assets/images/caret.png';
import './topic-column.scss';

const TopicColumn = ({ topics, className, title, handleViewMore }) => {
	const [isExpand, setIsExpand] = useState(false);

	const handleExpand = () => {
		setIsExpand(prev => !prev);
		handleViewMore();
	};

	if (topics && topics.length) {
		return (
			<div className={classNames('topic-column', { [`${className}`]: className })}>
				<h4 className='topic-column__header'>{title}</h4>
				<div className={classNames('topic-column__container', { 'expand': isExpand })}>
					{topics.map((topic, index) => (
						<div className='topic-column__item' key={index} title={topic.name}>
							<span>{topic.name}</span>
						</div>
					))}
				</div>
				<button className='topic-column__btn' onClick={handleExpand}>
					<img
						className={classNames('view-caret', { 'view-more': isExpand })}
						src={caretIcon}
						alt='caret-icon'
					/>
					<span>{isExpand ? 'Rút gọn' : 'Xem thêm'}</span>
				</button>
			</div>
		);
	}

	return null;
};

TopicColumn.defaultProps = {
	topics: [],
	className: '',
	title: '',
	handleViewMore: () => {},
};

TopicColumn.propTypes = {
	topics: PropTypes.array.isRequired,
	className: PropTypes.string,
	title: PropTypes.string,
	handleViewMore: PropTypes.func,
};

export default TopicColumn;
