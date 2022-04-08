import NormalContainer from 'components/layout/normal-container';
import React, { useState } from 'react';
import './friend.scss';
import SearchField from 'shared/search-field';
import Button from 'shared/button';
import MyFriends from './component/my-friend';
import MyFollow from './component/my-follow';
import InvitationFriend from './component/invitation-friend';
import SuggestFriend from './component/suggest-friend';
const Friends = () => {
	const [activeTabs, setActiveTabs] = useState('friend');
	const [toggleSearch, setToggleSearch] = useState(true);

	const handleActiveTabs = string => {
		if (string === 'friend') {
			setActiveTabs('friend');
			setToggleSearch(true);
		} else if (string === 'follow') {
			setActiveTabs('follow');
			setToggleSearch(true);
		} else if (string === 'addfriend') {
			setActiveTabs('addfriend');
			setToggleSearch(true);
		} else if (string === 'suggest') {
			setActiveTabs('suggest');
			setToggleSearch(false);
		}
	};

	const contentTabFriends = () => {
		if (activeTabs === 'friend') {
			return <MyFriends />;
		} else if (activeTabs === 'follow') {
			return <MyFollow />;
		} else if (activeTabs === 'addfriend') {
			return <InvitationFriend />;
		} else if (activeTabs === 'suggest') {
			return <SuggestFriend />;
		}
	};

	return (
		<NormalContainer>
			<div className='friends__container'>
				<div className='friends__content'>Bạn bè</div>
				<div className='friends__header'>
					{toggleSearch && (
						<div className='friends__search'>
							<SearchField placeholder='Tìm kiếm bạn bè' />
							<Button className='connect-button' isOutline={false} name='friend'>
								<span>Tìm kiếm</span>
							</Button>
						</div>
					)}

					<div className='friend__radio'>
						<p onClick={() => handleActiveTabs('friend')}>
							<input type='radio' id='friend' name='radio-group' defaultChecked />
							<label htmlFor='friend'>Tất cả bạn bè</label>
						</p>
						<p onClick={() => handleActiveTabs('follow')}>
							<input type='radio' id='follow' name='radio-group' />
							<label htmlFor='follow'>Tất cả Follow</label>
						</p>
						<p onClick={() => handleActiveTabs('addfriend')}>
							<input type='radio' id='addfriend' name='radio-group' />
							<label htmlFor='addfriend'>Lời mời kết bạn</label>
						</p>
						<p onClick={() => handleActiveTabs('suggest')}>
							<input type='radio' id='suggest' name='radio-group' />
							<label htmlFor='suggest'>Gợi ý</label>
						</p>
					</div>
				</div>
				<div className='friends__main'>{contentTabFriends()}</div>
			</div>
		</NormalContainer>
	);
};

export default Friends;
