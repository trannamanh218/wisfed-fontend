import './SeeMoreComments.scss';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { NotificationError } from 'helpers/Error';
import { useDispatch } from 'react-redux';
import { getQuoteComments } from 'reducers/redux-utils/quote';
import { getGroupPostComments, getMiniPostComments } from 'reducers/redux-utils/post';
import { getListCommentsReview } from 'reducers/redux-utils/book';
import { useState } from 'react';
import LoadingIndicator from 'shared/loading-indicator';
import { useEffect } from 'react';

const SeeMoreComments = ({
	data = {},
	setData = () => {},
	haveNotClickedSeeMoreOnce,
	setHaveNotClickedSeeMoreOnce = () => {},
	isInDetail = false,
	postType = '',
}) => {
	const dispatch = useDispatch();

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	const [isLoading, setIsLoading] = useState(false);
	const [show, setShow] = useState(false);

	const params = {
		start: callApiStart.current,
		limit: callApiPerPage.current,
		sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
	};

	useEffect(() => {
		// Kiểm tra xem nếu bài viết đã hiển thị đủ comment rồi thì không hiện nút Xem thêm nữa
		checkShow();

		// Nếu không ở trong màn detail và chưa bấm xem thêm thì dữ liệu số comment ban đầu là 1 cho nên bắt đầu gọi từ 0
		if (!isInDetail && data.usersComments?.length > 0 && haveNotClickedSeeMoreOnce) {
			callApiStart.current = 0;
		}
	}, [data]);

	const checkShow = () => {
		let totalComments = data.usersComments?.length;
		for (let i = 0; i < data.usersComments?.length; i++) {
			totalComments += data.usersComments[i].reply?.length;
		}
		if (isInDetail) {
			if (totalComments < data.comment) {
				setShow(true);
			} else {
				setShow(false);
			}
		} else {
			if (haveNotClickedSeeMoreOnce) {
				if (data.usersComments?.length > 1) {
					setShow(true);
				}
			} else {
				if (totalComments < data.comment) {
					setShow(true);
				} else {
					setShow(false);
				}
			}
		}
	};

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
			} else if (postType === 'post') {
				sentData = {
					postId: data.minipostId || data.id,
					params: params,
				};
				res = await dispatch(getMiniPostComments(sentData)).unwrap();
			} else if (postType === 'group') {
				sentData = {
					postId: data.groupPostId || data.id,
					params: params,
				};
				res = await dispatch(getGroupPostComments(sentData)).unwrap();
			} else if (postType === 'review') {
				sentData = {
					reviewId: data.id,
					params: params,
				};
				res = await dispatch(getListCommentsReview(sentData)).unwrap();
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			if (res.rows?.length > 0) {
				handleAddMoreComments(data, res.rows);
			}
			setIsLoading(false);
		}
	};

	const handleAddMoreComments = (paramData, paramRows) => {
		const cloneObj = { ...paramData };
		if (haveNotClickedSeeMoreOnce) {
			setHaveNotClickedSeeMoreOnce(false);
			if (!isInDetail) {
				cloneObj.usersComments = [];
			}
		}
		// Đảo ngược cả các comment reply nữa
		for (let i = 0; i < paramRows.length; i++) {
			if (paramRows[i].reply.length > 0) {
				const commentsChildReverse = [...paramRows[i].reply];
				commentsChildReverse.reverse();

				const newCloneObj = { ...paramRows[i] };
				newCloneObj.reply = commentsChildReverse;

				paramRows[i] = newCloneObj;
			}
		}

		paramRows.forEach(item => cloneObj.usersComments.unshift(item));
		setData(cloneObj);
		callApiStart.current += callApiPerPage.current;
	};

	return (
		<>
			{show && (
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
	isInDetail: PropTypes.bool,
	postType: PropTypes.string,
};

export default SeeMoreComments;
