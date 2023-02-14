import classNames from 'classnames';
import Comment from 'shared/comments';
import CommentEditor from 'shared/comment-editor';
import PropTypes from 'prop-types';

export default function CommentsList({
	data,
	postData,
	handleReply,
	type,
	showReplyArrayState,
	onClickSeeMoreReply,
	onCreateComment,
	mentionUsersArr,
	setMentionUsersArr,
	clickReply,
	replyingCommentId,
}) {
	return (
		<>
			{data.map(comment => (
				<div key={comment.id}>
					<Comment
						commentLv1Id={comment.id}
						dataProp={comment}
						postData={postData}
						handleReply={handleReply}
						type={type}
					/>
					<div className='comment-reply-container'>
						{comment.reply && !!comment.reply?.length && (
							<>
								{showReplyArrayState.includes(comment.id) ? (
									<div className='reply-comment-item'>
										{comment.reply?.map(commentChild => (
											<div key={commentChild.id}>
												<Comment
													commentLv1Id={comment.id}
													dataProp={commentChild}
													postData={postData}
													handleReply={handleReply}
													type={type}
												/>
											</div>
										))}
									</div>
								) : (
									<div className='reply-see-more' onClick={() => onClickSeeMoreReply(comment.id)}>
										Xem phản hồi
									</div>
								)}
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
		</>
	);
}

CommentsList.defaultProps = {
	data: [],
	postData: {},
	handleReply: () => {},
	type: '',
	showReplyArrayState: [],
	onClickSeeMoreReply: () => {},
	onCreateComment: () => {},
	mentionUsersArr: [],
	setMentionUsersArr: () => {},
	clickReply: null,
	replyingCommentId: -1,
};

CommentsList.propTypes = {
	data: PropTypes.array,
	postData: PropTypes.object,
	handleReply: PropTypes.func,
	type: PropTypes.string,
	showReplyArrayState: PropTypes.array,
	onClickSeeMoreReply: PropTypes.func,
	onCreateComment: PropTypes.func,
	mentionUsersArr: PropTypes.array,
	setMentionUsersArr: PropTypes.func,
	clickReply: PropTypes.any,
	replyingCommentId: PropTypes.number,
};
