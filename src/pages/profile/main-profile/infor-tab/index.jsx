import BadgeList from 'shared/badge-list';
import Input from 'shared/input';
import './infor-tab.scss';
import PropTypes from 'prop-types';

const InforTab = ({ userInfo }) => {
	const getGender = {
		'female': 'Nữ',
		'male': 'Nam',
		'unidentified': 'Không xác định',
	};

	return (
		<div className='infor-tab'>
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
								/>
							</div>
						</div>
					</div>
					<div className='col-2'>
						<div className='form-field-group'>
							<label className='form-field-label'>Giới tính</label>
							<div className='form-field'>
								<Input
									type='text'
									placeholder='Nhập giới tính'
									isBorder={false}
									disabled
									value={getGender[userInfo.gender]}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className='row'>
					<div className='col-6'>
						<div className='form-field-group'>
							<label className='form-field-label'>Ngày sinh</label>
							<div className='row'>
								<div className='col-4 '>
									<div className='form-field'>
										<Input type='text' placeholder='Ngày' isBorder={false} disabled value={27} />
									</div>
								</div>
								<div className='col-4 '>
									<div className='form-field'>
										<Input type='text' placeholder='Tháng' isBorder={false} disabled value={4} />
									</div>
								</div>
								<div className='col-4 '>
									<div className='form-field'>
										<Input type='text' placeholder='Năm' isBorder={false} disabled value={1986} />
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='col-6'>
						<div className='form-field-group'>
							<label className='form-field-label'>Địa chỉ</label>
							<div className='form-field'>
								<Input
									type='text'
									placeholder='Nhập địa chỉ'
									isBorder={false}
									disabled
									value={userInfo.address}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className='row'>
					<div className='col-6'>
						<div className='form-field-group'>
							<label className='form-field-label'>Công việc</label>
							<div className='form-field'>
								<Input type='text' isBorder={false} disabled value={userInfo.works} />
							</div>
						</div>
					</div>
					<div className='col-6'>
						<div className='form-field-group'>
							<label className='form-field-label'>URL Mạng xã hội khác</label>
							<div className='form-field'>
								{/* <Input
									type='text'
									isBorder={false}
									disabled
									value={userInfo?.socials[0]}
								/> */}
							</div>
						</div>
					</div>
				</div>

				<div className='row'>
					<div className='col-6'>
						<div className='form-field-group'>
							<label className='form-field-label '>Chủ đề yêu thích</label>
							<div className='form-field form-field-flex '>
								<BadgeList list={userInfo?.favoriteCategories} className='form-field-badge' />
							</div>
						</div>
					</div>
					<div className='col-6'></div>
				</div>
				<div className='row'>
					<div className='col-12'>
						<div className='form-field-group'>
							<label className='form-field-label'>Giới thiệu</label>
							<div className='form-field-textarea'>{userInfo.descriptions}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

InforTab.propTypes = { userInfo: PropTypes.object };

export default InforTab;
