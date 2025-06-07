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

router.post('/events', isAuthenticated, isCoordinator, new CreateEventController().handle)
router.get('/events', new ListEventsController().handle)
router.get('/events/details', new GetEventDetailsController().handle)
router.put('/events', isAuthenticated, isCoordinator, new UpdateEventController().handle)
router.delete('/events', isAuthenticated, isCoordinator, new DeleteEventController().handle)
router.get('/events/unavailable-dates', isAuthenticated, isCoordinator, new CheckUnavailableDatesController().handle)
router.get('/events/available-time-slots', isAuthenticated, isCoordinator, new CheckAvailableTimeSlotsController().handle)

export { router }
