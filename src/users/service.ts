import { User } from "./user";

export const checkIfUserExists = async (userEmail: string) => {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  };