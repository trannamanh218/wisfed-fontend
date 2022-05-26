import './category-search.scss';
import CategoryGroup from 'shared/category-group';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBookDetail } from 'reducers/redux-utils/book';
import { NotificationError } from 'helpers/Error';
import RouteLink from 'helpers/RouteLink';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import { getFilterSearchAuth, getFilterSearch } from 'reducers/redux-utils/search';
import { useEffect, useState, useRef, useCallback } from 'react';
import Storage from 'helpers/Storage';
import LoadingIndicator from 'shared/loading-indicator';
import { getCategoryDetail } from 'reducers/redux-utils/category';

const CategorySearch = ({
	value,
	reload,
	setIsFetching,
	searchResultInput,
	activeKeyDefault,
	updateBooks,
	isFetching,
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [listArrayCategory, setListArrayCategory] = useState([]);
	const { isShowModal } = useSelector(state => state.search);
	const [hasMore, setHasMore] = useState(true);
	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	useEffect(() => {
		if (activeKeyDefault === 'categories') {
			setListArrayCategory([]);
			callApiStart.current = 0;
			setHasMore(true);
		}
	}, [reload, updateBooks, isShowModal, activeKeyDefault]);

	useEffect(() => {
		if (
			activeKeyDefault === 'categories' &&
			callApiStart.current === 0 &&
			listArrayCategory.length === 0 &&
			searchResultInput.length > 0
		) {
			handleGetGroupSearch();
		}
	}, [callApiStart.current, value, isShowModal, listArrayCategory]);

	const handleGetGroupSearch = async () => {
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
					setListArrayCategory(listArrayCategory.concat(result.rows));
				} else {
					setHasMore(false);
				}
			} else {
				const result = await dispatch(getFilterSearch(params)).unwrap();
				if (result.rows.length > 0) {
					callApiStart.current += callApiPerPage.current;
					setListArrayCategory(listArrayCategory.concat(result.rows));
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

	const handleViewBookDetail = useCallback(async data => {
		setIsFetching(true);
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			setIsFetching(false);
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
		}
	}, []);

	const viewCategoryDetail = async data => {
		try {
			await dispatch(getCategoryDetail(data.id)).unwrap();

			navigate(RouteLink.categoryDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
		}
	};

	return (
		<div className='category__search__container'>
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
						handleClick={viewCategoryDetail}
					/>
				))}
			</InfiniteScroll>
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
};
export default CategorySearch;
