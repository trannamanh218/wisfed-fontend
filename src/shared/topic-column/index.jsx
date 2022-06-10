import classNames from 'classnames';
import { useState } from 'react';
import PropTypes from 'prop-types';
import caretIcon from 'assets/images/caret.png';
import './topic-column.scss';

const TopicColumn = ({ topics, className, title, viewCategoryDetail, inCategory = false }) => {
	const [isExpand, setIsExpand] = useState(false);

	let defaultItems;
	let maxItems;
	if (inCategory) {
		defaultItems = 12;
		maxItems = 30;
	} else {
		defaultItems = 6;
		maxItems = 15;
	}

	const [breakpoint, setBreakPoint] = useState(defaultItems);

	const handleViewMore = () => {
		const length = topics.length;
		let maxLength;

		if (length <= maxItems) {
			maxLength = length;
		} else {
			maxLength = maxItems;
		}

		const newItems = isExpand ? defaultItems : maxLength;
		setBreakPoint(newItems);
		setIsExpand(!isExpand);
	};

	return (
		<>
			{!!topics.length && (
				<div className={classNames('topic-column', { [`${className}`]: className })}>
					<h4 className='topic-column__header'>{title}</h4>
					<div className='topic-column__container'>
						{topics.slice(0, breakpoint).map((topic, index) => (
							<div
								className='topic-column__item'
								key={index}
								title={topic.name}
								onClick={() => viewCategoryDetail(topic)}
							>
								<span>{topic.name || topic.tag?.name}</span>
							</div>
						))}
					</div>
					{topics.length > defaultItems && (
						<button className='topic-column__btn' onClick={handleViewMore}>
							<img
								className={classNames('view-caret', { 'view-more': isExpand })}
								src={caretIcon}
								alt='caret-icon'
							/>
							<span>{isExpand ? 'Rút gọn' : 'Xem thêm'}</span>
						</button>
					)}
				</div>
			)}
		</>
	);
};

TopicColumn.defaultProps = {
	topics: [],
	className: '',
	title: 'Chủ đề khác',
	viewCategoryDetail: () => {},
};

TopicColumn.propTypes = {
	topics: PropTypes.array.isRequired,
	className: PropTypes.string,
	title: PropTypes.string,
	viewCategoryDetail: PropTypes.func,
	inCategory: PropTypes.bool,
};

export default TopicColumn;
