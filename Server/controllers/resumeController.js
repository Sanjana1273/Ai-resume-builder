import Resume from "../models/Resume";

// controller for creating a new resume
// POST: /api/resumes/create
export const createResume = async (req,res)=>{
  try{
    const userId = req.userId;
    const {title} = req.body;

    // Create new Resume
    const newResume = await Resume.create({userId, title})
    // return succes message
    return res.status(201).json({message : 'Resume created successfully',resume : newResume})
   } catch (error) {
    return res.status(400).json({message: error.message})
  }
}

// controller for deleting a resume
// DELETE : /api/resumes/delete
export const deleteResume = async(req, res)=>{
    try{
        const userId = req.userId;
        const {resumeId} = req.params;

        // delete resume
        await Resume.findOneAndDelete({userId , _id:resumeId})
        return res.status (201).json({message:'Resume deleted successfully '})

         } catch (error) {
    return res.status(400).json({message: error.message})
  }   
 }

// get user resume by id
// GET: /api/resumes/get
export const getResumeById = async(req,res)=>{
    try{
       const userId = req.userId;
       const {resumeId} = req.params;

       const resume = await Resume.findOne({userId, _id:resumeId})
       if(!resume){
        return res.status(404).json({message: 'Resume not found'})
       }
       resume.__v = undefined;
       resume.createdAt = undefined;
       resume.updatedAt = undefined;
       return res.status(200).json({resume})

     } catch (error) {
    return res.status(400).json({message: error.message})
  }
}

// get resume by id public
// GET: api/resumes/public
export const getPublicResumeBYId = async(req, res)=>{
    try{
        const {resumeId} = req.params;
        const resume = await Resume.findOne({public: true, _id:resumeId})

          if(!resume){
        return res.status(404).json({message: 'Resume not found'})
       }
       return res.status(200).json({resume})

     } catch (error) {
    return res.status(400).json({message: error.message})
  }
}