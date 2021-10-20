import { Button, TextField, Typography, Alert, Snackbar, Box } from "@mui/material";
import { useRef, useState } from "react"
import { Link, useHistory, Redirect } from "react-router-dom"
import { useAuth } from '../context/authStudentContext';
import axios from 'axios'


export default function StudentLogin() {
    const usernameRef = useRef()
    const passwordRef = useRef()
    const [loading, setLoading] = useState(false)
    const {currentUser, setDidLogin} = useAuth()
    const history = useHistory()
    const [error, setError] = useState('')
    const [open, setOpen] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (usernameRef.current.value === "" || passwordRef.current.value === "") {
            console.log('username or password field should not be empty')
            return setError('username or password field should not be empty')
        }
        setError('')
        setLoading(true)

        // encoding form values before post request
        const details = {
            "username": usernameRef.current.value,
            "password": passwordRef.current.value,
        }
        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        // login post request using axios
        axios.post(`${process.env.REACT_APP_API_URL}/student_login`, formBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }).then(
            res => {
                if (res.data.disabled !== true) {
                    localStorage.setItem("token", res.data.access_token)
                    setDidLogin(true)
                    setLoading(false)
                    history.push("/books/student")
                } else {
                    setError("Inactive user")
                    console.log("Inactive user")
                    setLoading(false)
                }
            }
        ).catch(
            err => {
                console.log(err.response.data.detail)
                setError(err.response.data.detail)
                setLoading(false)
            }
        )
    }

    const handleClose = (e, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    }


    return !currentUser ? (
            <Box>
                <form onSubmit={(e) => { handleSubmit(e) }} style={{ width: "18em", margin: "20px auto", display: "grid"}}>
                    <Typography color="secondary" variant="h4" component="div" align="center"> Student </Typography>
                    <TextField label="Username" inputRef={usernameRef} sx={{ mb: "4px" }}/>
                    <TextField label="Password" type="password" inputRef={passwordRef} />
                    <Button size="large" disabled={loading} type="submit" color="primary">Log In</Button>
                    <Typography align="center">
                        Need an account? <Link to="/signup/student">Sign Up</Link>
                    </Typography>
                </form>
                {error && 
                    <Snackbar open={open} autoHideDuration={4000} onClose={(e, reason) => handleClose(e, reason)}>
                        <Alert onClose={(e, reason) => handleClose(e, reason)} severity="error" color="info">{error}</Alert>
                    </Snackbar>
                }
            </Box>
        ) : <Redirect to="/" />
}