import React, { useState, useEffect } from 'react'
import Component from '../../constants/Component'
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import './store.scss'
import { GetData } from '../../utils/fetchData';
import { apiheader } from './../../utils/fetchData';
import Img from '../../assets/Img';
import Skeleton from '@mui/material/Skeleton';

const StoreDetails = () => {
  let { id } = useParams()
  const [animal, setAnimal] = useState([]);
  const [isLoader, setIsloader] = useState(false);

  // get store
  const store = async () => {
    await GetData(`${process.env.REACT_APP_API_URL}/admin/animalproducts/details/${id}`, apiheader).then((res) => {
      setAnimal(res.Response);
      const timeoutId = setTimeout(() => {
        setIsloader(true)
      }, 2000);
      return () => clearTimeout(timeoutId);
    }).catch((error) => {
      if (error.response && error.response.status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        setTimeout(() => {
          store();
        }, (retryAfter || 60) * 1000);
      }
    });
  };

  useEffect(() => {
    store();
  }, [id]);

  const SkeletonCard = () => {
    return (
      <div className="summary_blog gap-1">
        <Skeleton variant='rounded' height={12} width="70%" />
        <Skeleton variant='rounded' height={10} width="40%" />
      </div>
    )
  }
  const SkeletonSummary = () => {
    return (
      <>
        <Skeleton variant='rounded' height={9} width="40%" />
        <Skeleton variant='rounded' height={10} width="70%" />
      </>
    )
  }
  const SkeletonDesc = () => {
    return (
      <div className="summary_blog d-flex flex-column gap-1 mt-3">
        <Skeleton variant='rounded' height={30} width="40%" className='mb-2' />
        <Skeleton variant='rounded' animation='wave' height={10} width="70%" />
        <Skeleton variant='rounded' animation='wave' height={10} width="70%" />
        <Skeleton variant='rounded' animation='wave' height={10} width="70%" />
      </div>
    )
  }
  const SkeletonImage = () => {
    return (
      <Skeleton variant="rounded" width={210} height={'100%'} />
    )
  }
  return (
    <>
      <div className='app__blog'>
        <Container fluid>
          <div className="app__addprodects">
            <Component.SubNav sub__nav={[{ name: " Animal Products", path: '/store' }, { name: "Product Details ", path: `/store/details/${id}` }]} />
          </div>
          <Row>
            <Col xl={6} lg={6} md={6} sm={12} className='store_info'>
              <div className="store_header">
                Product Info
              </div>
              <div className="store_info_body">
                <Row >
                  <Col xl={5} lg={5} md={5} sm={5}  >
                    {isLoader ? <> {animal.AnimalProductImage ?
                      <img src={animal.AnimalProductImage} className='w-100 rounded' /> :
                      <img src={Img.defaultImg} className='w-100 rounded' />}
                    </> : SkeletonImage()}
                  </Col>
                  <Col xl={7} lg={7} md={7} sm={7} className="store_info_animal">
                    {isLoader ? <div className="summary_blog">
                      <span className='title'>Category:</span>
                      <span className='body'>{animal?.AnimalCategoryName}</span>
                    </div> : SkeletonCard()}

                    {isLoader ? <div className="summary_blog">
                      <span className='title'> Sub Category :</span>
                      <span className='body'>{animal?.AnimalSubCategoryName}</span>
                    </div> : SkeletonCard()}

                    {isLoader ? <div className="summary_blog">
                      <span className='title'> Product Type :</span>
                      <span className='body'>{animal?.AnimalProductType?.charAt(0).toUpperCase() + animal?.AnimalProductType?.slice(1).toLowerCase()}</span>
                    </div> : SkeletonCard()}
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xl={6} lg={6} md={6} sm={12} className='store_info'>
              <div className="store_header">
                Client Info
              </div>
              <div className="store_info_body">
                <Row>
                  <Col xl={5} lg={5} md={5} sm={5}  >
                    {
                      isLoader ? <>
                        {animal.ClientPicture ?
                          <img src={animal.ClientPicture} className='w-100 rounded' /> :
                          <img src={Img.defaultImg} className='w-100 rounded' />}
                      </> : SkeletonImage()}
                  </Col>
                  <Col xl={7} lg={7} md={7} sm={7} className="store_info_animal">
                    {
                      isLoader ? <div className="summary_blog">
                        <span className='title'>Name :</span>
                        <span className='body'>{animal?.ClientName}</span>
                      </div> : SkeletonCard()
                    }
                    {
                      isLoader ? <div className="summary_blog">
                        <span className='title'>Phone :</span>
                        <span className='body'>{animal?.ClientPhone}</span>
                      </div> : SkeletonCard()
                    }
                    {
                      isLoader ? <div className="summary_blog">
                        <span className='title'> City :</span>
                        <span className='body'>{animal?.CityName}</span>
                      </div> : SkeletonCard()
                    }
                  </Col>
                </Row>
              </div>
            </Col>
            <div className="summary">
              <Row>
                <Col className="summary_blog">
                  {isLoader ? <>
                    <span className='title'>{animal?.AnimalProductPrice}</span>
                    <span className='body'>Price</span>
                  </> : SkeletonSummary()}
                </Col>
                <Col className="summary_blog">
                  {isLoader ? <>
                    <span className='title'>{animal?.AnimalProductAge}</span>
                    <span className='body'>Age</span>
                  </> : SkeletonSummary()}
                </Col>
                <Col className="summary_blog">
                  {isLoader ? <>
                    <span className='title'>{animal?.AnimalProductGender?.charAt(0)?.toUpperCase() + animal?.AnimalProductGender?.slice(1).toLowerCase()}</span>
                    <span className='body'>Gender</span>
                  </> : SkeletonSummary()}
                </Col>
                <Col className="summary_blog">
                  {isLoader ? <>
                    <span className='title'>{animal?.AnimalProductSize}</span>
                    <span className='body'>Size</span>
                  </> : SkeletonSummary()}
                </Col>
                <Col className="summary_blog">
                  {isLoader ? <>
                    <span className='title'>{animal?.HasBagging}</span>
                    <span className='body'>Bagging</span>
                  </> : SkeletonSummary()}
                </Col>
                <Col className="summary_blog">

                  {isLoader ? <>
                    <span className='title'>{animal?.HasCutting}</span>
                    <span className='body'> Cutting</span>
                  </> : SkeletonSummary()}
                </Col>
                <Col className="summary_blog">
                  {isLoader ? <>
                    <span className='title'>{animal?.HasDelivery}</span>
                    <span className='body'> Delivery</span>
                  </> : SkeletonSummary()}
                </Col>
                <Col className="summary_blog">

                  {isLoader ? <>
                    <span className='title'>{animal?.AllowPhone}</span>
                    <span className='body'>  Phone</span>
                  </> : SkeletonSummary()}
                </Col>
                <Col className="summary_blog">

                  {isLoader ? <>
                    <span className='title'>{animal?.AllowWhatsapp}</span>
                    <span className='body'>  Whatsapp</span>
                  </> : SkeletonSummary()}
                </Col>
                <Col className="summary_blog">
                  {isLoader ? <>
                    <span className='title'>{animal?.AnimalProductStatus?.charAt(0)?.toUpperCase() + animal?.AnimalProductStatus?.slice(1).toLowerCase()}</span>
                    <span className='body'>Status</span>
                  </> : SkeletonSummary()}
                </Col>
              </Row>
            </div>
            {isLoader ? <>
              {animal?.AnimalProductDescription &&
                <div className="product_description">
                  <h3 >Product Description</h3>
                  <p>{animal?.AnimalProductDescription}</p>
                </div>
              }
            </> : SkeletonDesc()
            }
          </Row>

          <div className="app__blog_gallary">
            <div className=' '  >
              {isLoader ? <>
                {animal?.AnimalProductGallery &&
                  <div className="product_description">
                    <h3 >Product Gallery</h3>
                  </div>
                }
              </> :         <Skeleton variant='rounded' height={30} width="40%" className='mt-3 mb-2' />

              }

              <div className='row'>
                {isLoader ? <>
                  {animal?.AnimalProductGallery &&
                    <>
                      {animal?.AnimalProductGallery?.length > 8 ? animal?.AnimalProductGallery?.slice(0, 8).map((item, i) => (
                        <Col key={i}
                          xl={animal?.AnimalProductGallery?.length === 4 ? 6 : 12 / Math.min(animal?.AnimalProductGallery?.length, 4)}
                          lg={animal?.AnimalProductGallery?.length === 4 ? 6 : 12 / Math.min(animal?.AnimalProductGallery?.length, 4)}
                          md={12 / Math.min(animal?.AnimalProductGallery?.length, 2)}
                          sm={12} className='mt-3  '  >
                          <img
                            loading="lazy"
                            className='rounded-2  image'
                            src={item?.AnimalProductGalleryPath} // use normal <img> attributes as props
                            width={item?.AnimalProductGallery?.length < 2 ? "20%" : '100%'}
                          />
                        </Col>
                      )) :
                        animal?.AnimalProductGallery?.map((item, i) => (
                          <Col key={i}
                            xl={animal?.AnimalProductGallery?.length === 4 ? 6 : 12 / Math.min(animal?.AnimalProductGallery?.length, 4)}
                            lg={animal?.AnimalProductGallery?.length === 4 ? 6 : 12 / Math.min(animal?.AnimalProductGallery?.length, 4)}
                            md={12 / Math.min(animal?.AnimalProductGallery?.length, 2)}
                            sm={12} className='mt-3  ' style={{ maxHeight: '400px' }}  >
                            <img
                              loading="lazy"
                              className='rounded-2  image'
                              src={item?.AnimalProductGalleryPath} // use normal <img> attributes as props
                              width={'100%'}
                              height={'100%'}
                            />
                          </Col>
                        ))
                      }
                    </>
                  }
                </> :

                  <>
                    <div className="col">
                      <Skeleton variant="rounded" animation='wave' width={'100%'} height={150} />
                    </div>
                    <div className="col">
                      <Skeleton variant="rounded" animation='wave' width={'100%'} height={150} />
                    </div>
                    <div className="col">
                      <Skeleton variant="rounded" animation='wave' width={'100%'} height={150} />
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
        </Container>
      </div>

    </>
  )
}

export default StoreDetails
