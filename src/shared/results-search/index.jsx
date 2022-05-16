import { TimeIcon, CloseIconX, Search } from 'components/svg';
import './results-search.scss';
// import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Storage from 'helpers/Storage';
const ResultSearch = ({ valueInputSearch, resultSearch }) => {
	// const resultValue = JSON.parse(Storage.getItem('result'));
	const handleDeleteItem = id => {};

	const renderDeleteCloseIcon = id => {
		return (
			<div onClick={handleDeleteItem(id)} className='result__search__close'>
				<CloseIconX />
			</div>
		);
	};

	return (
		<div className='result__search__container'>
			<>
				{resultSearch.books?.slice(0, 5).map(item => (
					<div key={item.id} className='result__search__main'>
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
						<Link to={`/profile/${item.id}`} className='result__search__main__left'>
							<div className='result__search__icon__time'>
								<TimeIcon />
							</div>
							{/* <div className='result__search__main__avatar'>
							<UserAvatar size='sm' className='result__search__main__img' />
						</div> */}
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

			{valueInputSearch.length > 0 && (
				<Link to={'/result'} className='result__search__value'>
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
	resultSearch: PropTypes.object,
};
export default ResultSearch;
