import './preview-link.scss';
import { useState, useEffect } from 'react';
import _ from 'lodash';
import { CloseX } from 'components/svg';
import PropTypes from 'prop-types';
function PreviewLink({ urlData, isFetching, removeUrlPreview }) {
	const [domain, setDomain] = useState('');

	useEffect(() => {
		if (!_.isEmpty(urlData)) {
			const urlDomain = urlData.url.split('/')[2];
			if (urlDomain.includes('www')) {
				setDomain(urlDomain.split('www.')[1]);
			} else {
				setDomain(urlDomain);
			}
		}
	}, [urlData]);

	return (
		<div className='preview-link'>
			{isFetching ? (
				<div className='preview-link-loading'>
					<div className='lds-ellipsis'>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			) : (
				<div className='preview-link__content'>
					{urlData.images?.length > 0 && (
						<div className='preview-link__image' onClick={() => window.open(urlData.url)}>
							<img src={urlData.images[0]} alt='preview-link-image' />
						</div>
					)}
					<div className='preview-link__information'>
						<div className='preview-link__information__domain'>{domain}</div>
						<div className='preview-link__information__title'>{urlData.title}</div>
						{urlData.description && (
							<div className='preview-link__information__description'>{urlData.description}</div>
						)}
					</div>
					<button className='preview-link__close-btn' onClick={removeUrlPreview}>
						<CloseX />
					</button>
				</div>
			)}
		</div>
	);
}

PreviewLink.defaultProps = {
	urlData: {},
	isFetching: false,
	removeUrlPreview: () => {},
};

PreviewLink.propTypes = {
	urlData: PropTypes.object,
	isFetching: PropTypes.bool,
	removeUrlPreview: PropTypes.func,
};

export default PreviewLink;
