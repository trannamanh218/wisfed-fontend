import { Forward } from 'components/svg';
import React, { useState, useEffect } from 'react';
import BackButton from 'shared/back-button';
import Comment from 'shared/comment';
import QuoteCard from 'shared/quote-card';
import './main-quote-detail.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuoteDetail } from 'reducers/redux-utils/quote';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import CommentEditor from 'shared/comment-editor';
import { useSelector } from 'react-redux';
import { createComment } from 'reducers/redux-utils/comment';

const MainQuoteDetail = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userInfo = useSelector(state => state.auth.userInfo);

	const [quoteData, setQuoteData] = useState({});
	const [hasReplyCommentId, setHasReplyCommentId] = useState([]);

	useEffect(() => {
		window.scrollTo(0, 0);
		getQuoteData();
	}, []);

	const getQuoteData = async () => {
		try {
			const response = await dispatch(getQuoteDetail(id)).unwrap();
			setQuoteData(response);
		} catch {
			toast.error('Lỗi hệ thống');
		}
	};

	const backFnc = () => {
		navigate(-1);
	};

	useEffect(() => {
		if (quoteData?.commentQuotes?.length > 0) {
			const hasReplyCommentIdTemp = [];
			for (let i = 0; i < quoteData.commentQuotes.length; i++) {
				if (
					quoteData.commentQuotes[i].reply &&
					!hasReplyCommentIdTemp.includes(quoteData.commentQuotes[i].reply)
				) {
					hasReplyCommentIdTemp.push(quoteData.commentQuotes[i].reply);
				}
			}
			setHasReplyCommentId(hasReplyCommentIdTemp);
		}
	}, [quoteData.commentQuotes]);

	const onCreateComment = (content, reply, parentData, indexParent) => {
		const params = {
			activityId: quoteData.activityId,
			content: content,
			mediaUrl: [],
			reply,
		};

		dispatch(createComment(params))
			.unwrap()
			.then(res => {
				const propertyComment = ['activityId', 'content', 'getstreamId', 'reply', 'id', 'createdAt'];
				const newComment = _.pick(res, propertyComment);
				newComment.user = userInfo;
				newComment.replyComments = [];

				let usersComments = [];
				if (_.isEmpty(parentData)) {
					usersComments = [...quoteData.usersComments, newComment];
				} else {
					const replyComments = [...parentData.replyComments.slice(0, -1), newComment];
					usersComments = [
						...quoteData.usersComments.slice(0, indexParent),
						{ ...parentData, replyComments },
						...quoteData.usersComments.slice(indexParent + 1),
					];
				}

				setQuoteData(prev => ({ ...prev, usersComments, comments: ++prev.comments }));
			})
			.catch(err => {
				return err;
			});
	};

	const handleReply = (data, index, parentData, indexParent) => {
		const newData = {
			content: '',
			reply: parentData.id || data.id,
			activityId: quoteData.activityId,
			user: { ...userInfo },
			replyComments: [],
		};

		let usersComments = [];
		const isValid = _.isEmpty(parentData) ? isValidToAddReply(data) : isValidToAddReply(parentData);

		if (isValid) {
			if (_.isEmpty(parentData)) {
				const replyComments = [...data.replyComments, newData];

				usersComments = [
					...quoteData.usersComments.slice(0, index),
					{ ...data, replyComments },
					...quoteData.usersComments.slice(index + 1),
				];
			} else {
				const replyComments = [...parentData.replyComments, newData];

				usersComments = [
					...quoteData.usersComments.slice(0, indexParent),
					{ ...parentData, replyComments },
					...quoteData.usersComments.slice(indexParent + 1),
				];
			}

			return setQuoteData(prev => ({ ...prev, usersComments }));
		}
	};

	const isValidToAddReply = data => {
		if (data && data.replyComments && data.replyComments.length) {
			return data.replyComments.every(item => item.content);
		}
		return true;
	};

	return (
		<div className='main-quote-detail'>
			<div className='main-quote-detail__header'>
				<button onClick={backFnc}>
					<BackButton />
				</button>
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
							{comment.reply === null && (
								<Comment
									data={comment}
									postData={quoteData}
									handleReply={handleReply}
									index={index}
									indexParent={null}
								/>
							)}
							{hasReplyCommentId.includes(comment.id) && (
								<div className='main-quote-detail__reply'>
									{quoteData.commentQuotes.map((commentChild, index) => {
										if (commentChild.reply === comment.id) {
											return (
												<div key={commentChild.id}>
													<div>
														<Comment
															data={commentChild}
															postData={quoteData}
															handleReply={handleReply}
															index={index}
															indexParent={null}
														/>
													</div>
												</div>
											);
										}
									})}
									<CommentEditor
										// key={`editor-${comment.id}-${childIndex}`}
										userInfo={userInfo}
										postData={quoteData}
										onCreateComment={onCreateComment}
										className='reply-comment'
										// reply={childComment.reply}
										parentData={comment}
										indexParent={index}
									/>
								</div>
							)}
						</div>
					))}

					<CommentEditor userInfo={userInfo} />
				</div>
			)}
		</div>
	);
};

MainQuoteDetail.propTypes = {};

export default MainQuoteDetail;
