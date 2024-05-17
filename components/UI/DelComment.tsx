'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DeleteIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Comments } from '@prisma/client';
import { UserPosts } from '../UserPosts';
import { MdDelete } from "react-icons/md";

export default function DelComment({ commentId, postId, setCommentsLengthState }: { commentId: string, postId: string, setCommentsLengthState: any }) {
  const [open, setOpen] = React.useState(false);

  const queryClient = useQueryClient();

  const [disabled, setDisabled] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function handleDeleteComment() {
   
    console.log("commentId", commentId, "postId", postId);


    // ` Run the mutateAsync funtion of useMutaion
    await mutateAsync(commentId)




    handleClose();
  }
  const { mutateAsync } = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await axios.post(`/api/delComment`, { commentId: commentId })
      

      if (res.data.error) {
        toast.error(res.data.error);

      }
      else {
        toast.success("Comment Deleted");
        setOpen(false);

      }

      
    },
    //`On clicking del we will update the ['comments',postId] such that the comments now will not contain the commentId
    onMutate: () => {

      setDisabled(true);
      //Updating comment section 

      queryClient.setQueryData(['comments', postId], (comments: any) => {
        //`Filter the comments
        const updatedComments = comments.filter((comment: any) => comment.id !== commentId)
        console.log(updatedComments, "Updated Comments");

        return updatedComments;
      })
      setCommentsLengthState((prev: any) => prev - 1);
      
      
      
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries(['comments', postId])
    // },
    onError: () => {
      toast.error("Error Deleting Comment - Mutate")
      queryClient.invalidateQueries(['comments', postId])
      setCommentsLengthState((prev: any) => prev + 1);
    },
    onSettled:()=>setDisabled(false)

  })
  return (
    <div>

      <MdDelete className={`${disabled ? "pointer-events-none opacity-40":"pointer-events-auto opacity-100"} cursor-pointer`} onClick={handleClickOpen} />

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Comment"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this comment
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={disabled} onClick={handleClose}>Cancel</Button>
          <Button disabled={disabled} onClick={handleDeleteComment} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}