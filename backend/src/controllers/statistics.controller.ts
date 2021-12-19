import { Request, Response } from 'express';
import { CResponse } from '../helpers/classes/response.class';
import Events from '../models/event.model';
import Purchases from '../models/purchase.model';
import Users from '../models/user.model';
const generalOverview = async (req: Request, res: Response) => {

  try {
    const eventsCount = await Events.countDocuments();
    const activeMembersCount = await Users.countDocuments({status: "active", role: "user"});
    const inactiveMembersCount = await Users.countDocuments({status: "inactive", role: "user"});
    
    
    const users = await Users.find().populate("accountOwner");
    
    const allAccounts = users.length;
    const males = users.filter((us) => us.status == "active" && us.role == "user" && us.accountOwner.gender == "M");
    const females = users.filter((us) => us.status == "active" && us.role == "user" && us.accountOwner.gender == "F");
    
    const maleAccounts = males ? males.length : 0;
    const femaleAccounts = females ? females.length : 0;

    return res.status(200).json({message: "Statistics fetched", code: 200, status: "ok", data: { eventsCount, activeMembersCount, maleAccounts, femaleAccounts, inactiveMembersCount, allAccounts}})
  } catch (error: any) {
    return res
      .status(404)
      .json({ message: error.message, code: 404, status: 'error' });
  }
};

// const portalStats = async (req: Request, res: Response) => {
//   const eventId = req.params["eventId"];
  // const purchases = await Purchases
//   .find({})
//    .aggregate([
//     // matching only the current year
//     { $match: { _id: eventId } },

//     // group based on the month
//     {
//         $group: {
//             _id: '$month',
//             amount: { $sum: '$amount' },
//             count: { $sum: 1 },
//         },
//     },
// ]);
// const sales = await Purchases.find({"tickets.eventId": eventId});

// return res.status(200).json({message: 'Sales fetched', data: sales, code: 200, status: 'ok'})
// }

const portalStats = async (req: Request, res: Response) => {
  try {
    const eventId = req.params['eventId'];

    const event = await Events.findById(eventId);

    return CResponse.success(res, {data: {capacity: event?.capacity, totalCount: 0}});
  } catch (error: any) {
    return CResponse.error(res, {message: error.message});
  }
}

export { generalOverview, portalStats };
