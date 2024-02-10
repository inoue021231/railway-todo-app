import axios from 'axios'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

// import { useHistory, useParams } from "react-router-dom";
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { url } from '../const'
import './editList.scss'

export const EditList = () => {
  // const history = useHistory();
  const navigate = useNavigate()
  const { listId } = useParams()
  const [title, setTitle] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [cookies] = useCookies()
  const handleTitleChange = (e) => setTitle(e.target.value)
  const onUpdateList = () => {
    const data = {
      title: title,
    }

    axios
      .put(`${url}/lists/${listId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        // history.push("/");
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。 ${err}`)
      })
  }

  const onDeleteList = () => {
    axios
      .delete(`${url}/lists/${listId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        // history.push("/");
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`)
      })
  }

  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const list = res.data
        setTitle(list.title)
      })
      .catch((err) => {
        setErrorMessage(`リスト情報の取得に失敗しました。${err}`)
      })
  }, [])

  return (
    <div>
      <Header />
      <main className="edit-list">
        <h2>リスト編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-list-form">
          <label>タイトル</label>
          <br />
          <input
            type="text"
            className="edit-list-title"
            value={title}
            onChange={handleTitleChange}
          />
          <br />
          <button
            type="button"
            className="delete-list-button"
            onClick={onDeleteList}
          >
            削除
          </button>
          <button
            type="button"
            className="edit-list-button"
            onClick={onUpdateList}
          >
            更新
          </button>
        </form>
      </main>
    </div>
  )
}
