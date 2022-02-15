import './style.scss';
import { BackArrow, Search } from 'components/svg';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import BookThumbnail from 'shared/book-thumbnail';
import UserAvatar from 'shared/user-avatar';
import settingsSlider from './settingsSlider';
import noSearchResult from 'assets/images/no-search-result.png';

function CreatPostSubModal({ option, backToMainModal }) {
	const [optionName, setOptionName] = useState('');
	const [inputSearchValue, setInputSearchValue] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [suggests, setSuggests] = useState([]);

	useEffect(() => {
		if (option === 'add-book') {
			setOptionName('sách');
		} else if (option === 'add-topic') {
			setOptionName('chủ đề');
		} else if (option === 'add-author') {
			setOptionName('tác giả');
		} else if (option === 'add-friends') {
			setOptionName('bạn bè');
		}
	}, [option]);

	const updateInputSearchValue = e => {
		setInputSearchValue(e.target.value);
	};

	const renderNoSearchResultText = () => {
		switch (option) {
			case 'add-book':
				return <span>Không tìm thấy cuốn sách nào</span>;
			case 'add-author':
				return <span>Không tìm thấy tác giả</span>;
			case 'add-friends':
				return <span>Không tìm thấy bạn bè</span>;
			case 'add-topic':
				return <span>Không tìm thấy chủ đề</span>;
		}
	};

	const renderSearchResult = () => {
		return (
			<>
				{inputSearchValue.trim().length > 0 ? (
					<>
						{searchResult.length > 0 ? (
							<></>
						) : (
							<div className='creat-post-modal-content__substitute__no-search-result'>
								<img src={noSearchResult} alt='no search result' />
								{renderNoSearchResultText()}
							</div>
						)}
					</>
				) : (
					<>{renderSuggest()}</>
				)}
			</>
		);
	};

	const renderSuggest = () => {
		switch (option) {
			case 'add-book':
				return (
					<>
						<h5>Gợi ý</h5>
						{/* {suggests.length > 0 && ( */}
						<Slider
							{...settingsSlider}
							className='creat-post-modal-content__substitute__suggest-book-container'
						>
							{[...Array(10)].map((item, index) => (
								<div className='creat-post-modal-content__substitute__suggest-book-item' key={index}>
									<BookThumbnail size='md' />
									<div className='creat-post-modal-content__substitute__suggest-book-infomations'>
										<div className='creat-post-modal-content__substitute__suggest-book-infomations__name'>
											The Vegetarian A Novel Han Kang A Novel Han Kang
										</div>
										<div className='creat-post-modal-content__substitute__suggest-book-infomations__author'>
											Han Kang Kang
										</div>
									</div>
								</div>
							))}
						</Slider>
						{/* )} */}
					</>
				);
			case 'add-author':
				return (
					<>
						<h5>Gợi ý</h5>
						<div className='creat-post-modal-content__substitute__suggest-author-container'>
							{[...Array(5)].map((item, index) => (
								<div className='creat-post-modal-content__substitute__suggest-author-item' key={index}>
									<UserAvatar size='lg' />
									<div className='creat-post-modal-content__substitute__suggest-author__name'>
										Nguyễn Thu Phương
									</div>
								</div>
							))}
						</div>
					</>
				);
			case 'add-topic':
				return (
					<>
						<h5>Gợi ý</h5>
						<div className='creat-post-modal-content__substitute__suggest-topic-container'>
							{[...Array(10)].map((item, index) => (
								<button
									className='creat-post-modal-content__substitute__suggest-topic-item'
									key={index}
								>
									Kinh doanh
								</button>
							))}
						</div>
					</>
				);
			case 'add-friends':
				return (
					<>
						<h5>Gợi ý</h5>
						<div className='creat-post-modal-content__substitute__suggest-author-container'>
							{[...Array(5)].map((item, index) => (
								<div className='creat-post-modal-content__substitute__suggest-author-item' key={index}>
									<UserAvatar size='lg' />
									<div className='creat-post-modal-content__substitute__suggest-author__name'>
										Trần Văn Đức
									</div>
								</div>
							))}
						</div>
					</>
				);
		}
	};

	return (
		<>
			<div className='creat-post-modal-content__substitute__header'>
				<button className='creat-post-modal-content__substitute__back' onClick={backToMainModal}>
					<BackArrow />
				</button>
				<h5>{`Thêm ${optionName} vào bài viết`}</h5>
				<button style={{ visibility: 'hidden' }} className='creat-post-modal-content__substitute__back'>
					<BackArrow />
				</button>
			</div>
			<div className='creat-post-modal-content__substitute__body'>
				<div className='creat-post-modal-content__substitute__search-container'>
					<div className='creat-post-modal-content__substitute__search-bar'>
						<Search />
						<input
							className='creat-post-modal-content__substitute__search-bar__input'
							placeholder={`Tìm kiếm ${optionName} để thêm vào bài viết`}
							value={inputSearchValue}
							onChange={updateInputSearchValue}
						/>
					</div>
					<button className='creat-post-modal-content__substitute__search-bar__button'>Xong</button>
				</div>
				<div className='creat-post-modal-content__substitute__search-result'>{renderSearchResult()}</div>
			</div>
		</>
	);
}

CreatPostSubModal.propTypes = {
	option: PropTypes.string,
	backToMainModal: PropTypes.func,
};

export default CreatPostSubModal;
