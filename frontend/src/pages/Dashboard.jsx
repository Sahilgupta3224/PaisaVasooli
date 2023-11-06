import React,{useState,useEffect} from 'react'
import Navbar from '../components/Navbar'
import {Button} from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal';

const Dashboard = () => {
    const [show, setShow] = useState(false);
    const [transInput,setTransInput] = useState({
        type: 'Expense',
        amount:'',
        category:'',
        desc:'',
        date:'',
    })
    
    const {type,amount,category,desc,date} = transInput

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleTransInput = name=>e=>{
          setTransInput({...transInput,[name]:e.target.value})
    }
    useEffect(()=>{
        axios.post()
    },[])

    
    const handleSubmit = e=>{
        e.preventDefault()
        console.log(transInput)
        // addTransaction(transInput)
       
        setTransInput({
            type:'Expense',
            amount:'',
            category:'',
            desc:'',
            date:''
        })
       
    }

  return (
    <div>
        <Navbar/>
        <div >
            <div className='flex w-full border-black border-2 justify-center h-40'>
            <div className=' mx-4 w-60 my-4 rounded-md flex justify-center bg-[#198754] text-white'>income</div>
            <div className=' mx-4 w-60 my-4 rounded-md flex justify-center bg-[#198754] text-white'>balance</div>
            <div className=' mx-4 w-60 my-4 rounded-md flex justify-center bg-[#198754] text-white'>expense</div>
        </div>
        
        <div className='flex px-4 py-4 justify-center'>
        <div className='flex justify-center align-middle border-2 py-2 px-2 font-bold text-xl'>Filters:</div>

        <select className='mx-2 border-2 rounded-md' name="category" id="category" selected="All">
           <option value="All">All Categories</option>
           <option value="Food">Food</option>
           <option value="Shopping">Shopping</option>
           <option value="Cinema">Cinema</option>
        </select>

        <input type="date" className='mx-2 border-2 rounded-md w-60' onChange={handleTransInput('date')}></input>

        <input type="month" id="month" name="month" className='mx-2 border-2 rounded-md w-60' placeholder='Select Month' onChange={handleTransInput('month')}></input>
        
        <select name="year" id="year" className='mx-2 border-2 rounded-md' placeholder='year' onChange={handleTransInput('year')}>
           <option value="2023">2023</option>
        </select>
        </div>

    <button onClick={handleShow} className='bg-[#198754] text-white rounded-full px-2 py-2 w-12 h-12 shadow-md fixed bottom-8 right-8'>+</button>
    <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {/* Add transaction input section */}
            <label htmlFor="type">Transaction type: </label>
            <select name="type" 
                    id="type" 
                    selected="Expense" 
                    value={type}
                    onChange={handleTransInput('type')}
                    className='px-1 border-1 py-1 mx-2 rounded-md'
                    required
                    >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            </select><br/>

            <label htmlFor='amount'>Amount: </label>
            <input type="number" 
                   name={'amount'}
                   value={amount}
                   onChange={handleTransInput('amount')}
                   required
                   ></input>

            <label htmlFor='category'>Category: </label>
            <input name={"category"}
                   type="text"
                   value={category}
                   onChange={handleTransInput('category')}
                   required
                   ></input>

            <label htmlFor='desc'>Description:</label>
            <input type='text' 
                   name={'desc'}
                   value={desc}
                   onChange={handleTransInput('desc')}
            ></input>

            <label htmlFor='date'>Date:</label>
            <input type='date'
                   name={"date"}
                   value={date}
                   onChange={handleTransInput('date')}
                   required
            ></input>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success"
                  onClick={handleSubmit}
                  required
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
            
             
        </div>
    </div>
  )
}

export default Dashboard