import PropTypes from 'prop-types';
import AuthorBook from 'shared/author-book';
import { CHECK_STAR } from 'constants';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getBookAuthorList } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';

const BookTab = ({ currentTab }) => {
	const { userId } = useParams();
	const [booksOfAuthor, setBooksOfAuthor] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	const dispatch = useDispatch();

	useEffect(() => {
		if (currentTab === 'books') {
			getBookListByAuthor();
		}
	}, [currentTab]);

	const getBookListByAuthor = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			};
			const res = await dispatch(getBookAuthorList({ id: userId, params: params })).unwrap();
			if (res.length) {
				if (res.length < callApiPerPage.current) {
					setHasMore(false);
				} else {
					callApiStart.current += callApiPerPage.current;
				}
				setBooksOfAuthor(booksOfAuthor.concat(res));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{isLoading ? (
				<LoadingIndicator />
			) : (
				<>
					{!!booksOfAuthor.length && currentTab === 'books' ? (
						<InfiniteScroll
							dataLength={booksOfAuthor.length}
							next={getBookListByAuthor}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
						>
							{booksOfAuthor.map(book => (
								<AuthorBook key={book.id} data={book} checkStar={CHECK_STAR} />
							))}
						</InfiniteScroll>
					) : (
						<p className='blank-content'>Không có quyển sách nào</p>
					)}
				</>
			)}
		</>
	);
};

BookTab.propTypes = {
	currentTab: PropTypes.string,
};

export default BookTab;
