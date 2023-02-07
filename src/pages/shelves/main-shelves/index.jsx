import { generateQuery } from 'helpers/Common';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
	getAllBooksInLibraries,
	getListBookLibrary,
	handleSetDefaultLibrary,
	updateLibrary,
} from 'reducers/redux-utils/library';
import PaginationGroup from 'shared/pagination-group';
import SearchField from 'shared/search-field';
import SelectBox from 'shared/select-box';
import Shelf from 'shared/shelf';
import SearchBook from './SearchBook';
import './main-shelves.scss';
import LoadingIndicator from 'shared/loading-indicator';
import { NotificationError } from 'helpers/Error';
import Button from 'shared/button';
import EyeIcon from 'shared/eye-icon';
import { toast } from 'react-toastify';

const DEFAULT_LIBRARY = { value: 'all', title: 'Tất cả', id: 'all' };

const MainShelves = ({ allLibraryList, shelveGroupName, isMyShelves, handleViewBookDetail, setRenderNotFound }) => {
	const [currentBooks, setCurrentBooks] = useState([]);
	const [currentLibrary, setCurrentLibrary] = useState({});
	const [filter, setFilter] = useState('[]');
	const [inputSearch, setInputSearch] = useState('');
	const [currentPage, setCurrentPage] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [totalPage, setTotalPage] = useState(0);
	const [isShowPublic, setIsShowPublic] = useState(true);
	const [isDisabledBtnStatus, setIsDisabledBtnStatus] = useState(false);

	const itemsPerPage = useRef(16).current;

	const { userId } = useParams();
	const dispatch = useDispatch();
	const { defaultLibraryRedux } = useSelector(state => state.library);

	const libraryList = !_.isEmpty(allLibraryList) ? [DEFAULT_LIBRARY].concat(allLibraryList) : [];

	useEffect(() => {
		if (!_.isEmpty(defaultLibraryRedux)) {
			setCurrentLibrary(defaultLibraryRedux);
		} else {
			setCurrentLibrary(DEFAULT_LIBRARY);
		}
	}, [defaultLibraryRedux]);

	useEffect(() => {
		if (!_.isEmpty(currentLibrary)) {
			getBooksInCurrentLibrary();
			setIsShowPublic(currentLibrary.display);
		}
	}, [currentLibrary, userId, filter, currentPage]);

	useEffect(() => {
		return () => {
			dispatch(handleSetDefaultLibrary({}));
		};
	}, []);

	const getBooksInCurrentLibrary = async () => {
		setIsLoading(true);
		const query = generateQuery(currentPage, itemsPerPage, filter);
		try {
			let data = { rows: [], count: 0 };
			if (currentLibrary.value === 'all') {
				data = await dispatch(getAllBooksInLibraries({ id: userId, ...query })).unwrap();
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
		dispatch(handleSetDefaultLibrary(data));
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

	const onChangePublic = async () => {
		setIsDisabledBtnStatus(true);
		try {
			const params = {
				id: currentLibrary.id,
				data: {
					display: !isShowPublic,
				},
			};
			await dispatch(updateLibrary(params)).unwrap();
			setIsShowPublic(!isShowPublic);
			toast.success('Đổi trạng thái tủ sách thành công', { toastId: 'update-status-library' });
		} catch (err) {
			NotificationError(err);
		} finally {
			setTimeout(() => setIsDisabledBtnStatus(false), 3500);
		}
	};

	return (
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
				<>
					<div className='main-shelves__filters'>
						<SelectBox
							name='library'
							list={libraryList}
							defaultOption={currentLibrary}
							onChangeOption={onChangeLibrary}
						/>
						{currentLibrary.id !== 'all' && (
							<Button
								onClick={onChangePublic}
								className='main-shelves__pane__public-btn'
								isOutline
								disabled={isDisabledBtnStatus}
							>
								<EyeIcon isPublic={isShowPublic} />
								{isShowPublic ? 'C' : 'Không c'}ông khai
							</Button>
						)}
					</div>

					{isLoading ? (
						<LoadingIndicator />
					) : (
						<>
							{isMyShelves !== undefined && (
								<>
									{filter !== '[]' ? (
										<SearchBook
											inputSearch={inputSearch}
											list={currentBooks}
											isMyShelves={isMyShelves}
											handleUpdateBookList={handleUpdateBookList}
											handleViewBookDetail={handleViewBookDetail}
										/>
									) : (
										<Shelf
											list={currentBooks}
											isMyShelves={isMyShelves}
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
				</>
			</div>
		</div>
	);
};

MainShelves.defaultProps = {
	allLibraryList: [],
	shelveGroupName: '',
	isMyShelves: true,
	setRenderNotFound: () => {},
};

MainShelves.propTypes = {
	allLibraryList: PropTypes.array,
	shelveGroupName: PropTypes.string,
	isMyShelves: PropTypes.bool,
	handleViewBookDetail: PropTypes.func,
	setRenderNotFound: PropTypes.func,
};

export default MainShelves;
