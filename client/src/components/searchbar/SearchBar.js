import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import './SearchBar.scss';

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('');
  const [submittedValue, setSubmittedValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const changeHandler = e => {
    setSearchInput(e.target.value);
  };

  const keyDownHandler = e => {
    if (e.keyCode === 13 && searchInput) {
      setSubmittedValue(e.target.value);
      setSubmitted(true);
      setSearchInput('');
    }
  };
  return (
    <div>
      <input
        value={searchInput}
        className='searchbar'
        onChange={changeHandler}
        onKeyDown={keyDownHandler}
        type='text'
        placeholder='search...'
      ></input>
      {submitted && <Redirect to={`/searchresult/${submittedValue}`} />}
    </div>
  );
};

export default SearchBar;
