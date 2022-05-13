import { TimeIcon, CloseIconX, Search } from 'components/svg';
import './results-search.scss';
import UserAvatar from 'shared/user-avatar';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
const ResultSearch = ({ valueInputSearch }) => {
	return (
		<div className='result__search__container'>
			<div className='result__search__main'>
				<div className='result__search__main__left'>
					<div className='result__search__icon__time'>
						<TimeIcon />
					</div>
					<div className='result__search__name'>Thương nhớ ở ai - Nguyễn Hiến Lê</div>
				</div>
				<div className='result__search__close'>
					<CloseIconX />
				</div>
			</div>
			<div className='result__search__main'>
				<div className='result__search__main__left'>
					<div className='result__search__main__avatar'>
						<UserAvatar size='sm' className='result__search__main__img' />
					</div>
					<div className='result__search__name'>Thương nhớ ở ai - Nguyễn Hiến Lê</div>
				</div>
				<div className='result__search__close'>
					<CloseIconX />
				</div>
			</div>
			<div className='result__search__main'>
				<div className='result__search__main__left'>
					<div className='result__search__main__avatar'>
						<UserAvatar size='sm' className='result__search__main__img' />
					</div>
					<div className='result__search__name'>Em là của hàng xóm</div>
				</div>
				<div className='result__search__close'>
					<CloseIconX />
				</div>
			</div>

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
};
export default ResultSearch;
