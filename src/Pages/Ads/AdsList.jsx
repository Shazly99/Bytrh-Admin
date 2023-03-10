import { Pagination } from "@mui/material";
import Box from "@mui/material/Box";
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment/moment';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Dropdown, DropdownButton, Form, Row, Table } from "react-bootstrap";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Img from '../../assets/Img';
import Component from '../../constants/Component';
import Icons from '../../constants/Icons';
import { apiheader, GetData } from '../../utils/fetchData';
import useFetch from '../../utils/useFetch';


const AdsList = () => {


  const [ads, setAds] = useState(null)
  const [page, setPage] = useState(1);
  const [PagesNumber, setPagesNumber] = useState('')
  const [searchValue, setSearchValue] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const advertisements = _.debounce(async () => {
    setIsLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/advertisements`, { IDPage: page }, apiheader).then((res) => {
        if (res.status === 200 && res.request.readyState === 4) {
          setAds(res.data.Response.Advertisements);
          setPagesNumber(res.data.Response.Pages);
          setIsLoading(false);

        }
      })
    } catch (error) {
      if (error.response && error.response.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        setTimeout(() => {
          advertisements();
        }, (retryAfter || 30) * 1000);
      }
    }
    setIsLoading(false);
  }, 1000);

  const pageCount = Number.isInteger(PagesNumber) ? parseInt(PagesNumber) : 0;
  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleActionSelect = async (id, action) => {
     if (action === "DELETE") {
       await GetData(`${process.env.REACT_APP_API_URL}/admin/advertisements/status/${id}`, apiheader).then((res) => {
        toast.success('The ads has been removed', {
          duration: 4000,
          position: 'top-center',
          icon: <Icons.bin color='#E20000' size={20} />,
          iconTheme: {
            primary: '#0a0',
            secondary: '#fff',
          },
        });
      })
      await advertisements()
    }
  };




  // !Filter By Start Date And End Date
  const [dateRange, setDateRange] = useState({ startDate: new Date(), endDate: new Date() });
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  function handleSelect(range) {
    setDateRange({ startDate: range.startDate, endDate: range.endDate });
  }

  async function handleApply(event, picker) {
    const start = picker.startDate.toDate().toLocaleDateString('en-US');
    const end = picker.endDate.toDate().toLocaleDateString('en-US');
    setStartDate(moment(start, 'M/D/YYYY').format('YYYY-MM-DD'))
    setEndDate(moment(end, 'M/D/YYYY').format('YYYY-MM-DD'))
    let date = {
      IDPage: page,
      StartDate: moment(start, 'M/D/YYYY').format('YYYY-MM-DD'),
      EndDate: moment(end, 'M/D/YYYY').format('YYYY-MM-DD')
    };
     try {
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/advertisements`, date, apiheader).then((res) => {
        if (res.status === 200 && res.request.readyState === 4) {
          setAds(res.data.Response.Advertisements);
          setPagesNumber(res.data.Response.Pages);
          setIsLoading(false);
         }
      })
    } catch (error) {
      if (error.response && error.response.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        setTimeout(() => {
          advertisements();
        }, (retryAfter || 30) * 1000);
      }
    }
  }

  // !Filter by city name 
  let { countries, cities, getCities } = useFetch()
  const countriesRef = useRef(null);
  const handelSelectCountry = (event) => {
    const selectedCountryId = event.target.value;
     getCities(selectedCountryId)
  }
  const handelSelectCity = async () => {
    let city = countriesRef.current.value
    if (city === 'cities') {
      advertisements()
    } else {

      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/admin/advertisements`, { IDPage: page, IDCity: city }, apiheader).then((res) => {
          if (res.status === 200 && res.request.readyState === 4) {
            setAds(res.data.Response.Advertisements);
            setPagesNumber(res.data.Response.Pages);
            setIsLoading(false);
           }
        })
      } catch (error) {
        if (error.response && error.response.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          setTimeout(() => {
            advertisements();
          }, (retryAfter || 30) * 1000);
        }
      }
    }
  }

  // !Filter by Advertisement Service 
  const adsService = useRef(null);

  const handelAdvertisementService = async () => {
    let adsSer = adsService.current.value
    if (adsSer === 'ads') {
      advertisements()
    } else {
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/advertisements`, { IDPage: page, AdvertisementService: adsSer }, apiheader).then((res) => {
        if (res.status === 200 && res.request.readyState === 4) {
          setAds(res.data.Response.Advertisements);
          setPagesNumber(res.data.Response.Pages);
        }
      })
    }
  }


  // !Filter by Advertisement Location 
  const adsLocation = useRef(null);

  const handelAdvertisementLocation = async () => {
    let ads = adsLocation.current.value
    if (ads === 'ads') {
      advertisements()
    } else {
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/advertisements`, { IDPage: page, AdvertisementLocation: ads }, apiheader).then((res) => {
        if (res.status === 200 && res.request.readyState === 4) {
          setAds(res.data.Response.Advertisements);
          setPagesNumber(res.data.Response.Pages);
        }
      })
    }
  }


  useEffect(() => {
    advertisements();
  }, [page]);

  return (
    <>
      {
        ads ?
          <>
            <div className="app__Users ">
              <Component.ButtonBase title={"Add "} bg={"primary"} icon={<Icons.add size={21} color={'#ffffffb4'} />} path="/ads/add" />
              <div className="app__Users-table">
                <div className="search-container">
                  <div className='search__group w-100'>
                    <div className=' app__addOrder-form'>
                      <div className="d-flex flex-column row justify-content-between">
                        <h5 style={{ marginBottom: '15px', color: '#4A4A4A' }} className='col'>Filter by Start Date and End Date :	</h5>
                        <div className='d-flex flex-row justify-content-between'>
                          <DateRangePicker
                            ranges={[dateRange]}
                            onChange={handleSelect}
                            onApply={handleApply}
                          >
                            <Button variant="outline-primary">Select Start Date & End Date</Button>
                          </DateRangePicker>
                          {startDate && <p> <strong>Start Date : </strong>{startDate} </p>}
                          {endDate && <p> <strong>End Date : </strong>{endDate} </p>}
                        </div>

                      </div>
                      <h5 style={{ marginTop: '15px', color: '#4A4A4A' }} className='col'>Filter by City || Ads Location || Ads Service :	</h5>
                      <Row className='d-flex flex-row justify-content-between'>
                        <Col className='w-100'>
                          <Form.Group controlId="formBasicEmail" onClick={handelSelectCountry}>
                            <Form.Label>Country</Form.Label>
                            <Form.Select aria-label="Default select example" > 
                              {
                                countries?.map((item, index) => (
                                  <option key={index} value={item?.IDCountry}  >{item?.CountryName}</option>
                                ))
                              }
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col className='w-100'>
                          <Form.Group controlId="formBasicEmail"   >
                            <Form.Label>City</Form.Label>
                            <Form.Select aria-label="Default select example" onClick={handelSelectCity} ref={countriesRef}>
                              <option value={'cities'}>all city</option>
                              {
                                cities?.map((item, index) => (
                                  <option key={index} value={item?.IDCity}>{item?.CityName}</option>
                                ))
                              }
                            </Form.Select>

                          </Form.Group>
                        </Col>
                        <Col className='w-100'>
                          <Form.Group controlId="formBasicEmail"  >
                            <Form.Label  >Advertisement Location</Form.Label>


                            <Form.Select aria-label="Default select example" ref={adsLocation} onClick={handelAdvertisementLocation} >
                              <option value={'ads'}  >All Ads</option>
                              {
                                ['HOME', 'PAGES', 'INNER_PAGES']?.map((item, index) => (
                                  <option key={index} value={item}  >{item.charAt(0).toUpperCase() + item.slice(1).toLowerCase().replace('_', " ")}</option>
                                ))
                              }
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col className='w-100'>
                          <Form.Group controlId="formBasicEmail"   >
                            <Form.Label  >Advertisement Service</Form.Label>
                            <Form.Select aria-label="Default select example" ref={adsService} onClick={handelAdvertisementService} >
                              <option value={'ads'}  >All Ads</option>
                              {
                                ['NONE', 'URGENT_CONSULT', 'CONSULT', 'DOCTOR_BLOG', 'CLIENT_BLOG', 'ADOPTION']?.map((item, index) => (
                                  <option key={index} value={item}>{item.charAt(0).toUpperCase() + item.slice(1).toLowerCase().replace('_', " ")}</option>
                                ))
                              }
                              {/* <option value="0">InActive</option> */}
                            </Form.Select>

                          </Form.Group>
                        </Col>

                      </Row>

                    </div>
                  </div>
                </div>

                <Table responsive={true} className='rounded-3 '>
                  <thead>
                    <tr className='text-center  ' style={{ background: '#F9F9F9' }}>
                      <th> Image</th>
                      <th> Service</th>
                      <th>Start-Date</th>
                      <th> End-Date  </th>
                      <th> Location</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody className='text-center'>
                    {
                      ads?.map((item, index) => (
                        <tr key={index}>
                          <td className='img'>
                            {
                              item?.AdvertisementImage ?
                                <img
                                
                                loading="lazy"
                                  src={item.AdvertisementImage} // use normal <img> attributes as props
                                  className="w-100 rounded-2"
                                /> :

                                <img
                                
                                loading="lazy"
                                  src={Img.ads} // use normal <img> attributes as props
                                  className="w-100 rounded-2"
                                />

                            }
                            {/* <img src={item.AdvertisementImage} alt='example' className='w-100 rounded-2' /> */}
                          </td>
                          <td >
                            <div>
                              {item?.AdvertisementService.charAt(0).toUpperCase() + item?.AdvertisementService.slice(1).toLowerCase()}
                            </div>
                          </td>
                          <td >
                            <div>
                              {item?.AdvertisementStartDate?.split(" ")[0]}
                            </div>
                          </td>
                          <td >
                            <div>
                              {item?.AdvertisementEndDate?.split(" ")[0]}
                            </div>
                          </td>
                          <td >
                            <div>
                              {item?.AdvertisementLocation.charAt(0).toUpperCase() + item?.AdvertisementLocation.slice(1).toLowerCase()}
                            </div>
                          </td>



                          <td>
                            <div>
                              <span>
                                <DropdownButton
                                  id={`dropdown-${item.IDAdvertisement}`}
                                  title="Actions"
                                  variant="outline-success"
                                  onSelect={(eventKey) => handleActionSelect(item.IDAdvertisement, eventKey)}
                                  className="DropdownButton "
                                  drop={'down-centered'}
                                >
                                  <Dropdown.Item eventKey="Edite" as={Link} to={`/ads/edit/${item.IDAdvertisement}`}>
                                    Edit
                                  </Dropdown.Item>

                                  <Dropdown.Item eventKey="DELETE"   >
                                    Delete
                                  </Dropdown.Item>

                                </DropdownButton>
                              </span>
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
          </> : <Component.Loader />
      }
    </>

  )
}

export default AdsList