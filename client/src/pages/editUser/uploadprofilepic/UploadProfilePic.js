import React, { useState } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { setCurrentUserProfilePic } from '../../../redux/currentUser/currentUserActions';
import LoadingDots from '../../../imgs/loadingdots.gif';

const UploadProfilePic = ({
  setCurrentUserProfilePic,
  profilePicId,
  token
}) => {
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [profileInputContainsFile, setProfileInputContainsFile] = useState(
    false
  );
  const [currentlyUploading, setCurrentlyUploading] = useState(false);

  const profileFileSelectedHandler = event => {
    setSelectedProfileFile(event.target.files[0]);
    setProfileInputContainsFile(true);
  };

  const fileUploadHandler = () => {
    const fd = new FormData();
    fd.append('image', selectedProfileFile, selectedProfileFile.name);
    Axios.post(`/user/editprofilepic`, fd, {
      onUploadProgress: progressEvent => {
        console.log(
          'Upload progress: ',
          Math.round((progressEvent.loaded / progressEvent.total) * 100)
        );
      },
      headers: { 'x-auth-token': token }
    })
      .then(res => {
        setCurrentUserProfilePic(res.data.profilePicId);
        setProfileInputContainsFile(false);
        setSelectedProfileFile(null);
        setCurrentlyUploading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleClick = e => {
    if (profileInputContainsFile) {
      setCurrentlyUploading(true);
      e.preventDefault();
      fileUploadHandler();
      setProfileInputContainsFile(false);
    }
  };

  return (
    <div className='edituserprofileupload'>
      <img
        className='edituserprofileuploadimage'
        src={`/user/image/${profilePicId}`}
        alt='profile'
      />

      {currentlyUploading ? (
        <img
          src={LoadingDots}
          className='uploadprofilepic-loadingdots'
          alt='upload in progress'
        />
      ) : (
        <>
          <input
            className='edituserprofileuploadinput'
            onChange={profileFileSelectedHandler}
            type='file'
            name='file'
            id='file'
          />
          <label
            className={`edituserprofilefileinputlabel edituserprofileselectedfile${selectedProfileFile &&
              'true'}`}
            htmlFor='file'
            onClick={handleClick}
          >
            {selectedProfileFile ? <>confirm</> : <>new profile pic</>}
          </label>
        </>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  userId: state.auth.userId,
  token: state.auth.token,
  profilePicId: state.currentUser.profilePicId
});

const mapDispatchToProps = dispatch => ({
  setCurrentUserProfilePic: profPicInfo => {
    dispatch(setCurrentUserProfilePic(profPicInfo));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadProfilePic);
