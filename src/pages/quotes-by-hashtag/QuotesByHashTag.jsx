import NormalContainer from 'components/layout/normal-container';
import { NotificationError } from 'helpers/Error';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getlistQuotesByTag } from 'reducers/redux-utils/quote';
import LoadingIndicator from 'shared/loading-indicator';
import QuoteCard from 'shared/quote-card';
import './QuotesByHashTag.scss';

function QuotesByHashTag() {
	const [listQuoteByTag, setListQuoteByTag] = useState([]);
	const [loading, setIsLoading] = useState(false);

	const { hashtag } = useParams();

	const dispatch = useDispatch();

	const getQuotesByTag = async () => {
		setIsLoading(true);
		try {
			const params = {
				tag: hashtag,
			};

			const response = await dispatch(getlistQuotesByTag(params)).unwrap();
			setListQuoteByTag(response.rows);
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getQuotesByTag();
	}, [hashtag]);

	return (
		<NormalContainer>
			<div className='hashtag-quotes'>
				<h4>Quotes có hashtag "#{hashtag}"</h4>
				{loading ? (
					<LoadingIndicator />
				) : (
					<div className='filter-quote-pane'>
						{listQuoteByTag.length > 0 ? (
							<>
								{listQuoteByTag.map(item => (
									<QuoteCard key={item.id} data={item} isDetail={false} />
								))}
							</>
						) : (
							<p className='quotes-blank'>Chưa có dữ liệu</p>
						)}
					</div>
				)}
			</div>
		</NormalContainer>
	);
}

export default QuotesByHashTag;
