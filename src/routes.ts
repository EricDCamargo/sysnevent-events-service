import { Router } from 'express'
import { isAuthenticated } from './middlewares/isAuthenticated'
import { CreateEventController } from './controllers/event/CreateEventController'
import { UpdateEventController } from './controllers/event/UpdateEventController'
import { ListActiveEventsController } from './controllers/event/ListActiveEventsController'
import { ListMyEventsController } from './controllers/event/ListMyEventsController'
import { GetEventDetailsController } from './controllers/event/GetEventDetailsController'
import { DeleteEventController } from './controllers/event/DeleteEventController'

const router = Router()

router.post('/events', isAuthenticated, new CreateEventController().handle)
router.put('/events', isAuthenticated, new UpdateEventController().handle)
router.get('/events', new ListActiveEventsController().handle)
router.get('events/mine', isAuthenticated, new ListMyEventsController().handle)
router.get('/events/:id', new GetEventDetailsController().handle)
router.delete('/events/:id', isAuthenticated, new DeleteEventController().handle)

export { router }
