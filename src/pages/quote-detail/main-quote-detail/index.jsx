import { Forward } from 'components/svg';
import React, { useState, useEffect } from 'react';
import BackButton from 'shared/back-button';
import QuoteComment from 'shared/quote-comments';
import QuoteCard from 'shared/quote-card';
import './main-quote-detail.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuoteDetail, creatQuotesComment } from 'reducers/redux-utils/quote';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import CommentEditor from 'shared/comment-editor';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

const MainQuoteDetail = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userInfo = useSelector(state => state.auth.userInfo);

	const [quoteData, setQuoteData] = useState({});
	const [commentLv1IdArray, setCommentLv1IdArray] = useState([]);
	const [replyingCommentId, setReplyingCommentId] = useState(0);

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
			const commentLv1IdTemp = [];
			for (let i = 0; i < quoteData.commentQuotes.length; i++) {
				if (
					quoteData.commentQuotes[i].reply === null &&
					!commentLv1IdTemp.includes(quoteData.commentQuotes[i].id)
				) {
					commentLv1IdTemp.push(quoteData.commentQuotes[i].id);
				}
			}
			setCommentLv1IdArray(commentLv1IdTemp);
		}
	}, [quoteData.commentQuotes]);

	const onCreateComment = async (content, reply) => {
		const params = {
			quoteId: Number(id),
			content: content,
			mediaUrl: [],
			reply: reply,
		};
		try {
			const res = await dispatch(creatQuotesComment(params));
			if (!_.isEmpty(res)) {
				getQuoteData();
			}
		} catch {
			err => {
				return err;
			};
		}
	};

	const handleReply = cmtLv1Id => {
		setReplyingCommentId(cmtLv1Id);
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
								<QuoteComment
									commentLv1Id={comment.id}
									data={comment}
									quoteData={quoteData}
									handleReply={handleReply}
								/>
							)}

							<div className='main-quote-detail__reply'>
								{quoteData.commentQuotes.map(commentChild => {
									if (commentChild.reply === comment.id) {
										return (
											<div key={commentChild.id}>
												<div>
													<QuoteComment
														commentLv1Id={comment.id}
														data={commentChild}
														quoteData={quoteData}
														handleReply={handleReply}
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
										reply={replyingCommentId}
									/>
								)}
							</div>
						</div>
					))}
					<CommentEditor userInfo={userInfo} reply={null} onCreateComment={onCreateComment} />
				</div>
			)}
		</div>
	);
};

export default MainQuoteDetail;
