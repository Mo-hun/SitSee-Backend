import Joi from 'joi';
import crypto from 'crypto';
import { user_info, email_confirm } from 'models';
import { generateToken } from 'lib/token.js';
import sendEmail from 'lib/mail.js';

import dotenv from 'dotenv';
import sendMail from '../../lib/mail';
dotenv.config();

export const SignIn = async (ctx) => {
    const LoginInput = Joi.object().keys({
        auth_id: Joi.string().email().required(),
        auth_pw: Joi.string().required()
    });

    const Result = Joi.validate(ctx.request.body, LoginInput);

    if (Result.error) {
        console.log(`SignIn - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "message": "Fail SignIn",
            "explain": "Joi Error"
        }
        return;
    }

    const founded = await user_info.findOne({
        where: {
            email: ctx.request.body.auth_id
        }
    });

    if (founded == null) {
        console.log(`SignIn - 존재하지 않는 계정입니다. / 입력된 이메일 : ${ctx.request.body.auth_id}`);
        ctx.status = 400;
        ctx.body = {
            "message": "Fail SignIn",
            "explain": "Incorrect"
        }
        return;
    }

    const input = crypto.createHmac('sha256', process.env.PASSWORD_KEY).update(ctx.request.body.auth_pw).digest('hex');

    if (founded.password != input) {
        console.log(`SignIn - 비밀번호를 틀렸습니다.`);
        ctx.status = 400;
        ctx.body = {
            "message": "Fail SignIn",
            "explain": "Incorrect"
        }
        return;
    }

    const payload = {
        email: founded.email
    };

    let token = null;
    token = await generateToken(payload);

    const is_admin = founded.grade <= 0 ? true : false

    console.log(token);
    ctx.status = 200;
    ctx.body = {
        "message" : "Success SignIn",
        token : token,
    };

    console.log(`로그인에 성공하였습니다.`);

}

export const SendCode = async (ctx) => {
    const EamilAddress = Joi.object().keys({
        email: Joi.string().email().required(),
    });
    console.log("SendEmail - "+EamilAddress);
    const result = Joi.validate(ctx.request.body, EamilAddress);

    if (result.error) {
        console.log("SendCode - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "message": "Fail SendCode",
            "explain": "Joi Error"
        }
        return;
    }
    if(ctx.request.body.email.indexOf("@gsm.hs.kr") == -1){
        console.log("SendCode - Email error --> "+ctx.request.body.email);
        ctx.status = 400;
        ctx.body = {
            "message": "Fail SendCode",
            "explain": "Not GSMmail"
        }
        return;
    }
    const existCode = await email_confirm.findOne({
        where: {
            email: ctx.request.body.email
        }
    });
    var newCode = Math.floor(Math.random() * 999999);
    console.log(existCode);
    if(existCode != null){
        await existCode.update({
            "code": newCode,
            updatedAt: "NOW()",
        });
        var sendResults = await sendMail(ctx.request.body.email, newCode);
        ctx.status = 200;
        ctx.body = {
            "message": "Success SendCode"
        };
    }else{
        await email_confirm.create({
            email: ctx.request.body.email,
            code: newCode,
            createdAt: "NOW()",
        });
        var sendResults = await sendMail(ctx.request.body.email, newCode);
        ctx.status = 200;
        ctx.body = {
            "message": "Success SendCode"
        };
    }
}

export const ConfirmCode = async (ctx) => {
    const EamilAddress = Joi.object().keys({
        email: Joi.string().email().required(),
        code: Joi.number().required()
    });
    console.log("ConfirmCode - "+EamilAddress);
    const result = Joi.validate(ctx.request.body, EamilAddress);

    if (result.error) {
        console.log("ConfirmCode - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "message": "Fail ConfirmCode",
            "explain": "Joi Error"
        }
        return;
    }
    if(ctx.request.body.email.indexOf("@gsm.hs.kr") == -1){
        console.log("ConfirmCode - Email error --> "+ctx.request.body.email);
        ctx.status = 400;
        ctx.body = {
            "message": "Fail ConfirmCode",
            "explain": "Not GSMmail"
        }
        return;
    }
    const existCode = await email_confirm.findOne({
        where: {
            email: ctx.request.body.email
        }
    });
    if(existCode != null){
        console.log(existCode.email_confirm);   
        if(existCode.code == ctx.request.body.code){
            ctx.status = 200;
            ctx.body = {
                "message": "Success ConfirmCode"
            };
        }else{
            ctx.status = 400;
            ctx.body = {
                "message": "Fail ConfirmCode",
                "explain": "Incorrect Code"
            };
        }
    }else{
        ctx.status = 400;
        ctx.body = {
            "message": "Fail ConfirmCode",
            "explain": "No Sent Email"
        };
    }
}

export const SignUp = async (ctx) => {
    const Registeration = Joi.object().keys({
        email: Joi.string().email().required(),
        pw: Joi.string().required(),
        pwc: Joi.string().required(),
        phone: Joi.string().required(),
        gender: Joi.number().required(),
        name: Joi.string().required(),
        code: Joi.number().required(),
    });
    const result = Joi.validate(ctx.request.body, Registeration)

    if (result.error) {
        console.log("SignUp - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "message": "fail Signup",
            "explain": "Joi error"
        }
        return;
    }

    if(ctx.request.body.email.indexOf("@gsm.hs.kr") == -1){
        console.log("ConfirmCode - Email error --> "+ctx.request.body.email);
        ctx.status = 400;
        ctx.body = {
            "message": "fail SignUp",
            "explain": "Not GSMmail"
        }
        return;
    }

    const existCode = await email_confirm.findOne({
        where: {
            email: ctx.request.body.email
        }
    });

    if(existCode != null){
        console.log(existCode.email_confirm);   
        if(existCode.code != ctx.request.body.code){
            ctx.status = 400;
            ctx.body = {
                "message": "fail SignUp",
                "explain": "Incorrect Code"
            };
            return;
        }
    }else{
        ctx.status = 400;
        ctx.body = {
            "message": "fail SignUp",
            "explain": "No Sent Code"
        };
        return;
    }
    const existId = await user_info.findOne({
        where: {
            email: ctx.request.body.email
        }
    });
    if (existId != null) {
        console.log(`SignUp - Email is define --> ${ctx.request.body.email}`);
        ctx.status = 400;
        ctx.body = {
            "message": "Fail SignUp",
            "explain": "Exist Email"
        }
        return;
    }
    if(ctx.request.body.pw != ctx.request.body.pwc){
        console.log(`SignUp - Not Password Check`);
        ctx.status = 400;
        ctx.body = {
            "message": "fail SignUp",
            "explain": "Password Check"
        }
        return;
    }
    console.log(process.env.PASSWORD_KEY);
    const password = crypto.createHmac('sha256', process.env.PASSWORD_KEY).update(ctx.request.body.pw).digest('hex');
    await user_info.create({
        "email": ctx.request.body.email,
        "password": password,
        "name": ctx.request.body.name,
        "phone": ctx.request.body.phone,
        "gender": ctx.request.body.gender
    })
    console.log(`SignUp - New User --> ${ctx.request.body.email}`);

    await email_confirm.destroy({where : {email : ctx.request.body.email}});

    ctx.status = 200;
    ctx.body = {
        "message" : "Success SignUp",
        "name": ctx.request.body.name
    }
}

export const TestCode = async (ctx) => {
    const EamilAddress = Joi.object().keys({
        email: Joi.string().email().required(),
    });
    console.log("SendEmail - "+EamilAddress);
    const result = Joi.validate(ctx.request.body, EamilAddress);

    if (result.error) {
        console.log("SendCode - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "message": "fail SendCode",
            "explain": "Joi Error"
        }
        return;
    }
    var newCode = Math.floor(Math.random() * 999999);
    var returnCode = await sendEmail(ctx.request.body.email, newCode);
    ctx.status = 200;
    ctx.body = {
        "code" : returnCode
    }
}