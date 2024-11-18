import { defineAuth } from '@aws-amplify/backend';

/**定义了预配置的身份验证后端。已将其配置为支持电子邮件和密码登录 */
/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,// 支持通过电子邮件登录
  },
});
