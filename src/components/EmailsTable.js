import { Delete } from "@mui/icons-material";
import { IconButton, CircularProgress } from "@mui/material";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useUserData } from "@nhost/react";
import toast from "react-hot-toast";
import "../styles/EmailsTable.css";

// QUERIES AND MUTATIONS
const GET_EMAILS = gql`
  query getEmails($user: uuid!) {
    emails(where: { user: { _eq: $user } }) {
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
      where: { id: { _eq: $id } }
      _set: { seen: true, seen_at: $seenAt }
    ) {
      returning {
        id
        seen
        seen_at
      }
    }
  }
`;

const EmailsTable = () => { // No longer needs the {styles} prop
  const user = useUserData();

  const { loading, error, data } = useQuery(GET_EMAILS, {
    variables: { user: user?.id },
    skip: !user?.id,
  });

  const [deleteEmailMutation, { loading: deleting }] = useMutation(DELETE_EMAIL, {
      refetchQueries: [{ query: GET_EMAILS, variables: { user: user?.id } }],
  });
  
  const [markAsSeen] = useMutation(MARK_AS_SEEN);

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

  const handleEmailClick = async (email) => {
    if (email.seen) return;
    const now = new Date().toISOString();
    try {
      await markAsSeen({ variables: { id: email.id, seenAt: now } });
    } catch (err) {
      toast.error("Failed to mark email as seen");
      console.error(err);
    }
  };
  
  const emails = data?.emails || [];

  if (loading) {
    return (
      <div className="loader">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    console.error(error);
    return <div className="loader">Error loading emails: {error.message}</div>;
  }

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

      {/* Table Body */}
      {emails.map((email) => (
        <div
          className="tableRow"
          key={email.id}
          onClick={() => handleEmailClick(email)}
          style={{ cursor: email.seen ? 'default' : 'pointer' }}
        >
          <div className="tableCell">{email.email}</div>
          
          <div className="tableCell">
            <span className={email.seen ? "seenBadge" : "unseenBadge"}>
              {email.seen ? "Seen" : "Unseen"}
            </span>
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
                e.stopPropagation();
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

export default EmailsTable;