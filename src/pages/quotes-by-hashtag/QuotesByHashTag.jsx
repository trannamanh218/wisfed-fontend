import NormalContainer from 'components/layout/normal-container';
import { NotificationError } from 'helpers/Error';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getlistQuotesByTag } from 'reducers/redux-utils/quote';
import LoadingIndicator from 'shared/loading-indicator';
import QuoteCard from 'shared/quote-card';
import './QuotesByHashTag.scss';

function QuotesByHashTag() {
	const [listQuoteByTag, setListQuoteByTag] = useState([]);
	const [loading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const callApiStart = useRef(3);
	const callApiPerPage = useRef(3);

	const { hashtag } = useParams();

	const dispatch = useDispatch();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		setHasMore(true);
		getQuotesByTag();
	}, [hashtag]);

	const getQuotesByTag = async () => {
		setIsLoading(true);
		const params = {
			start: 0,
			limit: callApiPerPage.current,
			tag: hashtag,
		};
		try {
			const response = await dispatch(getlistQuotesByTag(params)).unwrap();
			if (response.rows.length < callApiPerPage.current) {
				setHasMore(false);
			}
			setListQuoteByTag(response.rows);
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const getQuotesByTagNext = async () => {
		const params = {
			start: callApiStart.current,
			limit: callApiPerPage.current,
			tag: hashtag,
		};
		try {
			const response = await dispatch(getlistQuotesByTag(params)).unwrap();
			if (response.rows.length) {
				if (response.rows.length < callApiPerPage.current) {
					setHasMore(false);
				} else {
					callApiStart.current += callApiPerPage.current;
				}
				setListQuoteByTag(listQuoteByTag.concat(response.rows));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<NormalContainer>
			<div className='hashtag-quotes'>
				<h4>Quotes có hashtag "#{hashtag}"</h4>
				{loading ? (
					<LoadingIndicator />
				) : (
					<div className='filter-quote-pane'>
						<InfiniteScroll
							dataLength={listQuoteByTag.length}
							next={getQuotesByTagNext}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
						>
							<>
								{listQuoteByTag.length > 0 ? (
									<>
										{listQuoteByTag.map(item => (
											<QuoteCard key={item.id} data={item} isDetail={false} />
										))}
									</>
								) : (
									<p className='quotes-blank'>Chưa có dữ liệu</p>
								)}
							</>
						</InfiniteScroll>
					</div>
				)}
			</div>
		</NormalContainer>
	);
}

export default QuotesByHashTag;
