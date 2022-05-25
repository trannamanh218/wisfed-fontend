import classNames from 'classnames';
import { useState } from 'react';
import PropTypes from 'prop-types';
import caretIcon from 'assets/images/caret.png';
import './topic-column.scss';

const TopicColumn = ({ topics, className, title, viewCategoryDetail }) => {
	const [isExpand, setIsExpand] = useState(false);

	const handleViewMore = () => {
		setIsExpand(!isExpand);
	};

	return (
		<>
			{!!topics.length && (
				<div className={classNames('topic-column', { [`${className}`]: className })}>
					<h4 className='topic-column__header'>{title}</h4>
					<div className={classNames('topic-column__container', { 'expand': isExpand })}>
						{topics.map((topic, index) => (
							<div
								className='topic-column__item'
								key={index}
								title={topic.name}
								onClick={() => viewCategoryDetail(topic)}
							>
								<span>{topic.name}</span>
							</div>
						))}
					</div>
					<button className='topic-column__btn' onClick={handleViewMore}>
						<img
							className={classNames('view-caret', { 'view-more': isExpand })}
							src={caretIcon}
							alt='caret-icon'
						/>
						<span>{isExpand ? 'Rút gọn' : 'Xem thêm'}</span>
					</button>
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
};

export default TopicColumn;
