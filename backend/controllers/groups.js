import mongoose from "mongoose";
import user from "../models/user.js"
import group from "../models/group.js";
import bcrypt from "bcryptjs";
import  jwt  from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { validationResult } from "express-validator";
import Splitwise from 'splitwise-js-map';

export const  creategroup= async(req,res)=>{
    const {userId,title} = req.body.groupInput
        const newgroup = new group(
            req.body.groupInput
        );
    try {
        console.log(userId)
        newgroup.members.push(userId)
        const updatedgroup = await group.findByIdAndUpdate(
            newgroup._id,
            {$push:{members:userId}},
            {new:true}
        )
        const userr = await user.findByIdAndUpdate(
            userId,
            { $push: { groups: newgroup._id } },
            { new: true }
        );
        await newgroup.save()
        res.status(200).json({newgroup})
    }
    catch (err) {
    next(err)
    console.log(err);
    }
};
export const  getDebts= async(req,res)=>{
    const {groupId} = req.params
       
    try {
        const grp= await group.findById(groupId)
        console.log("getDebts:",grp)
        res.status(200).json(grp.simplifyDebt)
    }
    catch (err) {
    console.log(err);
    }
};

export const joingroup = async(req,res)=>{
    const {userId,JoingCode} = req.body.joincode
    const existgroup = await group.findOne({groupCode:JoingCode});
    if (!existgroup) {
        return res.status(404).json({ error: 'Group not found' });
    }
    if (existgroup.members.includes(userId)) {
        return res.status(400).json({ error: 'User is already a member of this group' });
    }
    const newgroup = await group.findByIdAndUpdate(
            existgroup._id,
            {$push:{members:userId}},
            {new:true}
        )
    const userr = await user.findByIdAndUpdate(
        userId,
        { $push: { groups: existgroup._id } },
        { new: true }
    );
    const updatedGroup = await newgroup.save();
    res.status(200).json(updatedGroup);
}

export const getgroups = async(req,res)=>{
    const userId= req.params.id;
    // console.log(req.params.userId)
    try{
        // const groups = await group.find({
        //     $or:[
        //     {members: { $in: userId }},{userId: userId},],})
        console.log(userId)
        const userr = await user.findById(userId)
        const allgroups = userr.groups
        // res.json({allgroups})
        const groupDetails = await Promise.all(allgroups.map(async groupId => {
            const groupDetail = await group.findById(groupId);
            return groupDetail;
          }));
        res.json( groupDetails );
    }catch(err){
        console.log(err)
    }
}

export const getmembers = async(req,res)=>{
    const groupId= req.params.id;
    // console.log(req.params.userId)
    try{
        // const groups = await group.find({
        //     $or:[
        //     {members: { $in: userId }},{userId: userId},],})
        console.log(groupId)
        const groupweneed= await group.findById(groupId)
        const allmembers = groupweneed.members
        // res.json({allgroups})
        const memberDetails = await Promise.all(allmembers.map(async userId => {
            const memberDetail = await user.findById(userId);
            return memberDetail;
          }));
        res.json( memberDetails );
    }catch(err){
        console.log(err)
    }
}

export const splitBill = async (req, res) => {
    const { amount, groupData } = req.body.input;
    const n = groupData.members.length;
  
    try {
      const billSplit = await Promise.all(
        groupData.members.map(async (mem) => {
          const { username } = await user.findById(mem);
          return {
            amount: amount / n,
            name: username,
            userId: mem,
            settled: false,
            approved:false
          };
        })
      )
      const updatedgroup = await group.findByIdAndUpdate(
        groupData._id,
        {$push:{billSplit:billSplit}},
        {new:true}
       )
  
      res.json(updatedgroup);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

//   export const markPaid = async (req, res) => {
//     // Group id
//     const id = req.params.id;
//     // User id
//     const userId = req.body.userId;


//     try {
        
//         const group1 = await group.findById(id);

//         // Find the index of the user in the billSplit array
//         const userIndex = group1.billSplit[0].findIndex((mem) => mem.userId === userId);

//         // If the user is found, update the settled field
//         if (userIndex !== -1) {
//             // Convert the string to a boolean and toggle it
//             group1.billSplit[0][userIndex].settled = group1.billSplit[0][userIndex].settled === true ? false : true;
//             await group1.save();
//         }
//         res.json(group1);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
export const markPaid = async (req, res) => {
    // Group id
    const id = req.params.id;
    // User id
    const userId = req.body.userId;

    try {
        const group1 = await group.findById(id);

        // Find the index of the user in the billSplit array
        console.log(group1.billSplit[0])
        const userIndex = group1.billSplit[0].findIndex((mem) => mem.userId === userId);

        // If the user is found, update the settled field
        if (userIndex !== -1) {
            const currentSettledValue = group1.billSplit[0][userIndex].settled;
            await group.updateOne(
                { _id: group1._id, 'billSplit.0.userId': userId },
                { $set: { 'billSplit.0.$.settled': !currentSettledValue } }
            );
        }

        res.json(group1);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const markApproved = async (req, res) => {
    // Group id
    const id = req.params.id;
    // User id
    const userId = req.body.userId;

    try {
        const group1 = await group.findById(id);

        // Find the index of the user in the billSplit array
        const userIndex = group1.billSplit[0].findIndex((mem) => mem.userId === userId);

        // If the user is found, update the settled field
        if (userIndex !== -1) {
            const currentApprovedValue = group1.billSplit[0][userIndex].approved;
            await group.updateOne(
                { _id: group1._id, 'billSplit.0.userId': userId },
                { $set: { 'billSplit.0.$.approved': !currentApprovedValue } }
            );
        }

        res.json(group1);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const simplifyDebt = async(req,res)=>{
    const debts = req.body.outputArray
    const id=req.params.id

    try{
        const splits = Splitwise(debts);
        splits.forEach(subArray => subArray.push(false));
        const updatedgroup = await group.findByIdAndUpdate(
            id,
            {$set:{simplifyDebt:splits}},
            {new:true}
           )
    console.log(splits);
    res.json(splits)
    }catch(err){
        res.json("unable to simplify")
    }
}


export const deleteGroup = async (req, res) => {
    try {
      const groupId = req.params.id;
      const groupToDelete = await group.findById(groupId);
      if (!groupToDelete) {
        return res.status(404).json({ error: "Group not found" });
      }
      await group.findByIdAndDelete(groupId);
      const members = groupToDelete.members;
      await Promise.all(
        members.map(async (userId) => {
          const userToUpdate = await user.findById(userId);
          if (userToUpdate) {
            userToUpdate.groups = userToUpdate.groups.filter(
              (groupId) => groupId.toString() !== groupToDelete._id.toString()
            );
            await userToUpdate.save();
          }
        })
      );
  
      res.status(200).json({ message: "Group deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Unable to delete group" });
    }
  };
  


export const approveDebt = async (req, res) => {
    const id = req.params.id;
    const arr = req.body;
  
    try {
      const updatedGroup = await group.findOneAndUpdate(
        {
          _id: id,
          'simplifyDebt': {
            $elemMatch: {
              0: arr[0],
              1: arr[1],
            },
          },
        },
        {
          $set: {
            'simplifyDebt.$[outer].3': true,
          },
        },
        {
          arrayFilters: [{ 'outer.0': arr[0], 'outer.1': arr[1] }],
          new: true, // Return the modified document
        }
      );
  
      res.json(updatedGroup);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };