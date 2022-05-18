import { TimeIcon, CloseIconX, Search } from 'components/svg';
import './results-search.scss';
// import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Storage from 'helpers/Storage';
import UserAvatar from 'shared/user-avatar';

const ResultSearch = ({ valueInputSearch, resultSearch, setRenderHistorySearch, renderHistorySearch }) => {
	const resultValue = JSON.parse(Storage.getItem('result'));

	const handleDeleteItem = index => {
		const filterResult = resultValue.filter((item, idx) => index !== idx);
		Storage.setItem('result', JSON.stringify(filterResult));
		setRenderHistorySearch(!renderHistorySearch);
	};

	const renderDeleteCloseIcon = index => {
		return (
			<div onClick={() => handleDeleteItem(index)} className='result__search__close'>
				<CloseIconX />
			</div>
		);
	};

	const handleLinkItem = item => {
		console.log(item);
	};

	const historySearch = () => {
		return resultValue?.map((item, index) => (
			<div key={item.id} className='result__search__main'>
				<div className='result__search__main__left'>
					<div className='result__search__icon__time'>
						<TimeIcon />
					</div>
					<div className='result__search__name'>{item}</div>
				</div>
				{renderDeleteCloseIcon(index)}
			</div>
		));
	};

	const renderSetting = () => {
		if (!valueInputSearch && resultValue?.length > 0) {
			return (
				<div className='search__all__main__title'>
					<div className='search__all__title'>Tìm kiếm gần đây </div>
					<div className='search__all__title__editing'>Chỉnh sửa</div>
				</div>
			);
		} else if (!valueInputSearch) {
			return <div className='history__search'>Không có tìm kiếm nào gần đây</div>;
		}
	};

	return (
		<>
			{renderSetting()}
			<div className='result__search__container'>
				{valueInputSearch ? (
					<>
						{resultSearch.books?.slice(0, 5).map(item => (
							<div key={item.id} onClick={() => handleLinkItem(item)} className='result__search__main'>
								<Link to={`/book/detail/${item.id}`} className='result__search__main__left'>
									<div className='result__search__icon__time'>
										<TimeIcon />
									</div>
									<div className='result__search__name'>{item.name}</div>
								</Link>
							</div>
						))}
						{resultSearch.users?.slice(0, 5).map(item => (
							<div key={item.id} className='result__search__main'>
								<Link
									to={`/profile/${item.id}`}
									onClick={() => handleLinkItem(item)}
									className='result__search__main__left'
								>
									{item.avatarImage ? (
										<div className='result__search__main__avatar'>
											<UserAvatar size='sm' className='result__search__main__img' />
										</div>
									) : (
										<div className='result__search__icon__time'>
											<TimeIcon />
										</div>
									)}
									<div className='result__search__name'>
										{item.fullName || (
											<p>
												{item.firstName} {item.lastName}
											</p>
										)}
									</div>
								</Link>
							</div>
						))}
					</>
				) : (
					historySearch()
				)}

				{valueInputSearch?.length > 0 && (
					<Link to={`/result/${valueInputSearch}`} className='result__search__value'>
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
	setRenderHistorySearch: PropTypes.func,
	renderHistorySearch: PropTypes.bool,
};
export default ResultSearch;
