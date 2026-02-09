export const sendEmailHtml = (verificationUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">

        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="padding:30px; text-align:center; background:#0d6efd; border-radius:8px 8px 0 0;">
              <h1 style="color:#ffffff; margin:0;">Mini E-Commerce</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;">
              <h2 style="color:#333;">Verify your email address</h2>

              <p style="color:#555; font-size:16px; line-height:1.6;">
                Thanks for signing up! Please confirm your email address by clicking the button below.
              </p>

              <!-- Button (email-safe) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}"
                      style="
                        background:#0d6efd;
                        color:#ffffff;
                        text-decoration:none;
                        padding:14px 28px;
                        border-radius:6px;
                        font-size:16px;
                        display:inline-block;
                      "
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#555; font-size:14px;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all; color:#0d6efd; font-size:14px;">
                ${verificationUrl}
              </p>

              <p style="color:#999; font-size:14px; margin-top:30px;">
                If you did not create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px; text-align:center; background:#f4f6f8; border-radius:0 0 8px 8px;">
              <p style="margin:0; color:#999; font-size:12px;">
                © 2025 Mini E-Commerce. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
