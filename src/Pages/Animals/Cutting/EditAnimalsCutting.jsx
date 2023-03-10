import React, { useRef, useEffect, useState } from 'react'
import { apiheader, GetData, PostData } from '../../../utils/fetchData';
import { toast } from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Col, Container, Row, Form, Button, FormControl } from 'react-bootstrap';
import Icons from '../../../constants/Icons';
import Component from '../../../constants/Component'

const EditAnimalsCutting = () => {
  let { id } = useParams()
  let navigate = useNavigate();
  const CuttingNameEn = useRef();
  const CuttingNameAr = useRef();
  const [editPage, setCategoryDetail] = useState(null)

  const submit = e => {
    e.preventDefault()
    editCategory({
      CuttingNameEn: CuttingNameEn.current.value,
      CuttingNameAr: CuttingNameAr.current.value,
      IDCutting: id
    })
  }

  async function editCategory(category) {
    await PostData(`${process.env.REACT_APP_API_URL}/admin/cuttings/edit`, category, apiheader).then((res) => {

      if (res.data.Success === true) {
        toast.success('Animal Category  has been updated!', {
          duration: 4000,
          position: 'top-center',
          icon: <Icons.Added color='#40AB45' size={25} />,
          iconTheme: {
            primary: '#0a0',
            secondary: '#fff',
          },
        });
        setTimeout(() => {
          navigate('/animals/cutting');
        }, 2000);
      } else {
        toast.error(res.data.ApiMsg)
      }
    });
  }

  const categoryDetail = async () => {
    let data = await GetData(`${process.env.REACT_APP_API_URL}/admin/cuttings/edit/page/${id}`, apiheader)
    setCategoryDetail(data.Response);
   }
  useEffect(() => {
    categoryDetail()
  }, [id])
  useEffect(() => {

  }, [id])

  return (
    <Container fluid>
      <div className="app__addprodects">
        <Component.SubNav sub__nav={[{ name: "Animal Cutting", path: '/animals/cutting '}, { name: "Edit Categorie ", path: `/animals/cutting/editcutting/${id}` }]} />

        <div className="app__addprodects__header ">
          <Component.BaseHeader h1={'Edit Animal Cutting'} />
          <div className="app__addOrder-form">
            <div className="app__addprodects-form">
              <form onSubmit={submit}>
 
                <Row>
                  <Col xl={6} lg={6} md={6} sm={12} className="app__addprodects-form-en">

                    <Form.Group controlId="formBasicEmail">
                      <Form.Label> Name (En)</Form.Label>
                      <Form.Control type="text" name='firstname' ref={CuttingNameEn} defaultValue={editPage?.CuttingNameEn} />

                    </Form.Group>

                  </Col>
                  <Col xl={6} lg={6} md={6} sm={12} className="app__addprodects-form-en">

                    <Form.Group controlId="formBasicEmail" >
                      <Form.Label> Name (Ar)</Form.Label>
                      <Form.Control type="text" name='email' ref={CuttingNameAr} defaultValue={editPage?.CuttingNameAr} style={{ direction: 'rtl' }} />
                    </Form.Group>

                  </Col>
                  <div className='d-flex justify-content-center align-content-center my-5'>

                    <div className='baseBtn1'>
                      <Button type='submit' variant={'primary'} className='d-flex align-items-center justify-content-center'>
                        Save
                      </Button>
                    </div>

                    <div className='baseBtn'>
                      <Link to={'/animals/cutting'}>
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

export default EditAnimalsCutting