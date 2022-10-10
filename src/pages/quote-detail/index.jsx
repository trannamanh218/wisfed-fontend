import MainContainer from 'components/layout/main-container';
import SidebarQuote from 'shared/sidebar-quote';
import { useState, useRef, useEffect } from 'react';
import MainQuoteDetail from './main-quote-detail';
import { getQuoteDetail, creatQuotesComment } from 'reducers/redux-utils/quote';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';

const QuoteDetail = () => {
	const [quoteData, setQuoteData] = useState({});
	const [listHashtags, setListHashtags] = useState([]);
	const [mentionUsersArr, setMentionUsersArr] = useState([]);

	const isLikeTemp = useRef(false);

	const { id } = useParams();
	const dispatch = useDispatch();

	const userInfo = useSelector(state => state.auth.userInfo);

	useEffect(() => {
		window.scrollTo(0, 0);
		getQuoteData();
	}, [id]);

	const getQuoteData = async () => {
		try {
			const response = await dispatch(getQuoteDetail(id)).unwrap();
			const newUserComments = response.usersComments.reverse();
			const obj = { ...response, usersComments: newUserComments };
			setQuoteData(obj);
			setListHashtags(response.tags);
			isLikeTemp.current = response.isLike;
		} catch (err) {
			NotificationError(err);
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
					const newQuoteData = { ...quoteData, usersComments, comments: quoteData.comment + 1 };
					setQuoteData(newQuoteData);
				}
			} catch (err) {
				NotificationError(err);
			}
		}
	};

	return (
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
			right={<SidebarQuote listHashtags={listHashtags} inMyQuote={false} hasCountQuotes={false} />}
		/>
	);
};

export default QuoteDetail;
