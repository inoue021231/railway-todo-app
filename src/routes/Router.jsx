import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Home } from '../pages/Home'
import { NotFound } from '../pages/NotFound'
import { SignIn } from '../pages/SignIn'
import { NewTask } from '../pages/NewTask'
import { NewList } from '../pages/NewList'
import { EditTask } from '../pages/EditTask'
import { SignUp } from '../pages/SignUp'
import { EditList } from '../pages/EditList'

export const Router = () => {
  const auth = useSelector((state) => state.auth.isSignIn)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/"
          element={auth ? <Home /> : <Navigate replace to="/signin" />}
        />
        <Route
          path="/task/new"
          element={auth ? <NewTask /> : <Navigate replace to="/signin" />}
        />
        <Route
          path="/list/new"
          element={auth ? <NewList /> : <Navigate replace to="/signin" />}
        />
        <Route
          path="/lists/:listId/tasks/:taskId"
          element={auth ? <EditTask /> : <Navigate replace to="/signin" />}
        />
        <Route
          path="/lists/:listId/edit"
          element={auth ? <EditList /> : <Navigate replace to="/signin" />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
