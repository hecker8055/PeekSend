import { Delete } from "@mui/icons-material";
import { IconButton, CircularProgress, Button } from "@mui/material";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useUserData } from "@nhost/react";
import toast from "react-hot-toast";
import "../styles/EmailsTable.css";

// QUERIES AND MUTATIONS
const GET_EMAILS = gql`
  query getEmails($user: uuid!) {
    emails(order_by: { created_at: desc }, where: { user: { _eq: $user } }) {
      created_at
      description
      email
      id
      img_text
      seen
      seen_at
    }
  }
`;

const DELETE_EMAIL = gql`
  mutation deleteEmail($id: uuid!) {
    delete_emails(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

const MARK_AS_SEEN = gql`
  mutation markEmailAsSeen($id: uuid!, $seenAt: timestamptz!) {
    update_emails(
      where: { id: { _eq: $id }, seen: { _eq: false } }
      _set: { seen: true, seen_at: $seenAt }
    ) {
      affected_rows
    }
  }
`;

const EmailsTable = () => {
  const user = useUserData();

  const { loading, error, data } = useQuery(GET_EMAILS, {
    variables: { user: user?.id },
    skip: !user?.id,
  });

  const [deleteEmailMutation, { loading: deleting }] = useMutation(DELETE_EMAIL, {
    refetchQueries: [{ query: GET_EMAILS, variables: { user: user?.id } }],
  });

  const [markAsSeenMutation] = useMutation(MARK_AS_SEEN, {
  refetchQueries: [{ query: GET_EMAILS, variables: { user: user?.id } }],
  awaitRefetchQueries: true,
});


  // Delete Email Function
  const deleteEmail = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await deleteEmailMutation({ variables: { id } });
      toast.success("Email deleted successfully");
    } catch (err) {
      toast.error("Unable to delete email");
      console.error(err);
    }
  };

  // Mark Email as Seen Function
  const markAsSeen = async (id) => {
    const now = new Date().toISOString();
    try {
      const { data } = await markAsSeenMutation({ variables: { id, seenAt: now } });

      if (data.update_emails.affected_rows === 0) {
        toast.error("Email is already marked as seen or does not exist.");
      } else {
        toast.success("Email successfully marked as seen!");
      }
    } catch (err) {
      toast.error("Failed to mark email as seen");
      console.error(err);
    }
  };

  const emails = data?.emails || [];

  // Handle Loading State
  if (loading) {
    return (
      <div className="loader">
        <CircularProgress />
      </div>
    );
  }

  // Handle Error State
  if (error) {
    console.error(error);
    return <div className="loader">Error loading emails: {error.message}</div>;
  }

  // Handle Empty State
  if (emails.length === 0) {
    return <div className="loader">No emails found</div>;
  }

  return (
    <div className="tableContainer">
      {/* Table Headers */}
      <div className="tableHeaderRow">
        <div className="tableHeaderCell">Email</div>
        <div className="tableHeaderCell">Status</div>
        <div className="tableHeaderCell">Description</div>
        <div className="tableHeaderCell">Date sent</div>
        <div className="tableHeaderCell">Date seen</div>
        <div className="tableHeaderCell">Actions</div>
      </div>

      {/* Table Rows */}
      {emails.map((email) => (
        <div className="tableRow" key={email.id}>
          <div className="tableCell">{email.email}</div>

          <div className="tableCell">
            <span className={email.seen ? "seenBadge" : "unseenBadge"}>
              {email.seen ? "Seen" : "Unseen"}
            </span>
            {!email.seen && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => markAsSeen(email.id)}
                style={{ marginLeft: "10px" }}
              >
                Mark as Seen
              </Button>
            )}
          </div>

          <div className="tableCell">{email.description}</div>

          <div className="tableCell">
            {new Date(email.created_at).toLocaleString()}
          </div>

          <div className="tableCell">
            {email.seen ? new Date(email.seen_at).toLocaleString() : "Not seen"}
          </div>

          <div className="tableCell">
            <IconButton
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click logic
                deleteEmail(email.id);
              }}
              disabled={deleting}
              aria-label="delete email"
            >
              <Delete />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export {
  GET_EMAILS,
  DELETE_EMAIL,
  MARK_AS_SEEN,
};

export default EmailsTable;
