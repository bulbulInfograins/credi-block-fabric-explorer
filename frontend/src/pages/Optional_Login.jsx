import React, { useState,useEffect } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { Link ,useHistory } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';



export default function Optional_Login() {


    // useEffect(() => {
    //     const user = JSON.parse(sessionStorage.getItem("userInfo"))
    //     if(user){
    //         History.push("/chat")
    //     }
    // },[History]);
    useEffect(() => {
        $("#password1").hide()
        $("#password2").hide()
        $("#email1").hide()
        $("#emailcheck").hide();
    },[]);

    $(".validate").focus(function(){
        $("#email1").hide();
        $("#password1").hide();
        $("#password2").hide();
        $("#emailcheck").hide();
    })


    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    // const [loading, setLoading] = useState(false);
    let History= useHistory()


     var url_string = window.location.href;
     const splitUrl = url_string.split('/')
     var role = splitUrl[4]


    

  const submitHander = async () => {
     console.log(role)
    // setLoading(true);
    if(!email){
        $("#email1").show();
    }
    if(!password){
        $("#password1").show();
    }
  
    try{
        const config = {
            headers: {
            "Content-type": "application/json",
            },
        };
        const { data } = await axios.post("http://localhost:3000/invoke", { email, password, role }, config  );
        console.log("login data" ,data)
        sessionStorage.setItem("userInfo", JSON.stringify(data));
        if(data.statusCode == 401){
            $("#emailcheck").show();
        }
        if(data.statusCode == 402){
            $("#password2").show();
        }
        if(data.statusCode == 403){
            alert("Incorrect Role")
        }
        if(data.success === true){
            History.push("/chat");
        }
        // if(data.data.role == 3){
        //     History.push("/supervisor")
        // }else{
        //     History.push("/chat");
        // }
    }catch (error) {
        console.log("error",error)
        // setLoading(false);
    }
  };


    return (
        <>
            <Header />
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 col-md-8 col-sm-12 mx-auto">
                            <div className="authentication ">
                                <div className="front-side">
                                    
                                        <div className="mb-12 sm:mb-8">
                                            <h2 className='text-center'>Log In</h2>
                                            <p className="mt-2 fw-light color-text">Doesn't have an account yet? <Link to ="/signup"
                                                className="underline color-away">Sign Up</Link></p>
                                        </div>
                                      
                                        <div className="form-group">

                                            <div className="form-group">
                                                <label className="fw-regular">Email Address</label>
                                                <input type="email" className="form-control validate" name="email" id="exampleInputEmail1"
                                                 placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)}  value={email} />
                                                <p className='error' id="email1">*Enter Valid Email</p>
                                                <p className='error' id="emailcheck">*Email does not exist!</p>
                                            </div>
                                       
                                     
                                            <div className="form-group">
                                                <label className="fw-regular w-100" >Password <a href="javascript:;"
                                                    className="underline color-away float-right" id="flip" >Forgot Password?</a></label>
                                                <input type="password" className="form-control validate" name="password" id="exampleInputPassword1"
                                                    placeholder="Enter 6 character or more" onChange={(e) => setPassword(e.target.value)}    value={password}/>
                                                    <p className='error' id="password1"> *Enter Password</p>
                                                    <p className='error' id="password2">*Password is not correct!</p>

                                            </div>   

                                   
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                                <label className="form-check-label fs-14" >Remember me</label>
                                            </div>
                                            <button className="button uppercase w-100 text-center" onClick={submitHander}>Login</button>

                                        </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}



