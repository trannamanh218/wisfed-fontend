import MainContainer from 'components/layout/main-container';
import SidebarQuote from 'shared/sidebar-quote';
import { useState, useEffect } from 'react';
import MainQuoteDetail from './main-quote-detail';
import { getQuoteDetail, creatQuotesComment } from 'reducers/redux-utils/quote';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import _ from 'lodash';
import { likeUnlikeQuote } from 'reducers/redux-utils/quote';

const QuoteDetail = () => {
	const [quoteData, setQuoteData] = useState({});
	const [listHashtags, setListHashtags] = useState([]);
	const [mentionUsersArr, setMentionUsersArr] = useState([]);

	const { id } = useParams();
	const dispatch = useDispatch();

	const userInfo = useSelector(state => state.auth.userInfo);

	useEffect(() => {
		window.scrollTo(0, 0);
		getQuoteData();
	}, []);

	const getQuoteData = async () => {
		try {
			const response = await dispatch(getQuoteDetail(id)).unwrap();
			setQuoteData(response);
			setListHashtags(response.tags);
		} catch (err) {
			NotificationError(err);
		}
	};

	const onCreateComment = async (content, replyId) => {
		const newArr = [];
		mentionUsersArr.forEach(item => newArr.push(item.userId));
		const params = {
			quoteId: Number(id),
			content: content,
			mediaUrl: [],
			replyId: replyId,
			mentionsUser: newArr,
		};
		try {
			const res = await dispatch(creatQuotesComment(params)).unwrap();
			if (!_.isEmpty(res)) {
				const newComment = { ...res, user: userInfo };
				const commentQuotes = [...quoteData.commentQuotes, newComment];
				const newQuoteData = { ...quoteData, commentQuotes, comments: quoteData.comments + 1 };
				setQuoteData(newQuoteData);
			}
		} catch {
			err => {
				return err;
			};
		}
	};

	const likeUnlikeQuoteFnc = async id => {
		try {
			await dispatch(likeUnlikeQuote(id)).unwrap();
			const setLike = !quoteData.isLike;
			const numberOfLike = setLike ? quoteData.like + 1 : quoteData.like - 1;
			setQuoteData({ ...quoteData, isLike: setLike, like: numberOfLike });
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<MainContainer
			main={
				<MainQuoteDetail
					quoteData={quoteData}
					onCreateComment={onCreateComment}
					likeUnlikeQuoteFnc={likeUnlikeQuoteFnc}
					setMentionUsersArr={setMentionUsersArr}
					mentionUsersArr={mentionUsersArr}
					userInfo={userInfo}
				/>
			}
			right={<SidebarQuote listHashtags={listHashtags} inMyQuote={false} hasCountQuotes={false} />}
		/>
	);
};

export default QuoteDetail;
