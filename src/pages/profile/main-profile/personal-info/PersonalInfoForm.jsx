import { Global, Pencil } from 'components/svg';
import { YEAR_LIMIT } from 'constants';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Form } from 'react-bootstrap';
import Input from 'shared/input';
import SelectBox from 'shared/select-box';
import './personal-info.scss';

const PersonalInfoForm = ({ userData }) => {
	const [userFirstName, setUserFirstName] = useState('');
	const [userLastName, setUserLastName] = useState('');
	const [editName, setEditName] = useState(false);
	const [userEmail, setUserEmail] = useState('');
	const [editEmail, setEditEmail] = useState(false);
	const [userBirthday, setUserBirthday] = useState('');
	const [editBirthday, setEditBirthday] = useState(false);
	const [editGender, setEditGender] = useState(false);
	const [userAddress, setUserAddress] = useState('');
	const [editAddress, setEditAddress] = useState(false);
	const [userWorks, setUserWorks] = useState('');
	const [editWorks, setEditWorks] = useState(false);
	const [userFavouriteCategories, setUserFavouriteCategories] = useState('');
	const [editFavouriteCategories, setEditFavouriteCategories] = useState(false);

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
		{ value: 'noneOfThem', title: 'Không xác định' },
	];

	const dateRef = useRef({});
	const monthRef = useRef({});
	const yearRef = useRef({});
	const genderRef = useRef({});

	useEffect(() => {
		const birthdayData = userData.birthday.slice(0, 10).split('-');
		dateRef.current = { value: Number(birthdayData[2]), title: Number(birthdayData[2]) };
		monthRef.current = { value: Number(birthdayData[1]), title: Number(birthdayData[1]) };
		yearRef.current = { value: Number(birthdayData[0]), title: Number(birthdayData[0]) };
		setUserBirthday(`${birthdayData[2]} / ${birthdayData[1]} / ${birthdayData[0]}`);
		if (userData.gender === 'male') {
			genderRef.current = { value: 'male', title: 'Nam' };
		} else if (userData.gender === 'female') {
			genderRef.current = { value: 'female', title: 'Nữ' };
		} else {
			genderRef.current = { value: 'noneOfThem', title: 'Không xác định' };
		}
	}, []);

	const onChangeDate = data => {
		dateRef.current = data;
	};
	const onChangeMonth = data => {
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
		} else if (option === 'edit-email') {
			setUserEmail(e.target.value);
		} else if (option === 'edit-address') {
			setUserAddress(e.target.value);
		} else if (option === 'edit-works') {
			setUserWorks(e.target.value);
		}
	};

	const cancelEdit = option => {
		if (option === 'cancel-edit-name') {
			setEditName(false);
			setUserFirstName('');
			setUserLastName('');
		} else if (option === 'cancel-edit-email') {
			setEditEmail(false);
			setUserEmail('');
		} else if (option === 'cancel-edit-birthday') {
			setEditBirthday(false);
		} else if (option === 'cancel-edit-gender') {
			setEditGender(false);
			if (userData.gender === 'male') {
				genderRef.current = { value: 'male', title: 'Nam' };
			} else if (userData.gender === 'female') {
				genderRef.current = { value: 'female', title: 'Nữ' };
			} else {
				genderRef.current = { value: 'noneOfThem', title: 'Không xác định' };
			}
		} else if (option === 'cancel-edit-address') {
			setEditAddress(false);
			setUserAddress('');
		} else if (option === 'cancel-edit-works') {
			setEditWorks(false);
			setUserWorks('');
		}
	};

	return (
		<Form className='personal-info-form'>
			<div className='form-field-group'>
				<label className='form-field-label'>Họ và tên</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						{editName ? (
							<div className='form-field-name'>
								<Input
									type='text'
									isBorder={false}
									placeholder='Họ'
									value={userFirstName}
									handleChange={e => updateInputValue(e, 'edit-first-name')}
								/>
								<Input
									type='text'
									isBorder={false}
									placeholder='Tên'
									value={userLastName}
									handleChange={e => updateInputValue(e, 'edit-last-name')}
								/>
							</div>
						) : (
							<div className='form-field-name'>
								<Input type='text' isBorder={false} value={userData.firstName} />
								<Input type='text' isBorder={false} value={userData.lastName} />
							</div>
						)}
					</div>
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon' onClick={() => setEditName(true)}>
						<Pencil />
					</div>
					{editName && (
						<div className='form-field__cancel-btn' onClick={() => cancelEdit('cancel-edit-name')}>
							Hủy
						</div>
					)}
				</div>
			</div>
			<div className='form-field-group'>
				<label className='form-field-label'>Email</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						{editEmail ? (
							<Input
								type='text'
								isBorder={false}
								placeholder='Nhập email'
								value={userEmail}
								handleChange={e => updateInputValue(e, 'edit-email')}
							/>
						) : (
							<Input type='text' isBorder={false} value={userData.email} />
						)}
					</div>
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon' onClick={() => setEditEmail(true)}>
						<Pencil />
					</div>
					{editEmail && (
						<div className='form-field__cancel-btn' onClick={() => cancelEdit('cancel-edit-email')}>
							Hủy
						</div>
					)}
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
							<Input type='text' isBorder={false} value={userBirthday} />
						)}
					</div>
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon' onClick={() => setEditBirthday(true)}>
						<Pencil />
					</div>
					{editBirthday && (
						<div className='form-field__cancel-btn' onClick={() => cancelEdit('cancel-edit-birthday')}>
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
						<div className='form-field-filled__gender'>{genderRef.current.title}</div>
					)}
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon' onClick={() => setEditGender(true)}>
						<Pencil />
					</div>
					{editGender && (
						<div className='form-field__cancel-btn' onClick={() => cancelEdit('cancel-edit-gender')}>
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
								type='text'
								isBorder={false}
								placeholder='Nhập địa chỉ'
								value={userAddress}
								handleChange={e => updateInputValue(e, 'edit-address')}
							/>
						) : (
							<>
								{userData.address ? (
									<Input type='text' isBorder={false} value={userData.address} />
								) : (
									<div className='form-field__no-data '>Chưa có dữ liệu</div>
								)}
							</>
						)}
					</div>
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon' onClick={() => setEditAddress(true)}>
						<Pencil />
					</div>
					{editAddress && (
						<div className='form-field__cancel-btn' onClick={() => cancelEdit('cancel-edit-address')}>
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
								type='text'
								isBorder={false}
								placeholder='Nhập côn việc'
								value={userWorks}
								handleChange={e => updateInputValue(e, 'edit-works')}
							/>
						) : (
							<>
								{userData.address ? (
									<Input type='text' isBorder={false} value={userData.works} />
								) : (
									<div className='form-field__no-data '>Chưa có dữ liệu</div>
								)}
							</>
						)}
					</div>
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon' onClick={() => setEditWorks(true)}>
						<Pencil />
					</div>
					{editWorks && (
						<div className='form-field__cancel-btn' onClick={() => cancelEdit('cancel-edit-works')}>
							Hủy
						</div>
					)}
				</div>
			</div>

			<div className='form-field-group'>
				<label className='form-field-label'>Chủ đề yêu thích</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						<Input type='text' isBorder={false} placeholder='Nhập chủ đề yêu thích' value='Ha noi' />
					</div>
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon'>
						<Pencil />
					</div>
				</div>
			</div>

			<div className='form-field-group'>
				<label className='form-field-label'>Giới thiệu</label>
				<div className='form-field form-field--custom'>
					<textarea
						className='form-field-textarea'
						rows={10}
						placeholder='Nhập giới thiệu bản thân'
						value='lorem nfken elkefv vrdne'
					/>
				</div>
				<div className='form-field-wrapper form-field-wrapper--custom'>
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon'>
						<Pencil />
					</div>
				</div>
			</div>

			<div className='form-field-group'>
				<label className='form-field-label'>URL Mạng xã hội khác</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						<Input type='text' isBorder={false} placeholder='Nhập link' value='www.facebook.com/duyquang' />
					</div>
					<div className='btn-icon'>
						<Global />
					</div>
					<div className='btn-icon'>
						<Pencil />
					</div>
				</div>
			</div>
			<div className='personal-info-form__btn__container'>
				<button type='submit' className='personal-info__btn__submit'>
					Lưu thay đổi
				</button>
			</div>
		</Form>
	);
};

PersonalInfoForm.propTypes = {};

export default PersonalInfoForm;
