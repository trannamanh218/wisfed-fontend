import classNames from 'classnames';
import { useState } from 'react';
import PropTypes from 'prop-types';
import caretIcon from 'assets/images/caret.png';
import './topic-column.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TopicColumn = ({
	topics,
	className,
	title,
	handleViewCategoryDetail,
	inCategory = false,
	hasMore,
	onClickViewMore,
}) => {
	const [isExpand, setIsExpand] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();
	const { userId } = useParams();
	const userInfo = useSelector(state => state.auth.userInfo);

	let defaultItems;
	let maxItems;
	if (inCategory) {
		defaultItems = Infinity;
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
			if (userId === userInfo.id) {
				navigate(`/quotes/hashtag/me/${topic.name?.slice(1) || topic.tag?.name?.slice(1)}`);
			} else navigate(`/quotes/hashtag/${topic.name?.slice(1) || topic.tag?.name?.slice(1)}`);
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
								<span onClick={() => handleDirect(topic)}>{topic.name || topic.tag?.name}</span>
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

					{inCategory && hasMore && (
						<button className='dualColumn-btn' onClick={onClickViewMore}>
							<img className='view-caret' src={caretIcon} alt='caret-icon' />
							<span>Xem thêm</span>
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
	hasMore: false,
	onClickViewMore: () => {},
	isFetching: false,
};

TopicColumn.propTypes = {
	topics: PropTypes.array.isRequired,
	className: PropTypes.string,
	title: PropTypes.string,
	handleViewCategoryDetail: PropTypes.func,
	inCategory: PropTypes.bool,
	hasMore: PropTypes.bool,
	onClickViewMore: PropTypes.func,
	isFetching: PropTypes.bool,
};

export default TopicColumn;
