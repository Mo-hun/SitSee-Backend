import nodemailer from 'nodemailer';
import path from 'path';

const config = require(path.join(__dirname, '..', 'config', 'mailconfig.json'))['SitSee'];

const sendMail = (Address, Code) => {
    var sendmailer = nodemailer.createTransport(config);
    var mailOptions = {
        from: config.auth.user,
        to: Address,
        subject: "[SitSee]이메일 주소 확인",
        html: `<div style="font-family: 'Apple SD Gothic Neo', 'sans-serif' !important; width: 540px; height: 600px; border-top: 4px solid #5C6BC0; margin: 100px auto; padding: 30px 0; box-sizing: border-box; color: black !important;">
        <h1 style="margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400;">
            <span style="font-size: 15px; margin: 0 0 10px 3px;">SitSee - 기숙사, 이제 앉아서 보자.</span><br />
            <span style="color: #5C6BC0;">메일인증</span> 안내입니다.
        </h1>
        <p style="font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px;">
            안녕하세요.<br />
            SitSee에 가입을 시도해 주셔서 감사합니다.<br />
            <b style="color: #5C6BC0;">${Code}</b>를 입력하여 회원가입을 완료해 주세요.<br />
            감사합니다.
        </p>
    
        <p style="font-size: 13px; line-height: 21px; color: #555;">
            해당 인증 번호를 절대 타인에게 공유하지 마세요.
        </p>
    </div>`};
    sendmailer.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            return info.response;
        }
    });
}

export default sendMail;