import Router from 'koa-router';
import { SignIn, SignUp, TestCode, SendCode, ConfirmCode } from './auth.ctrl';

const auth = new Router();

auth.post('/signin', SignIn);
auth.post('/signup', SignUp);
auth.post('/SendCode', SendCode);
auth.post('/testCode', TestCode)
auth.post('/ConfirmCode', ConfirmCode);

export default auth;