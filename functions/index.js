import { NhostClient } from "@nhost/nhost-js";

export default async (req, res) => {
  console.log("Pixel hit:", req.query);

  const imgText = req.query.img_text;
const userId = req.query.user;

  const nhost = new NhostClient({
    backendUrl: process.env.NHOST_BACKEND_URL,
  });

  nhost.graphql.setAccessToken(process.env.NHOST_ADMIN_SECRET);

  if (imgText && userId) {
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

    await nhost.graphql.request(UPDATE_EMAIL, {
      img_text: imgText,
      user: userId,
      date: new Date().toISOString(),
    });
  }

  // Always return GIF
  const gif = Buffer.from(
    "R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
    "base64"
  );

  res.setHeader("Content-Type", "image/gif");
  res.setHeader("Content-Length", gif.length);
  res.status(200).send(gif);
};
