import express from "express";

import { getUserByEmail, createUser } from "../db/users";
import { random, authentication } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    // destructure data from request
    const { email, password } = req.body;

    // check to see if data exists
    if (!email || !password) {
      return res.sendStatus(400);
    }
    // calls actions defined within db model
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    // check to see if user exists in db
    if (!user) {
      return res.sendStatus(400);
    }
    // gets hashed password
    const expectedHash = authentication(user.authentication.salt, password);

    // check to see if they match
    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403);
    }

    // update user session token
    const salt = random();
    user.authentication.sessionToken = authentication(salt, user.id.toString());
    await user.save();

    // sets cookie
    res.cookie("TOM-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    // destructure elements expected from the request as defined in the schema
    const { email, password, username } = req.body;
    console.log(email, password, username);

    // error handling if data does not exist in body
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    // get existing user
    const existingUser = await getUserByEmail(email);

    // if user already exists return error
    if (existingUser) {
      return res.sendStatus(400);
    }

    // create a salt from helpers
    const salt = random();

    // call create user function passing in data from req body and adding salt to the password
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    // return success with user data
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
