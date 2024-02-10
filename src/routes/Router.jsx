import { useSelector } from 'react-redux'
// import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
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
      {/* <Routes>
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        {auth ? (
          <>
            <Route exact path="/" component={Home} />
            <Route exact path="/task/new" component={NewTask} />
            <Route exact path="/list/new" component={NewList} />
            <Route exact path="/lists/:listId/tasks/:taskId" component={EditTask} />
            <Route exact path="/lists/:listId/edit" component={EditList} />
          </>
        ) : (
          <Redirect to="/signin" />
        )}
        <Route component={NotFound} />
      </Routes> */}
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
