

export const verifyJWT=async(req,res,next) => {
    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ",accessToken);

    if(!token){
        return res.status(401).json({message:"Unauthorized Request.."});
    }
}