import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import Spinner from './Spinner';

const Blogs = () => {
  //consume
  const {posts,loading}=useContext(AppContext);
  console.log("Printing inside the blog component");
  return (
    <div className='w-11/12 h-screen max-w-[450px] py-8 flex flex-col gap-y-7 justify-center items-center mt-[66px] mb-[70px]'>
      { 
      loading ? 
      (<Spinner/>) : 
      (
        posts.length===0 ? 
        (<div><p>No Post found</p></div>)
        : (posts.map((post)=>(
        <div key={post.id}>
          <p className='font-bold text-lg '>{post.title}</p>
          <p className='text-sm mt-[4px]'>
            By<span className='italic'>{post.author}</span> on <span className='underline font-bold'>{post.category}</span>
          </p>
          <p className='text-sm mt-[4px]'>Posted on {post.date}</p>
          <p className='text-md mt-[14px]'>{post.content}</p>
          <div className='flex gap-x-3'>
            {post.tags.map((tag,index)=>{return <span key={index} className='text-xs underline text-blue-500 mt-[5px]'>{`#${tag}`}</span>})}
          </div>
        </div>
        )))
      )
      }
    </div>
  )
}

export default Blogs
