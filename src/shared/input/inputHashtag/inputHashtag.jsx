import PropTypes from 'prop-types';
import { useRef, useState, useEffect, useCallback } from 'react';
import { CloseX } from 'components/svg';
import Input from 'shared/input';
import './inputHashtag.scss';
import { hashtagRegex } from 'constants';
import _ from 'lodash';

// tạo hashtag regex loại bỏ cờ 'g' để sử dụng hàm test()
const hashtagRegexRemoveGFlag = new RegExp(hashtagRegex, 'i');

const InputHashtag = ({ listHashtags, setListHashtags, setLastTag, label, showError, setShowError }) => {
	const hashtagInputWrapper = useRef(null);
	const inputRefHashtag = useRef('');

	const [inputHashtag, setInputHashtag] = useState('');
	const [pressedSpace, setPressedSpace] = useState(false);

	const handleChangeHashtag = e => {
		setInputHashtag(e.target.value);
		debounceFnc(e.target.value);
		if (hashtagInputWrapper.current) {
			hashtagInputWrapper.current.style.width = inputRefHashtag.current.value.length + 0.5 + 'ch';
		}
	};

	const handleRemoveTag = e => {
		const newList = listHashtags.filter(item => item !== e);
		setListHashtags(newList);
	};

	useEffect(() => {
		pressedSpace && inputRefHashtag.current.focus();
	}, [pressedSpace]);

	const handleCreateHashtags = e => {
		if (e.keyCode === 32) {
			e.preventDefault();
			const value = e.target.value;
			if (hashtagRegexRemoveGFlag.test(value) && !listHashtags.includes(value)) {
				const newValue = value
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/đ/g, 'd')
					.replace(/Đ/g, 'D');
				setListHashtags([...listHashtags, newValue]);
				setPressedSpace(true);
			}
			inputRefHashtag.current.value = '';
			setLastTag('');
		}
	};

	const debounceFnc = useCallback(
		_.debounce(textValue => {
			if (textValue.trim().length) {
				if (!hashtagRegexRemoveGFlag.test(textValue)) {
					setShowError(true);
				} else {
					setShowError(false);
					setLastTag(
						textValue
							.normalize('NFD')
							.replace(/[\u0300-\u036f]/g, '')
							.replace(/đ/g, 'd')
							.replace(/Đ/g, 'D')
					);
				}
			} else {
				setShowError(false);
			}
		}, 200),
		[]
	);

	return (
		<div className='input-form-group'>
			<div className='input-form-group__label'>{label}</div>
			<div className='input-form-group__list' onClick={() => inputRefHashtag.current.focus()}>
				{listHashtags.length > 0 ? (
					<div className='input-form-group__list__cards'>
						{listHashtags.map((item, index) => (
							<span key={index}>
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
								className='input-hashtag-input-element'
								onChange={handleChangeHashtag}
								ref={inputRefHashtag}
								onKeyDown={handleCreateHashtags}
							/>
						</div>
					</div>
				) : (
					<Input
						className='input-keyword'
						isBorder={false}
						placeholder='Nhập hashtag'
						handleChange={handleChangeHashtag}
						inputRef={inputRefHashtag}
						onKeyDown={handleCreateHashtags}
					/>
				)}
			</div>
			{showError && inputHashtag && <div className='input-hashtag-warning'>Vui lòng nhập đúng định dạng</div>}
		</div>
	);
};

InputHashtag.defaultProps = {
	listHashtags: [],
	setListHashtags: () => {},
	setLastTag: () => {},
	label: 'Hashtag',
	showError: false,
	setShowError: () => {},
};

InputHashtag.propTypes = {
	listHashtags: PropTypes.array,
	setListHashtags: PropTypes.func,
	setLastTag: PropTypes.func,
	label: PropTypes.string,
	showError: PropTypes.bool,
	setShowError: PropTypes.func,
};

export default InputHashtag;
