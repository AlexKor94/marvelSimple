
import { useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import useMarvelService from '../../services/MarvelService';

import './searchForm.scss';

const SearchForm = () => {
  const [resultText, setResultText] = useState('');
  const { findCharacterByFullName, clearError } = useMarvelService();

  const onSearch = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const result = await findCharacterByFullName(name);
    console.log(result);
  }

  return (
    <div className="search__form">
      <p className='search__form-selected'>Or find a character by name:</p>
      <form className="search__form_container" onSubmit={onSearch}>
        <input
          name='nameCharacter'
          type="text"
          className="search__form_container-input"
          placeholder="Enter name"
        />
        <button className="search__form_container-btn button button__main">
          <div className="inner">find</div>
        </button>
      </form>
    </div>
  )
}

export default SearchForm;