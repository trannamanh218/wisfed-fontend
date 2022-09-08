import { Forward } from 'components/svg';
import { useState } from 'react';
import BackButton from 'shared/back-button';
import Comment from 'shared/comments';
import QuoteCard from 'shared/quote-card';
import './main-quote-detail.scss';
import _ from 'lodash';
import CommentEditor from 'shared/comment-editor';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { QUOTE_TYPE } from 'constants/index';
import { useSelector, useDispatch } from 'react-redux';
import { handleCheckReplyToMe } from 'reducers/redux-utils/comment';
import { getQuoteComments } from 'reducers/redux-utils/quote';
import { useRef, useEffect } from 'react';
import { NotificationError } from 'helpers/Error';
import { handleMentionCommentId } from 'reducers/redux-utils/notificaiton';

const MainQuoteDetail = ({ quoteData, onCreateComment, setMentionUsersArr, mentionUsersArr }) => {
	const [replyingCommentId, setReplyingCommentId] = useState(0);
	const [comments, setComments] = useState([]);
	const clickReply = useRef(null);

	const userInfo = useSelector(state => state.auth.userInfo);
	const mentionCommentId = useSelector(state => state.notificationReducer.mentionCommentId);

	const dispatch = useDispatch();

	const handleReply = (cmtLv1Id, userData) => {
		const arr = [];
		if (userData.id !== userInfo.id) {
			arr.push(userData);
			dispatch(handleCheckReplyToMe(false));
		} else {
			dispatch(handleCheckReplyToMe(true));
		}
		setMentionUsersArr(arr);
		setReplyingCommentId(cmtLv1Id);
		clickReply.current = !clickReply.current;
	};

	const handleChangeOrderQuoteComments = async () => {
		try {
			const params = { filter: JSON.stringify([{ operator: 'eq', value: mentionCommentId, property: 'id' }]) };
			const mentionedComment = await dispatch(
				getQuoteComments({ quoteId: quoteData.id, params: params })
			).unwrap();
			let commentsArray = quoteData.usersComments.reverse();
			if (!_.isEmpty(mentionedComment)) {
				// Xóa bình luận nhắc đến bạn
				commentsArray = commentsArray.filter(item => item.id !== mentionCommentId);
				// Thêm bình luận nhắc đến bạn lên đầu
				commentsArray.unshift(mentionedComment[0]);
			}
			setComments(commentsArray);
		} catch (err) {
			NotificationError(err);
		}
	};

	useEffect(() => {
		if (!_.isEmpty(quoteData)) {
			if (mentionCommentId) {
				// Nếu bấm xem bình luận nhắc đến bạn từ thông báo thì sẽ đưa bình luận đó lên đầu
				handleChangeOrderQuoteComments();
				// Sau đó xóa mentionCommentId trong redux
				dispatch(handleMentionCommentId(null));
			} else {
				setComments(quoteData.usersComments.reverse());
			}
		}
	}, [quoteData]);

	return (
		<div className='main-quote-detail'>
			<div className='main-quote-detail__header'>
				<BackButton destination={-1} />
				<h4>Chi tiết Quote</h4>
				{quoteData?.user?.fullName || (quoteData?.user?.firstName && quoteData?.user?.lastName) ? (
					<Link to={`/quotes/${quoteData.user.id}`} className='main-quote-detail__link'>
						<div className='main-quote-detail__link__row'>
							<>
								Xem tất cả Quotes của{' '}
								{quoteData.user.fullName || quoteData.user.firstName + ' ' + quoteData.user.lastName}{' '}
							</>
							<Forward />
						</div>
					</Link>
				) : (
					<></>
				)}
			</div>
			{!_.isEmpty(quoteData) && (
				<div className='main-quote-detail__pane'>
					<QuoteCard isDetail={true} data={quoteData} />
					{comments.map(comment => (
						<div key={comment.id}>
							<Comment
								commentLv1Id={comment.id}
								dataProp={comment}
								postData={quoteData}
								handleReply={handleReply}
								type={QUOTE_TYPE}
							/>
							<div className='comment-reply-container'>
								{comment.reply && !!comment.reply.length && (
									<>
										{comment.reply.map(commentChild => (
											<div key={commentChild.id}>
												<Comment
													commentLv1Id={comment.id}
													dataProp={commentChild}
													postData={quoteData}
													handleReply={handleReply}
													type={QUOTE_TYPE}
												/>
											</div>
										))}
									</>
								)}
								<CommentEditor
									onCreateComment={onCreateComment}
									className={classNames(`reply-comment-editor reply-comment-${comment.id}`, {
										'show': comment.id === replyingCommentId,
									})}
									mentionUsersArr={mentionUsersArr}
									commentLv1Id={comment.id}
									replyingCommentId={replyingCommentId}
									clickReply={clickReply.current}
									setMentionUsersArr={setMentionUsersArr}
								/>
							</div>
						</div>
					))}
					<CommentEditor
						commentLv1Id={null}
						onCreateComment={onCreateComment}
						mentionUsersArr={mentionUsersArr}
						setMentionUsersArr={setMentionUsersArr}
					/>
				</div>
			)}
		</div>
	);
};

MainQuoteDetail.propTypes = {
	quoteData: PropTypes.object,
	onCreateComment: PropTypes.func,
	setMentionUsersArr: PropTypes.any,
	mentionUsersArr: PropTypes.any,
};

export default MainQuoteDetail;
