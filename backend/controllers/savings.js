import savingSchema from "../models/savings.js"

//controllers for savings/budgets to meet financial goals
export const addSaving = async(req,res)=>{
    const {userId,targetAmt,currency,currAmt} =req.body

    const saving = savingSchema({
        userId,
        targetAmt,
        currAmt,
        currency,

    })

    try{
        if(!userId || !targetAmt || !currAmt || !currency){
            return res.status(400).json({message: 'All fields are required!'})
        }
        await saving.save()
        res.status(200).json({message:'saving added',savingDetails:saving})

    }catch(err){
        res.status(500).json({message:'Server error'})
    }
    console.log(saving)

}

export const getSavings = async(req,res)=>{
    const {userId}= req.body;
    try{
        const savings = await savingSchema.find({userId:userId})
        res.json({savings})
    }catch(err){
        res.json({message:"No savings found"})
    }

}

export const editSaving = async(req,res)=>{
    try{
        const saving = await savingSchema.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
        res.json({message:"saving edited",saving})
    }catch(err){
        res.json({message:"cannot edit the saving/saving not found"})
    }
}
export const deleteSaving = async(req,res)=>{
    try{
        const saving = await savingSchema.findByIdAndDelete(req.params.id);
        res.json({message:"saving deleted"})
    }catch(err){
        res.json({message:"cannot delete the saving/saving not found"})

    }
}