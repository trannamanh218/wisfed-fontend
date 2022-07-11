import { Forward } from 'components/svg';
import { useState, useEffect } from 'react';
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

const MainQuoteDetail = ({ quoteData, onCreateComment, likeUnlikeQuoteFnc, setMentionUsersArr, mentionUsersArr }) => {
	const [commentLv1IdArray, setCommentLv1IdArray] = useState([]);
	const [replyingCommentId, setReplyingCommentId] = useState(0);
	const [clickReply, setClickReply] = useState(false);

	useEffect(() => {
		if (quoteData?.commentQuotes?.length > 0) {
			const commentLv1IdTemp = [];
			for (let i = 0; i < quoteData.commentQuotes.length; i++) {
				if (
					quoteData.commentQuotes[i].replyId === null &&
					!commentLv1IdTemp.includes(quoteData.commentQuotes[i].id)
				) {
					commentLv1IdTemp.push(quoteData.commentQuotes[i].id);
				}
			}
			setCommentLv1IdArray(commentLv1IdTemp);
		}
	}, [quoteData.commentQuotes]);

	const handleReply = (cmtLv1Id, userData) => {
		const arr = [];
		arr.push(userData);
		setMentionUsersArr(arr);
		setReplyingCommentId(cmtLv1Id);
		setClickReply(!clickReply);
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
					<QuoteCard
						className='mx-auto'
						isDetail={true}
						data={quoteData}
						likeUnlikeQuoteFnc={likeUnlikeQuoteFnc}
					/>
					{quoteData.commentQuotes?.map(comment => (
						<div key={comment.id}>
							{comment.replyId === null && (
								<Comment
									commentLv1Id={comment.id}
									data={comment}
									postData={quoteData}
									handleReply={handleReply}
									type={QUOTE_TYPE}
								/>
							)}

							<div className='comment-reply-container'>
								{quoteData.commentQuotes.map(commentChild => {
									if (commentChild.replyId === comment.id) {
										return (
											<div key={commentChild.id}>
												<Comment
													commentLv1Id={comment.id}
													data={commentChild}
													postData={quoteData}
													handleReply={handleReply}
													type={QUOTE_TYPE}
												/>
											</div>
										);
									}
								})}
								{commentLv1IdArray.includes(comment.id) && (
									<CommentEditor
										onCreateComment={onCreateComment}
										className={classNames('reply-comment-editor', {
											'show': comment.id === replyingCommentId,
										})}
										replyId={replyingCommentId}
										textareaId={`textarea-${comment.id}`}
										mentionUsersArr={mentionUsersArr}
										replyingCommentId={replyingCommentId}
										clickReply={clickReply}
										setMentionUsersArr={setMentionUsersArr}
									/>
								)}
							</div>
						</div>
					))}
					<CommentEditor replyId={null} onCreateComment={onCreateComment} mentionUsersArr={mentionUsersArr} />
				</div>
			)}
		</div>
	);
};

MainQuoteDetail.propTypes = {
	quoteData: PropTypes.object,
	onCreateComment: PropTypes.func,
	likeUnlikeQuoteFnc: PropTypes.func,
};

export default MainQuoteDetail;
