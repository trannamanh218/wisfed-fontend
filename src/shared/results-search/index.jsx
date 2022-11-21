import { TimeIcon, CloseIconX, Search } from 'components/svg';
import './results-search.scss';
import defaultAvatar from 'assets/icons/defaultLogoAvatar.svg';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookImage from 'assets/images/default-book.png';

const ResultSearch = ({ valueInputSearch, resultSearch, setIsShow }) => {
	const [checkRenderStorage, setCheckRenderStorage] = useState(false);
	const [saveLocalSearch, setSaveLocalSearch] = useState([]);
	const [directClick, setDirectClick] = useState(false);
	const navigate = useNavigate();

	const handleDeleteItem = id => {
		const filterResult = saveLocalSearch.filter(item => item.id !== id);
		localStorage.setItem('result', JSON.stringify(filterResult));
		setCheckRenderStorage(!checkRenderStorage);
	};

	useEffect(() => {
		const getDataLocal = JSON.parse(localStorage.getItem('result'));
		if (getDataLocal) {
			setSaveLocalSearch(getDataLocal);
		}
	}, [checkRenderStorage]);

	const directItem = item => {
		if (item.fullName || item.firstName) {
			navigate(`/profile/${item.id}`);
		} else {
			navigate(`/book/detail/${item.id}`);
		}
		setIsShow(false);
	};

	const handleItem = item => {
		if (!saveLocalSearch.some(data => data.id === item.id)) {
			saveLocalSearch.unshift(item);
			setSaveLocalSearch(saveLocalSearch.slice(0, 8));
			setDirectClick(true);
		} else {
			directItem(item);
		}
	};

	useEffect(() => {
		if (!!saveLocalSearch.length && directClick) {
			localStorage.setItem('result', JSON.stringify(saveLocalSearch));
			directItem(saveLocalSearch[0]);
		}
	}, [directClick]);

	const historySearch = () => {
		return saveLocalSearch?.map(item => (
			<div key={item.id} className='result__search__main'>
				<div onClick={() => directItem(item)} className='result__search__main__left'>
					<div className='result__search__icon__time'>
						<TimeIcon />
					</div>
					<div className='result__search__name'>{item.name || item.fullName || item.firstName}</div>
				</div>
				{renderDeleteCloseIcon(item.id)}
			</div>
		));
	};

	const renderDeleteCloseIcon = index => {
		return (
			<div onClick={() => handleDeleteItem(index)} className='result__search__close'>
				<CloseIconX />
			</div>
		);
	};

	const renderSetting = () => {
		if (saveLocalSearch.length > 0) {
			return (
				<div className='search__all__main__title'>
					<div className='search__all__title'>Tìm kiếm gần đây </div>
					<br />
				</div>
			);
		} else {
			return (
				<div className='history__search'>
					Không có tìm kiếm nào gần đây
					<br />
				</div>
			);
		}
	};

	return (
		<div className='result__search__container'>
			{valueInputSearch ? (
				<>
					{resultSearch.books?.slice(0, 5).map(item => (
						<div key={item.id} onClick={() => handleItem(item)} className='result__search__main'>
							<div className='result__search__main__left'>
								<div className='result__search__icon__time'>
									<img
										src={item?.frontBookCover || item?.images[0] || bookImage}
										className='result__search__img'
										onError={e => e.target.setAttribute('src', `${bookImage}`)}
									/>
								</div>
								<div className='result__search__name'>{item.name}</div>
							</div>
						</div>
					))}
					{resultSearch.users?.slice(0, 3).map(item => (
						<div key={item.id} className='result__search__main'>
							<div onClick={() => handleItem(item)} className='result__search__main__left'>
								<div className='result__search__icon__time'>
									<img
										src={item?.avatarImage || defaultAvatar}
										className='result__search__img'
										onError={e => e.target.setAttribute('src', defaultAvatar)}
									/>
								</div>
								<div className='result__search__name'>
									{item.fullName || `${item.firstName} ${item.lastName}`}
								</div>
							</div>
						</div>
					))}
				</>
			) : (
				<>
					{renderSetting()}
					{historySearch()}
				</>
			)}

			{valueInputSearch?.length > 0 && (
				<Link to={`/result/q=${valueInputSearch}`} className='result__search__value'>
					<div className='result__search__icon'>
						<Search />
					</div>
					<div className='result__search__value__input'>Tìm kiếm {valueInputSearch}</div>
				</Link>
			)}
		</div>
	);
};

ResultSearch.propTypes = {
	valueInputSearch: PropTypes.string,
	resultSearch: PropTypes.any,
	setIsShow: PropTypes.func,
};

export default ResultSearch;
