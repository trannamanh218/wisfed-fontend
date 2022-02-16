import { Global, Pencil } from 'components/svg';
import { YEAR_LIMIT } from 'constants';
import React from 'react';
import { useRef } from 'react';
import { Form } from 'react-bootstrap';
import Input from 'shared/input';
import SelectBox from 'shared/select-box';
import './personal-info.scss';

const PersonalInfoForm = () => {
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

	const dateRef = useRef({ value: 19, title: 19 });
	const monthRef = useRef({ value: 4, title: 4 });
	const yearRef = useRef({ value: 1987, title: 1987 });
	const genderRef = useRef({ value: 'female', title: 'Nữ' });

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

	return (
		<Form className='personal-info-form'>
			<div className='form-field-group'>
				<label className='form-field-label'>Tên</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						<Input type='text' isBorder={false} placeholder='Nhập tên' value='Phi Phuong Anh' />
					</div>
					<span className='btn-icon'>
						<Global />
					</span>
					<span className='btn-icon'>
						<Pencil />
					</span>
				</div>
			</div>
			<div className='form-field-group'>
				<label className='form-field-label'>Email</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						<Input type='text' isBorder={false} placeholder='Nhập tên' value='phuonganh@gmail.com' />
					</div>
					<span className='btn-icon'>
						<Global />
					</span>
					<span className='btn-icon'>
						<Pencil />
					</span>
				</div>
			</div>

			<div className='form-field-group'>
				<label className='form-field-label'>Ngày sinh</label>
				<div className='form-field-wrapper'>
					<SelectBox name='date' list={days} defaultOption={dateRef.current} onChangeOption={onChangeDate} />
					<SelectBox
						name='month'
						list={months}
						defaultOption={monthRef.current}
						onChangeOption={onChangeMonth}
					/>
					<SelectBox name='year' list={years} defaultOption={yearRef.current} onChangeOption={onChangeYear} />
					<span className='btn-icon'>
						<Global />
					</span>
				</div>
			</div>

			<div className='form-field-group'>
				<label className='form-field-label'>Giới tính</label>
				<div className='form-field-wrapper'>
					<SelectBox
						name='gender'
						list={genders}
						defaultOption={genderRef.current}
						onChangeOption={onChangeGender}
					/>
					<span className='btn-icon'>
						<Global />
					</span>
				</div>
			</div>

			<div className='form-field-group'>
				<label className='form-field-label'>Địa chỉ</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						<Input type='text' isBorder={false} placeholder='Nhập địa chỉ' value='Ha noi' />
					</div>
					<span className='btn-icon'>
						<Global />
					</span>
					<span className='btn-icon'>
						<Pencil />
					</span>
				</div>
			</div>
			<div className='form-field-group'>
				<label className='form-field-label'>Công việc</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						<Input type='text' isBorder={false} placeholder='Nhập công việc' value='Developer' />
					</div>
					<span className='btn-icon'>
						<Global />
					</span>
					<span className='btn-icon'>
						<Pencil />
					</span>
				</div>
			</div>
			<div className='form-field-group'>
				<label className='form-field-label'>Chủ đề yêu thich</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						<Input type='text' isBorder={false} placeholder='Nhập chủ đề yêu thích' value='Ha noi' />
					</div>
					<span className='btn-icon'>
						<Global />
					</span>
					<span className='btn-icon'>
						<Pencil />
					</span>
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
					<span className='btn-icon'>
						<Global />
					</span>
					<span className='btn-icon'>
						<Pencil />
					</span>
				</div>
			</div>

			<div className='form-field-group'>
				<label className='form-field-label'>URL Mạng xã hội khác</label>
				<div className='form-field-wrapper'>
					<div className='form-field'>
						<Input type='text' isBorder={false} placeholder='Nhập link' value='www.facebook.com/duyquang' />
					</div>
					<span className='btn-icon'>
						<Global />
					</span>
					<span className='btn-icon'>
						<Pencil />
					</span>
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
