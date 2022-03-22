import { useFetchAuthLibraries } from 'api/library.hook';
import { generateQuery } from 'helpers/Common';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getAllBookInLirary, getListBookLibrary } from 'reducers/redux-utils/library';
import Button from 'shared/button';
import EyeIcon from 'shared/eye-icon';
import PaginationGroup from 'shared/pagination-group';
import SearchField from 'shared/search-field';
import SelectBox from 'shared/select-box';
import Shelf from 'shared/shelf';
import SearchBook from './SearchBook';
import './main-shelves.scss';

const DEFAULT_LIBRARY = { value: 'all', title: 'Tất cả', id: 'all' };

const MainShelves = ({ handleUpdateLibrary, isUpdate }) => {
	const [isPublic, setIsPublic] = useState(true);
	const [allBooks, setAllBooks] = useState({ rows: [], count: 0 });
	const [currentLibrary, setCurrentLibrary] = useState({ value: 'all', title: 'Tất cả', id: 'all' });
	const [filter, setFilter] = useState('[]');
	const [inputSearch, setInputSearch] = useState('');

	const params = useParams();
	const dispatch = useDispatch();

	const {
		library: { libraryData },
		auth: { userInfo = {} },
	} = useSelector(state => state);

	const libraryList = !_.isEmpty(libraryData.rows) ? [DEFAULT_LIBRARY].concat(libraryData.rows) : [];

	useEffect(() => {
		setCurrentLibrary(DEFAULT_LIBRARY);
		setFilter('[]');
		setInputSearch('');
	}, [params]);

	useFetchAuthLibraries();

	useEffect(() => {
		const isMount = true;
		if (isMount) {
			const fetchData = async () => {
				const query = generateQuery(1, 10, filter);
				const id = params.userId || userInfo.id;
				try {
					let data = { rows: [], count: 0 };
					if (currentLibrary.value === 'all') {
						data = await dispatch(getAllBookInLirary({ id, ...query })).unwrap();
					} else {
						data = await dispatch(getListBookLibrary({ id: currentLibrary.id, ...query })).unwrap();
					}

					setAllBooks(data);
				} catch (err) {
					return err;
				}
			};

			fetchData();
		}
	}, [currentLibrary, isUpdate, params, userInfo, filter]);

	const handlePublic = () => {
		setIsPublic(!isPublic);
	};

	const onChangeLibrary = data => {
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

	const checkAuthorize = () => {
		if (_.isEmpty(params)) {
			return true;
		} else {
			return userInfo.id === params.userId;
		}
	};

	return (
		<div className='main-shelves'>
			<h4>
				<Link to='/shelves/c09fdf39-2691-44f4-96d6-e45c8f2afd63'>Tủ sách của Nguyễn HIến Lê</Link>
			</h4>
			<div className='main-shelves__header'>
				<h4>Tủ sách của tôi</h4>
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
					{checkAuthorize() && (
						<Button className='btn-private' isOutline={true} onClick={handlePublic}>
							<EyeIcon isPublic={isPublic} handlePublic={handlePublic} />
							<span>{isPublic ? 'Công khai' : 'Không công khai'}</span>
						</Button>
					)}
				</div>

				{filter !== '[]' ? (
					<SearchBook
						inputSearch={inputSearch}
						list={allBooks.rows}
						isMyShelve={checkAuthorize()}
						handleUpdateLibrary={handleUpdateLibrary}
					/>
				) : (
					<Shelf
						list={allBooks.rows}
						isMyShelve={checkAuthorize()}
						handleUpdateLibrary={handleUpdateLibrary}
					/>
				)}

				{allBooks.count > 10 && <PaginationGroup />}
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
