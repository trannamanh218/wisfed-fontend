import MainContainer from 'components/layout/main-container';
import { useState } from 'react';
import SidebarMyQuote from 'shared/sidebar-my-quote';
import MainQuoteDetail from './main-quote-detail';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { getQuoteDetail, creatQuotesComment } from 'reducers/redux-utils/quote';

const QuoteDetail = () => {
	const { id } = useParams();

	const [quoteData, setQuoteData] = useState({});
	const [quoteHashtags, setQuoteHashtags] = useState([]);

	const dispatch = useDispatch();

	const getQuoteData = async () => {
		try {
			const response = await dispatch(getQuoteDetail(id)).unwrap();
			setQuoteData(response);
		} catch {
			toast.error('Lỗi hệ thống');
		}
	};

	const onCreateComment = async (content, replyId) => {
		const params = {
			quoteId: Number(id),
			content: content,
			mediaUrl: [],
			replyId: replyId,
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

	return (
		<MainContainer
			main={<MainQuoteDetail quoteData={quoteData} onCreateComment={onCreateComment} />}
			right={<SidebarMyQuote isQuoteDetail={true} quoteHashtags={quoteHashtags} />}
		/>
	);
};

export default QuoteDetail;
