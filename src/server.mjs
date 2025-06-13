import { createApp } from './app.mjs'

import { EmailService } from './dev/services/verify-email.mjs'
import { UserModel } from './dev/models/user.mjs'
import { StallModel } from './dev/models/stall.mjs'
import { ClientModel } from './dev/models/clients.mjs'

createApp({
  emailService: EmailService,
  userModel: UserModel,
  stallModel: StallModel,
  clientModel: ClientModel
})
