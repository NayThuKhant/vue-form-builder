import { app } from './main-app'
import { abilitiesPlugin } from '@casl/vue'
import ability from '@/libs/casl/ability'

app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true
})
