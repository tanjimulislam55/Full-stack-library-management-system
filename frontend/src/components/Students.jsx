import { Backdrop, CircularProgress, Container } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Student from './Student'
import Masonry from 'react-masonry-css'

export default function Students() {

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const componentRef = useRef()
  const [didUpdate, setDidUpdate] = useState(false)

  useEffect(() => {
    setLoading(true)
    const unsubscribe = axios.get(`${process.env.REACT_APP_API_URL}/students`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }).then(
      res => {
        setStudents(res.data)
        setLoading(false)
        setDidUpdate(false)
      }
    ).catch(
      err => {
        setStudents(null)
        setLoading(false)
      }
    )
    return () => unsubscribe
  }, [didUpdate])

  const breakpoints = {
    default: 12,
    1100: 8,
    700: 6,
  }

  return (
    <>
      <Container style={{ backgroundColor: "#d9eeff8a" }} ref={componentRef}>
        <div style={{ margin: "40px 0 40px 0", fontWeight: 800, fontSize: "2.5rem" }}>
          All the stduents by their roll.
        </div>
        <Masonry
          breakpointCols={breakpoints}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {students && students.map(student => (
            <div key={student._id}>
              <Student studentInfo={student} setDidUpdate={setDidUpdate} />
            </div>
          ))}
        </Masonry>
      </Container>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}