import { Router } from 'express'
import { isAuthenticated, isCoordinator } from './middlewares/isAuthenticated'
import { CreateEventController } from './controllers/event/CreateEventController'
import { UpdateEventController } from './controllers/event/UpdateEventController'
import { GetEventDetailsController } from './controllers/event/GetEventDetailsController'
import { DeleteEventController } from './controllers/event/DeleteEventController'
import { ListEventsController } from './controllers/event/ListEventsController'
import { CheckUnavailableDatesController } from './controllers/event/CheckUnavailableDatesController'
import { CheckAvailableTimeSlotsController } from './controllers/event/CheckAvailableTimeSlotsController'

const router = Router()



router.post('/', isAuthenticated, isCoordinator, new CreateEventController().handle)
router.get('/', new ListEventsController().handle)
router.get('/details', new GetEventDetailsController().handle)
router.put('/', isAuthenticated, isCoordinator, new UpdateEventController().handle)
router.delete('/', isAuthenticated, isCoordinator, new DeleteEventController().handle)
router.get('/unavailable-dates', isAuthenticated, isCoordinator, new CheckUnavailableDatesController().handle)
router.get('/available-time-slots', isAuthenticated, isCoordinator, new CheckAvailableTimeSlotsController().handle)

export { router }
