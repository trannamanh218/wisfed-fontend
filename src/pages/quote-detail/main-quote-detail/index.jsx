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
import { QUOTE_TYPE } from 'constants';
import { useSelector } from 'react-redux';

const MainQuoteDetail = ({ quoteData, onCreateComment, setMentionUsersArr, mentionUsersArr }) => {
	const [replyingCommentId, setReplyingCommentId] = useState(0);
	const [clickReply, setClickReply] = useState(false);

	const userInfo = useSelector(state => state.auth.userInfo);

	const handleReply = (cmtLv1Id, userData) => {
		if (userData.id !== userInfo.id) {
			const arr = [];
			arr.push(userData);
			setMentionUsersArr(arr);
		}
		setReplyingCommentId(cmtLv1Id);
		setClickReply(true);
		setTimeout(() => {
			setClickReply(false);
		}, 200);
	};

	return (
		<div className='main-quote-detail'>
			<div className='main-quote-detail__header'>
				<BackButton destination={-1} />
				<h4>Chi tiết Quote</h4>
				{quoteData?.user?.fullName || (quoteData?.user?.firstName && quoteData?.user?.lastName) ? (
					<Link to={`/quotes/${quoteData.user.id}`} className='main-quote-detail__link'>
						<span>
							Xem tất cả Quotes của{' '}
							{quoteData.user.fullName || quoteData.user.firstName + ' ' + quoteData.user.lastName}{' '}
						</span>
						<Forward />
					</Link>
				) : (
					<></>
				)}
			</div>
			{!_.isEmpty(quoteData) && (
				<div className='main-quote-detail__pane'>
					<QuoteCard isDetail={true} data={quoteData} />
					{quoteData.usersComments && !!quoteData.usersComments?.length && (
						<>
							{quoteData.usersComments.map(comment => (
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
											clickReply={clickReply}
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
