import { useState } from 'react'
import abi from './abi.json'
import './App.css'
import { ethers } from 'ethers'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskText, setNewTaskText] = useState('')
  const [tasks, setTasks] = useState([])
  const contractAddress = '0x6E9E8EFa1339C63C650eaD4E4cc67373308F2e2f'

  async function requestAccounts() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function addTask() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts()
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    try {
      toast.info('Adding task...')
      const tx = await contract.addTask(newTaskText, newTaskTitle, false)
      await tx.wait()
      toast.success('Task added successfully')
      setNewTaskTitle('')
      setNewTaskText('')
      getTasks()
    } catch (error) {
      toast.error('Error adding task')
      console.error(error)
    }
  }

  async function deleteTask(taskId) {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts()
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    try {
      toast.info('Deleting task...')
      const tx = await contract.deleteTask(taskId)
      await tx.wait()
      toast.success('Task deleted successfully')
      getTasks()
    } catch (error) {
      toast.error('Error deleting task')
      console.error(error)
    }
  }

  async function getTasks() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts()
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    try {
      toast.info('Fetching tasks...')
      const taskArray = await contract.getMyTask();

      console.log("raw tasks", taskArray)
      const formattedTasks = taskArray.map(task => ({
        id: task.0.toNumber(), 
        title: task.title, 
        description: task.description, 
        isCompleted: task.isCompleted,
      }));
      console.log("formatted tasks", formattedTasks)
      toast.success('Tasks fetched successfully')
      setTasks(formattedTasks);
    } catch (error) {
      toast.error('Error getting tasks')
      console.error(error)
    }
  }

  return (
    <>
      <div className="App">
        <h1>Task List</h1>
        <div className="form">
          <input
            type="text"
            placeholder="Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <textarea
            placeholder="Text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
          ></textarea>
          <button onClick={addTask}>Add Task</button>
        </div>
        <div className="tasks">
          {tasks.map((task, index) => (
            <div className="task" key={index}>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          ))}
        </div>
        <button onClick={getTasks}>Get Tasks</button>
      </div>
      <ToastContainer />
    </>
  )
}

export default App
