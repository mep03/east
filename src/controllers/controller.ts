import { Request, Response, NextFunction } from "express";
import validUrl from "valid-url";
import shortid from "shortid";
import path from "path";
import bcrypt from "bcrypt";

import {
  UrlModel,
  UrlDocument,
  UserModel,
  UserDocument,
} from "../models/schema";
import { generateToken } from "../utils/token";
import { sendEmail } from "../libs/mail";
import { shouldSkipRedirect } from "../utils/skipredirect";
import { isStrongPassword } from "../utils/password";
import { isValidCustomUrl } from "../utils/custom";

/**
 * @desc Serves the index page.
 * @info This function sends the index page to the user.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const serveIndexPage = (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "../views/index.html"));
};

/**
 * @desc Retrieves a list of all short URLs for the authenticated user.
 * @info This function handles the retrieval of a list of all short URLs associated with the authenticated user.
 *       It validates the user's session token, retrieves the user based on the session token,
 *       and then fetches the short URLs from the database for that user.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const getShortAll = async (req: Request, res: Response) => {
  try {
    const userSessionToken = req.cookies.sessionToken;

    if (!userSessionToken) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await UserModel.findOne({
      sessionToken: userSessionToken,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid sessionToken" });
    }

    const baseUrl = process.env.PUBLIC_URI as string;
    const limit = parseInt(req.query.limit as string);
    const shortUrls = await UrlModel.find({ user: user._id }).limit(limit);

    const formattedUrls = shortUrls.map((url) => ({
      id: url._id,
      originalUrl: url.originalUrl,
      shortUrl: baseUrl + "/" + url.shortUrl,
      uniqueUrl: url.shortUrl,
      clickCount: url.clickCount,
    }));

    return res.status(200).json(formattedUrls);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc Creates a new short URL.
 * @info This function handles the creation of a new short URL. It validates the original URL,
 *       checks if the URL has been generated before, and then generates a short URL based on the custom input
 *       or a randomly generated short ID. It associates the short URL with the user and saves it in the database.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const createShortUrl = async (req: Request, res: Response) => {
  const { originalUrl, customShortUrl } = req.body;

  if (!validUrl.isWebUri(originalUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  if (customShortUrl && !isValidCustomUrl(customShortUrl)) {
    return res.status(400).json({ error: "Invalid custom short URL" });
  }

  try {
    const baseUrl = process.env.PUBLIC_URI as string;
    const existingUrl = await UrlModel.findOne({ originalUrl });

    if (existingUrl) {
      return res.status(200).json({
        message: "Short URL has been generated before",
        shortUrl: baseUrl + "/" + existingUrl.shortUrl,
      });
    }

    let shortUrl;
    if (customShortUrl) {
      const existingCustomUrl = await UrlModel.findOne({
        shortUrl: customShortUrl,
      });
      if (existingCustomUrl) {
        return res
          .status(400)
          .json({ error: "Custom short URL already exists" });
      }
      shortUrl = customShortUrl;
    } else {
      const shortId = shortid.generate();
      shortUrl = shortId.substring(0, 5);
    }

    const userSessionToken = req.cookies.sessionToken;

    if (!userSessionToken) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user: UserDocument | null = await UserModel.findOne({
      sessionToken: userSessionToken,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid sessionToken" });
    }

    const newUrl: UrlDocument = new UrlModel({
      originalUrl,
      shortUrl,
      user: user._id,
    });

    await newUrl.save();
    return res.status(201).json({
      message: "Short URL create successfully",
      shortUrl: baseUrl + "/" + newUrl.shortUrl,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc Retrieves information about a specific short URL.
 * @info This function handles the retrieval of information about a specific short URL.
 *       It validates the user's session token, retrieves the user based on the session token,
 *       and then fetches the short URL information from the database based on the provided ID parameter.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const getShortUrlById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const userSessionToken = req.cookies.sessionToken;

    if (!userSessionToken) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await UserModel.findOne({
      sessionToken: userSessionToken,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid sessionToken" });
    }

    const baseUrl = process.env.PUBLIC_URI as string;
    const shortUrl = await UrlModel.findById(id);

    if (!shortUrl) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    if (shortUrl.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    const formattedUrl = {
      id: shortUrl._id,
      originalUrl: shortUrl.originalUrl,
      shortUrl: baseUrl + "/" + shortUrl.shortUrl,
      uniqueUrl: shortUrl.shortUrl,
      clickCount: shortUrl.clickCount,
    };

    res.status(200).json(formattedUrl);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc Redirects to the original URL.
 * @info This function handles the redirection to the original URL associated with a short URL.
 *       It finds the URL document based on the short URL parameter, increments the click count,
 *       and performs a 301 redirect to the original URL.
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The Express NextFunction for passing control to the next middleware.
 */
