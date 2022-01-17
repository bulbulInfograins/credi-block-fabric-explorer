import React from 'react'
import UserImg from '../asset/image/userimg.png'

export default function UserListItem({user,handleFunction }) {

    return (
        
        <>
            <div className="container searchList" onClick={handleFunction}>
                <div className='row'>
                    <div className="col-sm-12">
                        <div className='searchlist '>
                           <span> < img  className="seacrchimg"src={UserImg}/></span> 
                               {user.first_name} {user.last_name} 
                             
                        </div>
                      
                    </div>
                </div>
            </div>
        </>
    )
}
