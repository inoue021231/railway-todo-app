import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { url } from '../const'
import { Header } from '../components/Header'
import './newTask.scss'
import { useNavigate } from 'react-router-dom'

export const NewTask = () => {
  const [selectListId, setSelectListId] = useState()
  const [lists, setLists] = useState([])
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [limitDate, setLimitDate] = useState('')
  const [limitTime, setLimitTime] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [cookies] = useCookies()
  const navigate = useNavigate()
  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleDetailChange = (e) => setDetail(e.target.value)
  const handleLimitDateChange = (e) => setLimitDate(e.target.value)
  const handleLimitTimeChange = (e) => setLimitTime(e.target.value)
  const handleSelectList = (id) => setSelectListId(id)
  const onCreateTask = () => {
    const limit = new Date(limitDate + ' ' + limitTime)

    const data = {
      title: title,
      detail: detail,
      done: false,
      limit: limit.toISOString(),
    }

    console.log(data.limit)

    axios
      .post(`${url}/lists/${selectListId}/tasks`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`タスクの作成に失敗しました。${err}`)
      })
  }

  useEffect(() => {
    const today = new Date()
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data)
        setSelectListId(res.data[0]?.id)
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`)
      })
    setLimitDate(
      today.getFullYear() +
        '-' +
        ('0' + (today.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + today.getDate()).slice(-2)
    )
    setLimitTime(
      ('0' + today.getHours()).slice(-2) +
        ':' +
        ('0' + today.getMinutes()).slice(-2)
    )
  }, [])

  return (
    <div>
      <Header />
      <main className="new-task">
        <h2>タスク新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-task-form">
          <label>リスト</label>
          <br />
          <select
            onChange={(e) => handleSelectList(e.target.value)}
            className="new-task-select-list"
          >
            {lists.map((list, key) => (
              <option key={key} className="list-item" value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
          <br />
          <label>タイトル</label>
          <br />
          <input
            type="text"
            onChange={handleTitleChange}
            className="new-task-title"
          />
          <br />
          <label>詳細</label>
          <br />
          <textarea
            type="text"
            onChange={handleDetailChange}
            className="new-task-detail"
          />
          <br />
          <label>期限</label>
          <br />
          <input type="date" onChange={handleLimitDateChange} />
          <input type="time" onChange={handleLimitTimeChange} />
          <br />
          <button
            type="button"
            className="new-task-button"
            onClick={onCreateTask}
          >
            作成
          </button>
        </form>
      </main>
    </div>
  )
}
