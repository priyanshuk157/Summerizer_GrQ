import nodemailer from "nodemailer"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { summary } = req.body

  try {
    let transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    })

    await transporter.sendMail({
      from: '"Meeting Bot" <bot@example.com>',
      to: "test@example.com",
      subject: "Your Meeting Summary",
      text: summary,
    })

    res.status(200).json({ message: "Email sent!" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}