import './authors-search.scss';
import AuthorCard from 'shared/author-card';
import PropTypes from 'prop-types';
import { getFilterSearch } from 'reducers/redux-utils/search';
import { NotificationError } from 'helpers/Error';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import ResultNotFound from '../result-not-found';
import LoadingIndicator from 'shared/loading-indicator';

const AuthorSearch = ({ value, searchResultInput, activeKeyDefault, updateBooks }) => {
	const [listArrayAuthors, setListArrayAuthors] = useState([]);
	const [isFetching, setIsFetching] = useState(false);
	const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(false);

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
		if (listArrayAuthors.length === 0) {
			setIsLoadingFirstTime(true);
		}
		setIsFetching(true);
		try {
			const params = {
				q: searchResultInput,
				type: activeKeyDefault,
				start: callApiStart.current,
				limit: callApiPerPage.current,
			};

			const result = await dispatch(getFilterSearch(params)).unwrap();
			if (result.rows.length > 0) {
				callApiStart.current += callApiPerPage.current;
				setListArrayAuthors(listArrayAuthors.concat(result.rows));
			}
			// Nếu kết quả tìm kiếm nhỏ hơn limit thì disable gọi api khi scroll
			if (!result.rows.length || result.rows.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsFetching(false);
			setIsLoadingFirstTime(false);
		}
	};

	return (
		<div className='authors__search__container'>
			{isLoadingFirstTime ? (
				<LoadingIndicator />
			) : (
				<>
					{listArrayAuthors?.length > 0 && activeKeyDefault === 'authors' ? (
						<InfiniteScroll
							next={handleGetAuthorsSearch}
							dataLength={listArrayAuthors.length}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
						>
							<div className='myfriends__layout__container'>
								{listArrayAuthors.map((item, index) => (
									<div key={index} className='myfriends__layout__container__top'>
										<AuthorCard item={item} size={'lg'} checkAuthors={true} />
									</div>
								))}
							</div>
						</InfiniteScroll>
					) : (
						isFetching === false && <ResultNotFound />
					)}
				</>
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
	setIsLoadingFirstTime: PropTypes.func,
};
export default AuthorSearch;
