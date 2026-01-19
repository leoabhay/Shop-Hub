// const nodemailer = require('nodemailer');

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: options.email,
//     subject: options.subject,
//     html: options.message
//   };

//   await transporter.sendMail(mailOptions);
// };

// const getVerificationEmailTemplate = (name, verificationUrl) => {
//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//         .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
//         .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
//         .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>Welcome to Shop Hub!</h1>
//         </div>
//         <div class="content">
//           <h2>Hello ${name},</h2>
//           <p>Thank you for registering with Shop Hub. Please verify your email address to activate your account.</p>
//           <p>Click the button below to verify your email:</p>
//           <a href="${verificationUrl}" class="button">Verify Email</a>
//           <p>Or copy and paste this link in your browser:</p>
//           <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
//           <p>This link will expire in 24 hours.</p>
//           <p>If you didn't create an account, please ignore this email.</p>
//         </div>
//         <div class="footer">
//           <p>&copy; ${new Date().getFullYear()} Shop Hub. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;
// };

// const getOrderConfirmationTemplate = (order) => {
//   const itemsList = order.orderItems.map(item => `
//     <tr>
//       <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
//       <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
//       <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${item.price.toFixed(2)}</td>
//     </tr>
//   `).join('');

//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <style>
//         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//         .content { background: #f9f9f9; padding: 30px; }
//         table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//         .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>Order Confirmation</h1>
//         </div>
//         <div class="content">
//           <h2>Order #${order._id}</h2>
//           <p>Thank you for your order! We've received your order and will process it soon.</p>
//           <h3>Order Details:</h3>
//           <table>
//             <thead>
//               <tr style="background: #667eea; color: white;">
//                 <th style="padding: 10px; text-align: left;">Product</th>
//                 <th style="padding: 10px; text-align: center;">Quantity</th>
//                 <th style="padding: 10px; text-align: right;">Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${itemsList}
//             </tbody>
//           </table>
//           <div class="total">
//             <p>Subtotal: Rs. ${order.itemsPrice.toFixed(2)}</p>
//             <p>Shipping: Rs. ${order.shippingPrice.toFixed(2)}</p>
//             <p>Tax: Rs. ${order.taxPrice.toFixed(2)}</p>
//             <p style="color: #667eea;">Total: Rs. ${order.totalPrice.toFixed(2)}</p>
//           </div>
//           <h3>Shipping Address:</h3>
//           <p>
//             ${order.shippingAddress.street}<br>
//             ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
//             ${order.shippingAddress.country}<br>
//             Phone: ${order.shippingAddress.phone}
//           </p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;
// };

// module.exports = { sendEmail, getVerificationEmailTemplate, getOrderConfirmationTemplate };