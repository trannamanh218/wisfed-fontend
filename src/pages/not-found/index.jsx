import NormalContainer from 'components/layout/normal-container';
import React from 'react';
import notFoundImage from 'assets/images/404.png';
import './not-found.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function NotFound() {
	const [imgLoaded, setImgLoaded] = useState(false);

	return (
		<NormalContainer>
			<img src={notFoundImage} alt='not found' onLoad={() => setImgLoaded(true)} style={{ display: 'none' }} />
			{imgLoaded ? (
				<div className='not-found'>
					<h4 className='not-found__title'>Opps!... Đã có lỗi xảy ra</h4>
					<p>Vui lòng thử truy cập lại</p>
					<img src={notFoundImage} alt='not found' />
					<Link className='btn btn-primary not-found__btn' to='/'>
						Về trang chủ
					</Link>
				</div>
			) : (
				<></>
			)}
		</NormalContainer>
	);
}

export default NotFound;
