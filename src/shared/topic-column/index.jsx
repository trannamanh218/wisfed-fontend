import classNames from 'classnames';
import { useState } from 'react';
import PropTypes from 'prop-types';
import caretIcon from 'assets/images/caret.png';
import './topic-column.scss';
import { useLocation, useNavigate } from 'react-router-dom';

const TopicColumn = ({ topics, className, title, handleViewCategoryDetail, inCategory = false }) => {
	const [isExpand, setIsExpand] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

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

	const handleDirect = topic => {
		if (location.pathname.includes('/quotes/') || location.pathname.includes('/quotes/detail/')) {
			return navigate(`/quotes/hashtag/${topic.name?.slice(1) || topic.tag?.name?.slice(1)}`);
		}
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
								onClick={() => handleViewCategoryDetail(topic)}
							>
								{/* <Link to={`/quotes/hashtag/${topic.name?.slice(1) || topic.tag?.name?.slice(1)}`}> */}
								<span onClick={() => handleDirect(topic)}>{topic.name || topic.tag?.name}</span>
								{/* </Link> */}
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
	handleViewCategoryDetail: () => {},
};

TopicColumn.propTypes = {
	topics: PropTypes.array.isRequired,
	className: PropTypes.string,
	title: PropTypes.string,
	handleViewCategoryDetail: PropTypes.func,
	inCategory: PropTypes.bool,
};

export default TopicColumn;
