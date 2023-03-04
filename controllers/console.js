import UserDetails from "../models/UserDetails";

export const getHome = async (req, res) => {
  const categoryInfo = {
    "ui/ux": { id: "c1", name: "UI/UX", count: 0 },
    frontend: { id: "c2", name: "Frontend", count: 0 },
    backend: { id: "c3", name: "Backend", count: 0 },
    ml: { id: "c4", name: "Machine Learning", count: 0 },
    blockchain: { id: "c5", name: "Blockchain", count: 0 },
    fullstack: { id: "c6", name: "Full Stack", count: 0 },
    "ar/vr": { id: "c7", name: "AR/VR", count: 0 },
    "android/ios": { id: "c8", name: "Android/IOS", count: 0 },
  };

  const categoryData = await UserDetails.aggregate([
    { $group: { _id: "$techStack", count: { $count: {} } } },
  ]);

  categoryData.forEach((ele) => {
    categoryInfo[ele._id].count = ele.count;
  });

  const featuredBuddies = await UserDetails.find(
    {},
    { userId: 1, firstName: 1, lastName: 1, state: 1, techStack: 1 }
  ).limit(8);

  res.send({ message: "Success", categoryInfo, featuredBuddies });
};
