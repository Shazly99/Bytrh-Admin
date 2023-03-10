import React, { useEffect, useRef, useState } from 'react';
import { Pagination } from "@mui/material";
import Box from "@mui/material/Box";
import { Col, Dropdown, DropdownButton, Form, Row, Table } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Img from "../../../assets/Img";
import Icons from '../../../constants/Icons';
import { apiheader, PostData } from '../../../utils/fetchData';
import Component from '../../../constants/Component';

const BlogClient = () => {
    const animalRef = useRef();

    const [blogs, setBlogs] = useState(null)
    const [PagesNumber, setPagesNumber] = useState('')
    const [page, setPage] = useState(1);
    const [showDropdown, setShowDropdown] = useState(false);


    const BlogsList = async () => {
        await PostData(`${process.env.REACT_APP_API_URL}/admin/clients/blogs`, { IDPage: page }, apiheader).then(({ data }) => {
            setBlogs(data.Response.ClientBlogs)
             setPagesNumber(data.Response.Pages);
        }).catch((error) => {
            if (error.response && error.response.status === 429) {
                const retryAfter = error.response.headers['retry-after'];
                setTimeout(() => {
                    BlogsList();
                }, (retryAfter || 60) * 1000);
            }
        })
    }
    // !pagination
    const pageCount = Number.isInteger(PagesNumber) ? parseInt(PagesNumber) : 0;
    const handleChange = (event, value) => {
        setPage(value);
    };
    // ToDo::change Blogs status
    const handleActionSelect = async (id, action) => {
        if (action === "PENDING" || action === "REJECTED" || action === "POSTED" || action === "REMOVED") {
            await ChangeBlogsStatus({ IDClientBlog: id, BlogStatus: action }).then((res) => {
                toast.success('Updated Successfully', {
                    duration: 4000,
                    position: 'top-center',
                    icon: <Icons.uploadItem color='#3182CE' size={20} />,
                    iconTheme: {
                        primary: '#0a0',
                        secondary: '#fff',
                    },
                });
            })
            await BlogsList()
        }
        await BlogsList()
    }
    const ChangeBlogsStatus = async (blog) => {
        return await PostData(`${process.env.REACT_APP_API_URL}/admin/clients/blogs/status`, blog, apiheader)
    }

    // **filter and search
    const [selectedOption, setSelectedOption] = useState('All');
    const [searchBlog, setSearchBlog] = useState('');


    const handleInputChange = (event) => {
         setSearchBlog(event.target.value);
        if (event.target.value === '') {
            BlogsList(page)
        }
    };
    const handleSearchClick = () => searchGetBlog(searchBlog)

    const searchGetBlog = async (searchValue) => {
        let { data } = await PostData(`${process.env.REACT_APP_API_URL}/admin/clients/blogs`, { IDPage: page, SearchKey: searchValue }, apiheader)
        setBlogs(data.Response.ClientBlogs)
        setPagesNumber(data.Response.Pages);

    }
    // ToDo::Filter radio btn Blogs status
    const handleOptionChange = async (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        if (selectedValue === "PENDING" || selectedValue === "REJECTED" || selectedValue === "POSTED" || selectedValue === "REMOVED") {
            let { data } = await PostData(`${process.env.REACT_APP_API_URL}/admin/clients/blogs`, { IDPage: page, BlogStatus: selectedValue }, apiheader)
            setBlogs(data.Response.ClientBlogs)
            setPagesNumber(data.Response.Pages);

        } else if (selectedValue === "All") {
            BlogsList()
        }
    };
    // ToDo::Filter by ID Animal Category
    const [animal, setAnimal] = useState(null)

    const animalcategories = async () => {
        let { data } = await PostData(`${process.env.REACT_APP_API_URL}/admin/animalcategories`, { IDPage: page }, apiheader)
        setAnimal(data.Response.AnimalCategories)
    }

    const handelSelectAnimalCategory = async (event) => {
         const selectedCountryId = event.target.value;
        if (selectedCountryId === "Animal Category") {
            BlogsList()
        } else {
            await animalcategories()
            let { data } = await PostData(`${process.env.REACT_APP_API_URL}/admin/clients/blogs`, { IDPage: page, IDAnimalCategory: selectedCountryId }, apiheader)
            setBlogs(data.Response.ClientBlogs)
            setPagesNumber(data.Response.Pages);

        }
    }

    useEffect(() => {
        BlogsList(page)
        animalcategories()
        return () => {
            BlogsList()
            animalcategories()

        }
    }, [page])
    useEffect(() => { 
    }, [page,PagesNumber])
    return (
        <>
            {
                blogs ?
                    <>
                        <div className="app__Users ">
                            <div className="app__Users-table ">
                                <div className="search-container">
                                    <div className='search__group'>
                                        <input type="text" placeholder="Search by Doctor Name,Email,Phone......" name="search" value={searchBlog} onChange={handleInputChange} />
                                        <button type="submit" onClick={handleSearchClick}>
                                            <Icons.Search color='#fff' size={25} />
                                        </button>
                                    </div>
                                </div>
                                <div className="app__addOrder-form  overflow-hidden">
                                    <Row>
                                        <Col xl={6} lg={6} md={6} sm={12} xs={12} >
                                            <h5 style={{ marginBottom: '15px', color: '#4A4A4A' }}>Filter by Blogs status :	</h5>
                                            <div className='filter__group__stats row ' style={{ display: 'flex', gap: '0px', marginBottom: '25px' }}>
                                                <label className='col active'>
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
                                                <label className='col active'>
                                                    <input
                                                        className="  form-check-input"
                                                        type="radio"
                                                        name="filter"
                                                        value="POSTED"
                                                        checked={selectedOption === "POSTED"}
                                                        onChange={handleOptionChange}
                                                    />Posted
                                                </label>        <label className='col active'>
                                                    <input
                                                        className="  form-check-input"
                                                        type="radio"
                                                        name="filter"
                                                        value="REJECTED"
                                                        checked={selectedOption === "REJECTED"}
                                                        onChange={handleOptionChange}
                                                    />Rejected
                                                </label>
                                                <label className='col active'>
                                                    <input
                                                        className="  form-check-input"
                                                        type="radio"
                                                        name="filter"
                                                        value="PENDING"
                                                        checked={selectedOption === "PENDING"}
                                                        onChange={handleOptionChange}
                                                    />
                                                    Pending
                                                </label>
                                                <label className='col active'>
                                                    <input
                                                        className="  form-check-input"
                                                        type="radio"
                                                        name="filter"
                                                        value="REMOVED"
                                                        checked={selectedOption === "REMOVED"}
                                                        onChange={handleOptionChange}
                                                    />Remove
                                                </label>

                                            </div>
                                        </Col>
                                        <Col xl={6} lg={6} md={6} sm={12} xs={12} className='Filter_by_Animal' >
                                            <h5 style={{ marginBottom: '15px', color: '#4A4A4A' }}>Filter by Animal Category :	</h5>
                                            <Form.Select aria-label="Default select example" ref={animalRef} onClick={handelSelectAnimalCategory}>
                                                <option >Animal Category </option>

                                                {
                                                    animal?.map((item, index) => (
                                                        <option key={index} value={item?.IDAnimalCategory}>{item?.AnimalCategoryName}</option>
                                                    ))
                                                }
                                                {/* <option value="0">InActive</option> */}
                                            </Form.Select>

                                        </Col>
                                    </Row>
                                </div>
                                <Table responsive={true} className='rounded-3 '>
                                    <thead>
                                        <tr className='text-center  ' style={{ background: '#F9F9F9' }}>

                                            <th>Client Name</th>
                                            <th>Blog Title</th>
                                            <th>Animal Category</th>
                                            <th>Blog Status</th>
                                            <th>Blog Visibility</th>
                                            <th>Blog Date</th>
                                            <th>Blog Stats</th>
                                            <th>View Blog</th>
                                        </tr>
                                    </thead>
                                    <tbody className='text-center'>
                                        {
                                            blogs?.map((item, index) => (
                                                <tr key={index}>

                                                    <td >
                                                        <div>
                                                            {item?.ClientName}
                                                        </div>
                                                    </td>

                                                    <td >
                                                        <div>
                                                            {item?.BlogTitle}
                                                        </div>
                                                    </td>
                                                    <td >
                                                        <div>
                                                            {item?.AnimalCategory}
                                                        </div>
                                                    </td>
                                                    <td >

                                                        <div className='blog__status'>
                                                            <span style={{ height: 'fit-content !important' }} className={`
                                                                ${item.BlogStatus == 'PENDING' && 'txt_pending'} 
                                                                ${item.BlogStatus == 'REJECTED' && 'txt_rejected'} 
                                                                ${item.BlogStatus == 'POSTED' && 'txt_delivered'}
                                                                ${item.BlogStatus == 'REMOVED' && 'txt_cancel'}`} >
                                                                {item?.BlogStatus.charAt(0).toUpperCase() + item?.BlogStatus.slice(1).toLowerCase()}

                                                            </span>
                                                            <div className="delete">
                                                                <DropdownButton
                                                                    title={<Icons.dotes size={20} />}
                                                                    id="dropdown-menu"
                                                                    variant="outline-success"
                                                                    onClick={() => setShowDropdown(!showDropdown)}
                                                                    onSelect={(eventKey) => handleActionSelect(item.IDClientBlog, eventKey)}
                                                                    className="DropdownButton "
                                                                    drop={'down-centered'}
                                                                >
                                                                    {
                                                                        item.BlogStatus === 'PENDING' &&
                                                                        <>
                                                                            <Dropdown.Item eventKey="POSTED">Post</Dropdown.Item>
                                                                            <Dropdown.Item eventKey="REJECTED">Rejected</Dropdown.Item>
                                                                        </>
                                                                    }
                                                                    {
                                                                        item.BlogStatus === 'REJECTED' &&
                                                                        <Dropdown.Item eventKey="POSTED">Post</Dropdown.Item>
                                                                    }
                                                                    {
                                                                        item.BlogStatus === 'REMOVED' &&
                                                                        <Dropdown.Item eventKey="POSTED">Post</Dropdown.Item>
                                                                    }
                                                                    {
                                                                        item.BlogStatus === 'POSTED' &&
                                                                        <Dropdown.Item eventKey="REMOVED">Removed</Dropdown.Item>
                                                                    }
                                                                </DropdownButton>

                                                            </div>
                                                        </div>
                                                    </td>


                                                    <td >
                                                        <div>
                                                            <span   >
                                                                {item?.BlogVisibility.charAt(0).toUpperCase() + item?.BlogVisibility.slice(1).toLowerCase()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td >
                                                        <div className='d-flex justify-content-center align-item-center m-0 p-0 flex-column gap-0' >
                                                            <span   > {item?.BlogDate.split(' ')[0]}  </span>
                                                            <span className='ClientPhone'> {item?.BlogDate.split(' ')[1]}  </span>
                                                        </div>
                                                    </td>

                                                    <td >
                                                        <div className='d-flex' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                            <div className=' d-flex justify-content-center align-item-center gap-3' >
                                                                <span><Icons.like size={19} color='#3182CE' /> </span><span>{item?.BlogLikes}</span>
                                                            </div>
                                                            <div className=' d-flex justify-content-center align-item-center gap-3' >
                                                                <span><Icons.comments size={19} color='#40AB45' /> </span><span>{item?.BlogComments}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td >
                                                        <div>
                                                            <Link to={`/blogs/client/details/${item?.IDClientBlog}`}>
                                                                <img src={Img.view}loading="lazy" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>

                                </Table>
                            </div>

                        </div>
                        <div className="pagination ">
                            <Box sx={{ margin: "auto", width: "fit-content", alignItems: "center", }}>
                                <Pagination count={pageCount} page={page} onChange={handleChange} />
                            </Box>
                        </div>
                    </>
                    : <Component.Loader />
            }
        </>

    )
}

export default BlogClient
