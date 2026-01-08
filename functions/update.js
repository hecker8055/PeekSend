import { NhostClient } from "@nhost/nhost-js";

const nhost = new NhostClient({
  backendUrl: process.env.NHOST_BACKEND_URL,
});

nhost.graphql.setAccessToken(process.env.NHOST_ADMIN_SECRET);

export default async (req, res) => {
  const img_text = req.query.img_text;
  const user = req.query.user;

  console.log("Pixel hit:", { img_text, user });

  if (img_text && user) {
    const UPDATE_EMAIL = `
      mutation UpdateEmail($img_text: String!, $user: uuid!, $date: timestamptz!) {
        update_emails(
          where: {
            img_text: { _eq: $img_text },
            user: { _eq: $user }
          },
          _set: { seen: true, seen_at: $date }
        ) {
          affected_rows
        }
      }
    `;

    try {
      const result = await nhost.graphql.request(UPDATE_EMAIL, {
        img_text,
        user,
        date: new Date().toISOString(),
      });

      console.log("Update Result:", result);
    } catch (error) {
      console.error("GraphQL Error:", error);
    }
  } else {
    console.log("Missing parameters:", req.query);
  }

  // return transparent pixel
  const gif = Buffer.from(
    "R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
    "base64"
  );

  res.setHeader("Content-Type", "image/gif");
  res.setHeader("Content-Length", gif.length);

  return res.status(200).send(gif);
};
