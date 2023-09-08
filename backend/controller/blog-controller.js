const { Mongoose, default: mongoose } = require("mongoose");
const Blog = require("../model/Blog")

const getAllBlog = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find();
    } catch (err) {
        console.log(err)
    }
    if (!blogs) {
        return res.status(400).json({ message: "No Blog  Found" })
    }
    return res.status(200).json({ blogs })
}
const addBlog = async (req, res, next) => {
    const { title, description, image, user } = req.body;
    let existingUser;
    try {
        existingUser = await user.findById(user);
    } catch (err) {
        return console.log(err)
    }
    if (!existingUser) {
        return res.status(400).json({ message: "unable to find user by this id" })
    }
    const blog = new Blog({
        title,
        description,
        image,
        user
    });
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({ session });
        existingUser.blogs.push(blog);
        await existingUser.save({ session })
        await session.commitTransaction();
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err })
    }
    return res.status(200).json({ blog })
};
const updateBlog = async (req, res, next) => {
    const { title, description } = req.body;
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description
        })
    } catch (err) {
        return console.log(err)
    }
    if (!blog) {
        return res.status(500).json({ message: "unbale to update the blog" })
    }
    return res.status(200).json({ blog })
}
const getById = async (req, res, next) => {
    const id = req.param.id;
    let blog;
    try {
        blog = await Blog.findById(id);
    } catch (err) {
        return console.log(err)
    }
    if (!blog) {
        return res.status(404).json({ message: "No blog Found" })
    }
    return res.status(202).json({ blog })
}
const deleteBlog = async (req, res, next) => {
    const id = req.param.id;
    let blog;
    try {
        blog = await Blog.findByIdRemove(id).populate("user");
        await blog.user.blog.pull(blog);
        await blog.user.save();
    } catch (err) {
        return console.log(err)
    }
    if (!blog) {
        return res.status(500).json({ message: "Unbale to delete" })
    }
    return res.status(200).json({ menubar: "sucessfully Deleted" })
}
const getByUserId = async (req, res, next) => {
    const userId = req.param.id;
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate("blogs");
    } catch (err) {
        return console.log(err)
    }
    if (!userBlogs) {
        return res.status(404).json({ message: "No blog found" })
    }
    return res.status(200).json({ blogs: userBlogs })
}


module.exports = { getAllBlog, addBlog, updateBlog, getById, deleteBlog, getByUserId }