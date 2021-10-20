import { Button, TextField, Typography, Box } from "@mui/material";
import { useRef, useState } from "react"
import { Link, useHistory, Redirect } from "react-router-dom"
import { useAuth } from '../context/authStudentContext';
import axios from 'axios'

export default function StudentSignup() {

    const fullNameRef = useRef()
    const rollRef = useRef()
    const departmentRef = useRef()
    const batchRef = useRef()
    const usernameRef = useRef()
    const passwordRef = useRef()
    const [loading, setLoading] = useState(false)
    const { currentUser } = useAuth()
    const history = useHistory()

    function handleSubmit(e) {
        e.preventDefault()

        setLoading(true)

        // register post request using axios
        axios.post(`${process.env.REACT_APP_API_URL}/student_register`, {
            full_name: fullNameRef.current.value,
            roll: rollRef.current.value,
            department: departmentRef.current.value,
            batch: batchRef.current.value,
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        }).then(
            res => {
                setLoading(false)
                history.push("/login/student")
            }
        ).catch(
            err => {
                setLoading(false)
            }
        )
    }

    return !currentUser ? (
        <Box>
            <form onSubmit={(e) => { handleSubmit(e) }} style={{ width: "18em", margin: "20px auto", display: "grid" }}>
                <Typography color="secondary" variant="h4" component="div" align="center"> Student </Typography>
                <TextField label="Full Name" inputRef={fullNameRef} variant="standard" />
                <TextField label="Roll" inputRef={rollRef} variant="standard" />
                <TextField label="Department" inputRef={departmentRef} variant="standard" />
                <TextField label="Batch" inputRef={batchRef} variant="standard" />
                <TextField label="Username" inputRef={usernameRef} variant="standard" />
                <TextField label="Password" type="password" inputRef={passwordRef} variant="standard" />
                <Button size="large" disabled={loading} type="submit" color="primary">Sign Up</Button>
                <Typography align="center">
                    Already have an account? <Link to="/login/student">Login</Link>
                </Typography>
            </form>
        </Box>
    ) : <Redirect to="/books/student" />
}