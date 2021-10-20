import { Button, Dialog, DialogActions, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import { useState, useRef } from "react";
import axios from 'axios'
import moment from 'moment'


export default function Student({ studentInfo: data, setDidUpdate }) {

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const fineRef = useRef()

  const handleDialog = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClearRecord = async (e) => {

    setLoading(true)

    axios.put(`${process.env.REACT_APP_API_URL}/clear_book_request_${data._id}_${data.book_info.book_id}`, {
      student_id: data._id,
      book_id: data.book_info.book_id,
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }).then(
      res => {
        setLoading(false)
        setDidUpdate(true)
        setOpen(false)
      }
    ).catch(
      err => {
        setLoading(false)
      }
    )
  }

  const handleUpdateFine = () => {

    setLoading(true)

    axios.put(`${process.env.REACT_APP_API_URL}/update_student_fine/${data._id}?fine=${fineRef.current.value}`, {
      id: data._id,
      fine: parseFloat(fineRef.current.value),
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }).then(
      res => {
        setLoading(false)
        setDidUpdate(true)
        setOpen(false)
      }
    ).catch(
      err => {
        setLoading(false)
      }
    )

  }


  return (
    <>
      <Button onClick={handleDialog} variant="contained">{data.roll}</Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: "green" }} id="alert-dialog-title">
          "Student profile"
        </DialogTitle>
        <DialogContentText style={{ padding: "10px"}}>
          <Typography>
            Id: {data._id}
          </Typography>
          <Typography>
            Full Name: {data.full_name}
          </Typography>
          <Typography>
            Username: {data.username}
          </Typography>
          <Typography>
            Roll: {data.roll}
          </Typography>
          <Typography>
            Department: {data.department}
          </Typography>
          <Typography>
            Batch: {data.batch}
          </Typography>
          <Typography>
            Current fine: {data.fine}
          </Typography>
          <Typography>
            Book borrwed info: {data.book_info ? <div style={{ margin: "5px 5px 10px 20px", padding: "5px", border: "1px solid grey"}} >
              <Typography>Book id: {data.book_info.book_id}</Typography>
              <Typography>Issue date: {moment(data.book_info.issue_date).format('MMM DD YYYY')}</Typography>
              <Typography>Return date: {moment(data.book_info.return_date).format('MMM DD YYYY')}</Typography>
            </div> : "None"}
          </Typography>
          <Typography>
            Requested book id: {data.book_req ? data.book_req : "None"}
          </Typography>
        </DialogContentText>
        <DialogActions>
          <TextField 
            label="Fine" 
            inputRef={fineRef}
            style={{ 
              width: "80px", 
              border: "1px solid #E5E8EC", 
              borderRadius: "10px",
              lineHeight: "1.4375em",
              fontSize: "1rem",
           }}
          />
          <Button disabled={loading} onClick={handleUpdateFine}>Update Fine</Button>
          <Button 
            variant="outlined" 
            disabled={(data.book_info && typeof data.book_info === 'object' && data.book_info.constructor === Object) ? false : true} 
            color="secondary" 
            onClick={handleClearRecord}
          >
            Clear Borrowed Book Record
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}