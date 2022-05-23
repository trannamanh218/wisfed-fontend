import { TimeIcon, CloseIconX, Search } from 'components/svg';
import './results-search.scss';
import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Storage from 'helpers/Storage';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResultSearch = ({ valueInputSearch, resultSearch, setIsShow }) => {
	const [checkRenderStorage, setCheckRenderStorage] = useState(false);
	const [saveLocalSearch, setSaveLoacalSearch] = useState([]);
	const [directClick, setDirectClick] = useState(false);
	const navigate = useNavigate();

	const handleDeleteItem = id => {
		const filterResult = saveLocalSearch.filter(item => item.id !== id);
		Storage.setItem('result', JSON.stringify(filterResult));
		setCheckRenderStorage(!checkRenderStorage);
	};

	useEffect(() => {
		const getDataLocal = JSON.parse(Storage.getItem('result'));
		if (getDataLocal) {
			setSaveLoacalSearch(getDataLocal.reverse());
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
		const newArr = saveLocalSearch?.filter(data => data.id === item.id);
		if (!newArr.length) {
			setSaveLoacalSearch(prev => [...prev, item]);
			setDirectClick(true);
		} else {
			directItem(item);
		}
	};

	useEffect(() => {
		if (!!saveLocalSearch.length && directClick) {
			if (saveLocalSearch.length < 9) {
				Storage.setItem('result', JSON.stringify(saveLocalSearch));
				const item = saveLocalSearch.reverse()[0];
				directItem(item);
			} else {
				const filterData = saveLocalSearch.filter((item, index) => index !== 0);
				Storage.setItem('result', JSON.stringify(filterData.reverse()));
				const item = saveLocalSearch.reverse()[0];
				directItem(item);
			}
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
				</div>
			);
		} else {
			return <div className='history__search'>Không có tìm kiếm nào gần đây</div>;
		}
	};

	return (
		<>
			<div className='result__search__container'>
				{valueInputSearch ? (
					<>
						{resultSearch.book?.rows.map(item => (
							<div key={item.id} onClick={() => handleItem(item)} className='result__search__main'>
								<div className='result__search__main__left'>
									<div className='result__search__icon__time'>
										<TimeIcon />
									</div>
									<div className='result__search__name'>{item.name}</div>
								</div>
							</div>
						))}
						{resultSearch.users?.rows.map(item => (
							<div key={item.id} className='result__search__main'>
								<div onClick={() => handleItem(item)} className='result__search__main__left'>
									<div className='result__search__main__avatar'>
										<UserAvatar size='sm' className='result__search__main__img' />
									</div>
									<div className='result__search__name'>
										{item.fullName || (
											<p>
												{item.firstName} {item.lastName}
											</p>
										)}
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
		</>
	);
};
ResultSearch.propTypes = {
	valueInputSearch: PropTypes.string,
	resultSearch: PropTypes.object,
	setIsShow: PropTypes.func,
};
export default ResultSearch;
