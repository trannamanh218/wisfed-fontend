const ItemMembers = () => {
	return (
		<div className='group-sibar-left__people'>
			<div className='group-sibar-left__people-admin'>
				<span>Quản trị viên</span>
				<div className='people-item'>
					<img
						src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
						alt='image'
					/>
					<div className='people-item__text'>
						<span>Shadow</span>
						<div>02 bạn chung</div>
					</div>
				</div>
			</div>
			<div className='group-sibar-left__people-friends'>
				<span>Bạn bè</span>
				<div className='people-item'>
					<img
						src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
						alt='image'
					/>
					<div className='people-item__text'>
						<span>Shadow</span>
						<div>02 bạn chung</div>
					</div>
				</div>
			</div>
			<div className='group-sibar-left__people-folowers'>
				<span>Người theo dõi</span>
				<div className='people-item'>
					<img
						src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
						alt='image'
					/>
					<div className='people-item__text'>
						<span>Shadow</span>
						<div>02 bạn chung</div>
					</div>
				</div>
			</div>
		</div>
	);
};
const ItemMember = () => {
	return (
		<div className='group-sibar-left__people'>
			<div className='group-sibar-left__people-folowers'>
				<div className='people-item'>
					<img
						src='https://play-lh.googleusercontent.com/NIUu0OgXQO4nU-ugWTv6yNy92u9wQFFfwvlWOsCIG-tPYBagOZdpyrJCxfHULI_eeGI'
						alt='image'
					/>
					<div className='people-item__text'>
						<span>Shadow</span>
						<div>02 bạn chung</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default {
	title: 'Components/Modules/ItemGroupMember',
	component: ItemMember,
	argTypes: {
		handleClick: { action: 'onClick' },
	},
};

const Template = args => <ItemMember {...args} />;
const Templates = args => <ItemMembers {...args} />;

export const Default = Template.bind({});
export const Multiple = Templates.bind({});
