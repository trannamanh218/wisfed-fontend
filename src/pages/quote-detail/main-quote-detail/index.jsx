import { Forward } from 'components/svg';
import { useState, useEffect } from 'react';
import BackButton from 'shared/back-button';
import QuoteComment from 'shared/quote-comments';
import QuoteCard from 'shared/quote-card';
import './main-quote-detail.scss';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import CommentEditor from 'shared/comment-editor';
import classNames from 'classnames';
import { checkLikeQuoteComment } from 'reducers/redux-utils/quote';

const MainQuoteDetail = ({ quoteData, onCreateComment }) => {
	const dispatch = useDispatch();
	const userInfo = useSelector(state => state.auth.userInfo);

	const [commentLv1IdArray, setCommentLv1IdArray] = useState([]);
	const [replyingCommentId, setReplyingCommentId] = useState(0);
	const [clickReply, setClickReply] = useState(false);
	const [quoteCommentsLikedArray, setQuoteCommentsLikedArray] = useState([]);

	useEffect(() => {
		window.scrollTo(0, 0);
		// getQuoteData();
		checkQuoteCommentLiked();
	}, []);

	// const getQuoteData = async () => {
	// 	try {
	// 		const response = await dispatch(getQuoteDetail(id)).unwrap();
	// 		setQuoteData(response);
	// 	} catch {
	// 		toast.error('Lỗi hệ thống');
	// 	}
	// };

	const checkQuoteCommentLiked = async () => {
		try {
			const res = await dispatch(checkLikeQuoteComment()).unwrap();
			setQuoteCommentsLikedArray(res);
		} catch {
			toast.error('Lỗi hệ thống');
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

	// const onCreateComment = async (content, replyId) => {
	// 	const params = {
	// 		quoteId: Number(id),
	// 		content: content,
	// 		mediaUrl: [],
	// 		replyId: replyId,
	// 	};
	// 	try {
	// 		const res = await dispatch(creatQuotesComment(params));
	// 		if (!_.isEmpty(res)) {
	// 			getQuoteData();
	// 		}
	// 	} catch {
	// 		err => {
	// 			return err;
	// 		};
	// 	}
	// };

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
				<BackButton />
				<h4>Chi tiết Quote</h4>
				<a className='main-quote-detail__link' href='#'>
					<span>Xem tất cả của Adam Khort</span>
					<Forward />
				</a>
			</div>
			{!_.isEmpty(quoteData) && (
				<div className='main-quote-detail__pane'>
					<QuoteCard className='mx-auto' isDetail={true} data={quoteData} />
					{quoteData.commentQuotes?.map((comment, index) => (
						<div key={`${comment.id}-${index}`}>
							{comment.replyId === null && (
								<QuoteComment
									commentLv1Id={comment.id}
									data={comment}
									quoteData={quoteData}
									handleReply={handleReply}
									quoteCommentsLikedArray={quoteCommentsLikedArray}
								/>
							)}

							<div className='main-quote-detail__reply'>
								{quoteData.commentQuotes.map(commentChild => {
									if (commentChild.replyId === comment.id) {
										return (
											<div key={commentChild.id}>
												<div>
													<QuoteComment
														commentLv1Id={comment.id}
														data={commentChild}
														quoteData={quoteData}
														handleReply={handleReply}
														quoteCommentsLikedArray={quoteCommentsLikedArray}
													/>
												</div>
											</div>
										);
									}
								})}
								{commentLv1IdArray.includes(comment.id) && (
									<CommentEditor
										userInfo={userInfo}
										postData={quoteData}
										onCreateComment={onCreateComment}
										className={classNames('main-quote-detail__reply-comment', {
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

export default MainQuoteDetail;
