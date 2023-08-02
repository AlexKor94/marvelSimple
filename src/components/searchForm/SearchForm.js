
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import useMarvelService from '../../services/MarvelService';

import './searchForm.scss';

const SearchForm = () => {
  const [character, setCharacter] = useState(null);
  const [msg, setMsg] = useState(null);
  const { findCharacterByFullName, error, clearError } = useMarvelService();

  const formik = useFormik({
    initialValues: {
      nameCharacter: ''
    },
    validationSchema: Yup.object({
      nameCharacter: Yup.string().min(3, "Enter minimum 3 symbols").required("This field is required")
    }),
    onSubmit: values => onSearch(values.nameCharacter),
  })

  useEffect(() => {
    setCharacter(null);
    setMsg(formik.errors.nameCharacter);
  }, [formik.errors.nameCharacter]);

  const onSearch = async (name) => {
    clearError();
    setCharacter(null);
    setMsg(null);
    const result = await findCharacterByFullName(name);
    if (result) {
      setMsg(`There is! Visit ${name} page?`);
      setCharacter(result);
    } else {
      setMsg('The character was not found. Check the name and try again');
    }

  }

  const link = character ? <Link
    to={`/character/${character.id}`}
    state={character}
    name='Alex'>{`There is! Visit ${character.name} page?`} </Link>
    : null;

  return (
    <div className="search__form">
      <p className='search__form-selected'>Or find a character by name:</p>
      <form className="search__form_container" onSubmit={formik.handleSubmit}>
        <input
          name='nameCharacter'
          type="text"
          className="search__form_container-input"
          placeholder="Enter name"
          onChange={formik.handleChange}
        />
        <button type="submit" className="search__form_container-btn button button__main">
          <div className="inner">find</div>
        </button>
      </form>

      <div
        className="search__form-result"
        style={!formik.isValid || error ? { color: 'red' } : { color: 'green' }}
      >{character ? link : msg}
      </div>
    </div>
  )
}


export default SearchForm;