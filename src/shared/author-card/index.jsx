import ConnectButtons from 'shared/connect-buttons';
import UserAvatar from 'shared/user-avatar';
import './author-card.scss';
import PropTypes from 'prop-types';
import Storage from 'helpers/Storage';
import Button from 'shared/button';
import { Add } from 'components/svg';
const AuthorCard = ({ direction, size, item, setModalShow }) => {
	return (
		<div className='author-card'>
			<div className='author-card__left'>
				<UserAvatar className='author-card__avatar' size={size} source={item.avatarImage || ''} />
				<div className='author-card__info'>
					<h5>{item.fullName || `${item.firstName} ${item.lastName}`}</h5>
					<p className='author-card__subtitle'>
						{item.numberFollowing} follow, {item.numFriends} bạn bè
					</p>
					{/* <p>Tác giả của cuốn sách cuốn theo chiều gió</p>
					<span>và 500 cuốn sách khác</span> */}
				</div>
			</div>
			<div className='author-card__right'>
				{Storage.getAccessToken() ? (
					<ConnectButtons direction={direction} item={item} />
				) : (
					<div className={`connect-buttons ${'column'}`}>
						<Button className='connect-button' onClick={() => setModalShow(true)}>
							<Add className='connect-button__icon' />

							<span className='connect-button__content'>Kết bạn</span>
						</Button>
						<Button
							className=' connect-button follow'
							isOutline={true}
							name='friend'
							onClick={() => setModalShow(true)}
						>
							<span className='connect-button__content follow'>Theo dõi </span>
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

AuthorCard.propTypes = {
	direction: PropTypes.string,
	size: PropTypes.string,
	item: PropTypes.object,
	setModalShow: PropTypes.func,
};

export default AuthorCard;
