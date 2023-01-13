import './add-and-search-items.scss';
import { CloseX, Search, CheckIcon } from 'components/svg';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import LoadingIndicator from 'shared/loading-indicator';

function AddAndSearchItems({
	itemAddedList,
	itemSearchedList,
	addItem,
	removeItem,
	getDataFinish,
	searchItem,
	inputItemValue,
	itemInputContainer,
	itemInputWrapper,
	itemInput,
	hasSearchIcon,
	placeholder,
	hasMoreEllipsis,
	acceptValueText,
	autoFocus,
}) {
	const [firstTimeFocus, setFirstTimeFocus] = useState(false);
	const [show, setShow] = useState(true);

	useEffect(() => {
		if (itemInput.current && firstTimeFocus) {
			itemInput.current.focus();
		}
	}, [itemAddedList]);

	useEffect(() => {
		if (itemInputContainer.current) {
			itemInputContainer.current.addEventListener('click', focusInput);
			return () => {
				itemInputContainer?.current?.removeEventListener('click', focusInput);
			};
		}
	}, []);

	useEffect(() => {
		if (autoFocus) {
			focusInput();
		}
	}, []);

	useEffect(() => {
		if (!inputItemValue) {
			setShow(true);
		}
	}, [inputItemValue]);

	const focusInput = () => {
		if (itemInput.current) {
			itemInput.current.focus();
			setFirstTimeFocus(true);
		}
	};

	const onClickAddNewItem = () => {
		setShow(false);
	};

	return (
		<div className='add-and-search-categories'>
			<div
				className={classNames('add-and-search-categories__main-content', {
					'added-categories': itemAddedList.length > 0,
				})}
				ref={itemInputContainer}
			>
				{itemAddedList.length > 0 ? (
					<div className='add-and-search-categories__categories-added'>
						{itemAddedList.map((item, index) => (
							<div key={index} className='add-and-search-categories__categories-added__item'>
								<div>{item.name || item.fullName || item.firstName + ' ' + item.lastName}</div>
								<button onClick={() => removeItem(index)}>
									<CloseX />
								</button>
							</div>
						))}
						<div
							ref={itemInputWrapper}
							className='add-and-search-categories__input-wrapper'
							style={{ width: '8px' }}
						>
							<input
								className='add-and-search-categories__input'
								value={inputItemValue}
								onChange={searchItem}
								ref={itemInput}
							/>
						</div>
					</div>
				) : (
					<>
						{hasSearchIcon && show && <Search className='add-and-search-categories__search-icon' />}
						<input
							placeholder={placeholder}
							value={inputItemValue}
							onChange={searchItem}
							onClick={() => setFirstTimeFocus(true)}
						/>
					</>
				)}
			</div>

			{/* Loading gọi dữ liệu  */}
			<div className='add-and-search-categories__loading'>
				{!getDataFinish && inputItemValue && <LoadingIndicator />}
			</div>

			{inputItemValue.trim() !== '' && getDataFinish && (
				<>
					{itemSearchedList.length > 0 ? (
						<div className='add-and-search-categories__search-result'>
							{itemSearchedList.map(item => (
								<div
									className='add-and-search-categories__searched-item'
									key={item.id}
									onClick={() => addItem(item)}
								>
									<span>{item.name || item.fullName || item.firstName + ' ' + item.lastName}</span>
									<>
										{itemAddedList.filter(itemAdded => itemAdded.id === item.id).length > 0 && (
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
											// onClick={() => setShow(false)}
											onClick={onClickAddNewItem}
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

AddAndSearchItems.defaultProps = {
	placeholder: 'Tìm kiếm và thêm chủ đề',
	hasMoreEllipsis: false,
	acceptValueText: false,
	autoFocus: false,
};

AddAndSearchItems.propTypes = {
	itemAddedList: PropTypes.array,
	itemSearchedList: PropTypes.array,
	addItem: PropTypes.func,
	removeItem: PropTypes.func,
	getDataFinish: PropTypes.bool,
	searchItem: PropTypes.func,
	inputItemValue: PropTypes.string,
	itemInputContainer: PropTypes.object,
	itemInputWrapper: PropTypes.object,
	itemInput: PropTypes.object,
	hasSearchIcon: PropTypes.bool,
	placeholder: PropTypes.string,
	hasMoreEllipsis: PropTypes.bool,
	acceptValueText: PropTypes.bool,
	autoFocus: PropTypes.bool,
};

export default AddAndSearchItems;
