import PopupInviteFriend from 'pages/group-page/popup-group/popupInviteFriend';

const ItemInviteFriend = () => {
	return (
		<div className='list-friend'>
			<div className='friend-item'>
				<img
					src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
					alt='image'
				/>
				<label htmlFor='1'>Hoàng Thiên Quân</label>
				<input type='checkbox' id='1' />
			</div>
		</div>
	);
};
export default {
	title: 'Components/Modules/PopupCreatGroup',
	component: PopupInviteFriend,
};

const Template = agr => (
	<div>
		<PopupInviteFriend {...agr} />
	</div>
);

const Item = agr => (
	<div>
		<ItemInviteFriend {...agr} />
	</div>
);

export const popupLayout = Template.bind({});
export const InviteItem = Item.bind({});
