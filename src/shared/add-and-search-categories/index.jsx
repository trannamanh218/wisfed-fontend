import './add-and-search-categories.scss';
import { CloseX, Search, CheckIcon } from 'components/svg';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useEffect } from 'react';

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
}) {
	const focusCategoryInput = () => {
		if (categoryInput.current) {
			categoryInput.current.focus();
		}
	};

	useEffect(() => {
		if (categoryInput.current) {
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
	console.log(categorySearchedList);

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
								<div>{item.name}</div>
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
						{hasSearchIcon && <Search className='add-and-search-categories__search-icon' />}
						<input
							placeholder='Tìm kiếm và thêm chủ đề'
							value={inputCategoryValue}
							onChange={searchCategory}
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
									<span>{item.name}</span>
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
						</div>
					) : (
						<div className='add-and-search-categories__no-search-result'>Không có kết quả phù hợp</div>
					)}
				</>
			)}
		</div>
	);
}

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
};

export default AddAndSearchCategories;
