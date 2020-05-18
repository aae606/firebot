const functions = require("firebase-functions");
const request = require("request-promise");
const config = require("./config.json");

//ตั้งค่า region และปรับ timeout และเพิ่ม memory
const region = "asia-east2";
const runtimeOptions = {
  timeoutSeconds: 4,
  memory: "2GB"
};

//ทำ webhook request url
exports.webhook = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    console.log("LINE REQUEST BODY", JSON.stringify(req.body));

    //[0] ดึงข้อมูลจาก request message ที่มาจาก LINE
    const replyToken = req.body.events[0].replyToken;
    const messages = [
      {
        type: "text",
        text: req.body.events[0].message.text //ดึง message ที่ส่งเข้ามา
      },
      {
        type: "text",
        text: JSON.stringify(req.body) //ลองให้พ่น สิ่งที่่ LINE ส่งมาให้ทั้งหมดออกมาดู
      }
    ];

    //ยิงข้อความกลับไปหา LINE (ส่ง response กลับไปหา LINE)
    return lineReply(replyToken, messages);
  });

//function สำหรับ reply กลับไปหา LINE โดยต้องการ reply token และ messages (array)
const lineReply = (replyToken, messages) => {
  const body = {
    replyToken: replyToken,
    messages: messages
  };
  return request({
    method: "POST",
    uri: `${config.lineMessagingApi}/reply`,
    headers: config.lineHeaders,
    body: JSON.stringify(body)
  });
};