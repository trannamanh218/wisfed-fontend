// import { Forward } from 'components/svg';
import { useState, useEffect } from 'react';
import BackButton from 'shared/back-button';
import Comment from 'shared/comments';
import QuoteCard from 'shared/quote-card';
import './main-quote-detail.scss';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import CommentEditor from 'shared/comment-editor';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { NotificationError } from 'helpers/Error';
import { checkLikeQuoteComment } from 'reducers/redux-utils/quote';
import PropTypes from 'prop-types';

const MainQuoteDetail = ({ quoteData, onCreateComment }) => {
	const dispatch = useDispatch();
	const userInfo = useSelector(state => state.auth.userInfo);

	const [commentLv1IdArray, setCommentLv1IdArray] = useState([]);
	const [replyingCommentId, setReplyingCommentId] = useState(0);
	const [clickReply, setClickReply] = useState(false);
	const [quoteCommentsLikedArray, setQuoteCommentsLikedArray] = useState([]);

	useEffect(() => {
		checkQuoteCommentLiked();
	}, []);

	const checkQuoteCommentLiked = async () => {
		try {
			const res = await dispatch(checkLikeQuoteComment()).unwrap();
			setQuoteCommentsLikedArray(res);
		} catch (err) {
			NotificationError(err);
		}
	};

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
		}
	}, [replyingCommentId, clickReply]);

	return (
		<div className='main-quote-detail'>
			<div className='main-quote-detail__header'>
				<BackButton destination={-1} />
				<h4>Chi tiết Quote</h4>
				{/* <a className='main-quote-detail__link' href='#'>
					<span>Xem tất cả của Adam Khort</span>
					<Forward />
				</a> */}
			</div>
			{!_.isEmpty(quoteData) && (
				<div className='main-quote-detail__pane'>
					<QuoteCard className='mx-auto' isDetail={true} data={quoteData} />
					{quoteData.commentQuotes?.map(comment => (
						<div key={comment.id}>
							{comment.replyId === null && (
								<Comment
									commentLv1Id={comment.id}
									data={comment}
									postData={quoteData}
									handleReply={handleReply}
									postCommentsLikedArray={quoteCommentsLikedArray}
									inQuotes={true}
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
													postCommentsLikedArray={quoteCommentsLikedArray}
													inQuotes={true}
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
};

export default MainQuoteDetail;
