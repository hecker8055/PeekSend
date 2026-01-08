import {
  TextField,
  Typography,
  IconButton,
  FormHelperText,
  FormControl,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import toast from "react-hot-toast";
import { useUserData } from "@nhost/react";

import styles from "../styles/components/Popup.module.css";
import { useState, useEffect, useRef } from "react";
import { gql, useMutation } from "@apollo/client";

const ADD_EMAIL = gql`
  mutation addEmail(
    $email: String
    $description: String
    $img_text: String
    $user: uuid
  ) {
    insert_emails(
      objects: {
        description: $description
        email: $email
        img_text: $img_text
        user: $user
        
      }
    ) {
      affected_rows
    }
  }
`;

const PopUp = ({ setPopUp }) => {
  const user = useUserData();
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState(user?.displayName || "");
  const [imgText, setImgText] = useState("");

  const [addEmail, { loading, error }] = useMutation(ADD_EMAIL);
  const ref = useRef();

  // Generate pixel URL
  useEffect(() => {
  if (!user?.id) return;

  const uniqueId = Date.now();

  setImgText(
    `https://mewefazwvknjenezsqmn.functions.eu-central-1.nhost.run/v1/index?img_text=${uniqueId}&user=${user.id}`
  );
}, [user]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // SAFELY extract email_id=XXXXX
    const match = imgText.match(/email_id=([^&]+)/);
    const emailId = match ? match[1] : null;

    if (!emailId) {
      toast.error("Failed to extract email tracking ID.");
      return;
    }

    try {
      await addEmail({
        variables: {
          email,
          description,
          img_text: emailId,
          user: user.id, 
          
          
        },
      });

      toast.success("Email added successfully!");
      setPopUp(false);
      window.location.reload();
    } catch (err) {
      toast.error("Unable to add email");
    }
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popUpDiv}>
        <div className={styles.header}>
          <Typography variant="h6">Enter new email details</Typography>
          <IconButton onClick={() => setPopUp(false)}>
            <HighlightOffIcon />
          </IconButton>
        </div>

        <form className={styles.groupForm} onSubmit={handleSubmit}>
          <FormControl sx={{ width: "100%" }} error={error}>
            <TextField
              className={styles.inputOutlinedTextField}
              fullWidth
              variant="outlined"
              type="email"
              label="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              className={styles.textAreaOutlinedTextField}
              variant="outlined"
              multiline
              label="Description"
              required
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextField
              variant="outlined"
              label="Your Name"
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* PIXEL PREVIEW */}
            <div className={styles.copyBox}>
              <div className={styles.imgDiv} ref={ref}>
                {name?.substring(0, 1)}
                <img src={imgText} className={styles.pixelImg} width={1} height={1} />
                {name?.substring(1)}
              </div>
              <span className={styles.imgHelperText}>
                Copy this text into your email.{" "}
                <strong>Do NOT delete the tiny pixel.</strong>
              </span>
            </div>

            {error && <FormHelperText>Error: {error.message}</FormHelperText>}

            <LoadingButton
              className={styles.buttonContainedText}
              variant="contained"
              color="primary"
              endIcon={<SaveIcon />}
              size="large"
              fullWidth
              type="submit"
              loading={loading}
            >
              Save
            </LoadingButton>
          </FormControl>
        </form>
      </div>
    </div>
  );
};

export default PopUp;
