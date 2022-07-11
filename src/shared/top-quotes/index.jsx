import QuoteActionBar from 'shared/quote-action-bar';
import UserAvatar from 'shared/user-avatar';
import './top-quotes.scss';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const TopQuotesComponent = ({ item }) => {
	const navigate = useNavigate();
	const onClickRedirectToAuthor = data => {
		const id = data.createdBy || data.user.id;
		navigate(`/profile/${id}`);
	};
	return (
		<div className='top__quotes__container'>
			<div className='top__quotes__description'>{item.quote}</div>
			<div className='top__quotes__author'>{item.authorName}</div>
			<div className='top__quotes__footer'>
				<div className='top__quotes__info'>
					<div className='quote-card__author__avatar' onClick={() => onClickRedirectToAuthor(item)}>
						<UserAvatar size='sm' source={item.user.avatarImage} />
					</div>
					<div className='quote-card__author__detail'>
						<p className='quote-card__author__detail__text'>Quotes tạo bởi</p>
						<p className='quote-card__author__detail__name' onClick={() => onClickRedirectToAuthor(item)}>
							{item?.user?.fullName || item?.user?.firstName + ' ' + item?.user?.lastName}
						</p>
					</div>
				</div>
				<QuoteActionBar data={item} />
			</div>
		</div>
	);
};
TopQuotesComponent.propTypes = {
	item: PropTypes.array,
};
export default TopQuotesComponent;
