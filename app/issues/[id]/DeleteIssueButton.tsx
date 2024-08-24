'use client'; // Indicates that this is a client-side component in Next.js

// Importing necessary components and libraries
import { Spinner } from '@/app/components';
import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Defining the DeleteIssueButton component
// It takes an issueId as a prop
const DeleteIssueButton = ({ issueId }: { issueId: number }) => {
  // Using the useRouter hook for navigation
  const router = useRouter();
  
  // State variables to manage error and deletion status
  const [error, setError] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  // Function to handle the issue deletion
  const deleteIssue = async () => {
    try {
      setDeleting(true); // Set deleting status to true
      await axios.delete('/api/issues/' + issueId); // Send DELETE request to API
      router.push('/issues/list'); // Navigate to issues list
      router.refresh(); // Refresh the current route
    } catch (error) {
      setDeleting(false); // Reset deleting status if error occurs
      setError(true); // Set error state to true
    }
  };

  return (
    <>
      {/* AlertDialog for delete confirmation */}
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red" disabled={isDeleting}>
            Delete Issue
            {isDeleting && <Spinner />} {/* Show spinner when deleting */}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this issue? This action cannot be
            undone.
          </AlertDialog.Description>
          <Flex mt="4" gap="3" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={deleteIssue}>
                Delete Issue
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* AlertDialog for error message */}
      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Error</AlertDialog.Title>
          <AlertDialog.Description>
            This issue could not be deleted.
          </AlertDialog.Description>
          <Button
            color="gray"
            variant="soft"
            mt="2"
            onClick={() => setError(false)} // Close error dialog
          >
            OK
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default DeleteIssueButton;