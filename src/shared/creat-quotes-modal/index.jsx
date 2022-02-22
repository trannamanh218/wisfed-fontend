import './creat-quotes-modal.scss';
import { CloseX, WeatherStars, BackChevron, Search } from 'components/svg';
import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import Slider from 'react-slick';
import settingsSlider from './settingsSlider';
import PropTypes from 'prop-types';
import avatar from 'assets/images/avatar2.png';
import { getSuggestion } from 'reducers/redux-utils/activity';
import { useDispatch, useSelector } from 'react-redux';

function CreatQuotesModal({ hideCreatQuotesModal }) {
	const [showTextFieldEditPlaceholder, setShowTextFieldEditPlaceholder] = useState(true);
	const [showTextFieldBackgroundSelect, setShowTextFieldBackgroundSelect] = useState(false);
	const [backgroundColor, setBackgroundColor] = useState('');
	const [inputAuthorValue, setInputAuthorValue] = useState('');
	const [inputBookValue, setInputBookValue] = useState('');
	const [inputTopicValue, setInputTopicValue] = useState('');
	const [inputKeywordValue, setInputKeywordValue] = useState('');
	const [colorActiveIndex, setColorActiveIndex] = useState(-1);
	const [authorSearchedList, setAuthorSearchedList] = useState([]);
	const [authorAdded, setAuthorAdded] = useState('');

	const textFieldEdit = useRef(null);
	const sliderRef = useRef(null);

	const userInfo = useSelector(state => state.auth.userInfo);
	const dispatch = useDispatch();

	const colorData = [
		'to bottom right, #FE7B59, #FE497A, #FD169C',
		'to right, #FEC790, #F991F7',
		'to bottom right, #3F74D0, #69C8DE, #A6E1CF',
		'to bottom right, #77C2F1, #FFB4ED',
		'to bottom right, #F9AB34, #FFE68E',
		'to bottom right, #A058AE, #FC6C75, #FEAAAA',
		'to bottom right, #C5FFAA, #00BAC6',
		'to bottom right, #FDFD9B, #F9F906, #C7C705',
		'to bottom right, #FE7B59, #FE497A, #FD169C',
		'to right, #FEC790, #F991F7',
		'to bottom right, #3F74D0, #69C8DE, #A6E1CF',
		'to bottom right, #77C2F1, #FFB4ED',
		'to bottom right, #F9AB34, #FFE68E',
		'to bottom right, #A058AE, #FC6C75, #FEAAAA',
		'to bottom right, #C5FFAA, #00BAC6',
		'to bottom right, #FDFD9B, #F9F906, #C7C705',
	];

	useEffect(() => {
		textFieldEdit.current.focus();
	}, [backgroundColor]);

	useEffect(() => {
		if (!showTextFieldBackgroundSelect) {
			setTimeout(() => {
				sliderRef.current.slickGoTo(0);
			}, 500);
		}
	}, [showTextFieldBackgroundSelect]);

	const handleTextFieldEditEvents = () => {
		if (textFieldEdit.current.innerText.length > 0) {
			setShowTextFieldEditPlaceholder(false);
			if (textFieldEdit.current.innerText.length > 500) {
				textFieldEdit.current.addEventListener('keypress', disableEventsListener, true);
				textFieldEdit.current.addEventListener('paste', disableEventsListener, true);
				textFieldEdit.current.innerText = textFieldEdit.current.innerText.slice(0, 500);
			} else {
				textFieldEdit.current.removeEventListener('keypress', disableEventsListener, true);
				textFieldEdit.current.removeEventListener('paste', disableEventsListener, true);
			}
		} else {
			setShowTextFieldEditPlaceholder(true);
		}
	};

	const disableEventsListener = e => {
		e.stopPropagation();
		e.preventDefault();
	};

	useEffect(() => {
		textFieldEdit.current.addEventListener('input', handleTextFieldEditEvents);
		textFieldEdit.current.addEventListener('keypress', handleTextFieldEditEvents);
		return () => {
			textFieldEdit.current.removeEventListener('input', handleTextFieldEditEvents);
			textFieldEdit.current.removeEventListener('keypress', handleTextFieldEditEvents);
		};
	}, [showTextFieldEditPlaceholder]);

	const changeBackground = (item, index) => {
		setBackgroundColor(item);
		setColorActiveIndex(index);
	};

	const addAuthor = authorName => {
		setAuthorAdded(authorName);
		setInputAuthorValue('');
	};

	const getSuggestionForCreatQuotes = async (input, option) => {
		try {
			const data = await dispatch(getSuggestion({ input, option, userInfo })).unwrap();
			setAuthorSearchedList(data.rows.slice(0, 5));
		} catch (err) {
			return err;
		}
	};

	const searchAuthor = e => {
		setInputAuthorValue(e.target.value);
		getSuggestionForCreatQuotes(e.target.value, { value: 'add-author' });
	};

	return (
		<div className='creat-quotes-modal-content'>
			<div className='creat-quotes-modal__header'>
				<div style={{ visibility: 'hidden' }} className='creat-quotes-modal__header__close'>
					<CloseX />
				</div>
				<h5>Tạo Quotes</h5>
				<button className='creat-quotes-modal__header__close' onClick={hideCreatQuotesModal}>
					<CloseX />
				</button>
			</div>
			<div className='creat-quotes-modal__body'>
				{backgroundColor ? (
					<div
						className='creat-quotes-modal__body__text-field-edit-wrapper has-background'
						style={{ backgroundImage: `linear-gradient(${backgroundColor})` }}
					>
						<div
							className='creat-quotes-modal__body__text-field-edit has-background'
							contentEditable={true}
							ref={textFieldEdit}
						></div>
						<div
							className={classNames('creat-quotes-modal__body__text-field-placeholder has-background', {
								'hide': !showTextFieldEditPlaceholder,
							})}
						>
							Nội dung Quotes của bạn (Dưới 500 ký tự)
						</div>
					</div>
				) : (
					<div className='creat-quotes-modal__body__text-field-edit-wrapper default'>
						<div
							className='creat-quotes-modal__body__text-field-edit default'
							contentEditable={true}
							ref={textFieldEdit}
						></div>
						<div
							className={classNames('creat-quotes-modal__body__text-field-placeholder default', {
								'hide': !showTextFieldEditPlaceholder,
							})}
						>
							Nội dung Quotes của bạn (Dưới 500 ký tự)
						</div>
					</div>
				)}

				<div className='creat-quotes-modal__body__select-background-container'>
					<div className='creat-quotes-modal__body__select-background-button-box'>
						<button
							className={classNames('creat-quotes-modal__body__select-background', {
								'open-button': !showTextFieldBackgroundSelect,
								'close-button': showTextFieldBackgroundSelect,
							})}
							onClick={() => setShowTextFieldBackgroundSelect(!showTextFieldBackgroundSelect)}
						>
							{!showTextFieldBackgroundSelect ? <WeatherStars /> : <BackChevron />}
						</button>
					</div>

					<Slider
						className={classNames('creat-quotes-modal__body__select-background-box', {
							'show': showTextFieldBackgroundSelect,
						})}
						{...settingsSlider}
						ref={sliderRef}
					>
						<div className='creat-quotes-modal__body__select-background-box-item'>
							<button
								style={{
									border: '#d9dbe9 4px solid',
								}}
								onClick={() => changeBackground('', -1)}
							></button>
						</div>

						{colorData.map((item, index) => (
							<div key={index} className='creat-quotes-modal__body__select-background-box-item'>
								<button
									style={{ backgroundImage: `linear-gradient(${item})` }}
									onClick={() => changeBackground(item, index)}
									className={index === colorActiveIndex && 'active'}
								></button>
							</div>
						))}
					</Slider>
				</div>
				<div className='creat-quotes-modal__body__add-options'>
					<div className='creat-quotes-modal__body__option-item'>
						<div className='creat-quotes-modal__body__option-item__title'>Tác giả</div>
						<div className='creat-quotes-modal__body__option-item__search-container'>
							{authorAdded ? (
								<div className='creat-quotes-modal__body__option-item__author-added'>
									<span>{authorAdded}</span>
									<button onClick={() => setAuthorAdded('')}>
										<CloseX />
									</button>
								</div>
							) : (
								<>
									<Search />
									<input
										placeholder='Tìm kiếm và thêm tác giả'
										value={inputAuthorValue}
										onChange={searchAuthor}
									/>
								</>
							)}
						</div>

						{inputAuthorValue.trim() !== '' && (
							<div className='creat-quotes-modal__body__option-item__search-result'>
								{authorSearchedList.map(item => (
									<div
										className='creat-quotes-modal__author-item'
										key={item.id}
										onClick={() => addAuthor(`${item.firstName} ${item.lastName}`)}
									>
										<img src={item.avatarImage || avatar} alt='author' />
										<div className='creat-quotes-modal__author__name'>{`${item.firstName} ${item.lastName}`}</div>
									</div>
								))}
							</div>
						)}
					</div>
					<div className='creat-quotes-modal__body__option-item'>
						<div className='creat-quotes-modal__body__option-item__title'>*Sách (Bắt buộc)</div>
						<div className='creat-quotes-modal__body__option-item__search-container'>
							<Search />
							<input
								placeholder='Tìm kiếm và thêm sách'
								value={inputBookValue}
								onChange={e => setInputBookValue(e.target.value)}
							/>
						</div>
					</div>
					<div className='creat-quotes-modal__body__option-item'>
						<div className='creat-quotes-modal__body__option-item__title'>Chủ đề</div>
						<div className='creat-quotes-modal__body__option-item__search-container'>
							<Search />
							<input
								placeholder='Tìm kiếm và thêm chủ đề'
								value={inputTopicValue}
								onChange={e => setInputTopicValue(e.target.value)}
							/>
						</div>
					</div>
					<div className='creat-quotes-modal__body__option-item'>
						<div className='creat-quotes-modal__body__option-item__title'>Từ khóa</div>
						<div className='creat-quotes-modal__body__option-item__search-container'>
							<input
								style={{ margin: '0' }}
								placeholder='Nhập từ khóa'
								value={inputKeywordValue}
								onChange={e => setInputKeywordValue(e.target.value)}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className='creat-quotes-modal__footer'>
				<button
					className={
						inputAuthorValue || inputBookValue || inputTopicValue || inputKeywordValue ? 'active' : ''
					}
				>
					Tạo Quotes
				</button>
			</div>
		</div>
	);
}

CreatQuotesModal.propTypes = {
	hideCreatQuotesModal: PropTypes.func,
};

export default CreatQuotesModal;