export const redirectToOriginalUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { shortUrl } = req.params;

  try {
    const urlData = await UrlModel.findOne({ shortUrl });

    if (shouldSkipRedirect(shortUrl)) {
      return next();
    }

    if (!urlData) {
      /**
       * Serves the 404 page (Not Found).
       * @info This sends the 404 error page to the user when a short URL is not found.
       */
      return res
        .status(404)
        .sendFile(path.join(__dirname, "../views/404.html"));
    }

    urlData.clickCount += 1;
    await urlData.save();

    return res.status(301).redirect(urlData.originalUrl);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc Deletes a user's short URL.
 * @info This function handles the deletion of a user's short URL. It validates the user's session token,
 *       retrieves the user based on the session token, and then deletes the corresponding URL document
 *       based on the provided request parameters.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const deleteShortUrl = async (req: Request, res: Response) => {
  const { idOrShortUrl } = req.params;

  try {
    const userSessionToken = req.cookies.sessionToken;

    if (!userSessionToken) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await UserModel.findOne({
      sessionToken: userSessionToken,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid sessionToken" });
    }

    let deletedUrl;

    if (idOrShortUrl.length === 5) {
      deletedUrl = await UrlModel.findOneAndDelete({
        shortUrl: idOrShortUrl,
        user: user._id,
      });
    } else if (idOrShortUrl.length === 24) {
      deletedUrl = await UrlModel.findOneAndDelete({
        _id: idOrShortUrl,
        user: user._id,
      });
    } else {
      return res.status(400).json({ error: "Invalid identifier format" });
    }

    if (!deletedUrl) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.status(200).json({ message: "Short URL deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc Updates a user's short URL.
 * @info This function handles the update of a user's short URL. It validates the user's session token,
 *       retrieves the user based on the session token, and then updates the original URL and/or short URL
 *       based on the provided request parameters. The updated URL document is saved in the database.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const updateShortUrl = async (req: Request, res: Response) => {
  try {
    const { idOrShortUrl } = req.params;
    const { shortUrl, originalUrl } = req.body;

    const userSessionToken = req.cookies.sessionToken;
    if (!userSessionToken) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await UserModel.findOne({
      sessionToken: userSessionToken,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid sessionToken" });
    }

    let existingUrl;

    if (idOrShortUrl.length === 5) {
      existingUrl = await UrlModel.findOne({
        shortUrl: idOrShortUrl,
        user: user._id,
      });
    } else if (idOrShortUrl.length === 24) {
      existingUrl = await UrlModel.findOne({
        _id: idOrShortUrl,
        user: user._id,
      });
    } else {
      return res.status(400).json({ error: "Invalid identifier format" });
    }

    if (!existingUrl) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    if (originalUrl) {
      if (!validUrl.isWebUri(originalUrl)) {
        return res.status(400).json({ error: "Invalid URL" });
      }
      existingUrl.originalUrl = originalUrl;
    }

    if (shortUrl) {
      if (!isValidCustomUrl(shortUrl)) {
        return res.status(400).json({ error: "Invalid custom short URL" });
      }
      if (shortUrl !== existingUrl.shortUrl) {
        const isShortUrlTaken = await UrlModel.exists({ shortUrl: shortUrl });
        if (isShortUrlTaken) {
          return res.status(400).json({ error: "Short URL is already taken" });
        }
        existingUrl.shortUrl = shortUrl;
      }
    }

    await existingUrl.save();

    return res.status(200).json({ message: "Short URL updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc Handles user authentication.
 * @info This function handles the user authentication process. It takes user email and password from the request body,
 *       checks the credentials, generates a session token, and updates the user's session token in the database.
 *       The session token is then set in a cookie for subsequent requests.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.emailVerified) {
      return res.status(401).json({ error: "Email not verified" });
    }

    const sessionToken = generateToken();

    user.sessionToken = sessionToken;
    await user.save();

    res.cookie("sessionToken", sessionToken, { httpOnly: true, secure: true });

    return res
      .status(200)
      .json({ message: "Sign in successful", sessionToken });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc Handles user registration.
 * @info This function handles the user registration process. It takes user email and password from the request body,
 *       checks if the user already exists, hashes the password, generates a verification token,
 *       creates a new user entry in the database, and sends a verification email to the user.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User email already exists" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: "Password is not strong enough" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const sessionToken = generateToken();
    const verificationToken = generateToken();

    await UserModel.create({
      email,
      password: hashedPassword,
      sessionToken,
      verificationToken,
    });

    const baseUrl = process.env.PUBLIC_URI as string;

    const senderName = "East Accounts";
    const subject = "Verify Email Address";
    const content = `<p>Thanks You for SignUp 👻<br><br>Please click the following link to verification your email: <a href="${baseUrl}/verification/${verificationToken}">Verify Email</a><br><br>Note: If you didn't sign up for our service, you can safely ignore this email.</p>`;

    sendEmail(senderName, email, subject, content);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc Handles email verification.
 * @info This function handles the email verification process. It takes a verification token from the request parameters,
 *       searches for a user with the corresponding verification token, updates the user's emailVerified status to true,
 *       and sends a success response indicating that the email has been verified.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const verificationToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const user = await UserModel.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(404)
        .sendFile(path.join(__dirname, "../views/verification-invalid.html"));
    }

    user.emailVerified = true;
    await user.save();

    res
      .status(200)
      .sendFile(path.join(__dirname, "../views/verification.html"));
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Logs the user out and redirects to the homepage or sign-in page.
 * @info This function handles the user logout process. It clears the "sessionToken" cookie to invalidate the user's session,
 *       generates a new session token, updates the user's session token in the database, and then redirects the user.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const signOut = async (req: Request, res: Response) => {
  const userSessionToken = req.cookies.sessionToken;

  if (!userSessionToken) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const user = await UserModel.findOne({
    sessionToken: userSessionToken,
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid sessionToken" });
  }

  const NewsessionToken = generateToken();

  user.sessionToken = NewsessionToken;
  await user.save();

  res.clearCookie("sessionToken", { httpOnly: true, secure: true });

  return res.status(200).redirect("/signin");
};

/**
 * @desc Displays the "sign in" view.
 * @info This function handles the request to show the "sign in" view, which provides a user interface for user authentication.
 *       It sends a response with the contents of the "signin.html" file located in the "views" directory.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const showSignIn = (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "../views/signin.html"));
};

/**
 * @desc Displays the "sign up" view.
 * @info This function handles the request to show the "sign up" view, which provides a user interface for user registration.
 *       It sends a response with the contents of the "signup.html" file located in the "views" directory.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const showSignUp = (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "../views/signup.html"));
};

/**
 * @desc Displays the "dashboard" view.
 * @info This function handles the request to show the "dashboard" view, which provides a user interface for managing data or content.
 *       It sends a response with the contents of the "dashboard.html" file located in the "views" directory.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const showDashboard = (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "../views/dashboard.html"));
};

/**
 * @desc Displays the "create" view.
 * @info This function handles the request to show the "create" view, which is used for creating new items.
 *       It sends a response with the contents of the "create.html" file located in the "views" directory.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const showCreate = (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "../views/create.html"));
};

/**
 * @desc Displays the "update" view.
 * @info This function handles the request to show the "update" view, which is used for updating existing items.
 *       It sends a response with the contents of the "update.html" file located in the "views" directory.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const showUpdate = (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "../views/update.html"));
};

/**
 * @desc Displays the "delete" view.
 * @info This function handles the request to show the "delete" view, which is used for deleting items.
 *       It sends a response with the contents of the "delete.html" file located in the "views" directory.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const showDelete = (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "../views/delete.html"));
};

/**
 * @desc Displays the "privacy" view.
 * @info This function handles the request to show the "privacy" view, which provides information about privacy policies.
 *       It sends a response with the contents of the "privacy.html" file located in the "views" directory.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const showPrivacy = (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "../views/privacy.html"));
};

/**
 * @desc Displays the "about" view.
 * @info This function handles the request to show the "about" view, which provides information about the application or website.
 *       It sends a response with the contents of the "about.html" file located in the "views" directory.
 * @param req The Express Request object.
 * @param res The Express Response object.
 */
export const showAbout = (req: Request, res: Response) => {
  res.status(200).sendFile(path.join(__dirname, "../views/about.html"));
};
