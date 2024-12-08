import  { useState, useEffect } from 'react';
import { IoMdSearch } from "react-icons/io";


const SearchBoards = ({ setSearchResults, setSearchActive }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    if (query.length >= 1) {
      fetchSearchResults(query);
      setSearchActive(true);
    } else {
      setSearchResults([]); // Clear results
      setSearchActive(false);
    }
  }, [query]);

  const fetchSearchResults = async (query) => {
    const response = await fetch(`/api/boards/search?query=${query}`);
    const data = await response.json();
    setSearchResults(data.boards || []);
  };

  return (
    <div>
      <div className="search-box"> 
      <IoMdSearch />
      <input 
        type="text" 
        value={query} 
        onChange={handleChange} 
        placeholder="Search boards..." 
      />
      </div>
    </div>
    
  );
};

export default SearchBoards;
