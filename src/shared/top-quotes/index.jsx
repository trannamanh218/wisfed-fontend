import QuoteActionBar from 'shared/quote-action-bar';
import UserAvatar from 'shared/user-avatar';
import './top-quotes.scss';
import PropTypes from 'prop-types';

const TopQuotesComponent = ({ item }) => {
	return (
		<div className='top__quotes__container'>
			<div className='top__quotes__description'>{item.quote}</div>
			<div className='top__quotes__author'>{item.authorName}</div>
			<div className='top__quotes__footer'>
				<div className='top__quotes__info'>
					<div className='quote-card__author__avatar'>
						<UserAvatar size='sm' source={item.user.avatarImage} />
					</div>
					<div className='quote-card__author__detail'>
						<p className='quote-card__author__detail__text'>Quotes tạo bởi</p>
						<p className='quote-card__author__detail__name'>{item.user.fullName}</p>
					</div>
				</div>
				<QuoteActionBar />
			</div>
		</div>
	);
};
TopQuotesComponent.propTypes = {
	item: PropTypes.array,
};
export default TopQuotesComponent;
