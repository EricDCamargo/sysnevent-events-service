import { Router } from 'express'
import { isAdmin, isAuthenticated, isCoordinator } from './middlewares/isAuthenticated'
import { CreateEventController } from './controllers/event/CreateEventController'
import { UpdateEventController } from './controllers/event/UpdateEventController'
import { GetEventDetailsController } from './controllers/event/GetEventDetailsController'
import { DeleteEventController } from './controllers/event/DeleteEventController'
import { ListEventsController } from './controllers/event/ListEventsController'
import { CheckUnavailableDatesController } from './controllers/event/CheckUnavailableDatesController'
import { CheckAvailableTimeSlotsController } from './controllers/event/CheckAvailableTimeSlotsController'
import { UpdateParticipantCountController } from './controllers/event/UpdateParticipantCountController'
import { CreateCategoryController } from './controllers/category/CreateCategoryController'
import { DeleteCategoryController } from './controllers/category/DeleteCategoryController'
import { ListCategoriesController } from './controllers/category/ListCategoriesController'
import { UpdateCategoryController } from './controllers/category/UpdateCategoryController'
import { CreateBannerController } from './controllers/banner/CreateBannerController'
import { DeleteBannerController } from './controllers/banner/DeleteBannerController'
import { ListActiveBannersController } from './controllers/banner/ListActiveBannersController'
import { ListAllBannersController } from './controllers/banner/ListAllBannersController'
import { UpdateBannerController } from './controllers/banner/UpdateBannerController'
import { ToggleBannerStatusController } from './controllers/banner/ToggleBannerStatusController'

const router = Router()

router.post('/', isAuthenticated, isCoordinator, new CreateEventController().handle)
router.get('/', new ListEventsController().handle)
router.get('/details', new GetEventDetailsController().handle)
router.put('/', isAuthenticated, isCoordinator, new UpdateEventController().handle)
router.delete('/', isAuthenticated, isCoordinator, new DeleteEventController().handle)
router.get('/unavailable-dates', isAuthenticated, new CheckUnavailableDatesController().handle)
router.get('/available-time-slots', isAuthenticated, new CheckAvailableTimeSlotsController().handle)
router.patch('/update-participant-count', new UpdateParticipantCountController().handle)

router.get('/categories', new ListCategoriesController().handle)
router.post('/categories', isAuthenticated, isCoordinator, new CreateCategoryController().handle)
router.put('/categories', isAuthenticated, isCoordinator, new UpdateCategoryController().handle)
router.delete('/categories', isAuthenticated, isCoordinator, new DeleteCategoryController().handle)

router.post('/banners', isAuthenticated, isCoordinator, new CreateBannerController().handle)
router.get('/banners', isAuthenticated, isCoordinator, new ListAllBannersController().handle)
router.get('/banners/active', new ListActiveBannersController().handle)
router.put('/banners', isAuthenticated, isCoordinator, new UpdateBannerController().handle)
router.delete('/banners', isAuthenticated, isCoordinator, new DeleteBannerController().handle)
router.patch('/banners/toggle-status', isAuthenticated, isCoordinator, new ToggleBannerStatusController().handle)

export { router }
