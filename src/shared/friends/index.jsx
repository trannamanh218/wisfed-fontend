import Button from 'shared/button';
import PropTypes from 'prop-types';
import avatarFriends from 'assets/images/avatarFriends.png';
import './friends.scss';
import { Subtract } from 'components/svg';

const FriendsItem = ({ list }) => {
	return (
		<div className='myfriends__layout'>
			<img className='myfriends__layout__img' src={avatarFriends} alt='' />
			<div className='myfriends__star'>
				<div className='myfriends__star__name'>{list.userTwo.fullName}</div>
				{list.isStar && <Subtract />}
			</div>
			<div className='myfriends__button__container'>
				{list.isFriends ? (
					<Button className='myfriends__button' isOutline={false} name='friend'>
						<span className='myfriends__button__content'>Hủy kết bạn</span>
					</Button>
				) : list.isPending ? (
					<Button className='myfriends__button' isOutline={false} name='friend'>
						<span className='myfriends__button__content'> Đã gửi lời mời</span>
					</Button>
				) : (
					<Button className='myfriends__button' isOutline={false} name='friend'>
						<span className='myfriends__button__content'>Kết bạn</span>
					</Button>
				)}

				{list.isFollow ? (
					<Button className='myfriends__button' isOutline={true} name='friend'>
						<span className='myfriends__button__content'>Hủy theo dõi</span>
					</Button>
				) : (
					<Button className='myfriends__button' isOutline={true} name='friend'>
						<span className='myfriends__button__content'>Theo dõi</span>
					</Button>
				)}
			</div>
		</div>
	);
};

FriendsItem.propTypes = {
	list: PropTypes.object,
};
export default FriendsItem;
