import { Button, TextField, Typography, Box } from "@mui/material";
import { useRef, useState } from "react"
import { Link, useHistory, Redirect } from "react-router-dom"
import { useAuth } from '../context/authContext';
import axios from 'axios'


export default function LibrarianLogin() {
    const usernameRef = useRef()
    const passwordRef = useRef()
    const [loading, setLoading] = useState(false)
    const {currentUser, setDidLogin} = useAuth() 
    const history = useHistory()


    const handleSubmit = (e) => {
        e.preventDefault()

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
        axios.post(`${process.env.REACT_APP_API_URL}/librarian_login`, formBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }).then(
            res => {
                if (res.data.disabled !== true) {
                    localStorage.setItem("token", res.data.access_token)
                    setDidLogin(true)
                    setLoading(false)
                    history.push("/")
                } else {
                    setLoading(false)
                }
            }
        ).catch(
            err => {
                setLoading(false)
            }
        )
    }


    return !currentUser ? (
            <Box>
                <form onSubmit={handleSubmit} style={{ width: "18em", margin: "20px auto", display: "grid" }}>
                <Typography color="secondary" variant="h4" component="div" align="center"> Librarian </Typography>
                    <TextField label="Username" inputRef={usernameRef} sx={{mb: "4px"}} />
                    <TextField label="Password" type="password" inputRef={passwordRef} />
                    <Button size="large" disabled={loading} type="submit" color="primary">Log In</Button>
                    <Typography align="center">
                        Need an account? <Link to="/signup/librarian">Sign Up</Link>
                    </Typography>
                </form>
            </Box>
        ) : <Redirect to="/" />
}