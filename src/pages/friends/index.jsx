import NormalContainer from 'components/layout/normal-container';
import { useState } from 'react';
import './friend.scss';
import MyFriends from './component/my-friend';
import MyFollow from './component/my-follow';
import InvitationFriend from './component/invitation-friend';
import SuggestFriend from './component/suggest-friend';
import SearchButton from 'shared/search-button';

const Friends = () => {
	const [activeTabs, setActiveTabs] = useState('friend');
	const [toggleSearch, setToggleSearch] = useState(true);
	const [inputSearch, setInputSearch] = useState('');
	const [filter, setFilter] = useState('[]');

	const handleActiveTabs = string => {
		setInputSearch('');
		setFilter('[]');
		setToggleSearch(false);
		if (string === 'friend') {
			setActiveTabs('friend');
			setToggleSearch(true);
		} else if (string === 'follow') {
			setActiveTabs('follow');
		} else if (string === 'addfriend') {
			setActiveTabs('addfriend');
		} else if (string === 'suggest') {
			setActiveTabs('suggest');
		}
	};

	const contentTabFriends = () => {
		if (activeTabs === 'friend') {
			return <MyFriends activeTabs={activeTabs} filter={filter} inputSearch={inputSearch} />;
		} else if (activeTabs === 'follow') {
			return <MyFollow activeTabs={activeTabs} />;
		} else if (activeTabs === 'addfriend') {
			return <InvitationFriend activeTabs={activeTabs} />;
		} else if (activeTabs === 'suggest') {
			return <SuggestFriend />;
		}
	};

	const updateInputSearch = value => {
		if (value) {
			const filterValue = [];
			filterValue.push({
				'operator': 'search',
				'value': value.toLowerCase().trim(),
				'property': 'firstName,lastName',
			});
			setFilter(JSON.stringify(filterValue));
		} else {
			setFilter('[]');
		}
	};

	const handleSearch = e => {
		setInputSearch(e.target.value);
		if (e.target.value === '') {
			updateInputSearch('');
		}
	};

	const onClickSearchBtn = () => {
		updateInputSearch(inputSearch);
	};

	const onBtnEnterPress = e => {
		if (e.key === 'Enter') {
			updateInputSearch(inputSearch);
		}
	};

	return (
		<NormalContainer>
			<div className='friends__container'>
				<div className='friends__content'>Bạn bè</div>
				<div className='friends__header'>
					{toggleSearch && (
						<SearchButton
							handleClickSearch={onClickSearchBtn}
							handleChange={handleSearch}
							value={inputSearch}
							onKeyDown={onBtnEnterPress}
						/>
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
