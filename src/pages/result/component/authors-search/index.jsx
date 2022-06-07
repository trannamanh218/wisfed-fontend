import './authors-search.scss';
import AuthorCard from 'shared/author-card';
import Button from 'shared/button';
import PropTypes from 'prop-types';
import LoadingIndicator from 'shared/loading-indicator';
import { getFilterSearchAuth, getFilterSearch } from 'reducers/redux-utils/search';
import { NotificationError } from 'helpers/Error';
import Storage from 'helpers/Storage';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import ResultNotFound from '../result-not-found';

const AuthorSearch = ({ value, setIsFetching, searchResultInput, activeKeyDefault, updateBooks, isFetching }) => {
	const [listArrayAuthors, setListArrayAuthors] = useState([]);
	const { isShowModal } = useSelector(state => state.search);
	const [hasMore, setHasMore] = useState(true);
	const dispatch = useDispatch();
	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	useEffect(() => {
		if (activeKeyDefault === 'authors') {
			setListArrayAuthors([]);
			callApiStart.current = 0;
			setHasMore(true);
		}
	}, [updateBooks, isShowModal, activeKeyDefault]);

	useEffect(() => {
		if (
			activeKeyDefault === 'authors' &&
			callApiStart.current === 0 &&
			listArrayAuthors.length === 0 &&
			searchResultInput.length > 0
		) {
			handleGetAuthorsSearch();
		}
	}, [callApiStart.current, value, isShowModal, listArrayAuthors]);

	const handleGetAuthorsSearch = async () => {
		setIsFetching(true);
		try {
			const params = {
				q: searchResultInput,
				type: activeKeyDefault,
				start: callApiStart.current,
				limit: callApiPerPage.current,
			};

			if (Storage.getAccessToken()) {
				const result = await dispatch(getFilterSearchAuth(params)).unwrap();
				if (result.rows.length > 0) {
					callApiStart.current += callApiPerPage.current;
					setListArrayAuthors(listArrayAuthors.concat(result.rows));
				} else {
					setHasMore(false);
				}
			} else {
				const result = await dispatch(getFilterSearch(params)).unwrap();
				if (result.rows.length > 0) {
					callApiStart.current += callApiPerPage.current;
					setListArrayAuthors(listArrayAuthors.concat(result.rows));
				} else {
					setHasMore(false);
				}
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<div className='authors__search__container'>
			{listArrayAuthors?.length > 0 && activeKeyDefault === 'authors' ? (
				<InfiniteScroll
					next={handleGetAuthorsSearch}
					dataLength={listArrayAuthors.length}
					hasMore={hasMore}
					// loader={<LoadingIndicator />}
				>
					<div className='myfriends__layout__container'>
						{listArrayAuthors.map(item => (
							<AuthorCard key={item.id} item={item} size={'lg'} checkAuthors={true} />
						))}
					</div>
				</InfiniteScroll>
			) : (
				isFetching === false && <ResultNotFound />
			)}
		</div>
	);
};
AuthorSearch.propTypes = {
	setIsFetching: PropTypes.func,
	activeKeyDefault: PropTypes.string,
	searchResultInput: PropTypes.string,
	value: PropTypes.string,
	updateBooks: PropTypes.bool,
	isFetching: PropTypes.bool,
};
export default AuthorSearch;
