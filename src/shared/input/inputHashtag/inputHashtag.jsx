import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import { CloseX } from 'components/svg';
import Input from 'shared/input';
import './inputHashtag.scss';
import { hashtagRegex } from 'constants';

const InputHashtag = ({ listHashtags, setListHashtags, setLastTag, label, isRequired }) => {
	const dataRef = useRef('');
	const hashtagInputWrapper = useRef(null);
	const inputRefHashtag = useRef('');

	const [inputHashtag, setInputHashtag] = useState('');
	const [show, setShow] = useState(false);
	const [justAddedFirstOneHashTag, setJustAddedFirstOneHashTag] = useState(false);

	const handleChangeHashtag = e => {
		setInputHashtag(e.target.value);
		const hashtagsMatched = e.target.value.match(hashtagRegex);

		if (!hashtagsMatched && e.target.value.trim().length) {
			setShow(true);
		} else {
			setShow(false);
		}
		if (hashtagInputWrapper.current) {
			hashtagInputWrapper.current.style.width = inputRefHashtag.current.value.length + 0.5 + 'ch';
		}
	};

	const handleRemoveTag = e => {
		const newList = listHashtags.filter(item => item !== e);
		setListHashtags(newList);
	};

	useEffect(() => {
		setLastTag(
			inputHashtag
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/đ/g, 'd')
				.replace(/Đ/g, 'D')
		);

		const hastagElement = document.getElementById('hashtag');
		const handleHashtag = e => {
			if (e.keyCode === 32 && hashtagRegex.test(inputHashtag)) {
				dataRef.current = inputHashtag.trim();
				inputRefHashtag.current.value = '';
			}
		};
		hastagElement.addEventListener('keydown', handleHashtag);

		return () => hastagElement.removeEventListener('keydown', handleHashtag);
	}, [inputHashtag]);

	useEffect(() => {
		const dataCheck = listHashtags.filter(item => dataRef.current === item);
		if (dataRef.current !== '' && dataCheck.length < 1) {
			const check = dataRef.current
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/đ/g, 'd')
				.replace(/Đ/g, 'D');
			const newList = [...listHashtags, check];
			setShow(false);
			setListHashtags(newList);
			setJustAddedFirstOneHashTag(true);
		}
	}, [dataRef.current]);

	useEffect(() => {
		if (justAddedFirstOneHashTag && listHashtags.length === 1) {
			inputRefHashtag.current.focus();
		}
	}, [justAddedFirstOneHashTag, listHashtags]);

	return (
		<div className='input-form-group'>
			<div className='input-form-group__label'>
				{label}
				{isRequired && <span style={{ marginLeft: '4px', color: 'red' }}>*</span>}
			</div>
			<div className='input-form-group__list' onClick={() => inputRefHashtag.current.focus()}>
				{listHashtags.length > 0 ? (
					<div className='input-form-group__list__cards'>
						{listHashtags.map(item => (
							<span key={item}>
								<span>{item}</span>
								<button
									className='close__author'
									onClick={() => {
										handleRemoveTag(item);
									}}
								>
									<CloseX />
								</button>
							</span>
						))}
						<div ref={hashtagInputWrapper} style={{ width: '8px' }}>
							<input
								id='hashtag'
								className='input-hashtag-input-element'
								onChange={handleChangeHashtag}
								ref={inputRefHashtag}
							/>
						</div>
					</div>
				) : (
					<Input
						className='input-keyword'
						id='hashtag'
						isBorder={false}
						placeholder='Nhập hashtag'
						handleChange={handleChangeHashtag}
						inputRef={inputRefHashtag}
					/>
				)}
			</div>
			{show && inputHashtag && <div className='input-hashtag-warning'>Vui lòng nhập đúng định dạng</div>}
		</div>
	);
};

InputHashtag.defaultProps = {
	listHashtags: [],
	setListHashtags: () => {},
	setLastTag: () => {},
	label: 'Hashtag',
	isRequired: false,
};

InputHashtag.propTypes = {
	listHashtags: PropTypes.array,
	setListHashtags: PropTypes.func,
	setLastTag: PropTypes.func,
	label: PropTypes.string,
	isRequired: PropTypes.bool,
};

export default InputHashtag;
