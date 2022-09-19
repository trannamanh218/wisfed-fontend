import ResultSearch from 'shared/results-search';
import SearchIcon from 'assets/icons/search.svg';
import classNames from 'classnames';
import { useState, useEffect, useCallback } from 'react';
import './header-search-mobile.scss';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getFilterSearch } from 'reducers/redux-utils/search';
import { NotificationError } from 'helpers/Error';
import PropTypes from 'prop-types';
import { useRef } from 'react';

function HeaderSearchMobile({ searchRef, isShowSearchMobile, setIsShowSearchMobile }) {
	const [valueInputSearch, setValueInputSearch] = useState('');
	const [filter, setFilter] = useState('');
	const [resultSearch, setResultSearch] = useState([]);
	const [renderResultSearchWrapper, setRenderResultSearchWrapper] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const inpSearchSmall = useRef(null);

	const onClickSearchIcon = () => {
		setIsShowSearchMobile(true);
		inpSearchSmall.current.focus();
	};

	const updateInputSearch = value => {
		if (value) {
			const filterValue = value.toLowerCase().trim();
			setFilter(JSON.stringify(filterValue));
		} else {
			setFilter('');
		}
	};

	useEffect(() => {
		let timeOut;
		if (isShowSearchMobile) {
			timeOut = setTimeout(() => {
				setRenderResultSearchWrapper(true);
			}, 150);
		} else {
			setRenderResultSearchWrapper(false);
		}
		return () => {
			clearTimeout(timeOut);
		};
	}, [isShowSearchMobile]);

	useEffect(async () => {
		const params = {
			q: filter,
		};
		try {
			if (valueInputSearch.length > 0) {
				const result = await dispatch(getFilterSearch({ ...params })).unwrap();
				setResultSearch(result);
			}
		} catch (err) {
			NotificationError(err);
		}
	}, [filter]);

	const debounceSearch = useCallback(_.debounce(updateInputSearch, 700), []);

	const handleChange = e => {
		debounceSearch(e.target.value);
		setValueInputSearch(e.target.value);
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter' && valueInputSearch.trim().length) {
			navigate(`/result/q=${valueInputSearch.trim()}`);
		}
	};

	return (
		<div className='header-search-small' ref={searchRef}>
			<div className='header-search-small__icon' onClick={onClickSearchIcon}>
				<img src={SearchIcon} alt='search-icon' />
			</div>
			<div
				className={classNames('header-search-small__input-wrapper', {
					'show': isShowSearchMobile,
				})}
			>
				<input
					ref={inpSearchSmall}
					placeholder='Tìm kiếm trên Wisfeed'
					value={valueInputSearch}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
				/>
			</div>
			<div className='header-search-small__block-end'></div>
			{isShowSearchMobile && renderResultSearchWrapper && (
				<ResultSearch
					setIsShow={setIsShowSearchMobile}
					valueInputSearch={valueInputSearch}
					resultSearch={resultSearch}
				/>
			)}
		</div>
	);
}

HeaderSearchMobile.propTypes = {
	searchRef: PropTypes.object,
	isShowSearchMobile: PropTypes.bool,
	setIsShowSearchMobile: PropTypes.func,
};

export default HeaderSearchMobile;
