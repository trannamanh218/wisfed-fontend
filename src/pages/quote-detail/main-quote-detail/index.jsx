import { Forward } from 'components/svg';
import { useState } from 'react';
const BackButton = lazy(() => import('shared/back-button'));
const Comment = lazy(() => import('shared/comments'));
const QuoteCard = lazy(() => import('shared/quote-card'));
import './main-quote-detail.scss';
import _ from 'lodash';
import CommentEditor from 'shared/comment-editor';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { QUOTE_TYPE } from 'constants/index';
import { useSelector, useDispatch } from 'react-redux';
import { getQuoteComments } from 'reducers/redux-utils/quote';
import { useRef, useEffect, lazy, Suspense } from 'react';
import { NotificationError } from 'helpers/Error';
import { handleMentionCommentId } from 'reducers/redux-utils/notification';
import Circle from 'shared/loading/circle';
import SeeMoreComments from 'shared/see-more-comments/SeeMoreComments';

const MainQuoteDetail = ({ quoteData, setQuoteData, onCreateComment, setMentionUsersArr, mentionUsersArr }) => {
	const [replyingCommentId, setReplyingCommentId] = useState(0);
	const [haveNotClickedSeeMoreOnce, setHaveNotClickedSeeMoreOnce] = useState(true);
	const [firstPlaceComment, setFirstPlaceComment] = useState([]);
	const [firstPlaceCommentId, setFirstPlaceCommentId] = useState(null);
	const [showReplyArrayState, setShowReplyArrayState] = useState([]);
	const [mentionCommentId, setMentionCommentId] = useState(null);

	const clickReply = useRef(null);

	const userInfo = useSelector(state => state.auth.userInfo);
	const reduxMentionCommentId = useSelector(state => state.notificationReducer.mentionCommentId);

	const dispatch = useDispatch();

	// Lấy comment nhắc đến bạn đặt trên đầu
	useEffect(() => {
		if (haveNotClickedSeeMoreOnce) {
			if (reduxMentionCommentId && mentionCommentId === null) {
				setMentionCommentId(reduxMentionCommentId);
			}
			if (!_.isEmpty(quoteData) && mentionCommentId) {
				// Nếu bấm xem bình luận nhắc đến bạn từ thông báo thì sẽ đưa bình luận đó lên đầu
				handleChangeOrderQuoteComments();
				// Sau đó xóa mentionCommentId trong redux
				dispatch(handleMentionCommentId(null));
			}
		}
	}, [quoteData, mentionCommentId]);

	// Sau khi bấm xem thêm thì không đặt comment nhắc đến bạn lên đầu nữa
	useEffect(() => {
		if (!haveNotClickedSeeMoreOnce) {
			setFirstPlaceComment([]);
			setFirstPlaceCommentId(null);
		}
	}, [haveNotClickedSeeMoreOnce]);

	const handleReply = (cmtLv1Id, userData) => {
		onClickSeeMoreReply(cmtLv1Id);
		const arr = [];
		if (userData.id !== userInfo.id) {
			arr.push(userData);
		}
		setMentionUsersArr(arr);
		setReplyingCommentId(cmtLv1Id);
		clickReply.current = !clickReply.current;
	};

	const onClickSeeMoreReply = paramId => {
		const arr = [...showReplyArrayState];
		arr.push(paramId);
		setShowReplyArrayState(arr);
	};

	const handleChangeOrderQuoteComments = async () => {
		try {
			// Gọi api lấy thông tin của bình luận nhắc đến bạn
			const params = { filter: JSON.stringify([{ operator: 'eq', value: mentionCommentId, property: 'id' }]) };
			const getMentionedCommentAPI = await dispatch(
				getQuoteComments({ quoteId: quoteData.id, params: params })
			).unwrap();
			const mentionedCommentAPI = getMentionedCommentAPI?.rows;
			if (!_.isEmpty(mentionedCommentAPI)) {
				if (mentionedCommentAPI[0].replyId === null) {
					// Đảo thứ tự replies
					const reverseReplies = mentionedCommentAPI[0].reply.reverse();
					const obj = { ...mentionedCommentAPI[0], reply: reverseReplies };

					setFirstPlaceComment([obj]);
					setFirstPlaceCommentId(mentionCommentId);
				} else {
					const params2 = {
						filter: JSON.stringify([
							{ operator: 'eq', value: mentionedCommentAPI[0].replyId, property: 'id' },
						]),
					};
					// Gọi api lấy thông tin của bình luận cha của bình luận nhắc đến bạn
					const fatherOfMentionedCommentAPI = await dispatch(
						getQuoteComments({ quoteId: quoteData.id, params: params2 })
					).unwrap();

					// Đảo thứ tự replies
					const reverseRepliesFather = fatherOfMentionedCommentAPI[0].reply.reverse();
					const objFather = { ...fatherOfMentionedCommentAPI[0], reply: reverseRepliesFather };

					setFirstPlaceComment([objFather]);
					setFirstPlaceCommentId(mentionedCommentAPI[0].replyId);
				}
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='main-quote-detail'>
			<Suspense fallback={<Circle />}>
				<div className='main-quote-detail__header'>
					<BackButton destination={-1} />
					<h4>Chi tiết Quote</h4>
					{quoteData?.user?.fullName || (quoteData?.user?.firstName && quoteData?.user?.lastName) ? (
						<Link to={`/quotes/${quoteData.createdBy}`} className='main-quote-detail__link'>
							<div className='main-quote-detail__link__row'>
								<>
									Xem tất cả Quotes của{' '}
									{quoteData.createdBy === userInfo.id
										? 'tôi'
										: quoteData.user.fullName ||
										  quoteData.user.firstName + ' ' + quoteData.user.lastName}
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

						<SeeMoreComments
							data={quoteData}
							setData={setQuoteData}
							haveNotClickedSeeMoreOnce={haveNotClickedSeeMoreOnce}
							setHaveNotClickedSeeMoreOnce={setHaveNotClickedSeeMoreOnce}
							isInDetail={true}
							postType={'quote'}
						/>

						{/* Comment mention đặt trên đầu  */}
						{firstPlaceComment && firstPlaceComment?.length > 0 && (
							<>
								{firstPlaceComment.map(comment => (
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
													{showReplyArrayState.includes(comment.id) ? (
														<div className='reply-comment-item'>
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
														</div>
													) : (
														<div
															className='reply-see-more'
															onClick={() => onClickSeeMoreReply(comment.id)}
														>
															Xem phản hồi
														</div>
													)}
												</>
											)}
											<CommentEditor
												onCreateComment={onCreateComment}
												className={classNames(
													`reply-comment-editor reply-comment-${comment.id}`,
													{
														'show': comment.id === replyingCommentId,
													}
												)}
												mentionUsersArr={mentionUsersArr}
												commentLv1Id={comment.id}
												replyingCommentId={replyingCommentId}
												clickReply={clickReply.current}
												setMentionUsersArr={setMentionUsersArr}
											/>
										</div>
									</div>
								))}
							</>
						)}
						{/* các bình luận ngoại trừ firstPlaceComment */}
						{quoteData.usersComments && quoteData.usersComments?.length > 0 && (
							<>
								{quoteData.usersComments
									.filter(x => x.id !== firstPlaceCommentId)
									.map(comment => (
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
														{showReplyArrayState.includes(comment.id) ? (
															<div className='reply-comment-item'>
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
															</div>
														) : (
															<div
																className='reply-see-more'
																onClick={() => onClickSeeMoreReply(comment.id)}
															>
																Xem phản hồi
															</div>
														)}
													</>
												)}
												<CommentEditor
													onCreateComment={onCreateComment}
													className={classNames(
														`reply-comment-editor reply-comment-${comment.id}`,
														{
															'show': comment.id === replyingCommentId,
														}
													)}
													mentionUsersArr={mentionUsersArr}
													commentLv1Id={comment.id}
													replyingCommentId={replyingCommentId}
													clickReply={clickReply.current}
													setMentionUsersArr={setMentionUsersArr}
												/>
											</div>
										</div>
									))}
							</>
						)}

						<CommentEditor
							commentLv1Id={null}
							onCreateComment={onCreateComment}
							mentionUsersArr={mentionUsersArr}
							setMentionUsersArr={setMentionUsersArr}
						/>
					</div>
				)}
			</Suspense>
		</div>
	);
};

MainQuoteDetail.propTypes = {
	quoteData: PropTypes.object,
	setQuoteData: PropTypes.func,
	onCreateComment: PropTypes.func,
	setMentionUsersArr: PropTypes.any,
	mentionUsersArr: PropTypes.any,
};

export default MainQuoteDetail;
