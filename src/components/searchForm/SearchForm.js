import './searchForm.scss';

const SearchForm = () => {
  return (
    <div className="search__form">
      <p className='search__form-selected'>Or find a character by name:</p>
      <div className="search__form_container">
        <input type="text" className="search__form_container-input" placeholder="Enter name" />
        <button className="search__form_container-btn button button__main">
          <div className="inner">find</div>
        </button>
      </div>
    </div>
  )
}

export default SearchForm;