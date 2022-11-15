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
import _ from 'lodash';

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
			// Nếu không ở trong màn detail và chưa bấm xem thêm thì dữ liệu số comment ban đầu là 1 cho nên bắt đầu gọi từ 0
			if (!isInDetail && data.usersComments?.length > 0 && haveNotClickedSeeMoreOnce) {
				callApiStart.current = 0;
			}

			// Kiểm tra xem nếu bài viết đã hiển thị đủ comment rồi thì không hiện nút Xem thêm nữa
			if (data.usersComments?.length > 0) {
				let fatherCommentsFirstCount = 1;
				if (isInDetail) {
					fatherCommentsFirstCount = data.usersComments?.length;
				}
				data.usersComments?.forEach(item => (fatherCommentsFirstCount += item.reply?.length));
				if (fatherCommentsFirstCount < data.comment) {
					setShow(true);
				}
			}
		}

		// Lấy giá trị cho fatherCommentsCount
		const getFetchData = async () => {
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
						postId: data.id,
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
				if (res?.count) {
					setFatherCommentsCount(res.count);
				}
			}
		};
		if (isInDetail && !_.isEmpty(data)) {
			getFetchData();
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
			} else if (postType === 'post') {
				sentData = {
					postId: data.minipostId || data.id,
					params: params,
				};
				res = await dispatch(getMiniPostComments(sentData)).unwrap();
			} else if (postType === 'group') {
				sentData = {
					postId: data.id,
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
	isInDetail: PropTypes.bool,
	postType: PropTypes.string,
};

export default SeeMoreComments;
