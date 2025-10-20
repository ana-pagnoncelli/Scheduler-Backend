import { User } from "./user";

export const checkIfUserExists = async (userEmail: string) => {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  };

export const increaseClassesToRecover = async (userEmail: string) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.classes_to_recover)
    user.classes_to_recover++;
  else
    user.classes_to_recover = 1;

  await user.save();
  return user;
};