import React from 'react';
import BadgeList from 'shared/badge-list';
import Input from 'shared/input';
import './infor-tab.scss';

const InforTab = () => {
	const data = {
		name: 'Phuong anh nguyen',
		birthday: '28/02/1994',
		gender: 'female',
		address: 'Bac Ninh',
		job: 'thiet ke',
		link: 'www.facebook.com/duyquang',
		favoriteTopics: [{ title: 'Marketing' }, { title: 'Phát triển bản thân' }],
		introduction: `Lorem ipsum dolor sit, amet consectetur adipisicing elitt,  amet consectetur adipisicing elitt  amet consectetur adipisicing elitt  amet consectetur adipisicing el. Distinctio voluptates omnis nesciunt sint rem dicta incidunt soluta exercitationem molestiae vel!`,
	};

	const getGender = {
		'female': 'Nữ',
		'male': 'Name',
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
								<Input type='text' placeholder='Nhập tên' isBorder={false} disabled value={data.name} />
							</div>
						</div>
					</div>
					<div className='col-3'>
						<div className='form-field-group'>
							<label className='form-field-label'>Giới tính</label>
							<div className='form-field'>
								<Input
									type='text'
									placeholder='Nhập giới tính'
									isBorder={false}
									disabled
									value={getGender[data.gender]}
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
									value={data.address}
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
								<Input
									type='text'
									placeholder='Nhập công việc'
									isBorder={false}
									disabled
									value={data.job}
								/>
							</div>
						</div>
					</div>
					<div className='col-6'>
						<div className='form-field-group'>
							<label className='form-field-label'>URL Mạng xã hội khác</label>
							<div className='form-field'>
								<Input
									type='text'
									placeholder='Nhập link'
									isBorder={false}
									disabled
									value={data.link}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className='row'>
					<div className='col-6'>
						<div className='form-field-group'>
							<label className='form-field-label '>Chủ đề yêu thích</label>
							<div className='form-field form-field-flex '>
								<BadgeList list={data.favoriteTopics} className='form-field-badge' />
							</div>
						</div>
					</div>
					<div className='col-6'></div>
				</div>
				<div className='row'>
					<div className='col-12'>
						<div className='form-field-group'>
							<label className='form-field-label'>Giới thiệu</label>
							<div className='form-field-textarea'>{data.introduction}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

InforTab.propTypes = {};

export default InforTab;
