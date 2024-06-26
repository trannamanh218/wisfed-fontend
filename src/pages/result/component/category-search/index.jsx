import './category-search.scss';
import CategoryGroup from 'shared/category-group';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBookDetail } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';
import RouteLink from 'helpers/RouteLink';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import { getFilterSearch } from 'reducers/redux-utils/search';
import { useEffect, useState, useRef, useCallback } from 'react';
import LoadingIndicator from 'shared/loading-indicator';
import { getCategoryDetail } from 'reducers/redux-utils/category';
import ResultNotFound from '../result-not-found';

const CategorySearch = ({ value, searchResultInput, activeKeyDefault, updateBooks }) => {
	const [listArrayCategory, setListArrayCategory] = useState([]);
	const { isShowModal } = useSelector(state => state.search);
	const [hasMore, setHasMore] = useState(true);
	const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(false);

	const callApiStartCategory = useRef(0);
	const callApiPerPage = useRef(3);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (activeKeyDefault === 'categories') {
			setListArrayCategory([]);
			callApiStartCategory.current = 0;
			setHasMore(true);
		}
	}, [updateBooks, isShowModal, activeKeyDefault]);

	useEffect(() => {
		if (
			activeKeyDefault === 'categories' &&
			callApiStartCategory.current === 0 &&
			listArrayCategory.length === 0 &&
			searchResultInput.length > 0
		) {
			handleGetGroupSearch();
		}
	}, [callApiStartCategory.current, value, isShowModal, listArrayCategory]);

	const handleGetGroupSearch = async () => {
		if (listArrayCategory.length === 0) {
			setIsLoadingFirstTime(true);
		}
		try {
			const params = {
				q: searchResultInput,
				type: activeKeyDefault,
				start: callApiStartCategory.current,
				limit: callApiPerPage.current,
				must_not: { 'numberBook': '0' },
			};
			const result = await dispatch(getFilterSearch(params)).unwrap();
			if (result.rows.length > 0) {
				callApiStartCategory.current += callApiPerPage.current;
				setListArrayCategory(listArrayCategory.concat(result.rows));
			}
			// Nếu kết quả tìm kiếm nhỏ hơn limit thì disable gọi api khi scroll
			if (!result.rows.length || result.rows.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoadingFirstTime(false);
		}
	};

	const handleViewBookDetail = useCallback(async data => {
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
		}
	}, []);

	const handleViewCategoryDetail = async data => {
		try {
			await dispatch(getCategoryDetail(data.id)).unwrap();
			navigate(RouteLink.categoryDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='category__search__container'>
			{isLoadingFirstTime ? (
				<LoadingIndicator />
			) : (
				<>
					{listArrayCategory.length && activeKeyDefault === 'categories' ? (
						<InfiniteScroll
							dataLength={listArrayCategory.length}
							next={handleGetGroupSearch}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
						>
							{listArrayCategory.map(category => (
								<CategoryGroup
									key={`category-group-${category.id}`}
									list={category.books}
									title={category.name}
									data={category}
									handleViewBookDetail={handleViewBookDetail}
									handleViewCategoryDetail={handleViewCategoryDetail}
									inResult={true}
									inCategory
								/>
							))}
						</InfiniteScroll>
					) : (
						<ResultNotFound />
					)}
				</>
			)}
		</div>
	);
};

CategorySearch.propTypes = {
	reload: PropTypes.bool,
	setIsFetching: PropTypes.func,
	activeKeyDefault: PropTypes.string,
	searchResultInput: PropTypes.string,
	value: PropTypes.string,
	updateBooks: PropTypes.bool,
	isFetching: PropTypes.bool,
	setIsLoadingFirstTime: PropTypes.func,
};

export default CategorySearch;
