import { Pencil } from 'components/svg';
import { YEAR_LIMIT } from 'constants';
import { useEffect, useState, useRef } from 'react';
import Input from 'shared/input';
import '../personal-info.scss';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { editUserInfo } from 'reducers/redux-utils/user';
import PropTypes from 'prop-types';
// import ShareModeDropdown from 'shared/share-mode-dropdown';
import InputType from './input-type';
import DropdownType from './dropdown-type';
import SelectType from './select-type';
import TextareaType from './textarea-type';
import GroupType from './group-type';
import { updateUserInfo } from 'reducers/redux-utils/auth';

const PersonalInfoForm = ({ userData, toggleModal }) => {
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
	const [editDescriptions, setEditDescriptions] = useState(false);
	const [userDescriptions, setUserDescriptions] = useState(userData.descriptions);
	const [userSocialsMedia, setUserSocialsMedia] = useState(userData.socials || []);
	const [editSocialsMedia, setEditSocialsMedia] = useState(false);
	const [socialsMediaInputValue, setSocialsMediaInputValue] = useState('');
	const [accessSubmit, setaccessSubmit] = useState(false);
	const [fieldEditting, setFeildEditting] = useState('');
	const [userHighSchool, setUserHighschool] = useState(userData.highSchool);
	const [editHighSchool, setEditHighSchool] = useState(false);
	const [userUniversity, setUserUniversity] = useState(userData.university);
	const [editUniversity, setEditUniversity] = useState(false);
	const [userInterest, setUserInterest] = useState(userData.interest);
	const [editInterest, setEditInterest] = useState(false);

	const textareaRef = useRef(null);
	const userFirstNameRef = useRef(null);
	const userAddressRef = useRef(null);
	const userWorksRef = useRef(null);
	const userSocialsMediaRef = useRef(null);
	const dateRef = useRef({ value: '01', title: '1' });
	const monthRef = useRef({ value: '01', title: '1' });
	const yearRef = useRef({ value: YEAR_LIMIT, title: YEAR_LIMIT });
	const birthdayArray = useRef([]);
	const genderRef = useRef({ value: 'female', title: 'Nữ' });
	const genderArray = useRef([]);
	const userFavoriteCategoriesOrigin = useRef([]);
	const userHighSchoolRef = useRef(null);
	const userUniversityRef = useRef(null);
	const userInterestRef = useRef(null);
	const favoriteCategoriesAddId = useRef([]);

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

		if (userData.favoriteCategory.length > 0) {
			const newArray = [];
			userData.favoriteCategory.forEach(item => {
				newArray.push(item.category);
			});
			userFavoriteCategoriesOrigin.current = newArray;
			setUserFavoriteCategories(newArray);
		}
	}, []);

	useEffect(() => {
		const newArray = [
			{ name: 'date', list: days, defaultOption: dateRef.current, onChangeOption: onChangeDate },
			{ name: 'month', list: months, defaultOption: monthRef.current, onChangeOption: onChangeMonth },
			{ name: 'year', list: years, defaultOption: yearRef.current, onChangeOption: onChangeYear },
		];
		birthdayArray.current = newArray;
	}, [dateRef.current, monthRef.current, yearRef.current]);

	useEffect(() => {
		const newArray = [
			{ name: 'gender', list: genders, defaultOption: genderRef.current, onChangeOption: onChangeGender },
		];
		genderArray.current = newArray;
	}, [genderRef.current]);

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
			textareaRef.current.style.height = '96px';
			textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
		} else if (option === 'edit-socials-media') {
			setSocialsMediaInputValue(e.target.value);
		} else if (option === 'edit-high-school') {
			setUserHighschool(e.target.value);
		} else if (option === 'edit-university') {
			setUserUniversity(e.target.value);
		} else if (option === 'edit-interest') {
			setUserInterest(e.target.value);
		}
	};

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
		}
	}, [textareaRef.current]);

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
		} else if (option === 'high-school-editting') {
			setEditHighSchool(true);
		} else if (option === 'university-editting') {
			setEditUniversity(true);
		} else if (option === 'interest-editting') {
			setEditInterest(true);
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
			setUserFavoriteCategories(userFavoriteCategoriesOrigin.current);
		} else if (option === 'cancel-edit-descriptions') {
			setEditDescriptions(false);
			setUserDescriptions(userData.descriptions);
		} else if (option === 'cancel-edit-socials-media') {
			setEditSocialsMedia(false);
			setSocialsMediaInputValue('');
		} else if (option === 'cancel-edit-high-school') {
			setEditHighSchool(false);
			setUserHighschool(userData.highSchool);
		} else if (option === 'cancel-edit-university') {
			setEditUniversity(false);
			setUserUniversity(userData.university);
		} else if (option === 'cancel-edit-interest') {
			setEditInterest(false);
			setUserInterest(userData.interest);
		}
	};

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
				favoriteCategory: favoriteCategoriesAddId.current,
			};
			const data = { userId: userData.id, params: params };
			const userDataChanged = await dispatch(editUserInfo(data)).unwrap();
			if (!_.isEmpty(userDataChanged)) {
				const customId = 'custom-id-PersonalInfoForm-editUserProfile-success';
				toast.success('Chỉnh sửa thành công', {
					autoClose: 1500,
					toastId: customId,
				});
			}
			dispatch(updateUserInfo(userDataChanged));
			toggleModal();
		} catch {
			const customId = 'custom-id-PersonalInfoForm-editUserProfile-error';
			toast.error('Chỉnh sửa thất bại', { toastId: customId });
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

	useEffect(() => {
		if (
			editName ||
			editBirthday ||
			editGender ||
			editAddress ||
			editWorks ||
			editDescriptions ||
			editFavoriteCategories ||
			!_.isEqual(userData.socials, userSocialsMedia) ||
			editHighSchool ||
			editUniversity ||
			editInterest
		) {
			setaccessSubmit(true);
		} else {
			setaccessSubmit(false);
		}

		if (userFirstNameRef.current && fieldEditting === 'name-editting') {
			userFirstNameRef.current.focus();
		} else if (userAddressRef.current && fieldEditting === 'address-editting') {
			userAddressRef.current.focus();
		} else if (userWorksRef.current && fieldEditting === 'works-editting') {
			userWorksRef.current.focus();
		} else if (textareaRef.current && fieldEditting === 'descriptions-editting') {
			const end = textareaRef.current.value.length;
			textareaRef.current.setSelectionRange(end, end);
			textareaRef.current.focus();
		} else if (userSocialsMediaRef.current && fieldEditting === 'socials-editting') {
			userSocialsMediaRef.current.focus();
		} else if (userHighSchoolRef.current && fieldEditting === 'high-school-editting') {
			userHighSchoolRef.current.focus();
		} else if (userUniversityRef.current && fieldEditting === 'university-editting') {
			userUniversityRef.current.focus();
		} else if (userInterestRef.current && fieldEditting === 'interest-editting') {
			userInterestRef.current.focus();
		}
	}, [
		editName,
		editBirthday,
		editGender,
		editAddress,
		editWorks,
		editDescriptions,
		editSocialsMedia,
		fieldEditting,
		editHighSchool,
		editUniversity,
		editInterest,
	]);

	useEffect(() => {
		const arrayTemp = [];
		userFavoriteCategories.forEach(item => {
			arrayTemp.push(item.id);
		});
		favoriteCategoriesAddId.current = arrayTemp;
	}, [userFavoriteCategories]);

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
									placeholder='Họ'
								/>
								<Input
									isBorder={true}
									value={userLastName}
									handleChange={e => updateInputValue(e, 'edit-last-name')}
									placeholder='Tên'
								/>
							</div>
						) : (
							<div className='form-field-name'>
								<Input isBorder={false} value={userFirstName} disabled />
								<Input isBorder={false} value={userLastName} disabled />
							</div>
						)}
					</div>

					{/* <ShareModeDropdown /> */}

					{editName ? (
						<div className='form-field__btn cancel' onClick={() => cancelEdit('cancel-edit-name')}>
							Hủy
						</div>
					) : (
						<div className='btn-icon' onClick={() => enableEdit('name-editting')}>
							<Pencil />
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
					{/* <ShareModeDropdown /> */}
				</div>
			</div>

			<DropdownType
				option='birthday'
				data={birthdayArray.current}
				editStatus={editBirthday}
				userData={userData.birthday}
				displayData={userBirthday}
				cancelEdit={cancelEdit}
				enableEdit={enableEdit}
			/>

			<DropdownType
				option='gender'
				data={genderArray.current}
				editStatus={editGender}
				userData={userData.gender}
				displayData={genderRef.current.title}
				cancelEdit={cancelEdit}
				enableEdit={enableEdit}
			/>

			<InputType
				option='address'
				editStatus={editAddress}
				inputValue={userAddress}
				updateInputValue={updateInputValue}
				inputRef={userAddressRef}
				cancelEdit={cancelEdit}
				enableEdit={enableEdit}
			/>

			<InputType
				option='works'
				editStatus={editWorks}
				inputValue={userWorks}
				updateInputValue={updateInputValue}
				inputRef={userWorksRef}
				cancelEdit={cancelEdit}
				enableEdit={enableEdit}
			/>

			<InputType
				option='high-school'
				editStatus={editHighSchool}
				inputValue={userHighSchool}
				updateInputValue={updateInputValue}
				inputRef={userHighSchoolRef}
				cancelEdit={cancelEdit}
				enableEdit={enableEdit}
			/>

			<InputType
				option='university'
				editStatus={editUniversity}
				inputValue={userUniversity}
				updateInputValue={updateInputValue}
				inputRef={userUniversityRef}
				cancelEdit={cancelEdit}
				enableEdit={enableEdit}
			/>

			<SelectType
				dataAdded={userFavoriteCategories}
				setDataAdded={setUserFavoriteCategories}
				editStatus={editFavoriteCategories}
				cancelEdit={cancelEdit}
				enableEdit={enableEdit}
			/>

			<InputType
				option='interest'
				editStatus={editInterest}
				inputValue={userInterest}
				updateInputValue={updateInputValue}
				inputRef={userInterestRef}
				cancelEdit={cancelEdit}
				enableEdit={enableEdit}
			/>

			<TextareaType
				textareaValue={userDescriptions}
				editStatus={editDescriptions}
				textareaRef={textareaRef}
				updateInputValue={updateInputValue}
				cancelEdit={cancelEdit}
				enableEdit={enableEdit}
			/>

			<GroupType
				dataArray={userSocialsMedia}
				socialsMediaInputValue={socialsMediaInputValue}
				updateInputValue={updateInputValue}
				userSocialsMediaRef={userSocialsMediaRef}
				editStatus={editSocialsMedia}
				cancelEdit={cancelEdit}
				enableEdit={enableEdit}
				addSocialsMediaLink={addSocialsMediaLink}
			/>

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
