import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { Header } from '../components/Header'
import { url } from '../const'
import './home.scss'

export const Home = () => {
  const [isDoneDisplay, setIsDoneDisplay] = useState('todo') // todo->未完了 done->完了
  const [lists, setLists] = useState([])
  const [selectListId, setSelectListId] = useState()
  const [tasks, setTasks] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [cookies] = useCookies()
  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value)
  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data)
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`)
      })
  }, [])

  useEffect(() => {
    const listId = lists[0]?.id
    if (typeof listId !== 'undefined') {
      setSelectListId(listId)
      axios
        .get(`${url}/lists/${listId}/tasks`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((res) => {
          setTasks(res.data.tasks)
        })
        .catch((err) => {
          setErrorMessage(`タスクの取得に失敗しました。${err}`)
        })
    }
  }, [lists])

  const handleSelectList = (id) => {
    setSelectListId(id)
    axios
      .get(`${url}/lists/${id}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks)
      })
      .catch((err) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`)
      })
  }

  const handleKeyDown = (event) => {
    console.log(event.key)
    if (lists.length <= 1 || event.key !== 'Tab') return
    const currentIndex = lists.findIndex((item) => item.id === selectListId)
    if (currentIndex === lists.length - 1) {
      handleSelectList(lists[0].id)
    } else {
      handleSelectList(lists[currentIndex + 1].id)
    }
  }

  return (
    <div>
      <Header />
      <main className="taskList">
        <p className="error-message">{errorMessage}</p>
        <div>
          <div className="list-header">
            <h2>リスト一覧</h2>
            <div className="list-menu">
              <p>
                <Link to="/list/new" tabIndex={-1}>
                  リスト新規作成
                </Link>
              </p>
              <p>
                <Link to={`/lists/${selectListId}/edit`} tabIndex={-1}>
                  選択中のリストを編集
                </Link>
              </p>
            </div>
          </div>
          <ul className="list-tab" role="tablist" onKeyDown={handleKeyDown}>
            {lists.map((list, key) => {
              const isActive = list.id === selectListId
              return (
                <li
                  key={key}
                  className={`list-tab-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectList(list.id)}
                  tabIndex={isActive ? 0 : -1}
                  role="tab"
                  aria-label={list.title}
                >
                  {list.title}
                </li>
              )
            })}
          </ul>
          <div className="tasks">
            <div className="tasks-header">
              <h2>タスク一覧</h2>
              <Link to="/task/new" tabIndex={-1}>
                タスク新規作成
              </Link>
            </div>
            <div className="display-select-wrapper">
              <select
                onChange={handleIsDoneDisplayChange}
                className="display-select"
                tabIndex={-1}
              >
                <option value="todo">未完了</option>
                <option value="done">完了</option>
              </select>
            </div>
            <Tasks
              tasks={tasks}
              selectListId={selectListId}
              isDoneDisplay={isDoneDisplay}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

// 表示するタスク
const Tasks = (props) => {
  const { tasks, selectListId, isDoneDisplay } = props
  if (tasks === null) return <></>

  if (isDoneDisplay == 'done') {
    return (
      <ul>
        {tasks
          .filter((task) => {
            return task.done === true
          })
          .map((task, key) => {
            const limit = new Date(task.limit)
            const limitDateTime =
              limit.getFullYear() +
              '年' +
              (limit.getMonth() + 1) +
              '月' +
              limit.getDate() +
              '日' +
              limit.getHours() +
              '時' +
              limit.getMinutes() +
              '分'

            let remain = limit >= new Date() ? limit - new Date() : 0
            const remainYear = Math.floor(remain / (365 * 24 * 60 * 60 * 1000))
            const remainYearStr = remainYear !== 0 ? remainYear + '年' : ''
            remain -= remainYear * (365 * 24 * 60 * 60 * 1000)
            const remainMonth = Math.floor(remain / (31 * 24 * 60 * 60 * 1000))
            const remainMonthStr = remainMonth !== 0 ? remainMonth + 'か月' : ''
            remain -= remainMonth * (31 * 24 * 60 * 60 * 1000)
            const remainDate = Math.floor(remain / (24 * 60 * 60 * 1000))
            const remainDateStr = remainDate !== 0 ? remainDate + '日' : ''
            remain -= remainDate * (24 * 60 * 60 * 1000)
            const remainHour = Math.floor(remain / (60 * 60 * 1000))
            const remainHourStr = remainHour !== 0 ? remainHour + '時間' : ''
            remain -= remainHour * (60 * 60 * 1000)
            const remainMinute = Math.floor(remain / (60 * 1000))
            const remianMinuteStr =
              remainMinute !== 0 ? remainMinute + '分' : ''
            const remainDateTime =
              remain > 0
                ? '残り' +
                  remainYearStr +
                  remainMonthStr +
                  remainDateStr +
                  remainHourStr +
                  remianMinuteStr
                : '期限切れ'
            return (
              <li key={key} className="task-item">
                <Link
                  to={`/lists/${selectListId}/tasks/${task.id}`}
                  className="task-item-link"
                  role="tabpanel"
                  tabIndex={-1}
                >
                  {task.title}
                  <br />
                  {limitDateTime}
                  まで
                  <br />
                  {remainDateTime}
                  <br />
                  {task.done ? '完了' : '未完了'}
                </Link>
              </li>
            )
          })}
      </ul>
    )
  }

  return (
    <ul>
      {tasks
        .filter((task) => {
          return task.done === false
        })
        .map((task, key) => {
          const limit = new Date(task.limit)
          const limitDateTime =
            limit.getFullYear() +
            '年' +
            (limit.getMonth() + 1) +
            '月' +
            limit.getDate() +
            '日' +
            limit.getHours() +
            '時' +
            limit.getMinutes() +
            '分'

          let remain = limit >= new Date() ? limit - new Date() : 0
          const remainYear = Math.floor(remain / (365 * 24 * 60 * 60 * 1000))
          const remainYearStr = remainYear !== 0 ? remainYear + '年' : ''
          remain -= remainYear * (365 * 24 * 60 * 60 * 1000)
          const remainMonth = Math.floor(remain / (31 * 24 * 60 * 60 * 1000))
          const remainMonthStr = remainMonth !== 0 ? remainMonth + 'か月' : ''
          remain -= remainMonth * (31 * 24 * 60 * 60 * 1000)
          const remainDate = Math.floor(remain / (24 * 60 * 60 * 1000))
          const remainDateStr = remainDate !== 0 ? remainDate + '日' : ''
          remain -= remainDate * (24 * 60 * 60 * 1000)
          const remainHour = Math.floor(remain / (60 * 60 * 1000))
          const remainHourStr = remainHour !== 0 ? remainHour + '時間' : ''
          remain -= remainHour * (60 * 60 * 1000)
          const remainMinute = Math.floor(remain / (60 * 1000))
          const remianMinuteStr = remainMinute !== 0 ? remainMinute + '分' : ''
          const remainDateTime =
            remain > 0
              ? '残り' +
                remainYearStr +
                remainMonthStr +
                remainDateStr +
                remainHourStr +
                remianMinuteStr
              : '期限切れ'
          return (
            <li key={key} className="task-item">
              <Link
                to={`/lists/${selectListId}/tasks/${task.id}`}
                className="task-item-link"
                tabIndex={-1}
                role="tabpanel"
              >
                {task.title}
                <br />
                {limitDateTime}
                まで
                <br />
                {remainDateTime}
                <br />
                {task.done ? '完了' : '未完了'}
              </Link>
            </li>
          )
        })}
    </ul>
  )
}
