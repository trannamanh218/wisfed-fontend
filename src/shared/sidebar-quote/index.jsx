import MyShelvesList from 'shared/my-shelves-list';
import StatisticList from 'shared/statistic-list';
import './sidebar-quote.scss';
import TopicColumn from 'shared/topic-column';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SearchField from 'shared/search-field';
import { useState, useEffect, useCallback } from 'react';
import DualColumn from 'shared/dual-column';
import { getCountQuotesByCategory } from 'reducers/redux-utils/quote';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import { handleCategoryByQuotesName } from 'reducers/redux-utils/quote';
import { getAllLibraryList } from 'reducers/redux-utils/library';
import BookSlider from 'shared/book-slider';
import { getBookDetail, getBookAuthorList } from 'reducers/redux-utils/book';
import RouteLink from 'helpers/RouteLink';
import Circle from 'shared/loading/circle';

const SidebarQuote = ({ listHashtags, firstStyleQuotesSidebar, createdByOfCurrentQuote }) => {
	const [inputSearch, setInputSearch] = useState('');
	const [categoryList, setCategoryList] = useState([]);
	const [libraries, setLibraries] = useState({});
	const [booksAuthor, setBooksAuthor] = useState([]);
	const [isViewBookDetailLoading, setIsViewBookDetailLoading] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const myAllLibrary = useSelector(state => state.library.myAllLibrary);
	const userInfo = useSelector(state => state.auth.userInfo);
	const userDetail = useSelector(state => state.user.userDetail);

	useEffect(() => {
		if (!firstStyleQuotesSidebar) {
			getCountQuotesByCategoryData('');
		}

		if (createdByOfCurrentQuote) {
			if (firstStyleQuotesSidebar) {
				if (userInfo.id === createdByOfCurrentQuote) {
					setLibraries(myAllLibrary);
				} else {
					getAllLibrariesByUser();
				}
			} else {
				getlistBooksByAuthor();
			}
		}
	}, [myAllLibrary]);

	const getCountQuotesByCategoryData = async inputValue => {
		try {
			const params = {
				sort: JSON.stringify([{ property: 'countQuote', direction: 'DESC' }]),
				filter: JSON.stringify([{ operator: 'search', value: inputValue, property: 'name' }]),
			};
			const res = await dispatch(getCountQuotesByCategory({ params: params })).unwrap();
			setCategoryList(res);
		} catch (err) {
			NotificationError(err);
		}
	};

	const getAllLibrariesByUser = async () => {
		try {
			const data = { userId: createdByOfCurrentQuote };
			const res = await dispatch(getAllLibraryList(data)).unwrap();
			setLibraries(res);
		} catch (err) {
			NotificationError(err);
		}
	};

	const getlistBooksByAuthor = async () => {
		try {
			const data = {
				id: createdByOfCurrentQuote,
				limit: 10,
			};
			const res = await dispatch(getBookAuthorList(data)).unwrap();
			setBooksAuthor(res);
		} catch (error) {
			NotificationError(error);
		}
	};

	const debouncSearch = useCallback(
		_.debounce(inputValue => {
			getCountQuotesByCategoryData(inputValue);
		}, 700),
		[]
	);

	const handleSearchCategories = e => {
		setInputSearch(e.target.value);
		debouncSearch(e.target.value);
	};

	const filterQuotesByCategory = (categoryId, categoryName) => {
		dispatch(handleCategoryByQuotesName(categoryName));
		navigate(`/quotes/category/${categoryId}`);
	};

	const handleViewBookDetail = useCallback(async data => {
		setIsViewBookDetailLoading(true);
		try {
			await dispatch(getBookDetail(data.id)).unwrap();
			navigate(RouteLink.bookDetail(data.id, data.name));
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsViewBookDetailLoading(false);
		}
	}, []);

	return (
		<div className='sidebar-quote'>
			<Circle loading={isViewBookDetailLoading} />
			<>
				{!firstStyleQuotesSidebar ? (
					<div className='sidebar-quote__category-list'>
						<h4>Chủ đề Quotes</h4>
						<SearchField
							placeholder='Tìm kiếm danh mục'
							className='sidebar-quote__category-list__search'
							handleChange={handleSearchCategories}
							value={inputSearch}
						/>
						<DualColumn
							list={categoryList}
							pageText={true}
							inQuotes={true}
							filterQuotesByCategory={filterQuotesByCategory}
						/>
						<div className='sidebar-quote__author-books'>
							<BookSlider
								className='book-reference__slider'
								title={`Sách của ${userDetail.fullName || userDetail.firstName + userDetail.lastName}`}
								list={booksAuthor}
								handleViewBookDetail={handleViewBookDetail}
							/>
							<Link className='view-all-link' to={`/books-author/${createdByOfCurrentQuote}`}>
								Xem thêm
							</Link>
						</div>
					</div>
				) : (
					<>
						{!!listHashtags.length && (
							<TopicColumn
								className='sidebar-category__topics'
								title='Hashtag từ Quotes'
								topics={listHashtags}
							/>
						)}
						{!_.isEmpty(libraries) && (
							<>
								<StatisticList
									className='sidebar-quote__reading__status'
									title='Trạng thái đọc'
									background='light'
									isBackground={true}
									list={libraries.default}
									pageText={false}
								/>
								<MyShelvesList list={libraries.custom} />
							</>
						)}
					</>
				)}
			</>
		</div>
	);
};

SidebarQuote.defaultProps = {
	listHashtags: [],
	firstStyleQuotesSidebar: false,
	createdByOfCurrentQuote: null,
};

SidebarQuote.propTypes = {
	listHashtags: PropTypes.array,
	firstStyleQuotesSidebar: PropTypes.bool,
	createdByOfCurrentQuote: PropTypes.string,
};

export default SidebarQuote;
