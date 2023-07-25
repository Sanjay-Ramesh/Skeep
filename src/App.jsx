import { GiCrossMark, GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import {
  BsBell,
  BsCheck2Square,
  BsLightbulb,
  BsTag,
  BsPlus,
} from "react-icons/bs";
import "./index.css";
import { Dialog, Transition } from "@headlessui/react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";
import { useState, Fragment, useEffect, useId } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiMoreVertical } from "react-icons/fi";
import NotesCards from "./components/NotesCard";
import { DragDropContext,Droppable,Draggable } from "react-beautiful-dnd";
import {default as UUID} from "node-uuid";

function App() {
  const [route, setRoute] = useState(0);
  const [view, setView] = useState(true);
  const [title, setTitle] = useState("");
  const [id, setId] = useState(null);
  const [body, setBody] = useState("");
  const [tags, setTags] = useState(null);
  const [image, setImage] = useState(null);
  const [list, setList] = useState(null);
  const [index, setIndex] = useState(null);
  const [newTitle,setNewTitle] = useState("");
  const [newBody,setNewBody] = useState("");
  const [newList,setNewList] = useState([]);
  const [newTags,setNewTags] = useState([])
  const [userList, setUserList] = useState([]);
  let [isOpen, setIsOpen] = useState(false);

  async function closeModal() {
    let temp = [...userList];
    let time = temp[index].timestamp;

    temp[index] = {
      id: id,
      Title: title,
      Body: body,
      image: image,
      List: list,
      tags: tags,
      timestamp: time,
    };
    console.log(temp, index, list);
    setUserList(temp);
    await axios.post("http://localhost:3000/updateNote",{notes:temp},{
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
  }}).then(async(response)=>{
    await axios.get("http://localhost:3000/").then((response) => {
      console.log(response);
      setUserList(response.data.notes);
    });
  })
    
    console.log(userList);
    setIsOpen(false);
    setId(null);
    setTitle("");
    setBody("");
    setList(null);
    setImage("");
    setTags(null);
  }

  const handleDragDrop = async (results)=>{
    const {source,destination,type} = results;
    if(!destination) return;

    if(source.droppableId === destination.droppableId && source.index===destination.index) return;

    if(type==='group'){
      const reorderedUserList = [...userList];
      const sourceIndex = source.index;
      const destinationIndex = destination.index;
      const [removedUserList] = reorderedUserList.splice(sourceIndex,1);
      reorderedUserList.splice(destinationIndex,0,removedUserList)

      await axios.post("http://localhost:3000/updateNote",{notes:reorderedUserList},{
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
  }}).then(async(response)=>{
    await axios.get("http://localhost:3000/").then((response) => {
      console.log(response);
      setUserList(response.data.notes);
    });
  })

      return setUserList(reorderedUserList)

      
    }
  }

  function openModal(note, idx) {
    // console.log(note)
    setIndex(idx);
    setId(note.id);
    setTitle(note.Title);
    setBody(note.Body);
    setList(note.List);
    setImage(note.image);
    setTags(note.tags ? note.tags : []);
    setIsOpen(true);
  }

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  
  const handleCheckBox = (idx) => {
    var temp = [...userList];
    temp[index].List[idx].completed = JSON.parse(!temp[index].List[idx].completed);
    setUserList(temp);
  };

  const addList = () => {
    var temp = [...userList];
    temp[index].List.push({
      title: `List Item ${temp[index].List.length + 1}`,
      completed: false,
    });
    setUserList(temp);
  };

  const addTag = () => {
    var temp = [...userList];
    try{
      temp[index].tags.push(`Tag ${temp[index].tags.length + 1}`);
    }catch{
      temp[index].tags = [];
      temp[index].tags.push(`Tag ${temp[index].tags.length + 1}`);
    }
    
    setUserList(temp);
  };

  const handleTag = (e, idx) => {
    var temp = [...userList];
    temp[index].tags[idx] = e.target.value;
    setUserList(temp);
  };

  const removeList = (idx) => {
    var temp = [...userList];
    temp[index].List.pop(idx);
    setUserList(temp);
  };

  const removeTag = (idx) => {
    var temp = [...userList];
    temp[index].tags.pop(idx);
    setUserList(temp);
  };

  const handleList = (e, idx) => {
    var temp = [...userList];
    temp[index].List[idx].title = e.target.value;
    setUserList(temp);
  };

  //new

  const handleNewCheckBox = (idx) => {
    var temp = [...newList];
    temp[idx].completed = JSON.parse(!temp[idx].completed);
    setNewList(temp);
  };

  const addNewList = () => {
    var temp = [...newList];
    temp.push({
      title: `List Item ${temp.length + 1}`,
      completed: false,
    });
    setNewList(temp);
  };

  const addNewTag = () => {
    var temp = [...newTags];
    temp.push(`Tag ${temp.length + 1}`);
    setNewTags(temp);
  };

  const handleNewTag = (e, idx) => {
    var temp = [...newTags];
    temp[idx] = e.target.value;
    setNewTags(temp);
  };

  const removeNewList = (idx) => {
    var temp = [...newList];
    temp.pop(idx);
    setNewList(temp);
  };

  const removeNewTag = (idx) => {
    var temp = [...newTags];
    temp.pop(idx);
    setNewTags(temp);
  };

  const handleNewList = (e, idx) => {
    var temp = [...newList];
    temp[idx].title = e.target.value;
    setNewList(temp);
  };

  const AddNote = async ()  => {
    var fd = new FormData();
    var note = {
      Title:newTitle,
      Body:newBody,
      List: newList,
      tags:newTags,
    }
    
  const fileData = JSON.stringify(note);
  const blob = new Blob([fileData], {type: "text/plain"});
    fd.append("note",JSON.stringify(note))
    fd.append("noteImage",selectedFile)
    await axios.put("http://localhost:3000/addNote",fd,{
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then((res)=>{
      axios.get("http://localhost:3000/").then((response) => {
        console.log(response);
        setUserList(response.data.notes);
      });
      toast("New Note Created ✅ - "+newTitle)
    })
  }



  const [selectedFile, setSelectedFile] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/").then((response) => {
      console.log(response);
      setUserList(response.data.notes);
    });

    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const search = async (e) => {
    e.preventDefault();
    // window.alert(e.target.value)
    await axios
      .post(
        "http://localhost:3000/search",
        { key: e.target.value },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        if (response.data.length > 0) {
          setUserList(response.data);
        }
      });
  };

  return (
    <>
      
      <div>
        <Toaster />
      </div>
      
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-black/[85%] shadow-xl rounded-2xl">
                  {image && (
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-white-900"
                    >
                      <img src={image} alt="" />
                    </Dialog.Title>
                  )}

                  <div className="mt-2">
                    <input
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                      value={title}
                      className="mt-2 text-xl font-bold bg-transparent "
                    />

                    <textarea
                      onChange={(e) => {
                        setBody(e.target.value);
                      }}
                      type="textarea"
                      value={body}
                      className="mt-2 bg-transparent "
                    />
                  </div>

                  <div>
                    {list && (
                      <div className="flex flex-col justify-start gap-2 p-2 mt-2">
                        <h1>List Section</h1>
                        {list.length > 0 ? (
                          list.map((item, idx) => {
                           
                            return (
                              <div id={UUID.v4()} className="flex gap-2">
                                <input
                                  onChange={() => {
                                    handleCheckBox(idx);
                                  }}
                                  checked={JSON.parse(item.completed)}
                                  type="checkbox"
                                  name={item.name}
                                  id={idx}
                                />
                                <input
                                  onChange={(e)=>handleList(e, idx)}
                                  value={item.title}
                                />
                                <button
                                  onClick={() => {
                                    addList();
                                  }}
                                  className="p-2 text-white bg-green-500"
                                >
                                  Add
                                </button>
                                <button
                                  onClick={() => {
                                    removeList(idx);
                                  }}
                                  className="p-2 text-white bg-red-500"
                                >
                                  Remove
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div>
                            <button
                              onClick={() => {
                                addList();
                              }}
                              className="p-2 text-white bg-green-500"
                            >
                              Add
                            </button>
                          </div>
                        )}
                        {tags && (
            
            <div className="flex flex-row flex-wrap items-center gap-2 mt-5">
              <h1>Tags: </h1>
              {tags.length>0 && (tags.map((tag,idx)=>{
                return (
                  <div id={UUID.v4()} className="p-2 w-[3rem] group transition-all overflow-hidden duration-120 hover:w-[3.5rem] flex justify-center flex-row gap-2 items-center rounded-r-full rounded-l-full outline-gray-700/[85%] outline outline-[1px]">
                  <input onChange={(e) => {
                                    handleTag(e, idx);
                                  }} className="text-[0.7rem] w-full flex-shrink-0 bg-transparent" value={tag}/>
                  <div className="hidden scale-75 rounded-full group-hover:block">
                    <RxCross1 onClick={()=>{removeTag(idx)}} className="hover:bg-slate-500/[55%] " />
                  </div>
                </div>
                )
              }))}
              <BsPlus onClick={() => {
                                addTag();
                              }} className="scale-[120%] hover:scale-150 transition-all duration-100 fill-white"/>
          </div>
          )}
                        
                      </div>
                    )}
                  </div>

                  <div className="mt-4">close</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="flex flex-col min-h-screen overflow-y-hidden">
        {/* Header */}
        <div className="flex flex-row items-center justify-start gap-2 p-2 border border-t-0 border-l-0 border-r-0 border-gray-600 shadow-md">
          <div className="flex items-center flex-shrink-0 gap-2">
            <button>
              <GiHamburgerMenu />
            </button>
            <img
              src={
                "https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png"
              }
              atl={"logo"}
            />
            <h2 className="font-sans font-semibold md:text-xl">SKeep</h2>
          </div>
          <div className="flex flex-grow">
            <input
              onChange={(e) => {
                search(e);
              }}
              placeholder="Search"
              className="rounded p-2 h-[2rem] w-[100%]"
              type="text"
            />
          </div>
        </div>

        {/* Main */}
        <div className="flex flex-row flex-grow">
          {/* Menu */}
          <div className="flex flex-col gap-8 p-2  w-[4rem] items-center  shadow-md">
            <div
              onClick={(e) => {
                setRoute(0);
                toast("Notes Created ✅");
              }}
              className={
                route != 0
                  ? "flex gap-2 hover:cursor-pointer items-center p-3 rounded-full hover:fill-white"
                  : "flex gap-2 hover:cursor-pointer items-center bg-yellow-400/[15%] w-max p-3 rounded-full"
              }
            >
              <BsLightbulb className="transition-all fill-gray-300 scale-[110%]" />
              {/* <h2>Notes</h2> */}
            </div>
            <div
              onClick={(e) => {
                setRoute(1);
              }}
              className={
                route != 1
                  ? "flex gap-2 hover:cursor-pointer items-center p-3 rounded-full hover:fill-white"
                  : "flex gap-2 hover:cursor-pointer items-center bg-yellow-400/[15%] w-max p-3 rounded-full"
              }
            >
              <BsBell />
              {/* <h2>Remainders</h2> */}
            </div>
            <div
              onClick={(e) => {
                setRoute(2);
              }}
              className={
                route != 2
                  ? "flex gap-2 hover:cursor-pointer items-center p-3 rounded-full hover:fill-white"
                  : "flex gap-2 hover:cursor-pointer items-center bg-yellow-400/[15%] w-max p-3 rounded-full"
              }
            >
              <BsTag />
              {/* <h2>tag</h2> */}
            </div>
          </div>
          {/* Notes */}
          <div className="flex flex-col flex-grow gap-10 mt-10">
            {/* Notes-Section */}
            <div
      
              className={
                !view
                  ? "flex   p-2 w-[100%] justify-center items-center"
                  : "hidden"
              }
            >
              <div className="flex  z-10 bg-black flex-col justify-between hover:shadow-md transition-all hover:shadow-blue-500  gap-2  p-3  w-[100%]  md:w-[50%] shadow-md outline outline-gray-700 rounded">
                <div >
                  {selectedFile && (
                    <div className="relative">
                      <img
                        className="w-[100%] object-contain h-[20rem]"
                        src={preview}
                      />
                      <button
                        onClick={() => {
                          setPreview(undefined);
                          setSelectedFile(false);
                        }}
                        className="absolute p-2 text-white bg-red-500 hover:shadow-2xl hover:shadow-red-600 hover:scale-110 rounded-xl right-1 bottom-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <input
                  onChange={(e)=>{setNewTitle(e.target.value)}}
                    type="text"
                    className="bg-transparent ring-0 focus:outline-none w-[90%]   rounded-sm placeholder:text-white"
                    placeholder="Title"
                  />
                  <textarea
                    onChange={(e)=>{setNewBody(e.target.value)}}
                    type="text"
                    className="bg-transparent mt-2 ring-0 focus:outline-none w-[90%]   rounded-sm placeholder:text-white"
                    placeholder="Body of Note"
                  />

                  

                   <div>
                    {newList && (
                      <div className="flex flex-col justify-start gap-2 p-2 mt-2">
                        <h1>List Section</h1>
                        {newList.length > 0 ? (
                          newList.map((item, idx) => {
                            return (
                              <div key={id} className="flex gap-2">
                                <input
                                  onChange={() => {
                                    handleNewCheckBox(idx);
                                  }}
                                  checked={JSON.parse(item.completed)}
                                  type="checkbox"
                                  name={item.name}
                                  id={idx}
                                />
                                <input
                                  onChange={(e) => {
                                    handleNewList(e, idx);
                                  }}
                                  value={item.title}
                                />
                                <button
                                  onClick={() => {
                                    addNewList();
                                  }}
                                  className="p-2 text-white bg-green-500"
                                >
                                  Add
                                </button>
                                <button
                                  onClick={() => {
                                    removeNewList(idx);
                                  }}
                                  className="p-2 text-white bg-red-500"
                                >
                                  Remove
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div>
                            <button
                              onClick={() => {
                                addNewList();
                              }}
                              className="p-2 text-white bg-green-500"
                            >
                              Add
                            </button>
                          </div>
                        )}
                        {newTags && (
            
            <div className="flex flex-row flex-wrap items-center gap-2 mt-5">
              <h1>Tags: </h1>
              {newTags.length>0 && newTags.map((tag,idx)=>{
                return (
                  <div key={newTags.length} className="p-2 w-[3.5rem] group transition-all overflow-hidden duration-120 flex justify-center flex-row gap-2 items-center rounded-r-full rounded-l-full outline-gray-700/[85%] outline outline-[1px]">
                  <input onChange={(e) => {
                                    handleNewTag(e, idx);
                                  }} className="text-[0.7rem] w-full flex-shrink-0 bg-transparent" value={tag}/>
                  <div className="hidden scale-75 rounded-full group-hover:block">
                    <RxCross1 onClick={()=>{removeNewTag(idx)}} className="hover:bg-slate-500/[55%] " />
                  </div>
                </div>
                )
              })}
              <BsPlus onClick={() => {
                                addNewTag();
                              }} className="scale-[120%] hover:scale-150 transition-all duration-100 fill-white"/>
          </div>
          )}
                        
                      </div>
                    )}
                  </div>     
                  



                  
                </div>
                <div className="flex items-center justify-between gap-2 p-1 mt-5">
                  <div className="flex gap-2">
                    <input
                      onChange={onSelectFile}
                      id="file"
                      accept="image/*"
                      className="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
                      type="file"
                    />
                    <label htmlFor="file">
                      <HiOutlinePhotograph className="scale-[130%] rounded-full" />
                    </label>
                    
                  </div>
                  <button
                    onClick={(e) => {
                      AddNote();
                      setView(true);
                    }}
                    className="p-1 shadow-md bg-green-500 rounded-full text-[0.8rem]"
                  >
                    Create
                  </button>
                </div>
                {/* <input type="text" className="bg-transparent ring-0 focus:outline-none w-[90%]   rounded-sm placeholder:text-white" placeholder="Take a note..." /> */}
              </div>
            </div>

            <div
              onClick={() => setView(false)}
              className={
                view
                  ? "flex h-[5rem] p-2  justify-center items-center"
                  : "hidden"
              }
            >
              <div className="flex hover:shadow-md transition-all hover:shadow-blue-500 justify-between items-center flex-row h-[2.6rem] p-3 w-[100%]  md:w-[50%] shadow-md outline outline-gray-700 rounded">
                <input
                  type="text"
                  className="bg-transparent ring-0 focus:outline-none w-[90%]   rounded-sm placeholder:text-white"
                  placeholder="Take a note..."
                />
                <div className="flex overflow-hidden">
                  <div
                    data-tooltip-target="tooltip-default"
                    className="p-2 flex justify-center hover:cursor-pointer items-center w-[3rem] hover:bg-slate-500/[25%] transition-all  rounded-full h-[3rem]"
                  >
                    <BsCheck2Square className="scale-[130%] rounded-full " />
                  </div>

                  <div className="p-2 flex justify-center hover:cursor-pointer items-center w-[3rem] hover:bg-slate-500/[25%] transition-all  rounded-full h-[3rem]">
                    <HiOutlinePhotograph className="scale-[130%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            {/* To-list */}
            <DragDropContext onDragEnd={handleDragDrop}>

          
            <Droppable droppableId="ROOT" type="group">
            
           
              {(provided)=>(
                 <div {...provided.droppableProps} ref={provided.innerRef} className="flex p-2 gap-[1rem] md:flex-wrap flex-col md:flex-row flex-grow ">
                  {userList.length > 0 ? (
                userList.map((item, idx) => {
                  return (
                    <Draggable draggableId={item.id} key={item.id} index={idx}
                      
                    >
                      {(provided)=>(
                        <div onClick={() => {
                          openModal(item, idx);
                        }} {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                          <NotesCards
                        CardInfo={item}
                        oidx={idx}
                        userList={userList}
                        open={openModal}
                        onClick={() => {
                          console.log("clc");
                        }}
                      />
                        </div>
                      )}
                    </Draggable>
                  );
                })
              ) : (
                <div>No Notes Written Yet</div>
              )}
                </div>
              )}
            
            </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>

    </>
  );
}

export default App;
