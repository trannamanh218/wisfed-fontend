import { Global, Pencil, Add } from 'components/svg';
import { YEAR_LIMIT } from 'constants';
import { useEffect, useState, useRef, useCallback } from 'react';
import Input from 'shared/input';
import SelectBox from 'shared/select-box';
import './personal-info.scss';
import AddAndSearchCategories from 'shared/add-and-search-categories';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { getSuggestionForPost } from 'reducers/redux-utils/activity';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { editUserInfo } from 'reducers/redux-utils/user';
import { activeUpdateUserProfileStatus } from 'reducers/redux-utils/user';
import PropTypes from 'prop-types';

const PersonalInfoForm = ({ userData }) => {
	const [userFirstName, setUserFirstName] = useState(userData.firstName);
	const [userLastName, setUserLastName] = useState(userData.lastName);
	const [editName, setEditName] = useState(false);
	const [userBirthday, setUserBirthday] = useState('');
	const [editBirthday, setEditBirthday] = useState(false);
	const [editGender, setEditGender] = useState(false);
	const [userAddress, setUserAddress] = useState(userData.address);
	const [editAddress, setEditAddress] = useState(false);
	const [userWorks, setUserWorks] = useState(userData.works);
	const [editWorks, setEditWorks] = useState(false);
	const [userFavoriteCategories, setUserFavoriteCategories] = useState([]);
	const [editFavoriteCategories, setEditFavoriteCategories] = useState(false);
	const [categorySearchedList, setCategorySearchedList] = useState([]);
	const [inputCategoryValue, setInputCategoryValue] = useState('');
	const [getDataFinish, setGetDataFinish] = useState(false);
	const [editDescriptions, setEditDescriptions] = useState(false);
	const [userDescriptions, setUserDescriptions] = useState(userData.descriptions);
	const [userSocialsMedia, setUserSocialsMedia] = useState(userData.socials);
	const [editSocialsMedia, setEditSocialsMedia] = useState(false);
	const [socialsMediaInputValue, setSocialsMediaInputValue] = useState('');
	const [accessSubmit, setaccessSubmit] = useState(false);
	const [fieldEditting, setFeildEditting] = useState('');

	const categoryInputContainer = useRef(null);
	const categoryInputWrapper = useRef(null);
	const categoryInput = useRef(null);
	const textArea = useRef(null);
	const userFirstNameRef = useRef(null);
	const userAddressRef = useRef(null);
	const userWorksRef = useRef(null);
	const userSocialsMediaRef = useRef(null);

	const dispatch = useDispatch();
	const currentYear = new Date().getFullYear();

	const days = [{ title: 'Ngày', value: null }].concat(
		[...Array(31)].map((_, index) => ({ value: index + 1, title: String(index + 1) }))
	);

	const months = [{ title: 'Tháng', value: null }].concat(
		[...Array(12)].map((_, index) => ({ value: index + 1, title: String(index + 1) }))
	);

	const years = [{ title: 'Năm', value: null }].concat(
		[...Array(currentYear - YEAR_LIMIT)].map((_, index) => ({
			value: currentYear - index,
			title: String(currentYear - index),
		}))
	);

	const genders = [
		{ value: 'female', title: 'Nữ' },
		{ value: 'male', title: 'Nam' },
		{ value: 'other', title: 'Không xác định' },
	];

	const dateRef = useRef({ value: '01', title: '1' });
	const monthRef = useRef({ value: '01', title: '1' });
	const yearRef = useRef({ value: YEAR_LIMIT, title: YEAR_LIMIT });
	const genderRef = useRef({ value: 'female', title: 'Nữ' });

	useEffect(() => {
		if (userData.birthday) {
			const birthdayData = userData.birthday.slice(0, 10).split('-');
			dateRef.current = { value: birthdayData[2], title: Number(birthdayData[2]) };
			monthRef.current = { value: birthdayData[1], title: Number(birthdayData[1]) };
			yearRef.current = { value: birthdayData[0], title: Number(birthdayData[0]) };
			setUserBirthday(`${birthdayData[2]} / ${birthdayData[1]} / ${birthdayData[0]}`);
		}

		if (userData.gender === 'male') {
			genderRef.current = { value: 'male', title: 'Nam' };
		} else if (userData.gender === 'female') {
			genderRef.current = { value: 'female', title: 'Nữ' };
		} else if (userData.gender === 'other') {
			genderRef.current = { value: 'other', title: 'Không xác định' };
		}
	}, []);

	const onChangeDate = data => {
		data.value = ('0' + data.value).slice(-2);
		dateRef.current = data;
	};
	const onChangeMonth = data => {
		data.value = ('0' + data.value).slice(-2);
		monthRef.current = data;
	};
	const onChangeYear = data => {
		yearRef.current = data;
	};
	const onChangeGender = data => {
		genderRef.current = data;
	};

	const updateInputValue = (e, option) => {
		if (option === 'edit-first-name') {
			setUserFirstName(e.target.value);
		} else if (option === 'edit-last-name') {
			setUserLastName(e.target.value);
		} else if (option === 'edit-address') {
			setUserAddress(e.target.value);
		} else if (option === 'edit-works') {
			setUserWorks(e.target.value);
		} else if (option === 'edit-descriptions') {
			setUserDescriptions(e.target.value);
			textArea.current.style.height = '96px';
			textArea.current.style.height = textArea.current.scrollHeight + 'px';
		} else if (option === 'edit-socials-media') {
			setSocialsMediaInputValue(e.target.value);
		}
	};

	const enableEdit = option => {
		if (option === 'name-editting') {
			setEditName(true);
		} else if (option === 'birthday-editting') {
			setEditBirthday(true);
		} else if (option === 'gender-editting') {
			setEditGender(true);
		} else if (option === 'address-editting') {
			setEditAddress(true);
		} else if (option === 'works-editting') {
			setEditWorks(true);
		} else if (option === 'categories-editting') {
			setEditFavoriteCategories(true);
		} else if (option === 'descriptions-editting') {
			setEditDescriptions(true);
		} else if (option === 'socials-editting') {
			setEditSocialsMedia(true);
		}
		setFeildEditting(option);
	};

	const cancelEdit = option => {
		if (option === 'cancel-edit-name') {
			setEditName(false);
			setUserFirstName(userData.firstName);
			setUserLastName(userData.lastName);
		} else if (option === 'cancel-edit-birthday') {
			setEditBirthday(false);
		} else if (option === 'cancel-edit-gender') {
			setEditGender(false);
			if (userData.gender === 'male') {
				genderRef.current = { value: 'male', title: 'Nam' };
			} else if (userData.gender === 'female') {
				genderRef.current = { value: 'female', title: 'Nữ' };
			} else {
				genderRef.current = { value: 'other', title: 'Không xác định' };
			}
		} else if (option === 'cancel-edit-address') {
			setEditAddress(false);
			setUserAddress(userData.address);
		} else if (option === 'cancel-edit-works') {
			setEditWorks(false);
			setUserWorks(userData.works);
		} else if (option === 'cancel-edit-favorite-categories') {
			setEditFavoriteCategories(false);
			setUserFavoriteCategories([]);
		} else if (option === 'cancel-edit-descriptions') {
			setEditDescriptions(false);
			setUserDescriptions(userData.descriptions);
		} else if (option === 'cancel-edit-socials-media') {
			setEditSocialsMedia(false);
			setSocialsMediaInputValue('');
		}
	};

	const searchCategory = e => {
		setGetDataFinish(false);
		setCategorySearchedList([]);
		setInputCategoryValue(e.target.value);
		debounceSearch(e.target.value, { value: 'addCategory' });
		categoryInputWrapper.current.style.width = categoryInput.current.value.length + 0.5 + 'ch';
	};

	const addCategory = category => {
		if (userFavoriteCategories.filter(categoryAdded => categoryAdded.id === category.id).length > 0) {
			removeCategory(category.id);
		} else {
			const categoryArrayTemp = [...userFavoriteCategories];
			categoryArrayTemp.push(category);
			setUserFavoriteCategories(categoryArrayTemp);
			setInputCategoryValue('');
			setCategorySearchedList([]);
			categoryInputWrapper.current.style.width = '0.5ch';
		}
	};

	const removeCategory = categoryId => {
		const categoryArr = [...userFavoriteCategories];
		const index = categoryArr.findIndex(item => item.id === categoryId);
		categoryArr.splice(index, 1);
		setUserFavoriteCategories(categoryArr);
	};

	const getSuggestionForCreatQuotes = async (input, option) => {
		try {
			const data = await dispatch(getSuggestionForPost({ input, option, userData })).unwrap();
			setCategorySearchedList(data.rows);
		} catch {
			toast.error('Lỗi hệ thống');
		} finally {
			setGetDataFinish(true);
		}
	};

	const debounceSearch = useCallback(
		_.debounce((inputValue, option) => getSuggestionForCreatQuotes(inputValue, option), 700),
		[]
	);

	const editUserProfile = async () => {
		try {
			const params = {
				firstName: userFirstName,
				lastName: userLastName,
				birthday: `${yearRef.current.value}-${monthRef.current.value}-${dateRef.current.value}`,
				gender: genderRef.current.value,
				address: userAddress,
				works: userWorks,
				descriptions: userDescriptions,
				socials: userSocialsMedia,
			};
			const data = { userId: userData.id, params: params };
			const changeUserAvatar = await dispatch(editUserInfo(data)).unwrap();
			if (!_.isEmpty(changeUserAvatar)) {
				dispatch(activeUpdateUserProfileStatus());
				toast.success('Chỉnh sửa thành công', {
					autoClose: 1500,
				});
			}
		} catch {
			toast.error('Chỉnh sửa thất bại');
		}
	};

	const addSocialsMediaLink = () => {
		if (socialsMediaInputValue) {
			const socialsMediaArr = [...userSocialsMedia];
			socialsMediaArr.push(socialsMediaInputValue);
			setEditSocialsMedia(false);
			setSocialsMediaInputValue('');
			setUserSocialsMedia(socialsMediaArr);
		}
	};

	const renderAddSocialsMediaLink = () => {
		return (
			<div className='form-field-wrapper'>
				<div className='form-field'>
					<Input
						type='text'
						isBorder={false}
						placeholder='Nhập link'
						value={socialsMediaInputValue}
						handleChange={e => updateInputValue(e, 'edit-socials-media')}
					/>
				</div>
				<div className='form-field__btn save' onClick={addSocialsMediaLink}>
					Lưu
				</div>
				<div className='form-field__btn cancel' onClick={() => cancelEdit('cancel-edit-socials-media')}>
					Hủy
				</div>
			</div>
		);
	};

	useEffect(() => {
		if (
			editName ||
			editBirthday ||
			editAddress ||
			editGender ||
			editDescriptions ||
			editWorks ||
			!_.isEqual(userData.socials, userSocialsMedia)
		) {
			setaccessSubmit(true);
		} else {
			setaccessSubmit(false);
		}

		if (
			userFirstNameRef.current ||
			userAddressRef.current ||
			userWorksRef.current ||
			textArea.current ||
			userSocialsMediaRef.current
		) {
			if (fieldEditting === 'name-editting') {
				userFirstNameRef.current.focus();
			} else if (fieldEditting === 'address-editting') {
				userAddressRef.current.focus();
			} else if (fieldEditting === 'works-editting') {
				userWorksRef.current.focus();
			} else if (fieldEditting === 'descriptions-editting') {
				const end = textArea.current.value.length;
				textArea.current.setSelectionRange(end, end);
				textArea.current.focus();
			} else if (fieldEditting === 'socials-editting') {
				userSocialsMediaRef.current.focus();
			}
		}
	}, [editName, editBirthday, editAddress, editGender, editDescriptions, editWorks, userSocialsMedia, fieldEditting]);

	return (
		<div className='personal-info-form'>
			<div className='form-field-group'>
				<label className='form-field-label'>Họ và tên</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						{editName ? (
							<div className='form-field-name'>
								<Input
									isBorder={true}
									value={userFirstName}
									handleChange={e => updateInputValue(e, 'edit-first-name')}
									inputRef={userFirstNameRef}
								/>
								<Input
									isBorder={true}
									value={userLastName}
									handleChange={e => updateInputValue(e, 'edit-last-name')}
								/>
							</div>
						) : (
							<div className='form-field-name'>
								<Input isBorder={false} value={userFirstName} disabled />
								<Input isBorder={false} value={userLastName} disabled />
							</div>
						)}
					</div>
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon' onClick={() => enableEdit('name-editting')}>
						<Pencil />
					</div>
					{editName && (
						<div className='form-field__btn cancel' onClick={() => cancelEdit('cancel-edit-name')}>
							Hủy
						</div>
					)}
				</div>
			</div>
			<div className='form-field-group'>
				<label className='form-field-label'>Email</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						<div className='form-field-filled email'>{userData.email}</div>
					</div>
					<div className='btn-icon'>
						<Global />
					</div>
				</div>
			</div>

			<div className='form-field-group'>
				<label className='form-field-label'>Ngày sinh</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						{editBirthday ? (
							<>
								<SelectBox
									name='date'
									list={days}
									defaultOption={dateRef.current}
									onChangeOption={onChangeDate}
								/>
								<SelectBox
									name='month'
									list={months}
									defaultOption={monthRef.current}
									onChangeOption={onChangeMonth}
								/>
								<SelectBox
									name='year'
									list={years}
									defaultOption={yearRef.current}
									onChangeOption={onChangeYear}
								/>
							</>
						) : (
							<>
								{userData.birthday ? (
									<div className='form-field-filled'>{userBirthday}</div>
								) : (
									<div className='form-field__no-data '>Chưa có dữ liệu</div>
								)}
							</>
						)}
					</div>
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon' onClick={() => enableEdit('birthday-editting')}>
						<Pencil />
					</div>
					{editBirthday && (
						<div className='form-field__btn cancel' onClick={() => cancelEdit('cancel-edit-birthday')}>
							Hủy
						</div>
					)}
				</div>
			</div>

			<div className='form-field-group'>
				<label className='form-field-label'>Giới tính</label>
				<div className='form-field-wrapper'>
					{editGender ? (
						<SelectBox
							name='gender'
							list={genders}
							defaultOption={genderRef.current}
							onChangeOption={onChangeGender}
						/>
					) : (
						<>
							{userData.gender ? (
								<div className='form-field-filled gender'>{genderRef.current.title}</div>
							) : (
								<div className='form-field'>
									<div className='form-field__no-data '>Chưa có dữ liệu</div>
								</div>
							)}
						</>
					)}
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon' onClick={() => enableEdit('gender-editting')}>
						<Pencil />
					</div>
					{editGender && (
						<div className='form-field__btn cancel' onClick={() => cancelEdit('cancel-edit-gender')}>
							Hủy
						</div>
					)}
				</div>
			</div>

			<div className='form-field-group'>
				<label className='form-field-label'>Địa chỉ</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						{editAddress ? (
							<Input
								isBorder={true}
								placeholder='Nhập địa chỉ'
								value={userAddress}
								handleChange={e => updateInputValue(e, 'edit-address')}
								inputRef={userAddressRef}
							/>
						) : (
							<>
								{userData.address ? (
									<Input isBorder={false} value={userAddress} disabled />
								) : (
									<div className='form-field__no-data '>Chưa có dữ liệu</div>
								)}
							</>
						)}
					</div>
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon' onClick={() => enableEdit('address-editting')}>
						<Pencil />
					</div>
					{editAddress && (
						<div className='form-field__btn cancel' onClick={() => cancelEdit('cancel-edit-address')}>
							Hủy
						</div>
					)}
				</div>
			</div>

			<div className='form-field-group'>
				<label className='form-field-label'>Công việc</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						{editWorks ? (
							<Input
								isBorder={true}
								placeholder='Nhập công việc'
								value={userWorks}
								handleChange={e => updateInputValue(e, 'edit-works')}
								inputRef={userWorksRef}
							/>
						) : (
							<>
								{userData.works ? (
									<Input isBorder={false} value={userWorks} disabled />
								) : (
									<div className='form-field__no-data '>Chưa có dữ liệu</div>
								)}
							</>
						)}
					</div>
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon' onClick={() => enableEdit('works-editting')}>
						<Pencil />
					</div>
					{editWorks && (
						<div className='form-field__btn cancel' onClick={() => cancelEdit('cancel-edit-works')}>
							Hủy
						</div>
					)}
				</div>
			</div>

			<div className='form-field-group'>
				<label className='form-field-label'>Chủ đề yêu thích</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						{editFavoriteCategories ? (
							<AddAndSearchCategories
								categoryAddedList={userFavoriteCategories}
								categorySearchedList={categorySearchedList}
								addCategory={addCategory}
								removeCategory={removeCategory}
								getDataFinish={getDataFinish}
								searchCategory={searchCategory}
								inputCategoryValue={inputCategoryValue}
								categoryInputContainer={categoryInputContainer}
								categoryInputWrapper={categoryInputWrapper}
								categoryInput={categoryInput}
								hasSearchIcon={false}
							/>
						) : (
							<>
								{userData.favoriteCategories ? (
									<div className='form-field-filled'>categories</div>
								) : (
									<div className='form-field__no-data '>Chưa có dữ liệu</div>
								)}
							</>
						)}
					</div>
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon' onClick={() => enableEdit('categories-editting')}>
						<Pencil />
					</div>
					{editFavoriteCategories && (
						<div
							className='form-field__btn cancel'
							onClick={() => cancelEdit('cancel-edit-favorite-categories')}
						>
							Hủy
						</div>
					)}
				</div>
			</div>

			<div className='form-field-group'>
				<label className='form-field-label'>Giới thiệu</label>
				<div
					className={classNames('form-field-wrapper', {
						'form-field-wrapper--custom': userData.descriptions || editDescriptions,
					})}
				>
					{editDescriptions ? (
						<div className='form-field--custom'>
							<textarea
								ref={textArea}
								className='form-field-textarea'
								rows={3}
								placeholder='Nhập lời giới thiệu bản thân'
								value={userDescriptions}
								onChange={e => updateInputValue(e, 'edit-descriptions')}
							/>
						</div>
					) : (
						<>
							{userData.descriptions ? (
								<div className='form-field--custom'>
									<div className='form-field-textarea'>{userData.descriptions}</div>
								</div>
							) : (
								<div className='form-field'>
									<div className='form-field__no-data '>Chưa có dữ liệu</div>
								</div>
							)}
						</>
					)}
					<div
						className={
							editDescriptions || userData.descriptions
								? 'form-field__buttons'
								: 'form-field__buttons no-data'
						}
					>
						<div className='btn-icon'>
							<Global />
						</div>
						<div className='btn-icon'>
							<Pencil onClick={() => enableEdit('descriptions-editting')} />
						</div>
						{editDescriptions && (
							<div
								className='form-field__btn cancel'
								onClick={() => cancelEdit('cancel-edit-descriptions')}
							>
								Hủy
							</div>
						)}
					</div>
				</div>
			</div>

			<div className='form-field-group'>
				<label className='form-field-label'>URL Mạng xã hội khác</label>
				{userSocialsMedia.length > 0 ? (
					<>
						{userSocialsMedia.map((item, index) => (
							<div className='form-field-wrapper socials-link' key={index}>
								<div className='form-field'>
									<div className='form-field-filled'>{item}</div>
								</div>
								<div className='btn-icon'>
									<Global />
								</div>
								{/* <div className='btn-icon'>
									<Pencil />
								</div> */}
								{!editSocialsMedia && index === userSocialsMedia.length - 1 && (
									<div className='btn-icon' onClick={() => enableEdit('socials-editting')}>
										<Add />
									</div>
								)}
							</div>
						))}
						{editSocialsMedia && renderAddSocialsMediaLink()}
					</>
				) : (
					<>
						{editSocialsMedia ? (
							renderAddSocialsMediaLink()
						) : (
							<div className='form-field-wrapper'>
								<div className='form-field'>
									<div className='form-field__no-data '>Chưa có dữ liệu</div>
								</div>
								<div className='btn-icon' onClick={() => setEditSocialsMedia(true)}>
									<Add />
								</div>
							</div>
						)}
					</>
				)}
			</div>

			<div className='personal-info-form__btn__container'>
				<button
					className={classNames('personal-info__btn__submit', { 'active': accessSubmit })}
					onClick={editUserProfile}
					disabled={!accessSubmit}
				>
					Lưu thay đổi
				</button>
			</div>
		</div>
	);
};

PersonalInfoForm.propTypes = { userData: PropTypes.object };

export default PersonalInfoForm;
