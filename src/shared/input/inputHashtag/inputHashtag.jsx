import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import { CloseIconX } from 'components/svg';
import Input from 'shared/input';
import './inputHashtag.scss';

const InputHashtag = ({ listHashtags, setListHashtags, setLastTag }) => {
	const hashtagRegex =
		/#(?![0-9_]+\b)[0-9a-z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+/gi;

	const dataRef = useRef('');
	const hashtagInputWrapper = useRef(null);
	const inputRefHashtag = useRef('');

	const [inputHashtag, setInputHashtag] = useState('');
	const [show, setShow] = useState(false);
	const [justAddedFirstOneHashTag, setJustAddedFirstOneHashTag] = useState(false);

	const handleChangeHashtag = e => {
		const value = e.target.value;
		setInputHashtag(value);
		if (!hashtagRegex.test(value) && value.trim().length > 1) {
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
		<div className='input-hashtag'>
			<div className='input-hashtag__label'>Hashtag</div>
			<div className='input-hashtag__list' onClick={() => inputRefHashtag.current.focus()}>
				{listHashtags.length > 0 ? (
					<div className='input-hashtag__list__cards'>
						{listHashtags.map(item => (
							<span key={item}>
								<span>{item}</span>
								<button
									className='close__author'
									onClick={() => {
										handleRemoveTag(item);
									}}
								>
									<CloseIconX />
								</button>
							</span>
						))}
						<div ref={hashtagInputWrapper} style={{ width: '80px' }}>
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
};

InputHashtag.propTypes = {
	listHashtags: PropTypes.array,
	setListHashtags: PropTypes.func,
	setLastTag: PropTypes.func,
};

export default InputHashtag;
