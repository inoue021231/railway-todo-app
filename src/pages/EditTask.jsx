import { useEffect, useState } from 'react'
import { Header } from '../components/Header'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { url } from '../const'
import { useNavigate, useParams } from 'react-router-dom'
import './editTask.scss'

export const EditTask = () => {
  const navigate = useNavigate()
  const { listId, taskId } = useParams()
  const [cookies] = useCookies()
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [isDone, setIsDone] = useState()
  const [limit, setLimit] = useState(new Date())
  const [limitDate, setLimitDate] = useState('')
  const [limitTime, setLimitTime] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleDetailChange = (e) => setDetail(e.target.value)
  const handleLimitDateChange = (e) => setLimitDate(e.target.value)
  const handleLimitTimeChange = (e) => setLimitTime(e.target.value)
  const handleIsDoneChange = (e) => setIsDone(e.target.value === 'done')

  const onUpdateTask = () => {
    const data = {
      title: title,
      detail: detail,
      done: isDone,
      limit: limit.toISOString(),
    }

    axios
      .put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`)
      })
  }

  const onDeleteTask = () => {
    axios
      .delete(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`)
      })
  }

  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const task = res.data
        setTitle(task.title)
        setDetail(task.detail)
        setIsDone(task.done)
        if (task.limit !== null) {
          const taskLimit = new Date(task.limit)
          setLimit(taskLimit)
          setLimitDate(
            taskLimit.getFullYear() +
              '-' +
              ('0' + (taskLimit.getMonth() + 1)).slice(-2) +
              '-' +
              ('0' + taskLimit.getDate()).slice(-2)
          )
          setLimitTime(
            ('0' + taskLimit.getHours()).slice(-2) +
              ':' +
              ('0' + taskLimit.getMinutes()).slice(-2)
          )
        } else {
          const today = new Date()
          setLimit(today)
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
        }
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`)
      })
  }, [])

  useEffect(() => {
    if (limitDate && limitTime) {
      setLimit(new Date(limitDate + ' ' + limitTime))
    }
  }, [limitDate, limitTime])

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label>タイトル</label>
          <br />
          <input
            type="text"
            onChange={handleTitleChange}
            className="edit-task-title"
            value={title}
          />
          <br />
          <label>詳細</label>
          <br />
          <textarea
            type="text"
            onChange={handleDetailChange}
            className="edit-task-detail"
            value={detail}
          />
          <br />
          <label>期限</label>
          <br />
          <input
            type="date"
            onChange={handleLimitDateChange}
            className="edit-task-detail"
            value={
              limit.getFullYear() +
              '-' +
              ('0' + (limit.getMonth() + 1)).slice(-2) +
              '-' +
              ('0' + limit.getDate()).slice(-2)
            }
          />
          <input
            type="time"
            onChange={handleLimitTimeChange}
            value={
              ('0' + limit.getHours()).slice(-2) +
              ':' +
              ('0' + limit.getMinutes()).slice(-2)
            }
          />
          <br />
          <div>
            <input
              type="radio"
              id="todo"
              name="status"
              value="todo"
              onChange={handleIsDoneChange}
              checked={isDone === false ? 'checked' : ''}
            />
            未完了
            <input
              type="radio"
              id="done"
              name="status"
              value="done"
              onChange={handleIsDoneChange}
              checked={isDone === true ? 'checked' : ''}
            />
            完了
          </div>
          <button
            type="button"
            className="delete-task-button"
            onClick={onDeleteTask}
          >
            削除
          </button>
          <button
            type="button"
            className="edit-task-button"
            onClick={onUpdateTask}
          >
            更新
          </button>
        </form>
      </main>
    </div>
  )
}
