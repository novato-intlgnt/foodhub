import { createApp } from './app.mjs'

import { UserModel } from './dev/models/user.mjs'
import { EmailService } from './dev/services/verify-email.mjs'

createApp({
  userModel: UserModel,
  emailService: EmailService,
})
