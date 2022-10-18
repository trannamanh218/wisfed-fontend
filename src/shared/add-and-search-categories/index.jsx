import './add-and-search-categories.scss';
import { CloseX, Search, CheckIcon } from 'components/svg';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

function AddAndSearchCategories({
	categoryAddedList,
	categorySearchedList,
	addCategory,
	removeCategory,
	getDataFinish,
	searchCategory,
	inputCategoryValue,
	categoryInputContainer,
	categoryInputWrapper,
	categoryInput,
	hasSearchIcon,
	placeholder,
	hasMoreEllipsis,
	acceptValueText,
}) {
	const [firstTimeFocus, setFirstTimeFocus] = useState(false);
	const [show, setShow] = useState(true);

	const focusCategoryInput = () => {
		if (categoryInput.current) {
			categoryInput.current.focus();
			setFirstTimeFocus(true);
		}
	};

	useEffect(() => {
		if (categoryInput.current && firstTimeFocus) {
			categoryInput.current.focus();
		}
	}, [categoryAddedList]);

	useEffect(() => {
		if (categoryInputContainer.current) {
			categoryInputContainer.current.addEventListener('click', focusCategoryInput);
			return () => {
				categoryInputContainer?.current?.removeEventListener('click', focusCategoryInput);
			};
		}
	}, []);

	useEffect(() => {
		if (!inputCategoryValue) {
			setShow(true);
		}
	}, [inputCategoryValue]);

	return (
		<div className='add-and-search-categories'>
			<div
				className={classNames('add-and-search-categories__main-content', {
					'added-categories': categoryAddedList.length > 0,
				})}
				ref={categoryInputContainer}
			>
				{categoryAddedList.length > 0 ? (
					<div className='add-and-search-categories__categories-added'>
						{categoryAddedList.map(item => (
							<div key={item.id} className='add-and-search-categories__categories-added__item'>
								<div>{item.name || item.fullName || item.firstName + ' ' + item.lastName}</div>
								<button onClick={() => removeCategory(item.id)}>
									<CloseX />
								</button>
							</div>
						))}
						<div
							ref={categoryInputWrapper}
							className='add-and-search-categories__input-wrapper'
							style={{ width: '8px' }}
						>
							<input
								className='add-and-search-categories__input'
								value={inputCategoryValue}
								onChange={searchCategory}
								ref={categoryInput}
							/>
						</div>
					</div>
				) : (
					<>
						{hasSearchIcon && show && <Search className='add-and-search-categories__search-icon' />}
						<input
							placeholder={placeholder}
							value={inputCategoryValue}
							onChange={searchCategory}
							onClick={() => setFirstTimeFocus(true)}
						/>
					</>
				)}
			</div>
			{inputCategoryValue.trim() !== '' && getDataFinish && (
				<>
					{categorySearchedList.length > 0 ? (
						<div className='add-and-search-categories__search-result'>
							{categorySearchedList.map(item => (
								<div
									className='add-and-search-categories__searched-item'
									key={item.id}
									onClick={() => addCategory(item)}
								>
									<span>{item.name || item.fullName || item.firstName + ' ' + item.lastName}</span>
									<>
										{categoryAddedList.filter(categoryAdded => categoryAdded.id === item.id)
											.length > 0 && (
											<>
												<div className='add-and-search-categories__checked-category'></div>
												<CheckIcon />
											</>
										)}
									</>
								</div>
							))}
							{hasMoreEllipsis && (
								<div className='add-and-search-categories__searched-item-elipsis'>...</div>
							)}
						</div>
					) : (
						<>
							{show && (
								<div className='add-and-search-categories__no-search-result'>
									Không có kết quả phù hợp{' '}
									{acceptValueText && (
										<span
											className='add-and-search-categories__type-new'
											onClick={() => setShow(false)}
										>
											(Nhập tên mới?)
										</span>
									)}
								</div>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
}

AddAndSearchCategories.defaultProps = {
	placeholder: 'Tìm kiếm và thêm chủ đề',
	hasMoreEllipsis: false,
	acceptValueText: false,
};

AddAndSearchCategories.propTypes = {
	categoryAddedList: PropTypes.array,
	categorySearchedList: PropTypes.array,
	addCategory: PropTypes.func,
	removeCategory: PropTypes.func,
	getDataFinish: PropTypes.bool,
	searchCategory: PropTypes.func,
	inputCategoryValue: PropTypes.string,
	categoryInputContainer: PropTypes.object,
	categoryInputWrapper: PropTypes.object,
	categoryInput: PropTypes.object,
	hasSearchIcon: PropTypes.bool,
	placeholder: PropTypes.string,
	hasMoreEllipsis: PropTypes.bool,
	acceptValueText: PropTypes.bool,
};

export default AddAndSearchCategories;
