import { createApp } from './app.mjs'

import { EmailService } from './dev/services/verify-email.mjs'
import { UserModel } from './dev/models/user.mjs'
import { WorkerModel } from './dev/models/worker.mjs'
import { StailModel } from './dev/models/stail.mjs'
import { ClientModel } from './dev/models/clients.mjs'

createApp({
  emailService: EmailService,
  userModel: UserModel,
  workerModel: WorkerModel,
  stailModel: StailModel,
  clientModel: ClientModel
})
