import { generateQuery } from 'helpers/Common';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAllBookInLirary, getListBookLibrary } from 'reducers/redux-utils/library';
import PaginationGroup from 'shared/pagination-group';
import SearchField from 'shared/search-field';
import SelectBox from 'shared/select-box';
import Shelf from 'shared/shelf';
import SearchBook from './SearchBook';
import './main-shelves.scss';
import LoadingIndicator from 'shared/loading-indicator';
import { NotificationError } from 'helpers/Error';

const DEFAULT_LIBRARY = { value: 'all', title: 'Tất cả', id: 'all' };

const MainShelves = ({ allLibraryList, shelveGroupName, isMyShelve, handleViewBookDetail, setRenderNotFound }) => {
	const [currentBooks, setCurrentBooks] = useState([]);
	const [currentLibrary, setCurrentLibrary] = useState(DEFAULT_LIBRARY);
	const [filter, setFilter] = useState('[]');
	const [inputSearch, setInputSearch] = useState('');
	const [currentPage, setCurrentPage] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [totalPage, setTotalPage] = useState(0);

	const itemsPerPage = useRef(16).current;

	const { userId } = useParams();
	const dispatch = useDispatch();

	const libraryList = !_.isEmpty(allLibraryList) ? [DEFAULT_LIBRARY].concat(allLibraryList) : [];

	useEffect(() => {
		getBooksInCurrentLibrary();
	}, [currentLibrary, userId, filter, currentPage]);

	const getBooksInCurrentLibrary = async () => {
		setIsLoading(true);
		const query = generateQuery(currentPage, itemsPerPage, filter);
		try {
			let data = { rows: [], count: 0 };
			if (currentLibrary.value === 'all') {
				data = await dispatch(getAllBookInLirary({ id: userId, ...query })).unwrap();
			} else {
				data = await dispatch(getListBookLibrary({ id: currentLibrary.id, ...query })).unwrap();
			}
			setCurrentBooks(data.rows);
			setTotalPage(Math.ceil(data.count / itemsPerPage));
		} catch (err) {
			setRenderNotFound(true);
			NotificationError(err);
		} finally {
			setIsLoading(false);
			window.scroll(0, 0);
		}
	};

	const onChangeLibrary = data => {
		setCurrentPage(0);
		setCurrentBooks([]);
		setCurrentLibrary(data);
	};

	const updateInputSearch = value => {
		if (value) {
			const filterValue = [];
			filterValue.push({ 'operator': 'search', 'value': value.trim(), 'property': 'name' });
			setFilter(JSON.stringify(filterValue));
			setCurrentPage(0);
		} else {
			setFilter('[]');
		}
	};

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 1000), []);

	const handleSearch = e => {
		setInputSearch(e.target.value);
		debounceSearch(e.target.value);
	};

	const changePage = pageIndex => {
		setCurrentPage(pageIndex);
	};

	const handleUpdateBookList = useCallback(() => {
		getBooksInCurrentLibrary();
	}, [currentBooks]);

	return (
		<>
			<div className='main-shelves'>
				<div className='main-shelves__header'>
					<h4>{shelveGroupName}</h4>
					<SearchField
						placeholder='Tìm kiếm sách'
						className='main-shelves__search'
						handleChange={handleSearch}
						value={inputSearch}
					/>
				</div>
				<div className='main-shelves__pane'>
					{isLoading ? (
						<LoadingIndicator />
					) : (
						<>
							<div className='main-shelves__filters'>
								<SelectBox
									name='library'
									list={libraryList}
									defaultOption={currentLibrary}
									onChangeOption={onChangeLibrary}
								/>
							</div>

							{isMyShelve !== undefined && (
								<>
									{filter !== '[]' ? (
										<SearchBook
											inputSearch={inputSearch}
											list={currentBooks}
											isMyShelve={isMyShelve}
											handleUpdateBookList={handleUpdateBookList}
											handleViewBookDetail={handleViewBookDetail}
										/>
									) : (
										<Shelf
											list={currentBooks}
											isMyShelve={isMyShelve}
											handleUpdateBookList={handleUpdateBookList}
											handleViewBookDetail={handleViewBookDetail}
											shelveGroupName={shelveGroupName}
										/>
									)}

									{totalPage > 1 && (
										<PaginationGroup
											totalPage={totalPage}
											currentPage={currentPage + 1}
											changePage={changePage}
										/>
									)}
								</>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
};

MainShelves.defaultProps = {
	allLibraryList: [],
	shelveGroupName: '',
	isMyShelve: true,
	setRenderNotFound: () => {},
};

MainShelves.propTypes = {
	allLibraryList: PropTypes.array,
	shelveGroupName: PropTypes.string,
	isMyShelve: PropTypes.bool,
	handleViewBookDetail: PropTypes.func,
	setRenderNotFound: PropTypes.func,
};

export default MainShelves;
