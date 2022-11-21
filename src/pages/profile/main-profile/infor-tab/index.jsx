import BadgeList from 'shared/badge-list';
import Input from 'shared/input';
import './infor-tab.scss';
import PropTypes from 'prop-types';
import { useState, useEffect, memo } from 'react';
import { YEAR_LIMIT } from 'constants/index';

const InforTab = ({ userInfo, currentTab }) => {
	const [date, setDate] = useState(1);
	const [month, setMonth] = useState(1);
	const [year, setYear] = useState(YEAR_LIMIT);

	const gender = { 'male': 'Nam', 'female': 'Nữ', 'other': 'Không xác định' };

	useEffect(() => {
		if (userInfo.birthday) {
			const birthdayData = userInfo.birthday.slice(0, 10).split('-');
			setDate(birthdayData[2]);
			setMonth(birthdayData[1]);
			setYear(birthdayData[0]);
		}
	}, [userInfo]);

	return (
		<div className='infor-tab'>
			{currentTab === 'infor' && (
				<>
					<h4 className='infor-tab__heading'>Thông tin cơ bản</h4>
					<div>
						<div className='row'>
							<div className='col-6'>
								<div className='form-field-group'>
									<label className='form-field-label'>Tên</label>
									<div className='form-field'>
										<Input
											type='text'
											placeholder='Nhập tên'
											isBorder={false}
											disabled
											value={userInfo.fullName}
											readOnly={true}
										/>
									</div>
								</div>
							</div>
							<div className='col-6 gender'>
								<div className='form-field-group'>
									<label className='form-field-label'>Giới tính</label>

									<div className='form-field'>
										{userInfo.gender ? (
											<div className='form-field-filled'>{gender[userInfo.gender]}</div>
										) : (
											<div className='form-field__no-data '>Chưa có dữ liệu</div>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className='row'>
							<div className='col-6'>
								<div className='form-field-group'>
									<label className='form-field-label'>Ngày sinh</label>
									{userInfo.birthday ? (
										<div className='row'>
											<div className='col-4 '>
												<div className='form-field'>
													<Input
														type='text'
														placeholder='Ngày'
														isBorder={false}
														disabled
														value={date}
														readOnly={true}
													/>
												</div>
											</div>
											<div className='col-4 '>
												<div className='form-field'>
													<Input
														type='text'
														isBorder={false}
														disabled
														value={month}
														readOnly={true}
													/>
												</div>
											</div>
											<div className='col-4 '>
												<div className='form-field'>
													<Input
														type='text'
														placeholder='Năm'
														isBorder={false}
														disabled
														value={year}
														readOnly={true}
													/>
												</div>
											</div>
										</div>
									) : (
										<div className='form-field'>
											<div className='form-field__no-data '>Chưa có dữ liệu</div>
										</div>
									)}
								</div>
							</div>
							<div className='col-6'>
								<div className='form-field-group'>
									<label className='form-field-label'>Địa chỉ</label>
									<div className='form-field'>
										{userInfo.address ? (
											<Input
												type='text'
												placeholder='Nhập địa chỉ'
												isBorder={false}
												disabled
												value={userInfo.address}
												readOnly={true}
											/>
										) : (
											<div className='form-field__no-data '>Chưa có dữ liệu</div>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className='row'>
							<div className='col-6'>
								<div className='form-field-group'>
									<label className='form-field-label'>Trường trung học</label>
									<div className='form-field'>
										{userInfo.highSchool ? (
											<Input
												type='text'
												placeholder='Nhập địa chỉ'
												isBorder={false}
												disabled
												value={userInfo.highSchool}
												readOnly={true}
											/>
										) : (
											<div className='form-field__no-data '>Chưa có dữ liệu</div>
										)}
									</div>
								</div>
							</div>
							<div className='col-6'>
								<div className='form-field-group'>
									<label className='form-field-label'>Đại học/Cao đẳng</label>
									<div className='form-field'>
										{userInfo.university ? (
											<Input
												type='text'
												placeholder='Nhập địa chỉ'
												isBorder={false}
												disabled
												value={userInfo.university}
												readOnly={true}
											/>
										) : (
											<div className='form-field__no-data '>Chưa có dữ liệu</div>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className='row'>
							<div className='col-6'>
								<div className='form-field-group'>
									<label className='form-field-label'>Công việc</label>
									<div className='form-field'>
										{userInfo.works ? (
											<Input
												type='text'
												isBorder={false}
												disabled
												value={userInfo.works}
												readOnly={true}
											/>
										) : (
											<div className='form-field__no-data '>Chưa có dữ liệu</div>
										)}
									</div>
								</div>
							</div>
							<div className='col-6'>
								<div className='form-field-group'>
									<label className='form-field-label'>URL Mạng xã hội khác</label>
									{userInfo.socials ? (
										<>
											{userInfo.socials.map((item, index) => (
												<div className='form-field-socials-link' key={index}>
													<div className='form-field'>
														<Input
															type='text'
															isBorder={false}
															value={item}
															readOnly={true}
														/>
													</div>
												</div>
											))}
										</>
									) : (
										<div className='form-field'>
											<div className='form-field__no-data '>Chưa có dữ liệu</div>
										</div>
									)}
								</div>
							</div>
						</div>

						<div className='row'>
							<div className='col-6'>
								<div className='form-field-group'>
									<label className='form-field-label'>Sở thích</label>
									<div className='form-field'>
										{userInfo.interest ? (
											<Input
												type='text'
												isBorder={false}
												disabled
												value={userInfo.interest}
												readOnly={true}
											/>
										) : (
											<div className='form-field__no-data '>Chưa có dữ liệu</div>
										)}
									</div>
								</div>
							</div>
							<div className='col-6'>
								<div className='form-field-group'>
									<label className='form-field-label '>Chủ đề yêu thích</label>
									{userInfo?.favoriteCategory?.length > 0 ? (
										<div className='form-field form-field-flex'>
											<BadgeList list={userInfo.favoriteCategory} className='form-field-badge' />
										</div>
									) : (
										<div className='form-field'>
											<div className='form-field__no-data'>Chưa có dữ liệu</div>
										</div>
									)}
								</div>
							</div>
						</div>

						<div className='row'>
							<div className='col-12'>
								<div className='form-field-group'>
									<label className='form-field-label'>Giới thiệu</label>
									{userInfo.descriptions ? (
										<div className='form-field-textarea'>{userInfo.descriptions}</div>
									) : (
										<div className='form-field'>
											<div className='form-field__no-data'>Chưa có dữ liệu</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

InforTab.propTypes = { userInfo: PropTypes.object, currentTab: PropTypes.string };

export default memo(InforTab);
