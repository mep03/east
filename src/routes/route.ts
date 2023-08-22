import express from "express";

import { Middleware } from "../middleware";
import { requireAuth, isSession } from "../libs/auth";
import { cache } from "../libs/cache";

import {
  serveIndexPage,
  getShortAll,
  createShortUrl,
  getShortUrlById,
  updateShortUrl,
  deleteShortUrl,
  redirectToOriginalUrl,
  signIn,
  signUp,
  logOut,
  showSignIn,
  showSignUp,
  showDashboard,
  showCreate,
  showUpdate,
  showDelete,
  showPrivacy,
  showAbout,
} from "../controllers/controller";

const router = express.Router();

/**
 * Route for serving the index page.
 * @info This route serves the index HTML page using the provided middleware function to check for an active session,
 *       and calls the 'serveIndexPage' controller function for handling the page serving.
 * @desc Handles the logic for serving the index page route.
 * @method GET
 * @route /
 * @middleware isSession - Middleware function for checking an active session.
 * @controller serveIndexPage - Controller function for serving the index page.
 */
router.get("/", cache("2 day"), isSession, serveIndexPage);

/**
 * Route for getting all short URLs.
 * @info This route retrieves all short URLs using the provided middleware function for authentication,
 *       and calls the 'getShortAll' controller function for handling the retrieval.
 * @desc Handles the logic for getting all short URLs route.
 * @method GET
 * @route /api/v1/shorten
 * @middleware Middleware - Middleware function for requiring authentication.
 * @controller getShortAll - Controller function for handling retrieval of all short URLs.
 */
router.get("/api/v1/shorten", Middleware, getShortAll);

/**
 * Route for creating a short URL.
 * @info This route creates a short URL using the provided middleware function for authentication,
 *       and calls the 'createShortUrl' controller function for handling the creation.
 * @desc Handles the logic for creating a short URL route.
 * @method POST
 * @route /api/v1/shorten
 * @middleware Middleware - Middleware function for requiring authentication.
 * @controller createShortUrl - Controller function for handling short URL creation.
 */
router.post("/api/v1/shorten", Middleware, createShortUrl);

/**
 * Route for getting a short URL by ID.
 * @info This route retrieves a short URL by its ID,
 *       using the provided middleware function for authentication,
 *       and calls the 'getShortUrlById' controller function for handling the retrieval.
 * @desc Handles the logic for getting a short URL by ID route.
 * @method GET
 * @route /api/v1/shorten/:id
 * @middleware Middleware - Middleware function for requiring authentication.
 * @controller getShortUrlById - Controller function for handling short URL retrieval by ID.
 * @param {string} :id - The ID of the short URL to be retrieved.
 */
router.get("/api/v1/shorten/:id", Middleware, getShortUrlById);

/**
 * Route for updating a short URL.
 * @info This route updates a short URL by either its ID or short URL string,
 *       using the provided middleware function for authentication,
 *       and calls the 'updateShortUrl' controller function for handling the update.
 * @desc Handles the logic for updating a short URL route.
 * @method PATCH
 * @route /api/v1/shorten/:idOrShortUrl
 * @middleware Middleware - Middleware function for requiring authentication.
 * @controller updateShortUrl - Controller function for handling short URL update.
 * @param {string} :idOrShortUrl - The ID or short URL string of the short URL to be updated.
 */
router.patch("/api/v1/shorten/:idOrShortUrl", Middleware, updateShortUrl);

/**
 * Route for deleting a short URL.
 * @info This route deletes a short URL by either its ID or short URL string,
 *       using the provided middleware function for authentication,
 *       and calls the 'deleteShortUrl' controller function for handling the deletion.
 * @desc Handles the logic for deleting a short URL route.
 * @method DELETE
 * @route /api/v1/shorten/:idOrShortUrl
 * @middleware Middleware - Middleware function for requiring authentication.
 * @controller deleteShortUrl - Controller function for handling short URL deletion.
 * @param {string} :idOrShortUrl - The ID or short URL string of the short URL to be deleted.
 */
router.delete("/api/v1/shorten/:idOrShortUrl", Middleware, deleteShortUrl);

/**
 * Route for redirecting to the original URL.
 * @info This route redirects to the original URL associated with the provided short URL,
 *       and calls the 'redirectToOriginalUrl' controller function for handling the redirection.
 * @desc Handles the logic for redirecting to the original URL route.
 * @method GET
 * @route /:shortUrl
 * @controller redirectToOriginalUrl - Controller function for handling URL redirection.
 * @param {string} :shortUrl - The short URL to be used for redirection.
 */
router.get("/:shortUrl", redirectToOriginalUrl);

/**
 * Route for user sign-in.
 * @info This route handles user authentication by using the provided middleware function to check for an active session,
 *       and then calls the 'signIn' controller function for user sign-in.
 * @desc Handles the logic for user sign-in route.
 * @method POST
 * @route /auth/signin
 * @middleware Middleware - Middleware function for checking an active session.
 * @controller signIn - Controller function for user sign-in.
 */
