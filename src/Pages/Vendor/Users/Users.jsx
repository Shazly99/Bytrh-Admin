import React, { useEffect } from 'react'
import Component from '../../../constants/Component'
import './Users.scss'
import Icons from "../../../constants/Icons.js";
import { Pagination, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { GetData, PostData } from '../../../utils/fetchData';
import { apiheader } from './../../../utils/fetchData';

function Users() {
  const [page, setPage] = React.useState(1);
  const [usersList, setuserList] = React.useState([]);
  const [PagesNumber, setPagesNumber] = React.useState('')

  const handleChange = (event, value) => {
    setPage(value);
  };
  const test = () => {

  }

  const userList = async (page) => {
    try {
      let { data } = await PostData(`https://bytrh.com/api/admin/users`, { IDPage: page }, apiheader);
      setuserList(data.Response.Users);
      setPagesNumber(data.Response.Pages);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        setTimeout(() => {
          userList(page);
        }, (retryAfter || 1) * 1000);  
      }
    } 
  }
  useEffect(() => {
    userList(page)
  }, [page, PagesNumber])
    // to fixed problem because Pagination count need a number 
    const pageCount = Number.isInteger(PagesNumber) ? parseInt(PagesNumber) : 0;

  return (
    <>
      <div className="app__Users ">
        <Component.ButtonBase onclick={test} title={"Add new user"} bg={"primary"} icon={<Icons.add />} path="/user/addUser" />
        <div className="app__Users-table">
          <Component.UsersTable usersList={usersList} userList={userList} />
        </div>
      </div>
      <div className="pagination ">
        <Box sx={{ margin: "auto", width: "fit-content", alignItems: "center", }}>
          <Pagination count={pageCount} page={page} onChange={handleChange} />
        </Box>
      </div>
    </>
  )
}

export default Users
