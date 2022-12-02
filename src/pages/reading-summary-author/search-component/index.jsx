import { useState, useCallback, useEffect } from 'react';
import SearchField from 'shared/search-field';
import _ from 'lodash';
import LoadingIndicator from 'shared/loading-indicator';
import { useDispatch } from 'react-redux';
import { getFilterSearch } from 'reducers/redux-utils/search';
import { useNavigate } from 'react-router-dom';
import bookImage from 'assets/images/default-book.png';
import { TimeIcon } from 'components/svg';
import Storage from 'helpers/Storage';
import PropTypes from 'prop-types';

export default function BookAuthorChartSearch({ searchValue, setSearchValue, setBooksId, setShow }) {
	const [resultSearch, setResultSearch] = useState([]);
	const [filter, setFilter] = useState('');
	const [localStorage, setLocalStorage] = useState([]);
	const [checkRenderStorage, setCheckRenderStorage] = useState(false);
	const [loadingBooksList, setLoadingBooksList] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(async () => {
		const params = {
			q: filter,
		};
		try {
			if (searchValue.length > 0) {
				const result = await dispatch(getFilterSearch({ ...params })).unwrap();
				setResultSearch(result.books);
			} else {
				setResultSearch([]);
			}
		} catch (err) {
			return;
		} finally {
			setLoadingBooksList(false);
		}
	}, [filter]);

	useEffect(() => {
		const dataLocal = Storage.getItem('result-book-author');
		if (dataLocal) {
			const getDataLocal = JSON.parse(Storage.getItem('result-book-author'));
			setLocalStorage(getDataLocal);
		}
	}, [checkRenderStorage]);

	const handleChange = e => {
		setSearchValue(e.target.value);
		if (e.target.value && JSON.stringify(e.target.value) !== filter) {
			setLoadingBooksList(true);
			debounceSearch(e.target.value);
		} else {
			setLoadingBooksList(false);
		}
	};

	const updateInputSearch = value => {
		if (value) {
			const filterValue = value.toLowerCase().trim();
			setFilter(JSON.stringify(filterValue));
		} else {
			setFilter('');
		}
	};

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 700), []);

	const handleClickBooks = item => {
		setBooksId(item.id);
		// Thay đổi localStorage
		const dataLocal = Storage.getItem('result-book-author');
		if (dataLocal) {
			const getDataLocal = JSON.parse(Storage.getItem('result-book-author'));
			if (getDataLocal && !getDataLocal.some(data => data.id === item.id)) {
				getDataLocal.unshift(item);
				Storage.setItem('result-book-author', JSON.stringify(getDataLocal.slice(0, 5)));
			}
		} else {
			Storage.setItem('result-book-author', JSON.stringify([item]));
		}
		setSearchValue('');
		setCheckRenderStorage(!checkRenderStorage);
		navigate(`/book-author-charts/${item.id}`);
		setShow(true);
	};

	return (
		<div className='book__author__charts__search__main'>
			<div className='book__author__charts__search__main__container'>
				<SearchField placeholder='Tìm kiếm tên sách' handleChange={handleChange} value={searchValue} />

				{searchValue ? (
					<>
						{loadingBooksList ? (
							<div style={{ marginTop: '15px' }}>
								<LoadingIndicator />
							</div>
						) : (
							<>
								{resultSearch.length > 0 ? (
									<div className='book__author__charts__search'>
										{resultSearch.slice(0, 5).map(item => (
											<div
												key={item.id}
												onClick={() => handleClickBooks(item)}
												className='result__search__main__left'
											>
												<img
													className='result__search__book-cover'
													src={item.frontBookCover || item.images[0] || bookImage}
													alt='book-cover'
													onError={e => e.target.setAttribute('src', `${bookImage}`)}
												/>

												<div className='result__search__name'>{item.name}</div>
											</div>
										))}
									</div>
								) : (
									<div className='chart__history__titles'>Không có dữ liệu</div>
								)}
							</>
						)}
					</>
				) : (
					<>
						{localStorage.length ? (
							<div className='book__author__charts__search'>
								<div className='chart__history__title'>Tìm kiếm gần đây</div>
								{localStorage.map(item => (
									<div
										key={item.id}
										onClick={() => handleClickBooks(item)}
										className='result__search__main__left'
									>
										<div className='result__search__icon__time'>
											<TimeIcon />
										</div>

										<div className='result__search__name'>{item.name}</div>
									</div>
								))}
							</div>
						) : (
							<div className='chart__history__titles'>Không có tìm kiếm nào gần đây</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}

BookAuthorChartSearch.defaultProps = {
	searchValue: '',
	setSearchValue: () => {},
	setBooksId: () => {},
	setShow: () => {},
};

BookAuthorChartSearch.propTypes = {
	searchValue: PropTypes.string,
	setSearchValue: PropTypes.func,
	setBooksId: PropTypes.func,
	setShow: PropTypes.func,
};
