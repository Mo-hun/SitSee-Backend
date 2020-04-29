import Sequelize from 'sequelize';
import path from 'path';

import { CourseApply } from './CourseApply';
import { CourseInfo } from './CourseInfo';
import { UserInfo } from './UserInfo';
import { SiteComplain } from './SiteComplain';
import { EmailConfirm } from './EmailConfirm';

const config = require(path.join(__dirname, '..', 'config', 'dbconfig.json'))['SitSee'];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
)

const user_info = UserInfo(sequelize, Sequelize);
const course_info = CourseInfo(sequelize, Sequelize);
const course_apply = CourseApply(sequelize, Sequelize);
const site_complain = SiteComplain(sequelize, Sequelize);
const email_confirm = EmailConfirm(sequelize, Sequelize);

export { sequelize, Sequelize, user_info, course_info, course_apply, site_complain, email_confirm };
