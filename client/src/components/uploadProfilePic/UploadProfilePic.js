import React, { useState } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { setCurrentUserProfilePic } from '../../redux/currentUser/currentUserActions';

const UploadProfilePic = ({
  setCurrentUserProfilePic,
  profilePicId,
  token
}) => {
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [profileInputContainsFile, setProfileInputContainsFile] = useState(
    false
  );

  const profileFileSelectedHandler = event => {
    setSelectedProfileFile(event.target.files[0]);
    setProfileInputContainsFile(true);
  };

  const fileUploadHandler = () => {
    // TODO: Maybe add error handling for if this
    // fires while selectedProfileFile is null
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
      })
      .catch(err => {
        console.log(err);
      });
    setProfileInputContainsFile(false);
  };

  const handleClick = e => {
    if (profileInputContainsFile) {
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
        {selectedProfileFile ? (
          <i
            className='fa fa-check edituserprofilefileinputlabelcheck'
            aria-hidden='true'
          ></i>
        ) : (
          <>new profile pic</>
        )}
      </label>
      {/* {profileInputContainsFile && (
        <button className='uploadprofilepicbutton' onClick={fileUploadHandler}>
          upload
        </button>
      )} */}
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
