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

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	const [isLoading, setIsLoading] = useState(false);
	const [postType, setPostType] = useState('');
	const [fatherCommentsCount, setFatherCommentsCount] = useState(11);
	const [show, setShow] = useState(false);

	const params = {
		start: callApiStart.current,
		limit: callApiPerPage.current,
		sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
	};

	useEffect(() => {
		// Cái if ngoài cùng này để ngăn code chạy lại mỗi khi bấm Xem thêm
		if (haveNotClickedSeeMoreOnce) {
			// Chia trường hợp để gọi api lấy comment
			if (data.quote) {
				setPostType('quote');
			} else if (data.minipostId) {
				setPostType('minipost');
			} else if (data.groupId) {
				setPostType('group');
			}

			// Nếu không ở trong màn detail và chưa bấm xem thêm thì dữ liệu số comment ban đầu là 1 cho nên bắt đầu gọi từ 0
			if (!isIndetail && data.usersComments?.length > 0 && haveNotClickedSeeMoreOnce) {
				callApiStart.current = 0;
			}

			// Kiểm tra xem nếu bài viết đã hiển thị đủ comment rồi thì không hiện nút Xem thêm nữa
			if (data.usersComments?.length > 0) {
				let fatherCommentsFirstCount = 1;
				if (isIndetail) {
					fatherCommentsFirstCount = data.usersComments?.length;
				}
				data.usersComments?.forEach(item => (fatherCommentsFirstCount += item.reply?.length));
				if (fatherCommentsFirstCount < data.comment) {
					setShow(true);
				}
			}
		}
	}, [data]);

	const onClickSeeMore = async () => {
		setIsLoading(true);
		let sentData = {};
		let res = {};
		try {
			if (postType === 'quote') {
				sentData = {
					quoteId: data.id,
					params: params,
				};
				res = await dispatch(getQuoteComments(sentData)).unwrap();
			} else if (postType === 'minipost') {
				sentData = {
					postId: data.minipostId,
					params: params,
				};
				res = await dispatch(getMiniPostComments(sentData)).unwrap();
			} else if (postType === 'group') {
				sentData = {
					postId: data.groupPostId,
					params: params,
				};
				res = await dispatch(getGroupPostComments(sentData)).unwrap();
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setFatherCommentsCount(res.count);
			if (res.rows.length > 0) {
				handleAddMoreComments(data, res.rows);
			}
			setIsLoading(false);
		}
	};

	const handleAddMoreComments = (paramData, paramRows) => {
		const cloneObj = { ...paramData };
		if (haveNotClickedSeeMoreOnce) {
			setHaveNotClickedSeeMoreOnce(false);
			if (!isIndetail) {
				cloneObj.usersComments = [];
			}
		}
		paramRows.forEach(item => cloneObj.usersComments.unshift(item));
		setData(cloneObj);
		callApiStart.current += callApiPerPage.current;
	};

	return (
		<>
			{show && data.usersComments?.length < fatherCommentsCount && (
				<>
					{isLoading ? (
						<div className='loading-more-comments'>
							<LoadingIndicator />
						</div>
					) : (
						<div className='see-more-comment'>
							<span className='see-more-comment__button' onClick={onClickSeeMore}>
								Xem thêm
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
