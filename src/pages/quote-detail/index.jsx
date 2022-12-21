import MainContainer from 'components/layout/main-container';
import SidebarQuote from 'shared/sidebar-quote';
import { useState, useRef, useEffect } from 'react';
import MainQuoteDetail from './main-quote-detail';
import { getQuoteDetail, creatQuotesComment } from 'reducers/redux-utils/quote';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import NotFound from 'pages/not-found';
import { setParamHandleEdit } from 'reducers/redux-utils/comment';

const QuoteDetail = () => {
	const [quoteData, setQuoteData] = useState({});
	const [listHashtags, setListHashtags] = useState([]);
	const [mentionUsersArr, setMentionUsersArr] = useState([]);
	const [renderNotFound, setRenderNotFound] = useState(false);

	const isLikeTemp = useRef(false);

	const { id } = useParams();
	const dispatch = useDispatch();

	const { paramHandleEdit } = useSelector(state => state.comment);
	const userInfo = useSelector(state => state.auth.userInfo);

	useEffect(() => {
		getQuoteData();
	}, [id]);

	useEffect(() => {
		// Thay đổi lại comment sau khi đã chỉnh sửa hoặc xóa
		if (!_.isEmpty(paramHandleEdit) && 'quote' === paramHandleEdit.type) {
			const cloneArr = [...quoteData.usersComments];
			let totalCommentNumber = quoteData.comment;

			if (paramHandleEdit.replyId) {
				const foundReplyObj = cloneArr.find(item => item.id === paramHandleEdit.replyId);
				if (foundReplyObj) {
					const cloneReplyArr = [...foundReplyObj.reply];
					const foundObj = cloneReplyArr.find(item => item.id === paramHandleEdit.id);
					if (foundObj) {
						if (paramHandleEdit.content) {
							foundObj.content = paramHandleEdit.content;
						} else {
							cloneReplyArr.splice(cloneReplyArr.indexOf(foundObj), 1);
							foundReplyObj.reply = cloneReplyArr;
							totalCommentNumber = totalCommentNumber - 1;
						}
					}
				}
			} else {
				const foundObj = cloneArr.find(item => item.id === paramHandleEdit.id);
				if (foundObj) {
					if (paramHandleEdit.content) {
						foundObj.content = paramHandleEdit.content;
					} else {
						cloneArr.splice(cloneArr.indexOf(foundObj), 1);
						if (Array.isArray(foundObj.reply) && foundObj.reply.length) {
							totalCommentNumber = totalCommentNumber - 1 - foundObj.reply.length;
						} else {
							totalCommentNumber = totalCommentNumber - 1;
						}
					}
				}
			}
			setQuoteData({ ...quoteData, comment: totalCommentNumber, usersComments: cloneArr });
			dispatch(setParamHandleEdit({}));
		}
	}, [paramHandleEdit]);

	const getQuoteData = async () => {
		try {
			const response = await dispatch(getQuoteDetail(id)).unwrap();
			const newUserComments = response.usersComments.reverse();
			const obj = { ...response, usersComments: newUserComments };
			setQuoteData(obj);
			setListHashtags(response.tags);
			isLikeTemp.current = response.isLike;
		} catch (err) {
			setRenderNotFound(true);
		}
	};

	const onCreateComment = async (content, replyId) => {
		if (content) {
			const newArr = [];
			mentionUsersArr.forEach(item => newArr.push(item.id));

			const params = {
				quoteId: Number(id),
				content: content.replace(/&nbsp;/g, ''),
				mediaUrl: [],
				replyId: replyId,
				mentionsUser: newArr,
			};
			try {
				const res = await dispatch(creatQuotesComment(params)).unwrap();
				if (!_.isEmpty(res)) {
					const newComment = { ...res, user: userInfo };
					const usersComments = [...quoteData.usersComments];
					if (res.replyId) {
						const cmtReplying = usersComments.filter(item => item.id === res.replyId);
						const reply = [...cmtReplying[0].reply];
						reply.push(newComment);
						const obj = { ...cmtReplying[0], reply };
						const index = usersComments.findIndex(item => item.id === res.replyId);
						usersComments[index] = obj;
					} else {
						newComment.reply = [];
						usersComments.push(newComment);
					}
					const newQuoteData = { ...quoteData, usersComments, comment: quoteData.comment + 1 };
					setQuoteData(newQuoteData);
				}
			} catch (err) {
				NotificationError(err);
			}
		}
	};

	return (
		<>
			{!_.isEmpty(quoteData) ? (
				<MainContainer
					main={
						<MainQuoteDetail
							quoteData={quoteData}
							setQuoteData={setQuoteData}
							onCreateComment={onCreateComment}
							setMentionUsersArr={setMentionUsersArr}
							mentionUsersArr={mentionUsersArr}
						/>
					}
					right={
						<SidebarQuote
							listHashtags={listHashtags}
							firstStyleQuotesSidebar={true}
							createdByOfCurrentQuote={quoteData.createdBy}
						/>
					}
				/>
			) : (
				<>{renderNotFound && <NotFound />}</>
			)}
		</>
	);
};

export default QuoteDetail;
