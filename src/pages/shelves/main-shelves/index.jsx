import { useFetchAuthLibraries } from 'api/library.hook';
import { generateQuery } from 'helpers/Common';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAllBookInLirary, getListBookLibrary } from 'reducers/redux-utils/library';
import Button from 'shared/button';
import EyeIcon from 'shared/eye-icon';
import PaginationGroup from 'shared/pagination-group';
import SearchField from 'shared/search-field';
import SelectBox from 'shared/select-box';
import Shelf from 'shared/shelf';
import SearchBook from './SearchBook';
import './main-shelves.scss';
import { getUserDetail } from 'reducers/redux-utils/user';

const DEFAULT_LIBRARY = { value: 'all', title: 'Tất cả', id: 'all' };

const MainShelves = ({ handleUpdateLibrary, isUpdate }) => {
	const [isPublic, setIsPublic] = useState(true);
	const [allBooks, setAllBooks] = useState({ rows: [], count: 0 });
	const [currentBooks, setCurrentBooks] = useState([]);
	const [currentLibrary, setCurrentLibrary] = useState({ value: 'all', title: 'Tất cả', id: 'all' });
	const [filter, setFilter] = useState('[]');
	const [inputSearch, setInputSearch] = useState('');
	const [shelveName, setShelveName] = useState('');
	const [isMyShelve, setIsMyShelve] = useState();
	const [currentPage, setCurrentPage] = useState(0);

	const itemsPerPage = useRef(16).current;

	const { userId } = useParams();
	const dispatch = useDispatch();

	const {
		library: { libraryData },
		auth: { userInfo = {} },
	} = useSelector(state => state);

	const libraryList = !_.isEmpty(libraryData.rows) ? [DEFAULT_LIBRARY].concat(libraryData.rows) : [];

	useEffect(async () => {
		if (!_.isEmpty(userInfo)) {
			if (userId !== userInfo.id) {
				const user = await dispatch(getUserDetail(userId)).unwrap();
				setShelveName(`Tủ sách của ${user.fullName}`);
				setIsMyShelve(false);
			} else {
				setShelveName('Tủ sách của tôi');
				setIsMyShelve(true);
			}
		}
	}, [userInfo, userId]);

	useFetchAuthLibraries();

	useEffect(() => {
		fetchData();
	}, [currentLibrary, isUpdate, userId, filter]);

	const fetchData = async () => {
		const query = generateQuery(1, 10, filter);
		try {
			let data = { rows: [], count: 0 };
			if (currentLibrary.value === 'all') {
				data = await dispatch(getAllBookInLirary({ id: userId, ...query })).unwrap();
			} else {
				data = await dispatch(getListBookLibrary({ id: currentLibrary.id, ...query })).unwrap();
			}
			setAllBooks(data);
		} catch (err) {
			return err;
		}
	};

	const handlePublic = () => {
		setIsPublic(!isPublic);
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

	useEffect(() => {
		if (allBooks.rows.length > 0) {
			window.scroll(0, 0);
			setCurrentBooks(allBooks.rows.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage));
		}
	}, [currentPage, allBooks]);

	return (
		<div className='main-shelves'>
			<div className='main-shelves__header'>
				<h4>{shelveName}</h4>
				<SearchField
					placeholder='Tìm kiếm sách'
					className='main-shelves__search'
					handleChange={handleSearch}
					value={inputSearch}
				/>
			</div>
			<div className='main-shelves__pane'>
				<div className='main-shelves__filters'>
					<SelectBox
						name='library'
						list={libraryList}
						defaultOption={currentLibrary}
						onChangeOption={onChangeLibrary}
					/>
					{isMyShelve && (
						<Button className='btn-private' isOutline={true} onClick={handlePublic}>
							<EyeIcon isPublic={isPublic} handlePublic={handlePublic} />
							<span>{isPublic ? 'Công khai' : 'Không công khai'}</span>
						</Button>
					)}
				</div>

				{filter !== '[]' ? (
					<SearchBook
						inputSearch={inputSearch}
						list={currentBooks}
						isMyShelve={isMyShelve}
						handleUpdateLibrary={handleUpdateLibrary}
					/>
				) : (
					<Shelf list={currentBooks} isMyShelve={isMyShelve} handleUpdateLibrary={handleUpdateLibrary} />
				)}

				{allBooks.count > itemsPerPage && (
					<PaginationGroup
						totalPage={Math.ceil(allBooks.count / itemsPerPage)}
						currentPage={currentPage + 1}
						changePage={changePage}
					/>
				)}
			</div>
		</div>
	);
};

MainShelves.defaultProps = {
	isUpdate: false,
	handleUpdateLibrary: () => {},
};

MainShelves.propTypes = {
	isUpdate: PropTypes.bool,
	handleUpdateLibrary: PropTypes.func,
};

export default MainShelves;
