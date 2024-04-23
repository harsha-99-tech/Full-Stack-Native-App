import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";
import SignIn from "../app/(auth)/sign-in";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.f_app",
  projectId: "6627a9a27e4aeadf2da7",
  databaseId: "6627ac2e0fe8301c98b5",
  userCollectionId: "6627ac68c91e374de295",
  videoCollectionId: "6627aca351a8ce11b27a",
  storageId: "6627ae7a77f0a8c7f651",
};

// Init your react-native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountid: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}
