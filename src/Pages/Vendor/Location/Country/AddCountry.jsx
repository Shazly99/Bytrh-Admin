import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { apiheader, PostData } from '../../../../utils/fetchData';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import Component from '../../../../constants/Component';
import Icons from '../../../../constants/Icons';
 

const AddCountry = () => {
  let navigate = useNavigate();
  const CountryNameEn = useRef();
  const CountryNameAr = useRef();
  const CountryTimeZone = useRef();
  const CountryCode = useRef();
  const selectRef = useRef();


  const submit = e => {
    e.preventDefault()
    addNewCountry({
      CountryNameEn: CountryNameEn.current.value,
      CountryNameAr: CountryNameAr.current.value,
      CountryTimeZone: '+' + CountryTimeZone.current.value,
      CountryCode: CountryCode.current.value,
      CountryActive: selectRef.current.value,
    })
  }

  async function addNewCountry(Country) {
    await PostData(`${process.env.REACT_APP_API_URL}/admin/location/countries/add`, Country, apiheader).then((res) => {

      if (res.data.Success === true) {
        toast.success('New Country added successfully!', {
          duration: 4000,
          position: 'top-center',
          icon: <Icons.Added color='#40AB45' size={25} />,
          iconTheme: {
            primary: '#0a0',
            secondary: '#fff',
          },
        });
        setTimeout(() => {
          navigate('/location/Country');
        }, 2000);
      } else {
        toast.error(res.data.ApiMsg)
      }
    });
  }
  return (
    <Container fluid>
      <div className="app__addprodects">
        <Component.SubNav sub__nav={[{ name: "Countries", path: '/location/country' }, { name: "Add Country ", path: '/location/country/addcountry' }]} />
        <div className="app__addprodects__header ">
          <Component.BaseHeader h1={'Add New Country'} />
          <div className="app__addOrder-form">
            <div className="app__addprodects-form">
              <form onSubmit={submit}>
                <Row>
                  <Col xl={6} lg={6} md={6} sm={12} className="app__addprodects-form-en">

                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>  Name (En)</Form.Label>
                      <Form.Control type="text" name='firstname' ref={CountryNameEn} />
                    </Form.Group>


                    <Form.Group controlId="formBasicEmail" className='mt-2'>
                      <Form.Label>  Time Zone  </Form.Label>
                      <Form.Control type="number" name='firstname' ref={CountryTimeZone} />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail" className='mt-2'>
                      <Form.Label>  Status </Form.Label>

                      <Form.Select aria-label="Default select example" ref={selectRef}>
                        <option>  Status</option>
                        <option value="1">Active</option>
                        <option value="0">InActive</option>
                      </Form.Select> 

                    </Form.Group>

                  </Col>
                  <Col xl={6} lg={6} md={6} sm={12} className="app__addprodects-form-en">

                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>  Name (Ar)</Form.Label>
                      <Form.Control type="text" name='firstname' ref={CountryNameAr} style={{ direction: 'rtl' }}  />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail" className='mt-2'>
                      <Form.Label>  Code</Form.Label>
                      <Form.Control type="text" name='firstname' ref={CountryCode} />
                    </Form.Group>

                  </Col>
                  <div className='d-flex justify-content-center align-content-center my-5'>

                    <div className='baseBtn1'>
                      <Button type='submit' variant={'primary'} className='d-flex align-items-center justify-content-center'>
                        Save
                      </Button>
                    </div>

                    <div className='baseBtn'>
                      <Link to={'/location/cities'}>
                        <Button variant={'primary'} className='d-flex align-items-center justify-content-center'>
                        Cancel
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Row>

              </form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default AddCountry