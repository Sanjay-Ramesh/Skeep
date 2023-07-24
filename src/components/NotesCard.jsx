import React, { useState } from 'react'
import { RxCross1 } from 'react-icons/rx';



function NotesCard({CardInfo,oidx,userList,open}){

    const handleCheckBox = (oidx,idx)=>{
        var temp = [...userList]
        temp[oidx].List[idx].completed = !temp[oidx].List[idx].completed 
        setUserList(temp);
      }
      const removeTag = (idx) => {
        var temp = [...userList];
        temp[index].tags.pop(idx);
        setUserList(temp);
      };
const card = CardInfo;
let [isOpen, setIsOpen] = useState(true)
  return (
    <div className="min-h-[12rem] w-[15rem]  min-w-[10rem] max-w-[34.5rem] rounded-md shadow-md  h-[max-content] gap-[2rem] outline overflow-hidden outline-gray-700">
        
        {/* To-Do-Section */}
        {card.image ? (
          <img className="w-[100%] h-[10rem] " src={card.image} />
        ) : (
          ""
        )}
  
        <div onClick={()=>{openModal(item,idx)}} className="p-[0.95rem]">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold" id="title">
              {card.Title}
            </h1>
            <h1 className="text-[0.9rem]">{card.Body}</h1>
          </div>
  
          {/* Lists */}
          {card.List &&  (
            <div className="flex flex-col justify-start p-2">
              
              {card.List.length > 0 && card.List.map((item, idx) => {
               
                return(
                <div className="flex gap-2">
                  <input onClick={()=>{handleCheckBox(oidx,idx)}} checked={JSON.parse(item.completed)} type="checkbox" name={item.name} id={idx} />
                  <h1 className={JSON.parse(item.completed)?"text-decoration-line: line-through text-green-500":""}>{item.title}</h1>
                </div>
                )
              })}
            </div>
            
          
          )}
           
          {card.tags && (
            <div className="flex flex-row flex-wrap gap-4">
              {card.tags.length>0 && card.tags.map((tag,idx)=>{
                return (
                  <div className="p-2  group transition-all overflow-hidden duration-120  flex justify-center flex-row gap-2 items-center rounded-r-full rounded-l-full outline-gray-700/[85%] outline outline-[1px]">
                  <h1 className="text-[0.7rem]">{tag}</h1>
                  {/* <div className="hidden scale-75 rounded-full group-hover:block">
                    <RxCross1 onClick={()=>{removeTag(idx)}} className="hover:bg-slate-500/[55%]" />
                  </div> */}
                </div>
                )
              })}
          </div>
          )}
          
        </div>
      </div>
  )
}

export default NotesCard


  