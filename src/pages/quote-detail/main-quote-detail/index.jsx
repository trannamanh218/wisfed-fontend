import { Forward } from 'components/svg';
import { useState, useEffect } from 'react';
import BackButton from 'shared/back-button';
import Comment from 'shared/comments';
import QuoteCard from 'shared/quote-card';
import './main-quote-detail.scss';
import _ from 'lodash';
import CommentEditor from 'shared/comment-editor';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { QUOTE_TYPE } from 'constants';

const MainQuoteDetail = ({ quoteData, onCreateComment, likeUnlikeQuoteFnc }) => {
	const userInfo = useSelector(state => state.auth.userInfo);

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

	const handleReply = cmtLv1Id => {
		setReplyingCommentId(cmtLv1Id);
		setClickReply(!clickReply);
	};

	useEffect(() => {
		const textareaInCommentEdit = document.querySelector(`#textarea-${replyingCommentId}`);
		if (textareaInCommentEdit) {
			textareaInCommentEdit.focus();
			window.scroll({
				top: textareaInCommentEdit.offsetTop - 400,
				behavior: 'smooth',
			});
			// textareaInCommentEdit.innerHTML = `<span class="url-color">${mentionUsersComment[0].userFullName}</span>`;
			// placeCaretAtEnd(textareaInCommentEdit);
		}
	}, [replyingCommentId, clickReply]);

	// const placeCaretAtEnd = element => {
	// 	element.focus();
	// 	if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
	// 		const range = document.createRange();
	// 		range.selectNodeContents(element);
	// 		range.collapse(false);
	// 		const selection = window.getSelection();
	// 		selection.removeAllRanges();
	// 		selection.addRange(range);
	// 	} else if (typeof document.body.createTextRange != 'undefined') {
	// 		const textRange = document.body.createTextRange();
	// 		textRange.moveToElementText(element);
	// 		textRange.collapse(false);
	// 		textRange.select();
	// 	}
	// };

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
										userInfo={userInfo}
										onCreateComment={onCreateComment}
										className={classNames('reply-comment-editor', {
											'show': comment.id === replyingCommentId,
										})}
										replyId={replyingCommentId}
										textareaId={`textarea-${comment.id}`}
									/>
								)}
							</div>
						</div>
					))}
					<CommentEditor userInfo={userInfo} replyId={null} onCreateComment={onCreateComment} />
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
