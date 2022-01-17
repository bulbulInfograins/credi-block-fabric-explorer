import React, { useState, useEffect } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import axios from 'axios'

export default function SuperVisor() {
    const [brokerList, setBrokerList] = useState("")


    useEffect(() => {
        getBroker();
    }, [])
    const getBroker = async () => {

        await axios.get("http://localhost:3111/getAllBroker").then(res => {
            console.log(res.data.data)
            setBrokerList(res.data.data)
        }).catch(err => {
            console.log(err)
        })

    }






    // console.log(brokerList)
    // console.log(brokerList.data)

    return (
        <>
            <Header />
            <section className="bgcolor-lgrey py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 d-flex ">
                            <button class="btn btn-primary mx-3" type="button" data-bs-toggle="offcanvas" onClick={getBroker} data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                                View Broker
                            </button>
                            <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">View Client</button>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-12  text-right sm:text-center">
                            {/* <button id="userId" href="fabricview.html?id=" className="btn btn_info">View on Fabric</button> */}
                            {/* <button className="btn btn_info  text-white" >Logout</button> */}
                        </div>
                    </div>
                </div>
            </section>
            {/* <button className='btn btn-primary'  onClick={getBroker}>view Broker</button> */}
            <div>


            </div>

            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">Search User</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <hr />
                <div className="offcanvas-body" >
                    <div className='col-lg-12 px-0 '>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Search..." />
                            <div className="input-group-append">
                                <button className="btn btn-primary text-white" type="button" >Go</button>
                            </div>
                        </div>

                        {brokerList.map(element => {
                            console.log("element", element)
                            return (
                                <div>
                                    <h2 className='text-danger'>{element.email}</h2>
                                </div>
                            )
                        })}



                    </div>
                </div>
            </div>

            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div class="offcanvas-header">
                    <h5 id="offcanvasRightLabel">Offcanvas right</h5>
                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">

                </div>
            </div>


            {/* <Footer /> */}
        </>
    )
}
