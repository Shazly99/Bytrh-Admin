import React, { useEffect, useState } from 'react'
import Component from '../../../constants/Component'
import { Pagination } from "@mui/material";
import Box from "@mui/material/Box";
import { PostData } from '../../../utils/fetchData';
import { apiheader } from './../../../utils/fetchData';
import Icons from "../../../constants/Icons.js";
import _ from 'lodash';
import Loader from '../../../Components/Shared/Loader/Loader';
import Img from '../../../assets/Img';

const Clients = () => {
  const [page, setPage] = React.useState(1);
  const [usersList, setuserList] = React.useState([]);
  const [PagesNumber, setPagesNumber] = React.useState('')
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const userList = _.debounce(async (page) => {
    setIsLoading(true);
    // if (isLoading === true) {      
    let { data } = await PostData(`https://bytrh.com/api/admin/clients`, { IDPage: page }, apiheader)
    setuserList(data.Response.Clients)
    setPagesNumber(data.Response.Pages);
    // }
  }, 1000)
  useEffect(() => {
    userList(page)
 
  }, [page])

  // to fixed problem because Pagination count need a number 
  const pageCount = Number.isInteger(PagesNumber) ? parseInt(PagesNumber) : 0;
  const [loadSearch, setloadSearch] = useState(true);


  const [searchValue, setSearchValue] = useState('');
  // search by click
  // const handleSearchClick = () => {
   // };
  const handleInputChange = (event) => {
    setloadSearch(false) 
    setSearchValue(event.target.value);
    searchGetData(searchValue)
  };
  const searchGetData = _.debounce(async (searchValue) => {
    let { data } = await PostData(`https://bytrh.com/api/admin/clients`, { IDPage: page, SearchKey: searchValue }, apiheader)
    setuserList(data.Response.Clients)
    setPagesNumber(data.Response.Pages);
    setloadSearch(true) 
  }, 3000)
  // filter
  const [selectedOption, setSelectedOption] = useState('All');
  const handleOptionChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    // filter your content based on the selected option 
    if (selectedValue === "ACTIVE" || selectedValue === "INACTIVE" || selectedValue === "BLOCKED") {
      let { data } = await PostData(`https://bytrh.com/api/admin/clients`, { IDPage: page, ClientStatus: selectedValue }, apiheader)
      setuserList(data.Response.Clients)
      setPagesNumber(data.Response.Pages);

    } else if (selectedValue === "All") {
      userList()
    }
  };
  useEffect(() => {
  }, [page, PagesNumber])
  return (
    <>
      {
        usersList ?
          <>
            <div className="app__Users ">
              {/* <Component.ButtonBase onclick={test} title={"Add new Clients"} bg={"primary"} icon={<Icons.add />}  /> */}
              <div className="app__Users-table">
                <div className="search-container">
                  <div className='search__group'>
                    <input type="text" placeholder="Search by name or email or phone....." name="search" value={searchValue} onChange={handleInputChange} />
                    {/*            <button type="submit" onClick={handleSearchClick}>
                      <Icons.Search color='#fff' size={25} />
                    </button> */}
                  </div>

                  <div className='filter__group'>

                    <label>
                      {
                        selectedOption === "All" ?
                          <input
                            type="radio"
                            name="filter"
                            value="All"
                            checked
                            onChange={handleOptionChange}
                            className={`inactive-radio form-check-input `}
                          /> :
                          <input
                            type="radio"
                            name="filter"
                            value="All"
                            checked={selectedOption === "All"}
                            onChange={handleOptionChange}
                            className={`inactive-radio form-check-input `}
                          />
                      }

                      All
                    </label>
                    <label className='active'>

                      <input
                        type="radio"
                        name="filter"
                        value="ACTIVE"
                        checked={selectedOption === "ACTIVE"}
                        onChange={handleOptionChange}
                        className="active-radio form-check-input"
                      />
                      Active
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="filter"
                        value="INACTIVE"
                        checked={selectedOption === "INACTIVE"}
                        onChange={handleOptionChange}
                        className="inactive-radio form-check-input"

                      />
                      InActive
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="filter"
                        value="BLOCKED"
                        checked={selectedOption === "BLOCKED"}
                        onChange={handleOptionChange}
                        className="inactive-radio form-check-input   "

                      />
                      Blocked
                    </label>

                  </div>
                </div>
                {
                  loadSearch ?

                    <>
                      {
                        usersList.length <= 0 ?
                          <div className="d-flex justify-content-center">
                            <img loading="lazy" src={Img.searchNotFound} className="w-75" alt="" />
                          </div>:
                          <Component.ClientTable usersList={usersList} userList={userList} /> 
                      }

                    </>
                    :
                    <div className="d-flex justify-content-center">
                      <img loading="lazy" src={Img.search} className="w-75" alt="" />
                    </div>
                }
              </div>
            </div>
            <div className="pagination ">
              <Box sx={{ margin: "auto", width: "fit-content", alignItems: "center", }}>
                <Pagination count={pageCount} page={page} onChange={handleChange} />
              </Box>
            </div>

          </> : <Loader />
      }
    </>
  )
}

export default Clients
