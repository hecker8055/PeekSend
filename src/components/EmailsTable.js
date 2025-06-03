import { Delete } from "@mui/icons-material";
import { IconButton, CircularProgress } from "@mui/material";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useUserData } from "@nhost/react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

// Queries
const GET_EMAILS = gql`
  query getEmails($user: uuid!) {
    emails(order_by: { created_at: desc }, where: { user_id: { _eq: $user } }) {
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

// Delete mutation
const DELETE_EMAIL = gql`
  mutation deleteEmail($id: uuid!) {
    delete_emails(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

// Mark as seen mutation
const MARK_AS_SEEN = gql`
  mutation markEmailAsSeen($id: uuid!, $seenAt: timestamptz!) {
    update_emails(
      where: { id: { _eq: $id } }
      _set: { seen: true, seen_at: $seenAt }
    ) {
      affected_rows
    }
  }
`;

const EmailsTable = ({ styles }) => {
  const user = useUserData();
  const [emails, setEmails] = useState([]);

  const { loading, error, data } = useQuery(GET_EMAILS, {
    variables: { user: user?.id || "" },
    skip: !user?.id,
    fetchPolicy: "network-only",
  });

  const [deleteEmailMutation, { loading: deleting }] = useMutation(DELETE_EMAIL);
  const [markAsSeen] = useMutation(MARK_AS_SEEN);

  useEffect(() => {
    if (data && data.emails) {
      setEmails(data.emails);
    }
  }, [data]);

  const deleteEmail = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this?");
    if (!confirmation) return;

    try {
      await deleteEmailMutation({ variables: { id } });
      toast.success("Email deleted successfully");
      setEmails((prev) => prev.filter((email) => email.id !== id));
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
      setEmails((prev) =>
        prev.map((e) =>
          e.id === email.id ? { ...e, seen: true, seen_at: now } : e
        )
      );
    } catch (err) {
      toast.error("Failed to mark email as seen");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    console.error(error);
    return <div className={styles.loader}>Error loading emails: {error.message}</div>;
  }

  if (emails.length === 0) {
    return <div className={styles.loader}>No emails found</div>;
  }

  return (
    <div className={styles.contentDiv1}>
      <div className={styles.columnDiv}>
        <div className={styles.tableHeaderCell}>
          <div className={styles.tableHeaderDiv}>
            <div className={styles.textDiv1}>Email</div>
          </div>
        </div>
        {emails.map((email) => (
          <div
            className={styles.tableCellDiv}
            key={email.id}
            onClick={() => handleEmailClick(email)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.supportingTextDiv1}>{email.email}</div>
          </div>
        ))}
      </div>

      <div className={styles.columnDiv1}>
        <div className={styles.tableHeaderCell1}>
          <div className={styles.tableHeaderDiv1}>
            <div className={styles.textDiv1}>Status</div>
          </div>
        </div>
        {emails.map(({ seen, id }) => (
          <div className={styles.tableCellDiv} key={id}>
            <div className={styles.badgeDiv}>
              <div className={styles.badgeBaseDiv}>
                <div className={seen ? styles.textDiv : styles.textDiv1}>
                  {seen ? "Seen" : "Unseen"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.columnDiv2}>
        <div className={styles.tableHeaderCell}>
          <div className={styles.tableHeaderDiv1}>
            <div className={styles.textDiv1}>Description</div>
          </div>
        </div>
        {emails.map(({ description, id }) => (
          <div className={styles.tableCellDiv} key={id}>
            <div className={styles.supportingTextDiv1}>{description}</div>
          </div>
        ))}
      </div>

      <div className={styles.columnDiv3}>
        <div className={styles.tableHeaderCell}>
          <div className={styles.tableHeaderDiv1}>
            <div className={styles.textDiv1}>Date sent</div>
          </div>
        </div>
        {emails.map(({ created_at, id }) => (
          <div className={styles.tableCellDiv} key={id}>
            <div className={styles.dateDiv}>
              {new Date(created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.columnDiv3}>
        <div className={styles.tableHeaderCell}>
          <div className={styles.tableHeaderDiv1}>
            <div className={styles.textDiv1}>Date seen</div>
          </div>
        </div>
        {emails.map(({ seen_at, id, seen }) => (
          <div className={styles.tableCellDiv} key={id}>
            <div className={styles.dateDiv}>
              {seen ? new Date(seen_at).toLocaleString() : "Not seen"}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dropdownDiv}>
        <div className={styles.tableHeaderCell8} />
        {emails.map(({ id }) => (
          <div className={styles.tableCellButton} key={id}>
            <IconButton
              onClick={() => deleteEmail(id)}
              disabled={deleting}
              aria-label="delete email"
            >
              <Delete />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailsTable;
