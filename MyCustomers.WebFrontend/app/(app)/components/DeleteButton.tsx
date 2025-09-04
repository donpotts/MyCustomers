"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";

/**
 * Props for the DeleteButton component.
 */
export interface DeleteButtonProps {
  /** The action to perform when the delete button is clicked. */
  deleteAction: () => Promise<void>;
}

/**
 * DeleteButton component renders a button that triggers a delete action.
 */
export default function DeleteButton({ deleteAction }: DeleteButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => setDialogOpen(true)}
        aria-haspopup="dialog"
        aria-controls="delete-dialog"
      >
        Delete
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        id="delete-dialog"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteAction} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
