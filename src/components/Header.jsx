import { useCookies } from 'react-cookie'
// import { useSelector, useDispatch } from "react-redux/es/exports";
import { useSelector, useDispatch } from 'react-redux'
// import { useHistory } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import { signOut } from '../authSlice'
import './header.scss'

export const Header = () => {
  const auth = useSelector((state) => state.auth.isSignIn)
  const dispatch = useDispatch()
  // const history = useHistory();
  const navigate = useNavigate()
  const [cookies, setCookie, removeCookie] = useCookies() // eslint-disable-line
  const handleSignOut = () => {
    dispatch(signOut())
    removeCookie('token')
    // history.push("/signin");
    navigate('/')
  }

  return (
    <header className="header">
      <h1>Todoアプリ</h1>
      {auth ? (
        <button onClick={handleSignOut} className="sign-out-button">
          サインアウト
        </button>
      ) : (
        <></>
      )}
    </header>
  )
}
