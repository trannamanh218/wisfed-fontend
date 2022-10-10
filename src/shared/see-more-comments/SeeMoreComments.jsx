import './SeeMoreComments.scss';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import { getQuoteComments } from 'reducers/redux-utils/quote';
import { getGroupPostComments, getMiniPostComments } from 'reducers/redux-utils/post';
import { useState } from 'react';
import LoadingIndicator from 'shared/loading-indicator';
import { useEffect } from 'react';

const SeeMoreComments = ({
	data = {},
	setData = () => {},
	haveNotClickedSeeMoreOnce,
	setHaveNotClickedSeeMoreOnce = () => {},
	isIndetail = false,
}) => {
	const dispatch = useDispatch();

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	const [isLoading, setIsLoading] = useState(false);
	const [postType, setPostType] = useState('');
	const [shownListCommentsLength, setShownListCommentsLength] = useState(0);

	const params = {
		start: callApiStart.current,
		limit: haveNotClickedSeeMoreOnce && isIndetail ? 20 : callApiPerPage.current,
		sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
	};

	useEffect(() => {
		// Chia trường hợp để gọi api lấy comment
		if (data.quote) {
			setPostType('quote');
		} else if (data.minipostId) {
			setPostType('minipost');
		} else if (data.groupId) {
			setPostType('group');
		}

		// Nếu không ở trong màn detail và chưa bấm xem thêm thì dữ liệu số comment ban đầu là 1
		if (!isIndetail && data.usersComments?.length > 0 && haveNotClickedSeeMoreOnce) {
			setShownListCommentsLength(1);
		} else {
			setShownListCommentsLength(data.usersComments?.length);
		}
	}, [data]);

	const onClickSeeMore = async () => {
		setIsLoading(true);
		let sentData = {};
		let rows = [];
		try {
			if (postType === 'quote') {
				sentData = {
					quoteId: data.id,
					params: params,
				};
				rows = await dispatch(getQuoteComments(sentData)).unwrap();
			} else if (postType === 'minipost') {
				sentData = {
					postId: data.minipostId,
					params: params,
				};
				rows = await dispatch(getMiniPostComments(sentData)).unwrap();
			} else if (postType === 'group') {
				sentData = {
					postId: data.groupPostId,
					params: params,
				};
				rows = await dispatch(getGroupPostComments(sentData)).unwrap();
			}
			handleAddMoreComments(data, rows);
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddMoreComments = (paramData, paramRows) => {
		const cloneObj = { ...paramData };
		if (haveNotClickedSeeMoreOnce) {
			cloneObj.usersComments = [];
			setHaveNotClickedSeeMoreOnce(false);
		}
		paramRows.forEach(item => cloneObj.usersComments.unshift(item));
		setData(cloneObj);

		if (haveNotClickedSeeMoreOnce && isIndetail) {
			callApiStart.current += 20;
		} else {
			callApiStart.current += callApiPerPage.current;
		}
	};

	return (
		<>
			{shownListCommentsLength < data.comment && (
				<>
					{isLoading ? (
						<div className='loading-more-comments'>
							<LoadingIndicator />
						</div>
					) : (
						<div className='see-more-comment'>
							<span className='see-more-comment__button' onClick={onClickSeeMore}>
								Xem thêm bình luận
							</span>
							<span className='see-more-comment__number'>
								{shownListCommentsLength}/{data.comment}
							</span>
						</div>
					)}
				</>
			)}
		</>
	);
};

SeeMoreComments.propTypes = {
	data: PropTypes.object,
	setData: PropTypes.func,
	haveNotClickedSeeMoreOnce: PropTypes.bool,
	setHaveNotClickedSeeMoreOnce: PropTypes.func,
	isIndetail: PropTypes.bool,
};

export default SeeMoreComments;