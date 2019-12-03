import React, { useState } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { setCurrentUserCoverPic } from '../../../redux/currentUser/currentUserActions';
import LoadingDots from '../../../imgs/loadingdots.gif';

const UploadCoverPic = ({ setCurrentUserCoverPic, coverPicId, token }) => {
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [inputContainsFile, setInputContainsFile] = useState(false);
  const [currentlyUploading, setCurrentlyUploading] = useState(false);

  const coverFileSelectedHandler = event => {
    setSelectedCoverFile(event.target.files[0]);
    setInputContainsFile(true);
  };

  const fileUploadHandler = () => {
    const fd = new FormData();
    fd.append('image', selectedCoverFile, selectedCoverFile.name);
    Axios.post(`/user/editcoverpic`, fd, {
      onUploadProgress: progressEvent => {
        console.log(
          'Upload progress: ',
          Math.round((progressEvent.loaded / progressEvent.total) * 100)
        );
      },
      headers: { 'x-auth-token': token }
    })
      .then(res => {
        setCurrentUserCoverPic(res.data.coverPicId);
        setInputContainsFile(false);
        setSelectedCoverFile(null);
        setCurrentlyUploading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleClick = e => {
    if (inputContainsFile) {
      setCurrentlyUploading(true);
      e.preventDefault();
      fileUploadHandler();
      setInputContainsFile(false);
    }
  };

  return (
    <div className='editusercoverupload'>
      {coverPicId ? (
        <img
          className='editusercoveruploadimage'
          src={`/user/image/${coverPicId}`}
          alt='cover'
        />
      ) : (
        <div className='nocoverpic' />
      )}

      {currentlyUploading ? (
        <img src={LoadingDots} className='uploadcoverpic-loadingdots' />
      ) : (
        <>
          <input
            className='editusercoveruploadinput'
            onChange={coverFileSelectedHandler}
            type='file'
            name='coverfile'
            id='coverfile'
          />
          <label
            className={`editusercoverfileinputlabel editusercoverselectedfile${selectedCoverFile &&
              'true'}`}
            htmlFor='coverfile'
            onClick={handleClick}
          >
            {selectedCoverFile ? <>confirm</> : <>new cover pic</>}
          </label>
        </>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    userId: state.auth.userId,
    token: state.auth.token,
    coverPicId: state.currentUser.coverPicId
  };
};

const mapDispatchToProps = dispatch => ({
  setCurrentUserCoverPic: profPicInfo => {
    dispatch(setCurrentUserCoverPic(profPicInfo));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadCoverPic);