router.post("/auth/signin", Middleware, signIn);

/**
 * Route for user sign-up.
 * @info This route handles user registration by using the provided middleware function to check for an active session,
 *       and then calls the 'signUp' controller function for user registration.
 * @desc Handles the logic for user sign-up route.
 * @method POST
 * @route /auth/signup
 * @middleware Middleware - Middleware function for checking an active session.
 * @controller signUp - Controller function for user sign-up.
 */
router.post("/auth/signup", Middleware, signUp);

/**
 * Route for user logout.
 * @info This route calls the 'logOut' controller function to handle user logout,
 *       effectively clearing the session token cookie.
 * @desc Handles the logic for user logout route.
 * @method GET
 * @route /auth/logout
 * @controller logOut - Controller function for handling user logout.
 */
router.get("/auth/logout", logOut);

/**
 * Route for displaying the sign-in page.
 * @info This route serves the sign-in HTML page by using the provided middleware function to check for an active session,
 *       and then calls the 'showSignIn' controller function for rendering the page.
 * @desc Handles the logic for displaying the sign-in page route.
 * @method GET
 * @route /signin
 * @middleware isSession - Middleware function for checking an active session.
 * @controller showSignIn - Controller function for rendering the sign-in page.
 */
router.get("/signin", cache("2 day"), isSession, showSignIn);

/**
 * Route for displaying the sign-up page.
 * @info This route serves the sign-up HTML page by using the provided middleware function to check for an active session,
 *       and then calls the 'showSignUp' controller function for rendering the page.
 * @desc Handles the logic for displaying the sign-up page route.
 * @method GET
 * @route /signup
 * @middleware isSession - Middleware function for checking an active session.
 * @controller showSignUp - Controller function for rendering the sign-up page.
 */
router.get("/signup", cache("2 day"), isSession, showSignUp);

/**
 * Route for displaying the dashboard page.
 * @info This route serves the dashboard HTML page by using the provided middleware function to require authentication,
 *       and then calls the 'showDashboard' controller function for rendering the page.
 * @desc Handles the logic for displaying the dashboard page route.
 * @method GET
 * @route /dashboard
 * @middleware requireAuth - Middleware function for requiring authentication.
 * @controller showDashboard - Controller function for rendering the dashboard page.
 */
router.get("/dashboard", requireAuth, showDashboard);

/**
 * Route for displaying the "create" form within the dashboard.
 * @info This route serves the "create" form HTML page by utilizing the provided middleware function to enforce authentication,
 *       and then invokes the 'showCreate' controller function to render the form.
 * @desc Handles the logic for displaying the "create" form route.
 * @method GET
 * @route /dashboard/create
 * @middleware requireAuth - Middleware function to ensure user authentication.
 * @controller showCreate - Controller function responsible for rendering the "create" form.
 */
router.get("/dashboard/create", requireAuth, showCreate);

/**
 * Route for displaying the "update" form within the dashboard.
 * @info This route serves the "update" form HTML page by utilizing the provided middleware function to enforce authentication,
 *       and then invokes the 'showUpdate' controller function to render the form with data related to the specified ID.
 * @desc Handles the logic for displaying the "update" form route.
 * @method GET
 * @route /dashboard/update/:id
 * @param {string} :id - Parameter representing the ID of the item to be updated.
 * @middleware requireAuth - Middleware function to ensure user authentication.
 * @controller showUpdate - Controller function responsible for rendering the "update" form.
 */
router.get("/dashboard/update/:id", requireAuth, showUpdate);

/**
 * Route for displaying the "delete" confirmation page within the dashboard.
 * @info This route serves the "delete" confirmation page by using the provided middleware function to enforce authentication,
 *       and then invokes the 'showDelete' controller function to render the confirmation page for the item identified by the given ID.
 * @desc Handles the logic for displaying the "delete" confirmation route.
 * @method GET
 * @route /dashboard/delete/:id
 * @param {string} :id - Parameter indicating the ID of the item to be deleted.
 * @middleware requireAuth - Middleware function to ensure user authentication.
 * @controller showDelete - Controller function responsible for rendering the "delete" confirmation page.
 */
router.get("/dashboard/delete/:id", requireAuth, showDelete);

/**
 * Route for displaying the privacy policy page.
 * @info This route serves the privacy policy HTML page by directly invoking the 'showPrivacy' controller function.
 * @desc Handles the logic for displaying the privacy policy page route.
 * @method GET
 * @route /privacy
 * @controller showPrivacy - Controller function responsible for rendering the privacy policy page.
 */
router.get("/privacy", cache("2 day"), showPrivacy);

/**
 * Route for displaying the "about" page.
 * @info This route serves the "about" HTML page by directly invoking the 'showAbout' controller function.
 * @desc Handles the logic for displaying the "about" page route.
 * @method GET
 * @route /about
 * @controller showAbout - Controller function responsible for rendering the "about" page.
 */
router.get("/about", cache("2 day"), showAbout);

export default router;
