import { generateQuery } from 'helpers/Common';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getLibraryList, getListBookLibrary } from 'reducers/redux-utils/library';
import Button from 'shared/button';
import EyeIcon from 'shared/eye-icon';
import PaginationGroup from 'shared/pagination-group';
import SearchField from 'shared/search-field';
import SelectBox from 'shared/select-box';
import Shelf from 'shared/shelf';
import './main-shelves.scss';

const MainShelves = () => {
	const [isPublic, setIsPublic] = useState(true);
	const [allBooks, setAllBooks] = useState({ rows: [], count: 0 });
	const [currentLibrary, setCurrentLibrary] = useState({ value: 'all', title: 'Tất cả' });
	const [filter, setFilter] = useState('[]');
	const [inputSearch, setInputSearch] = useState('');
	const [isUpdate, setIsUpdate] = useState(false);
	const [listLibrary, setListLibrary] = useState();
	// const { books: searchResults } = useFetchBooks(1, 10, filter);

	const params = useParams();
	const dispatch = useDispatch();

	const {
		library: {
			libraryData: { rows: authLibraryList = [] },
			otherLibraryData: { rows: otherLibraryList = [] },
		},
		auth: { userInfo = {} },
	} = useSelector(state => state);

	useEffect(() => {
		if (params.id && params.id !== userInfo.id) {
			const data = !_.isEmpty(otherLibraryList)
				? [{ value: 'all', title: 'Tất cả' }].concat(
						otherLibraryList.map(item => ({ ...item, title: item.name, value: item.id }))
				  )
				: [];
			setListLibrary(data);
		} else {
			const data = !_.isEmpty(authLibraryList)
				? [{ value: 'all', title: 'Tất cả' }].concat(
						authLibraryList.map(item => ({ ...item, title: item.name, value: item.id }))
				  )
				: [];
			setListLibrary(data);
		}
	}, [params]);

	useEffect(() => {
		const isMount = true;
		if (isMount) {
			const fetchData = async () => {
				const filter = [];

				if (_.isEmpty(params) && !_.isEmpty(userInfo) && currentLibrary.value === 'all') {
					filter.push({ 'operator': 'eq', 'value': userInfo.id, 'property': 'updatedBy' });
				}

				if (!_.isEmpty(params)) {
					filter.push({ 'operator': 'eq', 'value': params.id, 'property': 'updatedBy' });
				}

				if (currentLibrary.value !== 'all') {
					filter.push({ 'operator': 'eq', 'value': currentLibrary.value, 'property': 'libraryId' });
				}

				const query = generateQuery(1, 10, JSON.stringify(filter));
				try {
					const data = await dispatch(getListBookLibrary(query)).unwrap();
					if (params.id && params.id !== userInfo.id) {
						const queryLibrary = generateQuery(
							1,
							10,
							JSON.stringify([{ 'operator': 'eq', 'value': params.id, 'property': 'createdBy' }])
						);
						await dispatch(getLibraryList({ isAuth: false, ...queryLibrary }));
					}
					setAllBooks(data);
				} catch (err) {
					return err;
				}
			};

			fetchData();
		}
	}, [currentLibrary, isUpdate, params]);

	const handlePublic = () => {
		setIsPublic(!isPublic);
	};

	const onChangeLibrary = data => {
		setCurrentLibrary(data);
	};

	const updateInputSearch = value => {
		setInputSearch(value);

		if (value) {
			const filterValue = [{ 'operator': 'eq', 'value': userInfo.id, 'property': 'categoryId' }];
			filterValue.push({ 'operator': 'search', 'value': value.trim(), 'property': 'name' });
			setFilter(JSON.stringify(filterValue));
		} else {
			setFilter('[]');
		}
	};

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 1000), []);

	const handleSearch = e => {
		debounceSearch(e.target.value);
	};

	const handleRemoveBook = () => {
		setIsUpdate(!isUpdate);
	};

	const checkAuthorize = () => {
		if (_.isEmpty(params)) {
			return true;
		} else {
			return userInfo.id === params.id;
		}
	};

	return (
		<div className='main-shelves'>
			<h4>
				<Link to='/shelves/c09fdf39-2691-44f4-96d6-e45c8f2afd63'>Tủ sách của Nguyễn HIến Lê</Link>
			</h4>
			<div className='main-shelves__header'>
				<h4>Tủ sách của tôi</h4>
				<SearchField placeholder='Tìm kiếm sách' className='main-shelves__search' handleChange={handleSearch} />
			</div>
			<div className='main-shelves__pane'>
				<div className='main-shelves__filters'>
					<SelectBox
						name='library'
						list={listLibrary}
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
				{/* <SearchBook/> */}
				<Shelf list={allBooks.rows} isMyShelve={checkAuthorize()} handleRemoveBook={handleRemoveBook} />
				{allBooks.count > 10 && <PaginationGroup />}
			</div>
		</div>
	);
};

MainShelves.propTypes = {};

export default MainShelves;
