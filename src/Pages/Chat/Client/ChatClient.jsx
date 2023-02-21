import React, { useContext, useEffect, useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import '../chat.scss'
import Icons from '../../../constants/Icons';
import Img from '../../../assets/Img';
import Component from '../../../constants/Component';
import { PostData, apiheader, GetData } from './../../../utils/fetchData';
import { Outlet, useParams } from 'react-router-dom';
import { ChatContext } from '../../../context/ChatStore';

const ChatClient = () => {
  const { id } = useParams();
  const inputRef = useRef(null);
  let { userReplied } = useContext(ChatContext);
  const [inputValue, setInputValue] = useState('');
  const [clientChatSupport, setClientChatSupport] = useState([])

  const clientlist = async () => {
    let { data } = await PostData(`https://bytrh.com/api/admin/chat/client/list`, {}, apiheader)
    console.log(data.Response.ClientChatSupport);
    setClientChatSupport(data.Response.ClientChatSupport)

  }

  const adminSendMess = async (value) => {
    let data = await PostData(`https://bytrh.com/api/admin/chat/client/reply`,
      {
        IDClientChatSupport: id,
        ChatSupportMessage: value,
        ChatSupportType: 'TEXT'
      }
      , apiheader);
    // console.log(data);
  } 


  const handeAdminMess = () => {
    const value = inputRef.current.value;
    // console.log(value);
    // TODO: Send the value to the server
    adminSendMess(value)
    setInputValue('');
    inputRef.current.value = '';
  };

  const [selectedFile, setSelectedFile] = useState(null);
  async function handleFileSelect(event) {
    console.log(event.target.files);
    setSelectedFile();
    if (selectedFile !== null) {
      let data = await PostData(`https://bytrh.com/api/admin/chat/client/reply`,
        {
          IDClientChatSupport: id,
          ChatSupportMessage: event.target.files[0],
          ChatSupportType: 'IMAGE'
        }
        , apiheader);
      console.log(data);
    }
  }

  const [isOn, setIsOn] = useState(true);

  const handlePowerClick = async () => {
    setIsOn(false);
    if (isOn === true) {
      let data = await GetData(`https://bytrh.com/api/admin/chat/client/end/${id}`, apiheader)
      console.log(data);
    } 

    let fil=clientChatSupport.filter((item)=>item.IDClientChatSupport === id)
    console.log(fil);
  };

  useEffect(() => {
    clientlist()
    handlePowerClick()
  }, [id])
  return (
    <div className='app__chat'>
      <Row className="app__chat__container ">
        <Component.ClientList clientChatSupport={clientChatSupport} />
        <Col xl={8} lg={8} md={6} sm={12} className='app__chat_messages '>
          <div className='shadow app__chat_list-card'>
            <div className={`app__Live_chat chat-body  ${id ? '' : 'bg-dark'}`} style={{ background: '#d9d9d998' }}>
              {
                id ?
                  <>
                    <div className="turn__off">
                      <button className={`power-button ${isOn ? "on " : "off scaled"} `} onClick={handlePowerClick} >
                        <Icons.poweroff className="icon" />
                      </button>
                    </div>
                    <Outlet></Outlet>
                  </>
                  :
                  <div className="empty_chat   w-100 h-100 d-flex justify-content-center align-items-center flex-column">
                    <img src={Img.empty_chat} className='w-50' />
                    <h2 className={` ${id ? '' : 'text-light'}`}>
                      Welcome, <span style={{ color: '#313bac' }}>admin!</span>
                    </h2>
                    <h4 className={` ${id ? '' : 'text-light'}`}>Please select a chat to Start messaging.</h4>
                  </div>
              }
            </div>
            {
              userReplied === 0 ?
                <>
                  {
                    id ?
                      <div className="app__send">
                        <input type="text" className="form-control" ref={inputRef} />
                        <button className='btn shadow-lg bgChatBtn' onClick={handeAdminMess} >
                          <Icons.send color='#fff' size={20} />
                        </button>

                        <input type="file" id="file-input" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                        <label htmlFor="file-input" className="btn btn-info bgChatBtn shadow" style={{ pointerEvents: 'all' }}>
                          <Icons.imageUpload color='#fff' size={20} />
                        </label>

                      </div>
                      :
                      ''
                  }
                </> :
                <>
                  {
                    id ?
                      <div className="app__send d-flex justify-content-center align-items-center">
                        <h6> Another user already replied</h6>
                      </div> : ''
                  }
                </>
            }


          </div>

        </Col >

      </Row >
    </div >
  )
}

export default ChatClient