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
        id: task[0],
        title: task[1],
        description: task[2],
        isCompleted: task[3]
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f7fafc', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', borderRadius: '12px', padding: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: '#2d3748' }}>Task List</h1>
        <div style={{ marginTop: '16px', spaceY: '8px' }}>
          <input
            type="text"
            placeholder="Title"
            style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', focus: { outline: '2px solid #4299e1' } }}
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <textarea
            placeholder="Task description"
            style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', focus: { outline: '2px solid #4299e1' } }}
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
          ></textarea>
          <button
            onClick={addTask}
            style={{ width: '100%', backgroundColor: '#4299e1', color: '#fff', padding: '8px', borderRadius: '8px', cursor: 'pointer', hover: { backgroundColor: '#3182ce' }, transition: 'background-color 0.3s' }}
          >
            Add Task
          </button>
        </div>
        <div style={{ marginTop: '24px', spaceY: '16px' }}>
        <button
            onClick={getTasks}
            style={{ width: '100%', backgroundColor: '#4299e1', color: '#fff', padding: '8px', borderRadius: '8px', cursor: 'pointer', hover: { backgroundColor: '#3182ce' }, transition: 'background-color 0.3s' }}
          >
            Get Tasks
          </button>
        </div>
        <div style={{ marginTop: '24px', spaceY: '16px' }}>
          {tasks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#a0aec0' }}>No tasks yet</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                style={{ padding: '16px', backgroundColor: '#f7fafc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#718096' }}>{task.title}</h2>
                  <p style={{ color: '#718096' }}>{task.description}</p>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ color: '#e53e3e', cursor: 'pointer', hover: { color: '#c53030' }, transition: 'color 0.3s' }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
        
      </div>
      <ToastContainer />
    </div>
  );
}

export default App
